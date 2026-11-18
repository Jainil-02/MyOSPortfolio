/**
 * OMA process adapter.
 *
 * OMA owns subprocess execution. This adapter owns cancellation coordination,
 * redaction, retry-attempt accounting and local result persistence.
 * OMA's process runner is not treated as a durable workflow engine.
 */
import { run } from '@open-multi-agent/core/process';
import type {
  PersistenceStore, OmaProcessRunnerOptions, ProcessResult, RunState,
  RunMetadata, AgentRole,
} from './types.v2';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

const SECRET_PATTERNS = [
  /<<<SECRET:::[\\s\\S]*?>>>/g,
  /sk-[a-zA-Z0-9]{20,}/g,
  /ghp_[a-zA-Z0-9]{36}/g,
  /anthr_api_key=[^&\\s]*/g,
];

export class OmaProcessRunner {
  private readonly storePath: string;
  private readonly maxAttempts: number;
  private readonly timeoutMs: number;
  private readonly enableTimeout: boolean;
  private readonly attempts = new Map<string, number>();
  private readonly controllers = new Map<string, AbortController>();
  private readonly store: PersistenceStore;

  constructor(options: OmaProcessRunnerOptions = {}) {
    this.storePath = options.storePath ?? path.join(process.cwd(), '.oma-run-store.json');
    this.maxAttempts = Math.max(1, options.maxRetries ?? 3);
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.enableTimeout = options.enableTimeout ?? true;
    this.store = {
      read: async () => {
        try {
          return JSON.parse(await fs.promises.readFile(this.storePath, 'utf8')) as Record<string, unknown>;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
          throw error;
        }
      },
      write: async (key, value) => {
        const state = await this.store.read();
        state[key] = value;
        await this.writeAtomically(state);
      },
      has: async key => Object.hasOwn(await this.store.read(), key),
      delete: async key => {
        const state = await this.store.read();
        delete state[key];
        await this.writeAtomically(state);
      },
    };
  }

  async run(command: string, args: string[] = [], metadata: RunMetadata): Promise<ProcessResult> {
    const taskId = metadata.task.id;
    const attempt = this.attempts.get(taskId) ?? 0;
    if (attempt >= this.maxAttempts) {
      return {
        exitCode: -1, stdout: '', stderr: `RUN BLOCKED: maximum attempts (${this.maxAttempts}) reached for task ${taskId}`,
        timedOut: false, cancelled: false, finalState: 'blocked',
      };
    }
    this.attempts.set(taskId, attempt + 1);

    const runId = randomUUID();
    const controller = new AbortController();
    this.controllers.set(runId, controller);
    const forwardAbort = () => controller.abort(metadata.signal?.reason);
    if (metadata.signal?.aborted) forwardAbort();
    else metadata.signal?.addEventListener('abort', forwardAbort, { once: true });

    let timedOut = false;
    let cancelled = false;
    const timer = this.enableTimeout ? setTimeout(() => {
      timedOut = true;
      controller.abort(new DOMException('Process timed out', 'TimeoutError'));
    }, metadata.task.timeoutMs ?? this.timeoutMs) : undefined;

    try {
      const env = this.buildEnvironment(metadata.env ?? {});
      const result = await run({
        command, args, cwd: metadata.cwd, env, signal: controller.signal,
      });
      cancelled = !timedOut && (controller.signal.aborted || result.cancelled === true);
      timedOut = timedOut || result.error?.name === 'TimeoutError' || result.timedOut === true;
      const stdout = this.redact(String(result.stdout ?? ''));
      const stderr = this.redact(String(result.stderr ?? result.error?.message ?? ''));
      const exitCode = typeof result.exitCode === 'number' ? result.exitCode : -1;
      const finalState: RunState = timedOut ? 'timedOut' : cancelled ? 'cancelled' : 'completed';
      await this.persistResult({ taskId, role: metadata.role, exitCode, stdout, stderr, finalState, timedOut, cancelled });
      return { exitCode, stdout, stderr, timedOut, cancelled, finalState };
    } catch (error) {
      const err = error as Error;
      timedOut = timedOut || err.name === 'TimeoutError';
      cancelled = !timedOut && (err.name === 'AbortError' || controller.signal.aborted);
      const stderr = this.redact(err.message ?? String(error));
      const finalState: RunState = timedOut ? 'timedOut' : cancelled ? 'cancelled' : 'completed';
      await this.persistResult({ taskId, role: metadata.role, exitCode: -1, stdout: '', stderr, finalState, timedOut, cancelled });
      return { exitCode: -1, stdout: '', stderr, timedOut, cancelled, finalState, error: err };
    } finally {
      if (timer) clearTimeout(timer);
      metadata.signal?.removeEventListener('abort', forwardAbort);
      this.controllers.delete(runId);
    }
  }

  async cancelAll(): Promise<void> {
    for (const controller of this.controllers.values()) {
      if (!controller.signal.aborted) controller.abort(new DOMException('Cancelled by controller', 'AbortError'));
    }
  }

  async getStore(): Promise<Record<string, unknown>> {
    return this.store.read();
  }

  private buildEnvironment(custom: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
    const allowed = new Set([
      'PATH', 'Path', 'PATHEXT', 'SystemRoot', 'WINDIR', 'COMSPEC',
      'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'USER', 'USERNAME',
    ]);
    const env: NodeJS.ProcessEnv = {};
    for (const key of allowed) if (process.env[key] !== undefined) env[key] = process.env[key];
    for (const [key, value] of Object.entries(custom)) {
      if (allowed.has(key) && value !== undefined) env[key] = value;
    }
    return env;
  }

  private redact(value: string): string {
    return SECRET_PATTERNS.reduce((text, pattern) => text.replace(pattern, '[REDACTED]'), value);
  }

  private async persistResult(result: {
    taskId: string; role: AgentRole; exitCode: number; stdout: string; stderr: string;
    finalState: RunState; timedOut: boolean; cancelled: boolean;
  }): Promise<void> {
    const state = await this.store.read();
    state[`task:${result.taskId}:${Date.now()}:${randomUUID()}`] = {
      ...result, persistedAt: new Date().toISOString(),
    };
    await this.writeAtomically(state);
  }

  private async writeAtomically(state: Record<string, unknown>): Promise<void> {
    await fs.promises.mkdir(path.dirname(this.storePath), { recursive: true });
    const tempPath = `${this.storePath}.${randomUUID()}.tmp`;
    await fs.promises.writeFile(tempPath, JSON.stringify(state, null, 2), { mode: 0o600 });
    await fs.promises.rename(tempPath, this.storePath);
  }
}
