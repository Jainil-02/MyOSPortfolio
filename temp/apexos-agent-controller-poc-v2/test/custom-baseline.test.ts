import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { CustomProcessRunner } from '../src/custom-baseline.v2';

const directories: string[] = [];
async function createRunner(options: { timeoutMs?: number; maxRetries?: number } = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'apexos-custom-runner-'));
  directories.push(dir);
  return {
    dir,
    runner: new CustomProcessRunner({
      storePath: path.join(dir, 'state.json'),
      timeoutMs: options.timeoutMs ?? 5_000,
      maxRetries: options.maxRetries ?? 3,
    }),
  };
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(dir => rm(dir, { recursive: true, force: true })));
});

describe('CustomProcessRunner (real Node child processes)', () => {
  it('captures successful stdout and exit code', async () => {
    const { runner } = await createRunner();
    const result = await runner.run(process.execPath, ['-e', 'console.log("ok")'], {
      createdAt: new Date().toISOString(), task: { id: 'success', description: 'success' }, role: 'implementer',
    });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('ok');
    expect(result.cancelled).toBe(false);
    expect(result.timedOut).toBe(false);
  });

  it('preserves non-zero exit codes without mislabelling normal exit as cancellation', async () => {
    const { runner } = await createRunner();
    const result = await runner.run(process.execPath, ['-e', 'process.stderr.write("failed"); process.exit(7)'], {
      createdAt: new Date().toISOString(), task: { id: 'failure', description: 'failure' }, role: 'implementer',
    });
    expect(result.exitCode).toBe(7);
    expect(result.stderr).toContain('failed');
    expect(result.finalState).toBe('completed');
    expect(result.cancelled).toBe(false);
  });

  it('times out a real child process', async () => {
    const { runner } = await createRunner({ timeoutMs: 100 });
    const result = await runner.run(process.execPath, ['-e', 'setTimeout(() => {}, 10_000)'], {
      createdAt: new Date().toISOString(), task: { id: 'timeout', description: 'timeout' }, role: 'implementer',
    });
    expect(result.timedOut).toBe(true);
    expect(result.cancelled).toBe(false);
    expect(result.finalState).toBe('timedOut');
  });

  it('cancels a real child process through AbortSignal', async () => {
    const { runner } = await createRunner();
    const controller = new AbortController();
    const pending = runner.run(process.execPath, ['-e', 'setTimeout(() => {}, 10_000)'], {
      createdAt: new Date().toISOString(), task: { id: 'cancel', description: 'cancel' }, role: 'implementer',
      signal: controller.signal,
    });
    setTimeout(() => controller.abort(), 100);
    const result = await pending;
    expect(result.cancelled).toBe(true);
    expect(result.timedOut).toBe(false);
    expect(result.finalState).toBe('cancelled');
  });

  it('persists only redacted output', async () => {
    const { runner, dir } = await createRunner();
    const secret = '<<<SECRET:::DUMMY_SECRET_VALUE>>>';
    await runner.run(process.execPath, ['-e', `console.log(${JSON.stringify(secret)})`], {
      createdAt: new Date().toISOString(), task: { id: 'redaction', description: 'redaction' }, role: 'implementer',
    });
    const persisted = await readFile(path.join(dir, 'state.json'), 'utf8');
    expect(persisted).not.toContain(secret);
    expect(persisted).toContain('[REDACTED]');
  });

  it('enforces configured invocation cap', async () => {
    const { runner } = await createRunner({ maxRetries: 1 });
    const metadata = { createdAt: new Date().toISOString(), task: { id: 'cap', description: 'cap' }, role: 'implementer' as const };
    expect((await runner.run(process.execPath, ['-e', 'process.exit(0)'], metadata)).exitCode).toBe(0);
    expect((await runner.run(process.execPath, ['-e', 'process.exit(0)'], metadata)).finalState).toBe('blocked');
  });
});
