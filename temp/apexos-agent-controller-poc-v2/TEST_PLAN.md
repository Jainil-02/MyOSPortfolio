# OMA POC v2 — Test Plan and Evidence Boundaries

## Executable test coverage

The current Vitest suite contains real Node.js child-process tests for both runners:

| Area | Assertion |
|---|---|
| Process success | Real child exits 0 and stdout is captured |
| Process failure | Real child exits non-zero; normal exit is not called cancellation |
| Timeout | Long-running child is stopped and timeout state is returned |
| Cancellation | AbortSignal cancels a real child process |
| Redaction | Secret marker is redacted before persistence |
| Invocation cap | Configured per-task invocation cap blocks the next call |

The tests use `process.execPath` and inline Node scripts. This avoids relying on `/bin/bash`, `sleep`, or shell script fixtures and makes the core scenarios portable to Windows.

## Not implemented / not proven

These dimensions from the earlier draft are **not covered by executable tests** and must remain unsupported/unverified:

- durable approval pause/resume;
- stale approval rejection against a real artifact hash;
- controller restart recovery, including restart during an active invocation;
- real Git worktree isolation;
- separate reviewer agent invocation and independence;
- Claude/Codex non-interactive task launch;
- GitHub API permission boundaries and no-auto-merge enforcement;
- robust Windows descendant process-tree termination under all process-tree shapes.

A CLI `--version` check would prove only that a CLI is discoverable, not that task invocation, authentication, bounded permissions, or reviewer independence work.

## Test execution protocol

Run on the target Windows workstation from this directory:

```powershell
npm ci
npx tsc --noEmit
npm test
```

Record:
- exact command and exit code;
- Node.js and npm versions;
- Windows version and architecture;
- complete test summary;
- failures and skipped/blocked tests.

Do not fill in pass counts manually. Do not describe tests as executed until raw output from the target machine is captured.

## Interpretation

This is a process-runner comparison only. Neither implementation is thereby approved as the production orchestration controller. The next decision requires actual Windows execution evidence and a separate review of OMA package behavior and its documented limitations.
