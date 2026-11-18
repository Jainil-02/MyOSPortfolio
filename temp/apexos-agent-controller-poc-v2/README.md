# OMA POC v2 — Process Runner Comparison

## Purpose

This disposable proof of concept compares:
- a minimal custom Node.js subprocess runner; and
- an adapter around `@open-multi-agent/core@1.24.0` process execution.

It evaluates subprocess invocation, exit status, timeout/cancellation mapping, output redaction, local result persistence and invocation caps. It is **not** a complete multi-agent controller or an autonomous engineering workflow.

## Current scope

The test suite uses Node.js child processes (`process.execPath`) so the core process tests do not depend on Bash, shell scripts, or Unix-only utilities. Tests exercise the adapter classes rather than calling OMA directly.

The JSON store is a local single-process POC store. Atomic replacement reduces partial-write risk but does not provide cross-process locking, a transaction log, or a production-grade audit trail.

## Explicitly not implemented or proven

The following are outside this POC's verified scope and must not be reported as passing:
- durable human approval pause/resume or stale approval invalidation;
- restart recovery after forcibly terminating the controller mid-run;
- Git worktree creation and isolation;
- invocation of a genuinely separate Claude/Codex reviewer session;
- Claude/Codex non-interactive task execution or gateway authentication;
- GitHub issue/PR lifecycle, permission enforcement, or merge protection;
- reliable descendant-process-tree termination on every Windows configuration.

OMA process execution does not itself provide these controller-level capabilities. They require separate implementation and tests.

## Safety

- Keep this POC in its disposable directory.
- Do not install or modify global Claude Code, Codex, Copilot, MCP, or shell configuration.
- Do not put real credentials in test arguments or output.
- Persisted stdout/stderr is redacted; raw output is deliberately not stored.
- No automatic GitHub merge is implemented.

## Run on the target Windows workstation

From PowerShell:

```powershell
Set-Location .\temp\apexos-agent-controller-poc-v2
npm ci
npx tsc --noEmit
npm test
```

Run these commands only after reviewing this branch. Save the actual terminal output and environment details (Node version, npm version, Windows version) with the test evidence. A successful static review or PR merge is not a substitute for running these commands on Windows.
