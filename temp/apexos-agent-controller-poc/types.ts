/**
 * Types for OMA POC experiment
 */

export type RunState =
  | 'DRAFT'
  | 'SPECIFICATION'
  | 'DESIGN_REVIEW'
  | 'OWNER_APPROVAL'
  | 'READY'
  | 'IMPLEMENTATION'
  | 'INDEPENDENT_REVIEW'
  | 'QA'
  | 'OWNER_ACCEPTANCE'
  | 'PR_READY'
  | 'MERGED'
  | 'BLOCKED'
  | 'CANCELLED';

export type AgentRole = 'implementer' | 'reviewer' | 'orchestrator';

export interface TaskContract {
  id: string;
  title: string;
  specHash: string;
  designHash: string;
  actorId: string;
  role: AgentRole;
  inScope: string[];
  outOfScope: string[];
}

export interface RunMetadata {
  runId: string;
  taskId: string;
  state: RunState;
  attempt: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastTransition?: Date;
  exitCode?: number;
  timeout?: number;
  stdout?: string;
  stderr?: string;
  approval?: {
    id: string;
    approver: string;
    decision: 'approved' | 'rejected';
    timestamp: Date;
    artifactHash: string;
  };
  worktreePath?: string;
  branchName?: string;
  specUrl?: string;
  prUrl?: string;
  qaResults?: {
    passed: boolean;
    tests: string[];
    errors?: string[];
  };
}

export interface AgentInvocation {
  id: string;
  runId: string;
  executable: string;
  args: string[];
  cwd: string;
  timeoutMs: number;
  env: Record<string, string>;
  startedAt?: Date;
  completedAt?: Date;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  cancelled?: boolean;
  timedOut?: boolean;
}