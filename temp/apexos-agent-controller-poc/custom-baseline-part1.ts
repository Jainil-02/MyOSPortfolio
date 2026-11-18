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