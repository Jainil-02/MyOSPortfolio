/**
 * Minimal custom subprocess baseline for comparison with OMA.
 * This is a process runner, not a complete multi-agent orchestrator.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import type {
  PersistenceStore, CustomProcessRunnerOptions, ProcessResult, RunState,
  RunMetadata, AgentRole,
} from './types.v2';

const SECRET_PATTERNS = [
  /<<<SECRET:::[\\s\\S]*?>>>/g,
  /sk-[a-zA-Z0-9]{20,}/g,
  /ghp_[a-zA-Z0-9]{36}/g,
  /anthr_api_key=[^&\\s]*/g,
];

interface ActiveProcess {
  child: ChildProcess;
  cancel: () => Promise<void>;
}

export class CustomProcessRunner {
  private readonly storePath: string;
  private readonly maxAttempts: number;
  private readonly timeoutMs: number;
  private readonly envAllowlist: string[];
  private readonly attempts = new Map<string, number>();
  private readonly active = new Map<string, ActiveProcess>();
  private readonly store: PersistenceStore;

  constructor(options: CustomProcessRunnerOptions = {}) {
    this.storePath = options.storePath ?? path.join(process.cwd(), '.run-store.json');
    this.maxAttempts = Math.max(1, options.maxRetries ?? 3);
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.envAllowlist = options.envAllowlist ?? [
      'PATH', 'Path', 'PATHEXT', 'SystemRoot', 'WINDIR', 'COMSPEC',
      'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'USER', 'USERNAME',
    ];
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

  async run(executable: string, args: string[] = [], metadata: RunMetadata): Promise<ProcessResult> {
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
    const child = spawn(executable, args, {
      cwd: metadata.cwd,
      shell: false,
      windowsHide: true,
      env: this.buildEnvironment(metadata.env ?? {}),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let timedOut = false;
    let cancelled = false;
    let settled = false;
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout?.on('data', chunk => stdout.push(Buffer.from(chunk)));
    child.stderr?.on('data', chunk => stderr.push(Buffer.from(chunk)));

    const killTree = async (force: boolean): Promise<void> => {
      if (child.pid === undefined) return;
      if (process.platform === 'win32') {
        await new Promise<void>(resolve => {
          const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', ...(force ? ['/F'] : [])], {
            windowsHide: true, stdio: 'ignore',
          });
          killer.once('error', () => resolve());
          killer.once('close', () => resolve());
        });
      } else {
        try { child.kill(force ? 'SIGKILL' : 'SIGTERM'); } catch { /* process may have exited */ }
      }
    };

    const cancel = async (): Promise<void> => {
      if (settled) return;
      cancelled = true;
      await killTree(false);
      const grace = setTimeout(() => { void killTree(true); }, 750);
      grace.unref();
    };
    this.active.set(runId, { child, cancel });

    const timeoutMs = metadata.task.timeoutMs ?? this.timeoutMs;
    const timer = setTimeout(async () => {
      if (settled) return;
      timedOut = true;
      await killTree(false);
      const forceTimer = setTimeout(() => { void killTree(true); }, 750);
      forceTimer.unref();
    }, timeoutMs);

    const onAbort = () => { void cancel(); };
    if (metadata.signal?.aborted) onAbort();
    else metadata.signal?.addEventListener('abort', onAbort, { once: true });

    try {
      const exitCode = await new Promise<number>((resolve, reject) => {
        child.once('error', reject);
        child.once('close', code => resolve(code ?? -1));
      });
      settled = true;
      const out = this.redact(Buffer.concat(stdout).toString('utf8'));
      const err = this.redact(Buffer.concat(stderr).toString('utf8'));
      const finalState: RunState = timedOut ? 'timedOut' : cancelled ? 'cancelled' : 'completed';
      await this.persistResult({ taskId, role: metadata.role, exitCode, stdout: out, stderr: err, finalState, timedOut, cancelled });
      return { exitCode, stdout: out, stderr: err, timedOut, cancelled, finalState };
    } catch (error) {
      settled = true;
      const err = this.redact((error as Error).message ?? String(error));
      await this.persistResult({
        taskId, role: metadata.role, exitCode: -1, stdout: '', stderr: err,
        finalState: 'completed', timedOut: false, cancelled: false,
      });
      return { exitCode: -1, stdout: '', stderr: err, timedOut: false, cancelled: false, finalState: 'completed', error: error as Error };
    } finally {
      clearTimeout(timer);
      metadata.signal?.removeEventListener('abort', onAbort);
      this.active.delete(runId);
    }
  }

  async cancelAll(): Promise<void> {
    await Promise.all([...this.active.values()].map(entry => entry.cancel()));
  }

  async getStore(): Promise<Record<string, unknown>> {
    return this.store.read();
  }

  private buildEnvironment(custom: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
    const env: NodeJS.ProcessEnv = {};
    for (const key of this.envAllowlist) {
      if (process.env[key] !== undefined) env[key] = process.env[key];
      if (custom[key] !== undefined) env[key] = custom[key];
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
