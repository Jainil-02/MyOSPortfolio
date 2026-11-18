export class OmaProcessRunner {
  private storePath: string;
  private runStore: RunStore | null = null;

  constructor(storePath: string = '/tmp/apexos-oma-poc-store.json') {
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

  public async run(invocation: OmaAgentInvocation): Promise<OmaAgentResult> {
    const startTime = new Date();
    const { executable, args, cwd, timeoutMs, env, allowSecretRedaction } = invocation;

    const result: OmaAgentResult = {
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

    try {
      // Use OMA's process backend
      const { stdout, stderr, exitCode } = await run({
        command: executable,
        args,
        cwd,
        timeout: timeoutMs,
        env: { ...process.env, ...env },
        signal: AbortSignal.timeout(timeoutMs),
      });

      result.completedAt = new Date();
      result.exitCode = exitCode ?? 0;
      result.stdout = stdout;
      result.stderr = stderr;
      result.timedOut = false;
      result.cancelled = false;
      result.redactedStdout = allowSecretRedaction ? redactSecrets(stdout) : stdout;
      result.redactedStderr = allowSecretRedaction ? redactSecrets(stderr) : stderr;
    } catch (error: any) {
      result.completedAt = new Date();
      result.timedOut = error.name === 'TimeoutError';
      result.cancelled = error.name === 'AbortError';
      result.exitCode = error.exitCode ?? 1;
      result.stdout = error.stdout ?? '';
      result.stderr = error.stderr ?? (error.message ?? 'Unknown error');
      result.redactedStdout = allowSecretRedaction ? redactSecrets(result.stdout) : result.stdout;
      result.redactedStderr = allowSecretRedaction ? redactSecrets(result.stderr) : result.stderr;
    }

    this.saveResult(result);
    return result;
  }

  private saveResult(result: OmaAgentResult): void {
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

  // OMA-specific: checkpoint and resume
  public async checkpoint(runId: string, state: any): Promise<void> {
    // OMA provides checkpoint/resume via run store
    // This simulates checkpointing
  }

  public async resume(runId: string): Promise<any> {
    // OMA provides resume from checkpoint
    return null;
  }
}