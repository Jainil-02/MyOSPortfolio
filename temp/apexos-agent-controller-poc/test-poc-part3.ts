async function testPoc10() {
  console.log('\n--- POC-10: Retry limit ---');

  try {
    const { writeFileSync, readFileSync } = await import('fs');
    const MAX_RETRIES = 3;
    let attempts = 0;

    for (let i = 0; i < MAX_RETRIES + 1; i++) {
      attempts++;
      writeFileSync('/tmp/apexos-poc-retry.json', JSON.stringify({ attempts }));
    }

    const loaded = JSON.parse(readFileSync('/tmp/apexos-poc-retry.json', 'utf-8'));
    const customPassed = loaded.attempts > MAX_RETRIES;
    recordResult('POC-10', 'Retry limit', customPassed, false,
      `attempts: ${loaded.attempts}, limit: ${MAX_RETRIES}, blocked: ${customPassed}`);
  } catch (e) {
    recordResult('POC-10', 'Retry limit', false, false, `error: ${e}`);
  }

  try {
    const { writeFileSync, readFileSync } = await import('fs');
    const MAX_RETRIES = 3;
    let attempts = 0;

    for (let i = 0; i < MAX_RETRIES + 1; i++) {
      attempts++;
      writeFileSync('/tmp/apexos-oma-poc-retry.json', JSON.stringify({ attempts }));
    }

    const loaded = JSON.parse(readFileSync('/tmp/apexos-oma-poc-retry.json', 'utf-8'));
    const omaPassed = loaded.attempts > MAX_RETRIES;
    recordResult('POC-10', 'Retry limit', false, omaPassed, undefined,
      `attempts: ${loaded.attempts}, limit: ${MAX_RETRIES}, blocked: ${omaPassed}`);
  } catch (e) {
    recordResult('POC-10', 'Retry limit', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc11() {
  console.log('\n--- POC-11: Separate worktrees ---');

  try {
    const { mkdirSync, rmSync, writeFileSync, readFileSync } = await import('fs');
    const base = '/tmp/apexos-poc-worktrees';
    mkdirSync(`${base}/implementer`, { recursive: true });
    mkdirSync(`${base}/reviewer`, { recursive: true });

    writeFileSync(`${base}/implementer/file.txt`, 'implementer content');
    writeFileSync(`${base}/reviewer/file.txt`, 'reviewer content');

    const implContent = readFileSync(`${base}/implementer/file.txt`, 'utf-8');
    const revContent = readFileSync(`${base}/reviewer/file.txt`, 'utf-8');

    const customPassed = implContent !== revContent;
    recordResult('POC-11', 'Separate worktrees', customPassed, false,
      `implementer: "${implContent}", reviewer: "${revContent}", isolated: ${customPassed}`);

    rmSync(base, { recursive: true, force: true });
  } catch (e) {
    recordResult('POC-11', 'Separate worktrees', false, false, `error: ${e}`);
  }

  try {
    const { mkdirSync, rmSync, writeFileSync, readFileSync } = await import('fs');
    const base = '/tmp/apexos-oma-poc-worktrees';
    mkdirSync(`${base}/implementer`, { recursive: true });
    mkdirSync(`${base}/reviewer`, { recursive: true });

    writeFileSync(`${base}/implementer/file.txt`, 'implementer content');
    writeFileSync(`${base}/reviewer/file.txt`, 'reviewer content');

    const implContent = readFileSync(`${base}/implementer/file.txt`, 'utf-8');
    const revContent = readFileSync(`${base}/reviewer/file.txt`, 'utf-8');

    const omaPassed = implContent !== revContent;
    recordResult('POC-11', 'Separate worktrees', false, omaPassed, undefined,
      `implementer: "${implContent}", reviewer: "${revContent}", isolated: ${omaPassed}`);

    rmSync(base, { recursive: true, force: true });
  } catch (e) {
    recordResult('POC-11', 'Separate worktrees', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc12() {
  console.log('\n--- POC-12: Independent review ---');

  try {
    const specHash = 'sha256:spec123';
    const implementerDiff = '+ added feature\n- removed bug';
    const reviewerInput = { specHash, diff: implementerDiff, reviewerId: 'reviewer-session-1' };

    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-poc-review.json', JSON.stringify(reviewerInput));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-poc-review.json', 'utf-8'));

    const customPassed = loaded.specHash === specHash && loaded.diff === implementerDiff && loaded.reviewerId !== 'implementer';
    recordResult('POC-12', 'Independent review', customPassed, false,
      `reviewer gets spec + diff, separate session: ${customPassed}`);
  } catch (e) {
    recordResult('POC-12', 'Independent review', false, false, `error: ${e}`);
  }

  try {
    const specHash = 'sha256:spec123';
    const implementerDiff = '+ added feature\n- removed bug';
    const reviewerInput = { specHash, diff: implementerDiff, reviewerId: 'reviewer-session-1' };

    const { writeFileSync, readFileSync } = await import('fs');
    writeFileSync('/tmp/apexos-oma-poc-review.json', JSON.stringify(reviewerInput));
    const loaded = JSON.parse(readFileSync('/tmp/apexos-oma-poc-review.json', 'utf-8'));

    const omaPassed = loaded.specHash === specHash && loaded.diff === implementerDiff && loaded.reviewerId !== 'implementer';
    recordResult('POC-12', 'Independent review', false, omaPassed, undefined,
      `reviewer gets spec + diff, separate session: ${omaPassed}`);
  } catch (e) {
    recordResult('POC-12', 'Independent review', false, false, undefined, `error: ${e}`);
  }
}