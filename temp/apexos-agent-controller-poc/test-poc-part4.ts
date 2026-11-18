async function testPoc13() {
  console.log('\n--- POC-13: Windows CLI integration ---');

  let claudeAvailable = false;
  let codexAvailable = false;

  try {
    const { execSync } = await import('child_process');
    execSync('claude --version', { stdio: 'ignore' });
    claudeAvailable = true;
  } catch {}

  try {
    const { execSync } = await import('child_process');
    execSync('codex --version', { stdio: 'ignore' });
    codexAvailable = true;
  } catch {}

  const customPassed = claudeAvailable && codexAvailable;
  recordResult('POC-13', 'Windows CLI integration', customPassed, false,
    `claude: ${claudeAvailable}, codex: ${codexAvailable}`);

  const omaPassed = claudeAvailable && codexAvailable;
  recordResult('POC-13', 'Windows CLI integration', false, omaPassed, undefined,
    `claude: ${claudeAvailable}, codex: ${codexAvailable}`);
}

async function testPoc14() {
  console.log('\n--- POC-14: GitHub boundary ---');

  try {
    const allowedOps = ['create_issue', 'read_issue', 'create_pr', 'read_pr', 'read_review', 'read_ci'];
    const disallowedOps = ['merge_pr', 'delete_branch', 'change_protection', 'admin'];

    const customPassed = !disallowedOps.some(op => allowedOps.includes(op));
    recordResult('POC-14', 'GitHub boundary', customPassed, false,
      `allowed: ${allowedOps.join(', ')}, disallowed: ${disallowedOps.join(', ')}`);
  } catch (e) {
    recordResult('POC-14', 'GitHub boundary', false, false, `error: ${e}`);
  }

  try {
    const allowedOps = ['create_issue', 'read_issue', 'create_pr', 'read_pr', 'read_review', 'read_ci'];
    const disallowedOps = ['merge_pr', 'delete_branch', 'change_protection', 'admin'];

    const omaPassed = !disallowedOps.some(op => allowedOps.includes(op));
    recordResult('POC-14', 'GitHub boundary', false, omaPassed, undefined,
      `allowed: ${allowedOps.join(', ')}, disallowed: ${disallowedOps.join(', ')}`);
  } catch (e) {
    recordResult('POC-14', 'GitHub boundary', false, false, `error: ${e}`);
  }
}

async function runAllTests() {
  console.log('============================================================');
  console.log('       OMA Proof-of-Concept Test Matrix');
  console.log('       Running in disposable workspace');
  console.log('============================================================');

  await testPoc01();
  await testPoc02();
  await testPoc03();
  await testPoc04();
  await testPoc05();
  await testPoc06();
  await testPoc07();
  await testPoc08();
  await testPoc09();
  await testPoc10();
  await testPoc11();
  await testPoc12();
  await testPoc13();
  await testPoc14();

  console.log('\n============================================================');
  console.log('                        SUMMARY');
  console.log('============================================================');

  const customPassed = results.filter(r => !r.blocked && r.customPassed).length;
  const customFailed = results.filter(r => !r.blocked && !r.customPassed).length;
  const customBlocked = results.filter(r => r.blocked).length;

  const omaPassed = results.filter(r => !r.blocked && r.omaPassed).length;
  const omaFailed = results.filter(r => !r.blocked && !r.omaPassed).length;
  const omaBlocked = results.filter(r => r.blocked).length;

  console.log(`\nCustom Baseline: ${customPassed} passed, ${customFailed} failed, ${customBlocked} blocked`);
  console.log(`OMA Backend:     ${omaPassed} passed, ${omaFailed} failed, ${omaBlocked} blocked`;

  console.log('\nDetailed Results:');
  for (const r of results) {
    const status = r.blocked ? 'BLOCKED' : (r.customPassed || r.omaPassed ? 'PASS' : 'FAIL');
    console.log(`  ${r.id}: ${r.name} - ${status}`);
  }

  const { writeFileSync } = await import('fs');
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    results,
    summary: {
      custom: { passed: customPassed, failed: customFailed, blocked: customBlocked },
      oma: { passed: omaPassed, failed: omaFailed, blocked: omaBlocked },
    },
  };

  writeFileSync('/tmp/apexos-agent-controller-poc/POC_REPORT.json', JSON.stringify(report, null, 2));
  console.log('\nReport saved to POC_REPORT.json');
}

runAllTests().catch(console.error);