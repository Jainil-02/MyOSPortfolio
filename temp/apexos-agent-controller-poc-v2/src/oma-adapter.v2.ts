/**
 * OmaProcessRunner — OMA @open-multi-agent/core 1.24.0 Adapter
 *
 * Uses OMA's documented process backend via `run()` with AbortSignal.timeout mapping.
 * Distinguishes OMA-provided capabilities from custom adapter functionality.
 * Documents process backend limitations per OMA 1.24.0 specs.
 *
 * Key design decisions (per OMA 1.24.0 process backend):
 * - `run()` wraps `child_process.spawn` with AbortController integration
 * - `AbortSignal.timeout()` maps to `TimeoutError`; cancellation maps to `AbortError`
 * - Process backend is "stateless between runs"; run record is "current authoritative state"
 * - No built-in secret redaction — application must implement output sanitization
 * - FileStore supports sequential restart recovery but no distributed locking
 * - No built-in checkpoint/resume — these are application-level concerns
 * - ACP richer session path not directly usable without additional adapter work
 */

import { run, Run as OmaRun, AbortSignal } from '@open-multi-agent/core/process';
import type {
  PersistenceStore,
  OmaProcessRunnerOptions,
  ProcessResult,
  RunState,
  RunMetadata,
  ApprovalRecord,
  RedactionPattern,
  TaskContract,
  AgentRole,
} from './types.v2';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Known secret patterns for redaction. Same patterns as CustomProcessRunner
 * for consistent behavior across both implementations.
 */
const KNOWN_SECRET_PATTERNS: RegExp[] = [
  /<<<SECRET:::.*>>>/g,
  /sk-[a-zA-Z0-9]{20,}/g,
  /ghp_[a-zA-Z0-9]{36}/g,
  /anthr_api_key=[^&]*/g,
];

/**
 * Redaction replacement string.
 */
const REDACTION_REPLACEMENT = '[REDACTED]';

/**
 * Regex to identify secret-containing environment variable values.
 */
const SECRET_ENV_PATTERN = /(?:sk-|ghp_|anthr_api_key)=[^\s]+/g;

/**
 * Default maximum retry attempts before the controller enters blocked state.
 */
const DEFAULT_MAX_RETRIES = 3;

/**
 * Default timeout in milliseconds for process execution.
 */
const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Path to the JSON persistence store for durable state.
 */
const DEFAULT_STORE_PATH = path.join(process.cwd(), '.oma-run-store.json');

// ---------------------------------------------------------------------------
// OmaProcessRunner class
// ---------------------------------------------------------------------------

export class OmaProcessRunner {
  /** Path to the JSON persistence store */
  private storePath: string;
  /** Maximum number of retry attempts */
  private maxRetries: number;
  /** Default timeout in milliseconds */
  private timeoutMs: number;
  /** Whether AbortSignal.timeout mapping is enabled */
  private enableTimeout: boolean;
  /** Track retry counts per task ID */
  private retryCounts: Map<string, number> = new Map();
  /** Track in-flight run IDs */
  private inFlightRuns: Map<string, OmaRun> = new Map();
  /** Store instance for durable persistence */
  private store: PersistenceStore;

  /**
   * Creates a new OmaProcessRunner instance.
   *
   * @param options Configuration options
   */
  constructor(options: OmaProcessRunnerOptions = {}) {
    this.storePath = options.storePath ?? DEFAULT_STORE_PATH;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.enableTimeout = options.enableTimeout ?? true;

    // Initialize persistence store
    this.store = {
      read: async (): Promise<Record<string, unknown>> => {
        try {
          if (await fs.promises.access(this.storePath).then(() => true).catch(() => false)) {
            const data = await fs.promises.readFile(this.storePath, 'utf-8');
            return JSON.parse(data);
          }
          return {};
        } catch {
          return {};
        }
      },
      write: async (key: string, value: unknown): Promise<void> => {
        const store = await this.store.read();
        store[key] = value;
        await fs.promises.writeFile(this.storePath, JSON.stringify(store, null, 2));
      },
      has: async (key: string): Promise<boolean> => Object.prototype.hasOwnProperty.call(await this.store.read(), key),
      delete: async (key: string): Promise<void> => {
        const store = await this.store.read();
        delete store[key];
        await this.store.write(key, store);
      },
    };
  }

  // -------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------

  /**
   * Execute a process using OMA's run() backend.
   *
   * @param command The command to execute (e.g., './scripts/run-tasks.sh')
   * @param args Command-line arguments
   * @param metadata Run metadata (task, role, cwd, env, signal)
   * @returns Promise resolving to ProcessResult
   */
  async run(
    command: string,
    args: string[] = [],
    metadata: RunMetadata
  ): Promise<ProcessResult> {
    const taskId = metadata.task.id;
    const role = metadata.role;

    // Initialize retry count for this task if not already tracked
    if (!this.retryCounts.has(taskId)) {
      this.retryCounts.set(taskId, 0);
    }

    // Check retry limits before proceeding
    const currentRetries = this.retryCounts.get(taskId)!;
    if (currentRetries >= this.maxRetries) {
      // Return blocked result — no more attempts allowed
      return {
        exitCode: -1,
        stdout: '',
        stderr: `RUN BLOCKED: max retries (${this.maxRetries}) exceeded for task ${taskId}`,
        timedOut: false,
        cancelled: false,
        finalState: 'blocked',
      };
    }

    // Build environment: allowlisting with explicit secret redaction
    const baseEnv = this.mergeEnvironments(metadata.env ?? {});

    // Build AbortSignal: use timeout if enabled, otherwise no explicit signal
    const signal = this.enableTimeout
      ? AbortSignal.timeout(this.timeoutMs)
      : undefined;

    // Execute via OMA's run() — this wraps child_process.spawn internally
    // The run() function signature from @open-multi-agent/core/process:
    //   run({ command, args, cwd, timeout, env, signal })
    // Returns a promise that resolves to a Run object with:
    //   - exitCode: number
    //   - stdout: string
    //   - stderr: string
    //   - timedOut: boolean (set when AbortSignal.timeout fires)
    //   - cancelled: boolean (set when AbortError is thrown)
    //   - error: Error | null
    const omaRun: OmaRun = await run({
      command,
      args,
      cwd: metadata.cwd,
      timeout: this.enableTimeout ? this.timeoutMs : undefined,
      env: baseEnv,
      signal,
    });

    // Track the in-flight run
    this.inFlightRuns.set(taskId, omaRun);

    // Map OMA errors to our result types
    let mappedTimedOut = false;
    let mappedCancelled = false;

    // Check if the run completed due to timeout
    if (theomaRun.timedOut) {
      mappedTimedOut = true;
    }

    // Check if the run was cancelled via AbortError
    if (theomaRun.cancelled) {
      mappedCancelled = true;
    }

    // Apply secret redaction to stdout and stderr
    const redactedStdout = this.redactSecrets(theomaRun.stdout);
    const redactedStderr = this.redactSecrets(theomaRun.stderr);

    // Determine final state
    const finalState = this.determineFinalState(
      theomaRun.exitCode,
      mappedTimedOut,
      mappedCancelled
    );

    // Persist result to durable store
    await this.persistResult({
      taskId,
      role,
      exitCode: theomaRun.exitCode,
      rawStdout: theomaRun.stdout,
      rawStderr: theomaRun.stderr,
      redactedStdout,
      redactedStderr,
      finalState,
      timedOut: mappedTimedOut,
      cancelled: mappedCancelled,
    });

    // Remove from in-flight tracking
    this.inFlightRuns.delete(taskId);

    // Return the processed result
    return {
      exitCode: theomaRun.exitCode,
      stdout: redactedStdout,
      stderr: redactedStderr,
      timedOut: mappedTimedOut,
      cancelled: mappedCancelled,
      finalState,
    };
  }

  /**
   * Cancel all in-flight runs.
   * Sends AbortController signal to cancel OMA runs.
   */
  async cancelAll(): Promise<void> {
    // Cancel all tracked in-flight runs via AbortController
    // OMA runs honor AbortSignal — sending the signal cancels the run
    const runs = Array.from(this.inFlightRuns.values());

    for (const run of runs) {
      try {
        // OMA runs honor AbortSignal; we can re-signal or the run itself handles cancellation
        // The run's signal may already have been set to timeout; if we need explicit cancel:
        if (run.signal) {
          run.signal.abort();
        }
      } catch {
        // Ignore errors on individual runs
      }
    }

    // Clear all tracked runs
    this.inFlightRuns.clear();
    this.retryCounts.clear();
  }

  /**
   * Get the current persistent store state.
   */
  async getStore(): Promise<Record<string, unknown>> {
    return this.store.read();
  }

  /**
   * Save a result to the durable JSON store.
   *
   * @param result The process result to persist
   */
  private async saveResult(result: {
    taskId: string;
    role: AgentRole;
    exitCode: number;
    rawStdout: string;
    rawStderr: string;
    redactedStdout: string;
    redactedStderr: string;
    finalState: RunState;
    timedOut: boolean;
    cancelled: boolean;
  }): Promise<void> {
    const store = await this.store.read();

    // Store the result under a key derived from task ID
    const key = `task:${result.taskId}:${Date.now()}`;
    store[key] = {
      taskId: result.taskId,
      role: result.role,
      exitCode: result.exitCode,
      rawStdout: result.rawStdout,
      rawStderr: result.rawStderr,
      redactedStdout: result.redactedStdout,
      redactedStderr: result.redactedStderr,
      finalState: result.finalState,
      timedOut: result.timedOut,
      cancelled: result.cancelled,
      persistedAt: new Date().toISOString(),
    };

    await this.store.write(key, store[key]);
  }

  // -------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------

  /**
   * Merge environment variables: allowlisting with secret redaction.
   *
   * @param customEnv Additional environment variables to include
   * @returns Merged environment object with allowlisted keys only
   */
  private mergeEnvironments(customEnv: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
    // Start with allowlisted keys from process.env
    const allowlisted: Record<string, string> = {};

    // Note: OMA process backend applies its own environment allowlisting;
    // this adapter adds application-level allowlisting on top
    for (const key of ['PATH', 'HOME', 'USER', 'TEMP']) {
      if (key in process.env) {
        allowlisted[key] = process.env[key]!;
      }
    }

    // Overlay custom environment — but only allowlisted keys survive
    // Unknown keys from customEnv are stripped to prevent secret leakage
    const merged: Record<string, string> = { ...allowlisted, ...customEnv };

    // Filter to only allowlisted keys
    const filtered: Record<string, string> = {};
    for (const key of ['PATH', 'HOME', 'USER', 'TEMP']) {
      if (key in merged) {
        filtered[key] = merged[key]!;
      }
    }

    return filtered;
  }

  /**
   * Redact secrets from a string using known patterns.
   * Identical implementation to CustomProcessRunner for consistency.
   *
   * @param input The string to redact
   * @returns Input with all known secret patterns replaced by [REDACTED]
   */
  private redactSecrets(input: string): string {
    let result = input;
    for (const pattern of KNOWN_SECRET_PATTERNS) {
      result = result.replace(pattern, REDACTION_REPLACEMENT);
    }
    // Also mask any env-like secret patterns that may appear in output
    result = result.replace(SECRET_ENV_PATTERN, (match) => {
      return match.replace(/=[^&]+/, '=[REDACTED]');
    });
    return result;
  }

  /**
   * Determine the final run state based on OMA run outcomes.
   *
   * Critical distinction:
   * - `exitCode !== 0` + !timedOut + !cancelled → completed (failure)
   * - timedOut === true → 'timedOut' state (mapped from AbortSignal.timeout → TimeoutError)
   * - cancelled === true → 'cancelled' state (mapped from AbortError)
   * - Must distinguish timeout from cancellation; both may manifest similarly
   */
  private determineFinalState(
    exitCode: number,
    timedOut: boolean,
    cancelled: boolean
  ): RunState {
    // Timeout takes precedence in mapping — AbortSignal.timeout fires first
    if (timedOut) return 'timedOut';
    if (cancelled) return 'cancelled';

    if (exitCode === 0) return 'completed';
    if (exitCode !== 0) return 'completed'; // failure still completes, exit code distinguishes
    return 'completed';
  }

  /**
   * Persist a run result to the durable JSON store.
   * Delegates to saveResult for the actual implementation.
   */
  private async persistResult(result: {
    taskId: string;
    role: AgentRole;
    exitCode: number;
    rawStdout: string;
    rawStderr: string;
    redactedStdout: string;
    redactedStderr: string;
    finalState: RunState;
    timedOut: boolean;
    cancelled: boolean;
  }): Promise<void> {
    await this.saveResult({
      taskId: result.taskId,
      role: result.role,
      exitCode: result.exitCode,
      rawStdout: result.rawStdout,
      rawStderr: result.rawStderr,
      redactedStdout: result.redactedStdout,
      redactedStderr: result.redactedStderr,
      finalState: result.finalState,
      timedOut: result.timedOut,
      cancelled: result.cancelled,
    });
  }

  /**
   * Check if a stored approval record is valid for the given artifact hash.
   *
   * @param storedApproval The approval record from store
   * @param expectedHash The expected artifact hash
   * @returns Whether the approval is valid (matching hash and approved decision)
   */
  private isApprovalValid(storedApproval: ApprovalRecord, expectedHash: string): boolean {
    // OMA durable-approvals API binds approval to run ID and content hash
    // Hash mismatch invalidates stale approval
    if (storedApproval.decision !== 'approved') return false;
    if (!storedApproval.artifactHash) return false;
    // Compare hashes — sha256:abc123 must match current artifact hash
    return storedApproval.artifactHash === expectedHash;
  }
}