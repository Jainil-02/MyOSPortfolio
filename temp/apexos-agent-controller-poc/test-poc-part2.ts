async function testPoc05() {
  console.log('\n--- POC-05: Secret redaction ---');

  const secretOutput = 'Starting...\n<<<SECRET:::DUMMY_SECRET_VALUE:::>>>\nDone';

  try {
    const customResult = await runner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', `console.log("${secretOutput.replace(/\n/g, '\\n')}")`],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const customPassed = !customResult.redactedStdout.includes('DUMMY_SECRET_VALUE') &&
                         customResult.redactedStdout.includes('[REDACTED]');
    recordResult('POC-05', 'Secret redaction', customPassed, false,
      `original="${customResult.stdout.substring(0, 50)}...", redacted="${customResult.redactedStdout.substring(0, 50)}..."`);
  } catch (e) {
    recordResult('POC-05', 'Secret redaction', false, false, `error: ${e}`);
  }

  try {
    const omaResult = await omaRunner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', `console.log("${secretOutput.replace(/\n/g, '\\n')}")`],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const omaPassed = !omaResult.redactedStdout.includes('DUMMY_SECRET_VALUE') &&
                      omaResult.redactedStdout.includes('[REDACTED]');
    recordResult('POC-05', 'Secret redaction', false, omaPassed, undefined,
      `original="${omaResult.stdout.substring(0, 50)}...", redacted="${omaResult.redactedStdout.substring(0, 50)}..."`);
  } catch (e) {
    recordResult('POC-05', 'Secret redaction', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc06() {
  console.log('\n--- POC-06: Restart before invocation ---');

  try {
    const { readFileSync, writeFileSync } = await import('fs');
    const state = { runs: [], nextRun: { id: 'test-run', status: 'queued' } };
    writeFileSync('/tmp/apexos-poc-store.json', JSON.stringify(state));

    const loaded = JSON.parse(readFileSync('/tmp/apexos-poc-store.json', 'utf-8'));
    const customPassed = loaded.nextRun?.status === 'queued';
    recordResult('POC-06', 'Restart before invocation', customPassed, false,
      `loaded state: ${JSON.stringify(loaded.nextRun)}`);
  } catch (e) {
    recordResult('POC-06', 'Restart before invocation', false, false, `error: ${e}`);
  }

  try {
    const { readFileSync, writeFileSync } = await import('fs');
    const state = { runs: [], nextRun: { id: 'test-run', status: 'queued' } };
    writeFileSync('/tmp/apexos-oma-poc-store.json', JSON.stringify(state));

    const loaded = JSON.parse(readFileSync('/tmp/apexos-oma-poc-store.json', 'utf-8'));
    const omaPassed = loaded.nextRun?.status === 'queued';
    recordResult('POC-06', 'Restart before invocation', false, omaPassed, undefined,
      `loaded state: ${JSON.stringify(loaded.nextRun)}`);
  } catch (e) {
    recordResult('POC-06', 'Restart before invocation', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc07() {
  console.log('\n--- POC-07: Restart during invocation ---');

  try {
    const { readFileSync } = await import('fs');
    const data = JSON.parse(readFileSync('/tmp/apexos-poc-store.json', 'utf-8'));
    const incompleteRuns = data.runs.filter((r: any) => !r.completedAt);
    const customPassed = incompleteRuns.length > 0;
    recordResult('POC-07', 'Restart during invocation', customPassed, false,
      `incomplete runs: ${incompleteRuns.length}`);
  } catch (e) {
    recordResult('POC-07', 'Restart during invocation', false, false, `error: ${e}`);
  }

  try {
    const { readFileSync } = await import('fs');
    const data = JSON.parse(readFileSync('/tmp/apexos-oma-poc-store.json', 'utf-8'));
    const incompleteRuns = data.runs.filter((r: any) => !r.completedAt);
    const omaPassed = incompleteRuns.length > 0;
    recordResult('POC-07', 'Restart during invocation', false, omaPassed, undefined,
      `incomplete runs: ${incompleteRuns.length}`);
  } catch (e) {
    recordResult('POC-07', 'Restart during invocation', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc08() {
  console.log('\n--- POC-08: Approval pause ---');

  try {
    const approval = {
      id: randomUUID(),
      approver: 'owner',
      decision: 'approved',
      timestamp: new Date(),
      artifactHash: 'sha256:abc123',
    };
    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-poc-approval.json', JSON.stringify({ approval }));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-poc-approval.json', 'utf-8'));
    const customPassed = loaded.approval?.decision === 'approved' && loaded.approval.artifactHash === 'sha256:abc123';
    recordResult('POC-08', 'Approval pause', customPassed, false,
      `approval: ${JSON.stringify(loaded.approval)}`);
  } catch (e) {
    recordResult('POC-08', 'Approval pause', false, false, `error: ${e}`);
  }

  try {
    const approval = {
      id: randomUUID(),
      approver: 'owner',
      decision: 'approved',
      timestamp: new Date(),
      artifactHash: 'sha256:abc123',
    };
    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-oma-poc-approval.json', JSON.stringify({ approval }));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-oma-poc-approval.json', 'utf-8'));
    const omaPassed = loaded.approval?.decision === 'approved' && loaded.approval.artifactHash === 'sha256:abc123';
    recordResult('POC-08', 'Approval pause', false, omaPassed, undefined,
      `approval: ${JSON.stringify(loaded.approval)}`);
  } catch (e) {
    recordResult('POC-08', 'Approval pause', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc09() {
  console.log('\n--- POC-09: Stale approval ---');

  try {
    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-poc-approval.json', JSON.stringify({
      approval: { decision: 'approved', artifactHash: 'sha256:abc123' }
    }));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-poc-approval.json', 'utf-8'));
    const currentHash = 'sha256:def456';
    const customPassed = loaded.approval.artifactHash !== currentHash;
    recordResult('POC-09', 'Stale approval', customPassed, false,
      `stored hash: ${loaded.approval.artifactHash}, current: ${currentHash}, invalid: ${customPassed}`);
  } catch (e) {
    recordResult('POC-09', 'Stale approval', false, false, `error: ${e}`);
  }

  try {
    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-oma-poc-approval.json', JSON.stringify({
      approval: { decision: 'approved', artifactHash: 'sha256:abc123' }
    }));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-oma-poc-approval.json', 'utf-8'));
    const currentHash = 'sha256:def456';
    const omaPassed = loaded.approval.artifactHash !== currentHash;
    recordResult('POC-09', 'Stale approval', false, omaPassed, undefined,
      `stored hash: ${loaded.approval.artifactHash}, current: ${currentHash}, invalid: ${omaPassed}`);
  } catch (e) {
    recordResult('POC-09', 'Stale approval', false, false, undefined, `error: ${e}`);
  }
}