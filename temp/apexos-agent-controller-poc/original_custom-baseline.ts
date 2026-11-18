/**
 * Experiment A: Custom Process Baseline
 *
 * A tiny TypeScript adapter that captures stdout, stderr and exit code
 * and supports timeout/cancellation.
 */

import { spawn, ChildProcess } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface CustomAgentInvocation {
  id: string;
  executable: string;
  args: string[];
  cwd: string;
  timeoutMs: number;
  env: Record<string, string>;
  allowSecretRedaction: boolean;
}

export interface CustomAgentResult {
  id: string;
  executable: string;
  args: string[];
  cwd: string;
  startedAt: Date;
  completedAt?: Date;
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  cancelled: boolean;
  signal?: string;
  redactedStdout: string;
  redactedStderr: string;
}

const SECRET_MARKER = '<<<SECRET:::DUMMY_SECRET_VALUE>>>';

const KNOWN_SECRET_PATTERNS: (string | RegExp)[] = [
  SECRET_MARKER,
  /<<<<SECRET:::/g,
  />>>:::>>>>/g,
  /sk-[a-zA-Z0-9]{32,}/,
  /ghp_[a-zA-Z0-9]{36}/,
  /anthr_api_key=[a-zA-Z0-9_-]+/,
];

function redactSecrets(content: string): string {
  let redacted = content;
  for (const pattern of KNOWN_SECRET_PATTERNS) {
    if (typeof pattern === 'string') {
      redacted = redacted.split(pattern).join('[REDACTED]');
    } else {
      redacted = redacted.replace(pattern, '[REDACTED]');
    }
  }
  return redacted;
}

export class CustomProcessRunner {
  private currentProcess?: ChildProcess;
  private cancelRequested = false;
  private results: Map<string, CustomAgentResult> = new Map();
  private storePath: string;

  constructor(storePath: string = '/tmp/apexos-poc-store.json') {
    this.storePath = storePath;
    this.initStore();
  }

  private initStore() {
    const dir = join(this.storePath, '..');
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(this.storePath)) {
      writeFileSync(this.storePath, JSON.stringify({ runs: [] }));
    }
  }

  public async run(invocation: CustomAgentInvocation): Promise<CustomAgentResult> {
    const startTime = new Date();
    const { executable, args, cwd, timeoutMs, env, allowSecretRedaction } = invocation;

    const result: CustomAgentResult = {
      id: invocation.id,
      executable,
      args,
      cwd,
      startedAt: startTime,
      completedAt: undefined,
      exitCode: 0,
      stdout: '',
      stderr: '',
      timedOut: false,
      cancelled: false,
      redactedStdout: '',
      redactedStderr: '',
    };

    return new Promise((resolve) => {
      let stdoutBuffer = '';
      let stderrBuffer = '';
      let timedOut = false;
      let cancelled = false;

      const timeoutHandle = setTimeout(() => {
        timedOut = true;
        this.cancelRequested = true;
        if (this.currentProcess) {
          try {
            this.killProcessTree(this.currentProcess.pid!);
          } catch (e) { /* ignore */ }
        }
      }, timeoutMs);

      this.currentProcess = spawn(executable, args, {
        cwd,
        env: { ...process.env, ...env },
        shell: false,
        windowsHide: true,
      });

      this.currentProcess.stdout?.on('data', (data: Buffer) => {
        stdoutBuffer += data.toString();
      });

      this.currentProcess.stderr?.on('data', (data: Buffer) => {
        stderrBuffer += data.toString();
      });

      this.currentProcess.on('error', (err: Error) => {
        clearTimeout(timeoutHandle);
        result.exitCode = 1;
        result.completedAt = new Date();
        result.stdout = stdoutBuffer;
        result.stderr = stderrBuffer + err.message;
        result.timedOut = timedOut;
        result.cancelled = cancelled;
        result.redactedStdout = allowSecretRedaction ? redactSecrets(stdoutBuffer) : stdoutBuffer;
        result.redactedStderr = allowSecretRedaction ? redactSecrets(stderrBuffer + err.message) : stderrBuffer + err.message;
        this.results.set(invocation.id, result);
        this.saveResult(result);
        resolve(result);
      });

      this.currentProcess.on('close', (code: number | null, signal: string | undefined) => {
        clearTimeout(timeoutHandle);
        this.cancelRequested = false;

        result.completedAt = new Date();
        result.exitCode = code ?? 0;
        result.stdout = stdoutBuffer;
        result.stderr = stderrBuffer;
        result.timedOut = timedOut;
        result.cancelled = cancelled;
        result.signal = signal;
        result.redactedStdout = allowSecretRedaction ? redactSecrets(stdoutBuffer) : stdoutBuffer;
        result.redactedStderr = allowSecretRedaction ? redactSecrets(stderrBuffer) : stderrBuffer;

        this.results.set(invocation.id, result);
        this.saveResult(result);
        resolve(result);
      });
    });
  }

  private killProcessTree(pid: number): void {
    try {
      const { execSync } = require('child_process');
      execSync(`taskkill /PID ${pid} /T /F 2>nul`, { stdio: 'ignore' });
    } catch (e) {
      // Process might already be dead or we might not have permissions
    }
  }

  private saveResult(result: CustomAgentResult): void {
    try {
      const data = JSON.parse(readFileSync(this.storePath, 'utf-8'));
      data.runs.push({
        id: result.id,
        executable: result.executable,
        args: result.args,
        cwd: result.cwd,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
        timedOut: result.timedOut,
        cancelled: result.cancelled,
        redactedStdout: result.redactedStdout,
        redactedStderr: result.redactedStderr,
      });
      writeFileSync(this.storePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to save result to store:', e);
    }
  }

  public getResult(id: string): CustomAgentResult | undefined {
    return this.results.get(id);
  }

  public cancelAll(): void {
    this.cancelRequested = true;
    if (this.currentProcess) {
      try {
        this.killProcessTree(this.currentProcess.pid!);
      } catch (e) { /* ignore */ }
    }
  }
}