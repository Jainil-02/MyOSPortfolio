# OMA Proof-of-Concept Runbook

> Status: Approved to execute as a disposable local experiment; not production implementation.
> Owner decisions: custom TypeScript controller, OMA comparison, local single-user Windows v1.
> Selected candidate: @open-multi-agent/core 1.24.0.
> Date: 18 November 2026.

## 1. Purpose

Compare two implementations of the same tiny workflow:

A. Custom baseline: Node child-process invocation plus explicit state transitions.
B. OMA candidate: OMA process backend plus OMA checkpoint/approval facilities where applicable.

This experiment asks whether OMA materially improves scheduling, approval suspension/resume and durable recovery without compromising the existing Claude Code / Codex CLI setup.

This is not a production controller and not an ApexOS feature. Run it in a temporary directory or a separate disposable repository. Do not add OMA dependencies to ApexOS.

## 2. Environment assumptions

- Windows 10/11 and PowerShell.
- Node.js 22 or 24. The previously recorded Node 24.4.0 meets OMA's documented Node 22/24 recommendation; verify the current version.
- npm and Git available.
- Claude Code and Codex already installed and independently usable.
- FreeLLMAPI gateway already configured by the user.
- Do not print, copy or request API tokens.

OMA documentation currently lists @open-multi-agent/core 1.24.0. Pin this exact version during the experiment. Do not install a floating latest version.

## 3. Create a disposable workspace

Run in a new PowerShell window. This creates a temporary directory outside ApexOS and does not change global Claude/Codex configuration.

    $PocRoot = Join-Path $env:TEMP "apexos-agent-controller-poc"
    New-Item -ItemType Directory -Force -Path $PocRoot | Out-Null
    Set-Location $PocRoot

    node --version
    npm --version
    git --version

    npm init -y
    npm install --save-exact @open-multi-agent/core@1.24.0
    npm install --save-dev --save-exact typescript tsx vitest @types/node
    npx tsc --init

If npm install fails, stop and record the exact error. Do not work around certificate/proxy/network restrictions by disabling TLS verification or changing machine-wide settings.

## 4. Experiment A — custom process baseline

Create a tiny TypeScript adapter that:
1. accepts a fixed executable path, fixed argument array, explicit cwd, timeout and environment allowlist;
2. starts the process without shell interpolation;
3. captures stdout, stderr and exit code;
4. kills the process tree on timeout/cancel;
5. writes run metadata and state transitions to a local JSON/SQLite store;
6. uses a deterministic fake child process for the first test.

First test with Node itself, not Claude or Codex. A fake child should support successful output, non-zero exit, delayed output/timeout, process interruption and output containing a dummy secret marker for redaction. Never use real credentials in fixtures.

## 5. Experiment B — OMA process backend

Use OMA's documented process backend to invoke the same fake child. Compare invocation complexity, stdout/stderr and exit mapping, timeout/cancellation, process lifecycle, error classification, restart recovery and durable approval bound to the reviewed task content.

Upstream constraints to validate:
- Process backend starts a fresh subprocess for each run and is stateless between runs.
- ACP is the richer session path, but Claude Code uses an adapter and Codex ACP support is experimental.
- OMA FileStore supports sequential recovery; do not run multiple controller processes against it expecting distributed locking.
- Application still owns the approval UI and owner decision handling.

Prefer process backend for the first apples-to-apples test. Do not install ACP dependencies until a session requirement is demonstrated.

## 6. Required test matrix

| ID | Test | Pass condition |
|---|---|---|
| POC-01 | Fake child succeeds | Output and exit code normalized |
| POC-02 | Fake child fails | Non-zero exit recorded as failure |
| POC-03 | Timeout | Process tree terminated; timeout recorded |
| POC-04 | Cancellation | Cancellation recorded; no orphan remains |
| POC-05 | Secret redaction | Dummy secret marker absent from persisted logs |
| POC-06 | Restart before invocation | Queued state resumes safely |
| POC-07 | Restart during invocation | Recoverable or uncertain; never fabricated success |
| POC-08 | Approval pause | Decision durable and bound to task/spec hash |
| POC-09 | Stale approval | Changed task hash invalidates old approval |
| POC-10 | Retry limit | Configured limit enforced; run becomes blocked |
| POC-11 | Separate worktrees | Implementer/reviewer cannot mutate same workspace |
| POC-12 | Independent review | Reviewer receives actual diff/spec in a distinct invocation |
| POC-13 | Windows CLI integration | Claude and Codex launch under existing config without global changes |
| POC-14 | GitHub boundary | No merge/admin permission or auto-merge path exists |

Use fake processes and local fixtures for POC-01 through POC-12 first. Invoke real Claude/Codex only after those pass.

## 7. Real CLI smoke tests

### Claude Code

Use the already-installed CLI and its existing FreeLLMAPI environment. Start with a harmless read-only task in the disposable workspace, such as summarizing a local fixture. Use non-interactive print mode and a bounded turn/time limit. Confirm exit status, output format, gateway routing, session identifier behavior and that no token appears in process arguments, output or saved artifacts.

Do not use permission bypass flags. Do not change settings.json, .claude.json, MCP config or global environment.

### Codex

Use codex exec with read-only sandbox for a harmless task in the disposable workspace. Confirm exit status, structured output, read-only sandbox and existing provider configuration. Confirm no token appears in arguments, output or artifacts.

Do not use --yolo, danger-full-access or approval-bypass flags. Do not change config.toml or project trust settings.

## 8. Compare and decide

Score custom baseline and OMA from 1 (poor) to 5 (strong):

| Dimension | Custom baseline | OMA |
|---|---:|---:|
| Windows process reliability | | |
| Timeout/cancellation | | |
| Durable pause/resume | | |
| Restart recovery | | |
| Independent role enforcement | | |
| Audit/evidence | | |
| Code complexity | | |
| Testability | | |
| Maintenance burden | | |
| Security boundary clarity | | |

Adopt OMA only if it passes all mandatory safety/recovery tests and materially reduces implementation complexity without forcing a provider/session change. Otherwise retain the custom controller and borrow only validated design ideas.

## 9. Evidence to return

Record Windows version and Node/npm/Git versions, exact OMA version and lockfile, exact commands and exit codes, pass/fail/not-run matrix, sanitized output excerpts, recovery observations, any config/permission changes (expected: none), comparison scores and recommendation.

Never attach .env files, API tokens, full process environment, credential files or unsanitized logs.

## 10. Stop conditions

Stop if installation asks to weaken TLS/security settings; a process modifies files outside the temporary workspace; credentials are printed/persisted; an agent requests broad filesystem or permission bypass; interrupted side effects cannot be reconciled; or a test requires global settings/ApexOS source changes.

A successful POC does not authorize production adoption. Owner reviews evidence and approves the next phase separately.

## 11. Upstream references

- OMA package/release: https://github.com/open-multi-agent/open-multi-agent/releases
- OMA quick start: https://open-multi-agent.com/getting-started/quick-start/
- OMA external agents: https://open-multi-agent.com/reference/external-agents/
- OMA durable approvals: https://open-multi-agent.com/reference/durable-approvals/
- OMA run store: https://open-multi-agent.com/reference/run-store/
