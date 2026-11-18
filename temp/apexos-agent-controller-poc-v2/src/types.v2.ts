/**
 * Shared type definitions for OMA POC v2.
 *
 * These types are used by both the Custom Process Runner and the OMA Adapter.
 * Definitions are kept minimal and focused on process lifecycle management.
 */

// ---------------------------------------------------------------------------
// RunState — Lifecycle state of a managed process
// ---------------------------------------------------------------------------

export type RunState =
  | 'queued'        // waiting to be started
  | 'running'       // process is active
  | 'completed'     // process exited (success or failure)
  | 'timedOut'      // timeout expired before completion
  | 'cancelled'     // cancellation requested before completion
  | 'blocked'       // retry limit exceeded or approval denied;

// ---------------------------------------------------------------------------
// AgentRole — Who initiated or is responsible for the process
// ---------------------------------------------------------------------------

export type AgentRole =
  | 'implementer'   // the primary controller/agent
  | 'reviewer'      // independent reviewer session
  | 'system'        // internal system process;

// ---------------------------------------------------------------------------
// TaskContract — Description of work to be done by a process
// ---------------------------------------------------------------------------

export interface TaskContract {
  /** Unique identifier for the task (e.g., UUID or hash) */
  id: string;
  /** Human-readable description of the work */
  description: string;
  /** Optional artifact hash for integrity verification */
  artifactHash?: string;
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// RunMetadata — Snapshot of execution context at start time
// ---------------------------------------------------------------------------

export interface RunMetadata {
  /** When the run was created (ISO timestamp) */
  createdAt: string;
  /** The task contract describing the work */
  task: TaskContract;
  /** The role of the agent initiating the run */
  role: AgentRole;
  /** Working directory for the process */
  cwd?: string;
  /** Environment variables merged at runtime */
  env?: NodeJS.ProcessEnv;
  /** Signal for cancellation/timeout */
  signal?: AbortSignal;
}

// ---------------------------------------------------------------------------
// ProcessResult — Outcome of a single run attempt
// ---------------------------------------------------------------------------

export interface ProcessResult {
  /** Exit code from the child process (0 = success) */
  exitCode: number;
  /** Collected stdout (may be redacted after redaction) */
  stdout: string;
  /** Collected stderr (may be redacted after redaction) */
  stderr: string;
  /** Whether the process terminated due to timeout */
  timedOut: boolean;
  /** Whether the process was cancelled via signal */
  cancelled: boolean;
  /** Final run state after termination */
  finalState: RunState;
  /** Optional error object if the process failed */
  error?: Error;
}

// ---------------------------------------------------------------------------
// ApprovalRecord — Durable approval state persisted to JSON store
// ---------------------------------------------------------------------------

export interface ApprovalRecord {
  /** Unique approval identifier */
  id: string;
  /** Hash of the artifact being approved (sha256:...) */
  artifactHash: string;
  /** Decision: 'approved' or 'rejected' */
  decision: 'approved' | 'rejected';
  /** When the approval was recorded (ISO timestamp) */
  recordedAt: string;
  /** Optional comment from the reviewer */
  comment?: string;
}

// ---------------------------------------------------------------------------
// PersistenceStore — Key-value store for durable state
// ---------------------------------------------------------------------------

export interface PersistenceStore {
  /** Read the entire store state */
  read(): Promise<Record<string, unknown>>;
  /** Write a value at the given key (overwrites) */
  write(key: string, value: unknown): Promise<void>;
  /** Check if a key exists */
  has(key: string): Promise<boolean>;
  /** Delete a key */
  delete(key: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// RedactionPattern — Pattern used for secret identification
// ---------------------------------------------------------------------------

export type RedactionPattern =
  | '<<<SECRET:::.*>>>'          // SECRET marker pattern
  | 'sk-[a-zA-Z0-9]{20,}'         // OpenAI-style secret key
  | 'ghp_[a-zA-Z0-9]{36}'         // GitHub personal access token
  | 'anthr_api_key=[^&]*'         // Anthropic API key pattern;

// ---------------------------------------------------------------------------
// CustomProcessRunnerOptions — Options for CustomProcessRunner constructor
// ---------------------------------------------------------------------------

export interface CustomProcessRunnerOptions {
  /** Path to the store file for durable persistence (JSON) */
  storePath?: string;
  /** Maximum number of retry attempts before blocking */
  maxRetries?: number;
  /** Default timeout in milliseconds for process execution */
  timeoutMs?: number;
  /** Environment allowlisting — keys allowed from process.env */
  envAllowlist?: (keyof NodeJS.ProcessEnv)[];
}

// ---------------------------------------------------------------------------
// OmaProcessRunnerOptions — Options for OmaProcessRunner constructor
// ---------------------------------------------------------------------------

export interface OmaProcessRunnerOptions {
  /** Path to the store file for durable persistence (JSON) */
  storePath?: string;
  /** Maximum number of retry attempts before blocking */
  maxRetries?: number;
  /** Default timeout in milliseconds for process execution */
  timeoutMs?: number;
  /** Whether to enable AbortSignal.timeout mapping */
  enableTimeout?: boolean;
}