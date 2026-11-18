# OMA POC v2: Test Plan

## Test Coverage Mapping

Each test dimension is implemented as an equivalent test for both the Custom Baseline and OMA Adapter. No capability is simulated by fabricated JSON; each assertion genuinely verifies the expected behavior.

---

## Dimension 1: Process Success and Failure

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-01 (success) | `runner.run()` resolves; `result.exitCode === 0`; `result.stdout.includes('success')` | `runner.run()` resolves; `result.exitCode === 0`; `result.stdout.includes('success')` |
| POC-02 (failure) | `runner.run()` resolves; `result.exitCode !== 0`; `result.stderr.includes('fail')` | `runner.run()` resolves; `result.exitCode !== 0`; `result.stderr.includes('fail')` |
| POC-03 (missing executable) | `runner.run()` rejects or `result.exitCode === 127` (ENOENT) | `runner.run()` rejects or `result.exitCode === 127` |

---

## Dimension 2: Timeout and Cancellation

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-04 (timeout) | `result.timedOut === true`; `result.cancelled === false`; process tree killed after `timeoutMs` | `result.timedOut === true`; cancellation signaled via `AbortSignal.timeout()` |
| POC-05 (cancellation) | `result.timedOut === false`; `result.cancelled === true` when cancellation signal sent | `result.timedOut === false`; `result.cancelled === true` when AbortController signaled |
| Distinguish timeout vs cancellation | Assert `timedOut !== cancelled` unless both signals present | Assert `timedOut` mapped to `TimeoutError`; `cancelled` mapped to `AbortError` |

---

## Dimension 3: Parent and Descendant Process Termination

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-06 (process tree kill) | `killProcessTree(pid)` sends `taskkill /PID pid /T /F`; child process fully terminated | N/A — OMA process backend inherits Node.js signal handling |
| Verify descendant termination | After parent kill, no zombie processes remain (check via `ps` or error absence) | OMA's `run()` returns when subprocess exits; no explicit tree kill needed |

---

## Dimension 4: Secret Handling

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-07 (env secret) | `env` contains `SECRET=value`; `result.redactedStdout` does NOT contain `value`; `result.redactedStderr` does NOT contain `value` | Same env injection; same redaction assertion on `stdout` and `stderr` |
| POC-08 (stdout secret) | Output contains `<<<SECRET:::DUMMY_SECRET_VALUE>>>`; `result.redactedStdout` contains `[REDACTED]` instead | Same secret marker in stdout; same redaction on `result.stdout` |
| POC-09 (stderr secret) | Output contains secret on stderr; `result.redactedStderr` contains `[REDACTED]` | Same secret marker on stderr; same redaction on `result.stderr` |
| POC-10 (persisted state) | `saveResult()` writes to JSON store; `readFileSync(storePath)` redacted output does NOT contain raw secret | OMA's `saveResult()` writes to JSON store; persisted data redacted |
| POC-11 (error secret) | Error message contains secret; `result.redactedStderr` masks it | Error from `run()` contains secret; `result.redactedStderr` masks it |

**Rule:** Never allow unredacted secrets to persist in JSON store or execution evidence.

---

## Dimension 5: Restart and Recovery

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-12 (restart before invocation) | State store file exists from prior run; `nextRun.status === 'queued'`; fresh `run()` call succeeds | Same file-based state; OMA FileStore supports sequential recovery per docs |
| POC-13 (restart during invocation) | Prior run has `!completedAt`; restart detects incomplete run; marks uncertain or retries | OMA FileStore supports sequential restart recovery; run record is "current authoritative state" |
| Recovery without fabrication | Never claim success if process outcome cannot be proven; always reconcile before retry | Same — OMA run record is authoritative; do not fabricate outcomes |

---

## Dimension 6: Durable Approval and Stale Rejection

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-14 (approval pause) | Approval record written to JSON; `loaded.approval.decision === 'approved'`; `loaded.approval.artifactHash` matches | OMA `durable-approvals` API; approval bound to run ID and content hash |
| POC-15 (stale approval rejection) | Approval stored with hash `sha256:abc123`; current hash `sha256:def456`; mismatch invalidates | OMA approval store; hash mismatch correctly invalidates stale approval |
| Artifact hash binding | Changing reviewed artifact invalidates existing approval; new approval required | Same — OMA binds approval to immutable artifact hash |

**Rule:** Never retain stale approval. Always re-approve after artifact change.

---

## Dimension 7: Retry Enforcement and Blocked State

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-16 (retry limit) | `MAX_RETRIES = 3`; 4th attempt recorded; `loaded.attempts > MAX_RETRIES`; controller blocks further | OMA retry mechanism; configurable limit enforced; exhaustion marks blocked |
| Blocked state enforcement | After retry exhaustion, `run()` returns blocked result; no silent reset | Same — OMA does not silently reset approvals on retry; material spec change invalidates |

---

## Dimension 8: Git Worktree Isolation

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-17 (separate worktrees) | Actual Git worktrees: `implementer/` and `reviewer/` directories with distinct repos; file content differs | Actual Git worktrees same structure; both implementations use `git worktree add` |
| Prevent cross-editing | Reviewer cannot edit implementer's files; implementer cannot edit reviewer's files | Same — worktree isolation enforced by Git; not ordinary directory isolation |

**Rule:** Never claim worktree isolation using ordinary directories. Use actual `git worktree` commands.

---

## Dimension 9: Independent Reviewer Invocation

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-18 (reviewer receives spec + diff) | Spec hash `'sha256:spec123'`; diff `'+ added feature\n- removed bug'`; reviewer session ID distinct from implementer | Same — reviewer receives exact spec and diff; not implementer's conclusion |
| Reviewer independence | `reviewerId !== 'implementer'`; reviewer sees spec + actual diff; cannot bypass gate | Same — OMA adapter passes spec + diff to reviewer; reviewer ID tracked separately |

---

## Dimension 10: Windows CLI Integration

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-19 (claude availability) | `execSync('claude --version')` succeeds or fails; result recorded | Same — test invokes `claude --version` from Node.js; availability noted |
| POC-20 (codex availability) | `execSync('codex --version')` succeeds or fails; result recorded | Same — test invokes `codex --version` from Node.js; availability noted |
| POC-21 (non-interactive launch) | Both CLIs launch in non-interactive mode; stdout/stderr captured; exit code captured | Same — both CLIs launch non-interactively; documented behavior |

**Note:** POC-19 through POC-21 are marked BLOCKED in disposable POC env per runbook: "Do not install CLIs in POC environment; verify on target Windows workstation separately."

---

## Dimension 11: GitHub Permission Boundaries

| Test | Custom Baseline Assertion | OMA Adapter Assertion |
|------|--------------------------|----------------------|
| POC-22 (allowed ops) | `allowedOps = ['create_issue', 'read_issue', 'create_pr', 'read_pr', 'read_review', 'read_ci']`; `disallowedOps = ['merge_pr', 'delete_branch', 'change_protection', 'admin']`; assertion `!disallowedOps.some(op => allowedOps.includes(op))` | Same logical assertion — controller API surface respects least privilege |
| POC-23 (no auto-merge) | Controller does not merge PRs; merge is manual owner action | OMA does not enable auto-merge; controller API surface: no merge capability in v1 |
| Least-privilege token | GitHub API token has only `create_issue`, `read_*` scopes; no `merge_pr`, `delete_branch` | Same — OMA adapter uses narrowly scoped token; ACP path would require session credentials |

---

## Dimension 12: OMA-Specific Capabilities and Limitations

| Aspect | Custom Baseline | OMA Adaptation |
|--------|----------------|----------------|
| Process backend | `child_process.spawn` direct; full OS control | `run()` from `@open-multi-agent/core/process`; wraps spawn with AbortController |
| Timeout mapping | `setTimeout` + `taskkill`; clear `timedOut`/`cancelled` flags | `AbortSignal.timeout()` maps to `TimeoutError`; cancellation maps to `AbortError`; both may manifest similarly |
| Process backend statelessness | Controller manages state explicitly; run records are append-only event history | OMA process backend "starts a fresh subprocess per run and is stateless between runs"; run record is "current authoritative state, not complete append-only event history" |
| ACP caveats | Not applicable (custom adapter) | "Claude Code uses an adapter rather than native ACP; Codex ACP support is experimental"; richer session path (ACP) not directly usable without additional adapter work |
| FileStore limitations | Controller owns persistence; full control | "FileStore supports sequential restart recovery; do not run multiple controller processes against it expecting distributed locking" |
| Built-in secret redaction | Application-defined; explicit redaction functions | Not built into OMA process backend; application must implement output sanitization |
| Run record vs event history | Append-only event journal; audit trail complete | "Run record is current authoritative state, not a complete append-only event history"; audit trail requires additional event journal implementation |

**Documentation requirement:** Any OMA limitation not covered by the test matrix must be clearly documented in the final report.

---

## Test Rules Compliance Checklist

- [ ] Both implementations run equivalent scenarios (same test IDs, same assertions)
- [ ] No capability simulated by fabricated JSON
- [ ] No recovery claimed without actual process/controller restart
- [ ] No approval claimed without exercising actual approval mechanism
- [ ] No independent review claimed without invoking separate reviewer process
- [ ] No Git worktree isolation claimed using ordinary directories
- [ ] Timeout distinguished from user-requested cancellation
- [ ] Process termination verified using actual process IDs
- [ ] Test assertions genuinely verify expected behavior
- [ ] Test failures produce non-zero exit code
- [ ] Machine-readable results saved and raw execution evidence preserved
- [ ] OMA uses actual APIs and documented capabilities
- [ ] No fake OMA checkpoint, approval, or resume behavior
- [ ] OMA capabilities clearly distinguished from custom adapter functionality
- [ ] OMA limitations documented
- [ ] Custom baseline: tracks multiple processes safely
- [ ] Custom baseline: genuine cancellation implementation
- [ ] Custom baseline: safe process termination
- [ ] Custom baseline: atomic, durable persistence
- [ ] Custom baseline: environment allowlisting
- [ ] Custom baseline: unredacted secrets prevented from persistence

---

## Execution Prerequisites

1. **Node.js v22+** with `npm` available
2. **@open-multi-agent/core@1.24.0** installed (via `npm install`)
3. **TypeScript v5.7+** and **vitest v2.1+** (devDependencies in package.json)
4. **tsx** for running TypeScript directly (devDependency)
5. **Git** available on PATH for worktree tests
6. **Claude Code** and **Codex** CLIs on target Windows workstation (for POC-19 to POC-21; marked BLOCKED in disposable workspace)

## Execution Command

```bash
cd /c/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/temp/apexos-agent-controller-poc-v2
npm install       # First time only; installs @open-multi-agent/core@1.24.0 and deps
npm test          # Runs vitest suite; generates TEST_RESULTS.json
```

**DO NOT RUN `npm test` until source code review is complete.**

## Output Artifacts

After `npm test` runs successfully (post-review):

- `TEST_RESULTS.json` — machine-readable results conforming to the schema below
- `coverage/` — Vitest HTML coverage report
- `test-results/` — any raw execution evidence files

## TEST_RESULTS.json Schema (populated after execution)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OMA POC v2 Test Results",
  "type": "object",
  "properties": {
    "timestamp": {"type": "string", "format": "date-time"},
    "environment": {
      "nodeVersion": {"type": "string"},
      "platform": {"type": "string"},
      "arch": {"type": "string"}
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "customPassed", "omaPassed", "customDetails", "omaDetails"],
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "customPassed": {"type": "boolean"},
          "omaPassed": {"type": "boolean"},
          "customDetails": {"type": "string"},
          "omaDetails": {"type": "string"},
          "blocked": {"type": "boolean"},
          "blockReason": {"type": "string"}
        }
      }
    },
    "summary": {
      "type": "object",
      "properties": {
        "custom": {
          "type": "object",
          "properties": {
            "passed": {"type": "integer"},
            "failed": {"type": "integer"},
            "blocked": {"type": "integer"}
          },
          "required": ["passed", "failed", "blocked"]
        },
        "oma": {
          "type": "object",
          "properties": {
            "passed": {"type": "integer"},
            "failed": {"type": "integer"},
            "blocked": {"type": "integer"}
          },
          "required": ["passed", "failed", "blocked"]
        }
      },
      "required": ["custom", "oma"]
    }
  },
  "required": ["timestamp", "environment", "results", "summary"]
}
```