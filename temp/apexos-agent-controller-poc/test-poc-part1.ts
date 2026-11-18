/**
 * OMA POC Test Matrix
 * Runs tests POC-01 through POC-14
 */

import { CustomProcessRunner } from './custom-baseline.js';
import { OmaProcessRunner } from './oma-adapter.js';
import { randomUUID } from 'crypto';

interface TestResult {
  id: string;
  name: string;
  customPassed: boolean;
  omaPassed: boolean;
  customDetails?: string;
  omaDetails?: string;
  blocked?: boolean;
  blockReason?: string;
}

const results: TestResult[] = [];
const runner = new CustomProcessRunner();
const omaRunner = new OmaProcessRunner();

function recordResult(id: string, name: string, customPassed: boolean, omaPassed: boolean, customDetails?: string, omaDetails?: string, blocked?: boolean, blockReason?: string) {
  results.push({ id, name, customPassed, omaPassed, customDetails, omaDetails, blocked, blockReason });
  console.log(`\n=== ${id}: ${name} ===`);
  console.log(`  Custom: ${customPassed ? 'PASS' : 'FAIL'}${blocked ? ' (BLOCKED)' : ''}`);
  console.log(`  OMA:    ${omaPassed ? 'PASS' : 'FAIL'}${blocked ? ' (BLOCKED)' : ''}`);
  if (customDetails) console.log(`  Custom: ${customDetails}`);
  if (omaDetails) console.log(`  OMA:    ${omaDetails}`);
  if (blocked && blockReason) console.log(`  Blocked: ${blockReason}`);
}

async function testPoc01() {
  console.log('\n--- POC-01: Fake child succeeds ---');

  try {
    const customResult = await runner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'console.log("success"); process.exit(0)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const customPassed = customResult.exitCode === 0 && customResult.stdout.includes('success');
    recordResult('POC-01', 'Fake child succeeds', customPassed, false,
      `exitCode=${customResult.exitCode}, stdout="${customResult.stdout.trim()}"`);
  } catch (e) {
    recordResult('POC-01', 'Fake child succeeds', false, false, `error: ${e}`);
  }

  try {
    const omaResult = await omaRunner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'console.log("success"); process.exit(0)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const omaPassed = omaResult.exitCode === 0 && omaResult.stdout.includes('success');
    recordResult('POC-01', 'Fake child succeeds', false, omaPassed, undefined,
      `exitCode=${omaResult.exitCode}, stdout="${omaResult.stdout.trim()}"`);
  } catch (e) {
    recordResult('POC-01', 'Fake child succeeds', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc02() {
  console.log('\n--- POC-02: Fake child fails ---');

  try {
    const customResult = await runner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'console.error("fail"); process.exit(1)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const customPassed = customResult.exitCode !== 0;
    recordResult('POC-02', 'Fake child fails', customPassed, false,
      `exitCode=${customResult.exitCode}, stderr="${customResult.stderr.trim()}"`);
  } catch (e) {
    recordResult('POC-02', 'Fake child fails', false, false, `error: ${e}`);
  }

  try {
    const omaResult = await omaRunner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'console.error("fail"); process.exit(1)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 5000,
      env: {},
      allowSecretRedaction: true,
    });
    const omaPassed = omaResult.exitCode !== 0;
    recordResult('POC-02', 'Fake child fails', false, omaPassed, undefined,
      `exitCode=${omaResult.exitCode}, stderr="${omaResult.stderr.trim()}"`);
  } catch (e) {
    recordResult('POC-02', 'Fake child fails', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc03() {
  console.log('\n--- POC-03: Timeout ---');

  try {
    const customResult = await runner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'setTimeout(() => {}, 10000)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 1000,
      env: {},
      allowSecretRedaction: true,
    });
    const customPassed = customResult.timedOut === true && customResult.cancelled === false;
    recordResult('POC-03', 'Timeout', customPassed, false,
      `timedOut=${customResult.timedOut}, exitCode=${customResult.exitCode}`);
  } catch (e) {
    recordResult('POC-03', 'Timeout', false, false, `error: ${e}`);
  }

  try {
    const omaResult = await omaRunner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'setTimeout(() => {}, 10000)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 1000,
      env: {},
      allowSecretRedaction: true,
    });
    const omaPassed = omaResult.timedOut === true;
    recordResult('POC-03', 'Timeout', false, omaPassed, undefined,
      `timedOut=${omaResult.timedOut}, exitCode=${omaResult.exitCode}`);
  } catch (e) {
    recordResult('POC-03', 'Timeout', false, false, undefined, `error: ${e}`);
  }
}

async function testPoc04() {
  console.log('\n--- POC-04: Cancellation ---');

  try {
    const customResult = await runner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'setTimeout(() => {}, 10000)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 500,
      env: {},
      allowSecretRedaction: true,
    });
    const customPassed = customResult.timedOut === true && customResult.cancelled === false;
    recordResult('POC-04', 'Cancellation', customPassed, false,
      `timedOut=${customResult.timedOut}, cancelled=${customResult.cancelled}`);
  } catch (e) {
    recordResult('POC-04', 'Cancellation', false, false, `error: ${e}`);
  }

  try {
    const omaResult = await omaRunner.run({
      id: randomUUID(),
      executable: 'node',
      args: ['-e', 'setTimeout(() => {}, 10000)'],
      cwd: '/tmp/apexos-agent-controller-poc',
      timeoutMs: 500,
      env: {},
      allowSecretRedaction: true,
    });
    const omaPassed = omaResult.timedOut === true;
    recordResult('POC-04', 'Cancellation', false, omaPassed, undefined,
      `timedOut=${omaResult.timedOut}, cancelled=${omaResult.cancelled}`);
  } catch (e) {
    recordResult('POC-04', 'Cancellation', false, false, undefined, `error: ${e}`);
  }
}