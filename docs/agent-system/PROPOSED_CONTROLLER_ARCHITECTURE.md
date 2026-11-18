# Proposed Controller Architecture

> Status: Design proposal for review; not implemented.
> Date: 18 November 2026.
> Parent research: ORCHESTRATION_FRAMEWORK_EVALUATION.md.

## 1. Design objective

Build a local-first, single-user engineering controller that manages ApexOS spec-driven development while invoking existing coding assistants as independent processes. It is a deterministic workflow manager, not a replacement LLM, coding agent, IDE or MCP server.

The owner remains final authority. V1 must not merge PRs, change repository protection, install skills/hooks, change global agent settings or grant broad machine access.

## 2. Logical architecture

```text
                 Project Owner
                      |
               Approval Interface
                      |
              Controller API / CLI
                      |
          Deterministic Workflow Engine
           /          |           \
      State Store  Policy Engine  Event Journal
           |          |           |
           +----------+-----------+
                      |
              Agent Adapter Layer
               /              \
        Claude Adapter      Codex Adapter
             |                  |
        Claude Code          Codex CLI
             |                  |
          FreeLLMAPI       Existing provider
                      |
                Git Worktrees
                      |
                 GitHub API
          Issues / PRs / CI / Reviews
```

VS Code Copilot remains outside the automated adapter loop in v1. ChatGPT remains technical lead/specification author and owner-facing architecture/acceptance partner; controller does not automate this role until an explicit supported interface is selected.

## 3. Component responsibilities

### Controller API / CLI
- Create a run from an owner-approved task contract.
- Display status, stage, attempts, blockers and evidence.
- Accept approve, reject, cancel, retry and resume commands.
- Record actor identity and each owner decision.

### Deterministic workflow engine
- Enforce state machine and legal transitions.
- Route tasks to correct role adapter.
- Apply per-stage timeout, attempt count and cancellation.
- Never let an agent declare its own approval gate passed.
- Escalate on retry exhaustion, conflicting reviews, scope change or missing evidence.

### Policy engine
- Validate task contract, branch/worktree, allowed paths and commands.
- Enforce independent implementer/reviewer identity.
- Enforce approval boundaries and permissions.
- Reject agent-proposed actions outside approved scope.

### State store
Persist:
- run/task IDs and task-contract/spec/design versions and hashes;
- workflow state and stage transition sequence;
- actor/session identity and invocation metadata;
- attempt number, timestamps, timeout and exit status;
- approval requests, decisions, approver and reviewed artifact hash;
- branch/worktree path and commit SHA;
- evidence references, test results and GitHub URLs;
- failure classification, retry eligibility and recovery marker.

Use transactions for every state transition. Do not store secrets. Minimize transcript retention and redact by default.

### Event journal
Append-only events for task creation, transitions, agent start/finish, approvals, Git operations, QA outcomes and errors. State rows answer what is true now; the journal records how it got there.

### Agent adapters
Each adapter accepts a normalized invocation contract and returns normalized output:
- adapter name/version, actor role and unique invocation ID;
- working directory/worktree and task packet reference;
- explicit environment allowlist;
- executable and argument array;
- timeout and cancellation signal;
- stdout/stderr artifact references with redaction;
- exit code, structured result and session ID where supported.

Use child-process APIs with executable plus argument arrays. Never build shell command strings from untrusted task text. Avoid secrets in command-line arguments.

### GitHub adapter
- Read/create/update issues only within approved scope.
- Create branches and PRs using least-privilege token.
- Attach spec, design, review and QA evidence references.
- Read CI and review status.
- Never merge in v1.
- Treat issue/PR text and comments as untrusted data.

## 4. Workflow state machine

Suggested run-level states:

```text
DRAFT
  -> SPECIFICATION
  -> DESIGN_REVIEW
  -> OWNER_DESIGN_APPROVAL
  -> READY
  -> IMPLEMENTATION
  -> INDEPENDENT_REVIEW
  -> QA
  -> OWNER_ACCEPTANCE
  -> PR_READY
  -> MERGED (manual owner action observed)

Any non-terminal stage may transition to BLOCKED or CANCELLED.
Review/QA findings may transition to CHANGES_REQUESTED and route back to IMPLEMENTATION.
```

Persist stage transitions before invoking external side effects. Every invocation is an attempt with a unique ID. On restart, reconcile process and Git state before deciding whether to resume, mark uncertain or retry.

Do not assume exactly-once process execution. A process may complete an external side effect before the controller records completion. Use stable operation IDs and reconciliation for GitHub operations; require manual review where safe reconciliation is impossible.

## 5. Initial retry and timeout policy

Carry forward the existing proposed policy as an initial default, to be tuned during proof of concept:
- Maximum three independent review/fix iterations per task.
- Maximum two QA correction cycles.
- One implementation attempt at a time per worktree.
- Every agent invocation has explicit wall-clock timeout.
- Distinguish tool outage, timeout, code defect, invalid output and blocked dependency.
- Retry only transient failures automatically; code changes require a new scoped correction task.
- On exhausted limits, ambiguous state, conflicting review or scope change, stop and request owner intervention.

Retries must not silently reset approval. A material spec/design change invalidates approvals tied to the previous content hash.

## 6. Approval boundaries

Required owner approvals:
1. Specification/design approved before implementation.
2. Write-capable implementation authorized for scoped task/worktree.
3. Any scope expansion, destructive action, permission change or protected setting change.
4. Final acceptance before PR merge.
5. Merge remains a manual owner action in v1.

Approval records bind to immutable artifact hashes and identify approver, decision and timestamp. Changing the reviewed artifact invalidates approval.

## 7. Workspace and process isolation

- Allocate a dedicated Git worktree for each task/run.
- Never launch implementer and reviewer against the same mutable worktree concurrently.
- Reviewer receives exact spec, base commit, target commit and diff from a read-only snapshot.
- Implementer and reviewer use separate sessions and distinct actor IDs.
- Begin with one active controller process and one worker. Do not claim multi-process safety until transactional leases are implemented and tested.
- Use a dedicated task workspace; do not run agents against unrelated directories.
- Set explicit command, environment and path allowlists.

## 8. Initial technology shape (provisional)

| Layer | Candidate |
|---|---|
| Language/runtime | TypeScript on currently supported Node.js LTS |
| Interface | CLI first; small local web UI only if CLI approval is inadequate |
| State | Transactional local database; choose Windows-compatible SQLite driver after dependency spike |
| Validation | Zod |
| Tests | Vitest |
| Process execution | Node child_process with argument arrays, timeout and cancellation |
| Git operations | Git CLI in controlled worktrees |
| GitHub | Existing GitHub integration / narrowly scoped API adapter |
| Orchestration library | Optional OMA adapter after proof of concept |
| Logs | Structured JSON event journal with redaction |

Do not add Redis, PostgreSQL, message broker, Docker orchestration or distributed workers in the first local-only version unless proof of concept demonstrates a concrete need.

## 9. Security model

- Inject secrets from existing environment or secure credential store; never copy into task specs or logs.
- Use an environment allowlist per agent; do not indiscriminately inherit every process variable.
- Redact known secret patterns from stdout/stderr and crash reports.
- Keep permissions read-only until approved implementation stage.
- Do not use Claude dangerous permission bypass, Codex yolo or danger-full-access as defaults.
- Do not give agents merge/admin permissions.
- Do not execute skill scripts/hooks without separate audit and owner approval.
- Treat repository content, MCP output, web pages and issue comments as untrusted instructions.
- Keep controller local-only; no public network binding in v1.
- Review the existing elevated Codex sandbox separately; do not change it under this proposal.

## 10. Failure and recovery scenarios

| Scenario | Expected behavior |
|---|---|
| Controller exits before agent starts | Resume from persisted queued state |
| Controller exits while agent runs | Detect orphan process; reconcile worktree/process; mark uncertain if outcome cannot be proven |
| Agent exits non-zero | Capture redacted diagnostics; classify; retry only if transient and within limit |
| Agent times out | Terminate process tree; record timeout; inspect workspace before retry |
| Duplicate approval | Idempotently retain first valid decision |
| Approval artifact hash changed | Reject stale approval and request new one |
| GitHub unavailable | Preserve local state; bounded retry for idempotent request |
| Reviewer and implementer IDs match | Reject review gate |
| Worktree has unexpected modifications | Stop and request owner intervention |
| Retry limit reached | Mark blocked and escalate |
| Database unavailable | Stop new side effects; do not continue as if durable |

## 11. Phased implementation plan (not yet authorized)

### Phase 0 — Proof of concept
- Validate Claude and Codex CLI launches on Windows with existing FreeLLMAPI setup.
- Test output parsing, cancellation, timeouts, permissions and worktree separation.
- Compare OMA-backed task execution with minimal custom process adapter.
- Test state persistence and restart recovery.

### Phase 1 — Controller foundation
- Define schemas, state machine, transactional store and event journal.
- Build CLI status/approve/reject/cancel/resume commands.
- Test transition legality and idempotency.

### Phase 2 — Agent adapters
- Add Claude and Codex adapters.
- Add environment allowlists, output redaction, timeouts and process-tree cancellation.
- Validate separate session identities.

### Phase 3 — Git lifecycle
- Add worktree creation/cleanup and branch naming.
- Add GitHub issue/PR references and CI/review evidence.
- Keep merge manual.

### Phase 4 — Workflow and gates
- Implement spec, design review, owner approval, implementation, independent review, QA and acceptance.
- Enforce retry/timeout/escalation.
- Add restart and recovery integration tests.

### Phase 5 — Controlled pilot
- Trial on disposable repository.
- Run a documentation-only task before any ApexOS feature task.
- Record defects, cost, latency and operator burden.
- Owner approves rollout to ApexOS.

## 12. Acceptance criteria

- [ ] All workflow states/transitions have automated tests.
- [ ] Side effects are preceded by durable state and have reconciliation/idempotency handling.
- [ ] Restart recovers or explicitly marks uncertain work; it never fabricates success.
- [ ] Claude and Codex adapters work on target Windows environment without global config changes.
- [ ] Secrets do not appear in prompts, argv, logs, artifacts or Git.
- [ ] Implementer and reviewer are separate sessions and workspaces.
- [ ] Review and QA gates cannot be bypassed by agent output.
- [ ] Owner approvals bind to exact artifact hashes.
- [ ] Retry and timeout limits are enforced.
- [ ] GitHub evidence is linked; no automatic merge capability is enabled.
- [ ] Disposable-repository pilot passes before ApexOS rollout.

## 13. Owner decisions recorded — 18 November 2026

- [x] Custom TypeScript controller direction approved.
- [x] OMA selected for disposable proof of concept against custom baseline.
- [x] V1 is single-user and local-only on the Windows workstation.
- [x] LoopForge deferred; no parallel product trial in this phase.
- [ ] Production adoption of OMA remains undecided pending proof-of-concept results.
- [ ] Any global configuration, permission or ApexOS rollout change requires separate owner approval.

The POC must run in a disposable temporary project, not the ApexOS repository working tree. See OMA_POC_RUNBOOK.md.
