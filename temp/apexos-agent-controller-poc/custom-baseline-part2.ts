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