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