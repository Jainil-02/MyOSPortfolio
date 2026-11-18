# Independent Review: OMA Proof of Concept

**Review date:** 18 November 2026  
**Scope:** Read-only review of the three agent-system design/runbook documents and the available disposable POC artifacts under `C:\tmp\apexos-agent-controller-poc`. No ApexOS or POC code was changed.  
**Recommendation:** **Further Testing Required**

## Executive assessment

The submitted POC report does not establish that OMA or the custom baseline passed the claimed acceptance tests. The available `src/test-poc.ts` contains multiple checks that only write and read canned JSON, compare hard-coded strings, or compare fixed allowlists. It does not exercise restart recovery, approval enforcement, retries, real worktrees, independent agent sessions, or GitHub permissions. Moreover, the report references `src/custom-baseline.ts`, `src/oma-adapter.ts`, `package-lock.json`, and `POC_REPORT.json`, none of which were present in the inspected temporary directory. Only `POC_REPORT.md`, `src/test-poc.ts`, and `src/types.ts` were present. The runner implementations therefore could not be independently inspected or executed.

The report's broad recommendation to prefer a narrow custom controller may be a reasonable design hypothesis consistent with the architecture proposal, but its numerical scores and claimed experimental evidence are unsupported by the delivered artifacts. The runbook requires successful target-Windows tests and CLI integration before considering adoption; the evidence does not meet that bar.

## Evidence reviewed and reproduction

Reviewed:

- `docs/agent-system/ORCHESTRATION_FRAMEWORK_EVALUATION.md`
- `docs/agent-system/PROPOSED_CONTROLLER_ARCHITECTURE.md`
- `docs/agent-system/OMA_POC_RUNBOOK.md`
- `C:\tmp\apexos-agent-controller-poc\POC_REPORT.md`
- `C:\tmp\apexos-agent-controller-poc\src\test-poc.ts`
- `C:\tmp\apexos-agent-controller-poc\src\types.ts`

I could not reproduce the POC because the source files imported by the matrix (`custom-baseline.js` and `oma-adapter.js`) and the package metadata/dependencies are absent. There is no captured test output or `POC_REPORT.json` to establish which version of the test script was run or what it printed. This is an artifact completeness failure, not evidence that the implementation itself necessarily fails.

## Verified test results

“Verified” here means verified from the supplied test source, not a passing execution of the runners.

| Test area | Independent finding |
|---|---|
| POC-01/02 process success/failure | Test code intends to invoke both runners and check output/exit code, but runner implementations are missing; execution and reported outcomes are unverified. |
| POC-03 timeout | Test code asks runners to handle a timeout. It does not verify a child or descendant is gone. OMA is marked partial in the report; this remains unverified. |
| POC-04 cancellation | Not tested: the code supplies a 500 ms timeout, just as in POC-03, and never sends a cancellation signal. Reported “cancellation” pass/partial is incorrect. |
| POC-05 redaction | At most checks a returned `redactedStdout` value for a dummy marker. It does not inspect persisted logs/artifacts or verify secrets passed through environment, stderr, errors, or crash paths. Runner behavior is unverified. |
| POC-06 restart before invocation | Only serializes a hand-built `{status:"queued"}` object and parses it immediately. No controller restart, state store, resumed dispatch, or side-effect check. Not a recovery test. |
| POC-07 restart during invocation | Reads `runs` from a file created in POC-06 with `runs: []`, so `incompleteRuns.length > 0` is false. It cannot pass as written on a clean run. No process is interrupted or restarted. Reported PASS is contradicted by the code. |
| POC-08 approval pause | Writes and reads a fabricated approval record with a literal hash. Does not exercise OMA `ApprovalStore`, pause/resume, authorization, or binding to actual task content. Not an approval test. |
| POC-09 stale approval | Checks that two hard-coded strings differ. No content is hashed and no approval gate rejects a changed artifact. Not a stale-approval test. |
| POC-10 retry limit | A loop deliberately executes `MAX_RETRIES + 1` times and then asserts the count exceeds the limit. That proves the loop can exceed its limit; it does not test enforcement or a blocked state. Reported PASS is invalid. |
| POC-11 separate worktrees | Creates two ordinary directories and writes different strings. These are not Git worktrees and no agent is prevented from mutating the other directory. Not an isolation test. |
| POC-12 independent review | Writes fixed spec/diff strings and a fixed reviewer ID to JSON. No reviewer process/session is started, and the assertion `reviewerId !== 'implementer'` only compares against a literal. Not an independence test. |
| POC-13 Windows CLI integration | Checks only whether `claude --version` and `codex --version` succeed. It does not invoke a task, verify gateway routing, structured output, sandbox/permission behavior, session identity, or credential exposure. Correctly not passed, but “BLOCKED” is not represented by the script's `blocked` flag. |
| POC-14 GitHub boundary | Compares two source-code arrays. No GitHub client, token scope, permission, or auto-merge path is inspected. Not a boundary test. |

The test harness also records each implementation as a separate result row, then summarizes row counts as if they were unique test cases. It calls `recordResult` twice per ID. The displayed aggregate can therefore misstate case-level pass/fail counts. In addition, the `blocked` flag is never set in the POC-13 calls, so the harness counts missing CLIs as failures rather than blocked tests.

## Disputed or unsupported report claims

- The matrix's POC-06 through POC-12 and POC-14 passes are not supported by the code, for the reasons above. POC-07 and POC-10 are directly contradicted by the test logic.
- Assertions that Windows process-tree termination via `taskkill /T /F` was tested, that OMA wraps spawn in a particular way, and that OMA maps timeout/cancel to `AbortError` cannot be checked without `oma-adapter.ts`, package lock, or raw output.
- The custom baseline scores of 4–5/5 for process reliability, recovery, security, worktrees, and evidence are not supported: its implementation is absent, and the scripted tests do not demonstrate those properties.
- The report says the POC report JSON and pinned lockfile are artifacts, but neither was present in the inspected directory listing. The report labels the package “OCR Package” in its executive section, likely a typo; this adds to provenance uncertainty.
- The claimed environment and package versions are stated in Markdown only. No command transcript, package metadata, OS capture, or raw results were delivered for independent verification.
- Report and runbook paths disagree in representation: the report identifies `/tmp/apexos-agent-controller-poc`, while the inspected artifacts are under `C:\tmp\apexos-agent-controller-poc`. The test script itself writes several unrelated fixed `/tmp/apexos-poc-*.json` paths. On Windows, `/tmp` is not guaranteed to be the intended disposable workspace and may resolve differently depending on runtime/environment.
- The report says “reviewer receives spec + diff” and “separate session” although the harness merely fabricates those values. There is no evidence of an actual reviewer invocation.
- The recommendation to reject OMA for production may be a defensible provisional choice, but the report's comparative score total (48 vs 34) is not a valid measured result from this evidence.

## Runbook compliance

The experiment followed the broad disposable-workspace intent according to the supplied narrative, and no ApexOS source files were present among the POC artifacts reviewed. I found no evidence that global configuration or credentials were changed. Absence of evidence is not a verification of those claims.

The POC does **not** demonstrate compliance with the runbook's substantive requirements:

- POC-01–12 were not executed against actual, available implementation files in the delivered package; most test bodies are illustrative mocks or tautologies.
- The runbook calls for a deterministic fake child and actual process-tree termination checks. Descendant process cleanup is not asserted in the matrix.
- POC-13 requires real bounded read-only tasks through both installed CLIs, plus output/routing/permission/credential checks. Version checks alone do not satisfy it.
- OMA-specific durable approvals/checkpoint APIs and the OMA process backend are not visibly exercised by the supplied script's state/approval tests; they write JSON directly.
- Evidence requirements (exact commands, exit codes, sanitized output, actual lockfile, complete matrix output) are unmet in the delivered artifacts.
- The report's statement that CLI absence is “BLOCKED per runbook” overstates the runbook: it says to run those smoke tests on the configured workstation; the matrix has a blocked field, but the code does not set it.

## Windows and process management

The design's use of Node `child_process` with fixed executable/argument arrays and a task-scoped working directory is appropriate in principle. Windows process lifecycle behavior needs direct validation. On Windows, `child.kill()`/AbortSignal behavior should not be assumed to terminate descendants. The report claims `taskkill /PID /T /F` was tested for the custom baseline, but the implementation and evidence are missing. Verify handling of spawn errors, quoting/`.cmd` shims, process trees, output buffering, Unicode, long paths, and cleanup after timeout/cancel. Avoid shell command construction; the test's `execSync('claude --version')` / `execSync('codex --version')` invokes a shell and is not a suitable security pattern for the production adapter.

The fake child timeout does not prove process-tree termination. There is no test that launches a child which itself launches a grandchild, times out/cancels the parent, and checks both PIDs are gone. Timeout and caller cancellation must have separate causes/results, and cancellation must be initiated with an `AbortSignal` or equivalent rather than configured as a short timeout.

## Timeout, cancellation, recovery, and approval

- **Timeout:** Test only claims a returned `timedOut` flag; no elapsed-time bound or process exit confirmation is recorded.
- **Cancellation:** No cancellation operation is triggered. Timeout cannot substitute for cancellation.
- **Restart recovery:** No process/controller termination occurs. JSON round-tripping proves only JSON serialization.
- **Approval:** No OMA approval API or state transition is exercised. Binding to a hash needs recomputation from the exact immutable artifact on resume, approver identity, decision idempotency, changed-artifact rejection, and durable pause/resume across a fresh process.
- **Retries:** The “retry limit” test passes because it intentionally overshoots the limit. It does not test retry classification, backoff, attempt persistence, or escalation.

## Security, credentials, and workspace isolation

No real credential was used in the matrix (only a dummy output marker), and no credential material was observed in the available artifacts. This does not establish secret safety. The claimed environment allowlist, output redaction, safe argument handling, and log persistence are properties of missing implementation code. The script includes dummy marker text in a `node -e` argument; it does not check actual process arguments or all output/error artifacts.

Workspace isolation is unverified. Two directories with different file contents do not demonstrate Git worktrees, access restrictions, separate snapshots, or protection against one process writing into the other's directory. The design should ensure reviewer input is a read-only snapshot of a pinned base/target commit diff and test actual write attempts. Separate session IDs must come from distinct invocation records, not hard-coded strings.

## OMA vs minimal custom TypeScript layer

The source documents describe a meaningful tradeoff: OMA may supply workflow primitives such as run records, checkpoints, and approvals, while a custom layer can keep policy/state explicit and call existing CLIs directly. The current POC does not measure the tradeoff. It has no valid complexity measurement, equivalent end-to-end behavior, or code-size/build comparison because the two adapters and manifest are missing.

At this stage, retain the custom controller as the **architecture direction already approved in the evaluation document**, while treating OMA as an unvalidated optional library candidate. Do not interpret the report's score table as evidence to adopt or reject a production dependency. A custom controller still carries material obligations: transactional state, append-only audit events, idempotency/reconciliation, safe process-tree cancellation, redaction, worktree policy, and robust restart handling.

## Missing tests and production risks

Before a production decision, provide a reproducible, complete disposable POC and add at least:

1. Actual runner-level tests for spawn success, non-zero exit, missing executable, stderr/stdout capture, environment filtering, and command argument fidelity.
2. Timeout and explicit cancellation tests that verify parent and descendant PIDs terminate, distinguish the outcomes, and impose a bounded completion time.
3. Crash/restart integration tests: before spawn, while child is running, after side effect but before completion persistence, and after completion; verify no fabricated success or blind duplicate execution.
4. Approval pause/restart/approve/resume tests using OMA's real store/API and actual content hashes; test stale hash, rejected decision, duplicate decision, and unauthorized approver.
5. Retry policy tests at the configured limit, including transient vs permanent failures, backoff, persisted attempt counts, blocked state, and approval invalidation after material change.
6. Real Git worktree separation and reviewer snapshot tests, including attempted cross-worktree writes and proof of distinct implementer/reviewer invocation identities.
7. Secret tests covering environment, stdout, stderr, thrown errors, persisted state, crash diagnostics, and artifacts; scan the entire output tree for the dummy marker.
8. Read-only Claude and Codex smoke tests on the configured Windows workstation using exact CLI versions and existing FreeLLMAPI settings, with bounded runtime, structured output, effective sandbox verification, and sanitized command/output evidence. Do not capture full environment or tokens.
9. GitHub boundary verification through actual least-privilege token scopes and client capabilities, or explicitly mark GitHub integration out of POC scope rather than declaring the design array a pass.
10. Clean reproducibility bundle: exact package manifest/lockfile, source, command transcript, raw machine-readable results, test commit/hash, and checksums; make the script fail non-zero if any required test fails or is not run.

Operational risks remain for a local controller: user/session environment can vary, terminal processes can outlive the controller, a crash can occur between an external side effect and state commit, transcript storage can contain sensitive data, and Windows credential inheritance may expose more environment than intended. The architecture proposal already recognizes many of these; the POC does not yet demonstrate their controls.

## Final recommendation

**Further Testing Required.** Do not adopt OMA for production on this evidence, and do not treat the report as validation of the custom baseline either. The required Windows CLI integration is unrun, multiple claimed passes are invalid or unsupported, and core implementation/evidence artifacts are missing. Re-run the runbook with deliverable source and raw evidence. After those tests, decide whether OMA's actual integration savings outweigh its dependency/abstraction cost for the approved single-user workflow.
