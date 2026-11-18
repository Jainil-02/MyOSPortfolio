# Orchestration Framework Evaluation

> Status: Research and provisional recommendation for owner review; no framework installed and no local configuration changed.
> Research date: 18 November 2026.
> Scope: Internal ApexOS engineering workflow, not a user-facing product feature.

## 1. Executive summary

The requirement is a durable engineering workflow around existing coding tools, not a replacement coding agent. It must preserve separate implementer and reviewer sessions, owner approval, bounded retries, recovery, GitHub evidence, Windows support and TypeScript maintainability.

**Provisional recommendation:** build a narrow, local-first TypeScript controller with deterministic workflow state and explicit CLI adapters for Claude Code and Codex. Evaluate OMA as an optional execution/checkpoint library behind an adapter, rather than assuming it is the complete controller. Run a disposable-repository proof of concept before committing to OMA. Keep LoopForge as the strongest ready-made alternative if the owner prefers adopting a delivery product instead of building a small controller.

No candidate has been installed, benchmarked or tested on the user's machine. Upstream documentation is evidence of documented capability, not proof of compatibility with the exact local versions.

## 2. Decision criteria

| Criterion | Required behavior |
|---|---|
| Existing agents | Invoke Claude Code and Codex independently; Copilot remains inline |
| Independent review | Reviewer uses a distinct session and inspects actual spec and diff |
| Durable state | Persist task, run, attempt, approval and evidence across restarts |
| Human approval | Pause before implementation, privileged actions and merge |
| Bounded retries | Per-stage limits, timeouts, cancellation and escalation |
| GitHub lifecycle | Link issue/spec/branch/PR/CI/review evidence; no automatic merge initially |
| Windows | Local execution on Windows/PowerShell |
| TypeScript | Small maintainable controller |
| Security | Least privilege, secret redaction and isolated workspaces |
| Observability | Append-only evidence and explicit failure reasons |

Initial non-goals: multi-user SaaS, distributed worker fleet, autonomous merge, agent marketplace, public-facing assistant, automatic third-party skill installation, or changes to ApexOS product code.

## 3. Candidate comparison

### 3.1 Open Multi-Agent (OMA)

OMA is a self-hosted TypeScript library/runtime, not a hosted control plane. It documents task graphs, checkpoints, durable approvals, run records/leases, traces and external agent backends.

**Strengths**
- Native TypeScript and Node runtime.
- External process backend can launch local commands and capture stdout, stderr and exit status.
- Checkpoint/resume and durable approval features are relevant.
- Run store supports leases and fencing when backed by a store with genuine cross-process atomic compare-and-set.
- No required hosted OMA service; persistence is supplied by the application.

**Limitations**
- OMA explicitly says it is not a scheduler or queue and does not dispatch runs to workers on a timer.
- Generic process backend starts a fresh subprocess per run and is stateless between runs.
- ACP has caveats: Claude Code uses an adapter rather than native ACP; Codex ACP is documented as experimental. Authentication and session behavior must be tested with FreeLLMAPI.
- FileStore supports sequential restart recovery, not safe multi-process leases. Multi-worker use requires a store with cross-process atomicity.
- Reviewer UI, RBAC, notifications and escalation remain application responsibilities.
- Run record is current authoritative state, not a complete append-only event history.

**Fit:** Strong candidate library for a single-user TypeScript controller, but not sufficient by itself as the complete controller.

### 3.2 LangGraph JS

LangGraph JS provides graph-based agent workflows, checkpoint persistence, interrupts and resume behavior.

**Strengths**
- TypeScript/JavaScript support.
- Checkpoints support human review, time travel and fault recovery.
- Interrupts can pause for human input and resume from persisted state.

**Limitations**
- Not a ready-made software-delivery control plane.
- Task contracts, CLI adapters, reviewer separation, GitHub lifecycle, policy and evidence remain application work.
- Self-hosted platform documentation describes infrastructure and Lite/Enterprise distinctions; do not conflate the JS library with the full platform.
- More agent-graph abstraction than this mostly deterministic workflow initially needs.

**Fit:** Reconsider if future needs require complex dynamic agent graphs. Not the simplest initial choice.

### 3.3 Tencent LoopForge

LoopForge is a self-hosted coding-agent delivery workspace with agent, script, human-gate and sub-workflow nodes, Docker sandboxes, SOPs, run history and GitHub delivery.

**Strengths**
- Closest out-of-the-box match to software delivery SOPs.
- Explicitly lists Claude Code and Codex executors.
- Separates roles, prompts, models, rules, skills and MCP tools.
- Supports human approval, pause/resume, retry/rerun, artifacts and logs.
- Repository README states MIT license.
- LoopForge Local offers a lower-commitment trial inside existing assistants.

**Limitations**
- Full platform is a separate application/service with added operational and security surface.
- Default platform deployment uses Docker Compose, Docker sandbox containers and host Docker socket. Docker socket access grants control of the host Docker daemon; upstream describes this setup as intended for trusted teams, not untrusted multi-tenant isolation.
- Deployment guide documents Linux/macOS-oriented installation; Windows-native platform support should not be assumed. Test WSL2/Docker Desktop.
- Local mode is not equivalent to full platform; current docs say platform SOP export for independent local execution is not implemented.
- Verify that its default executor/model assumptions preserve ChatGPT-as-architect and the existing FreeLLMAPI setup.

**Fit:** Best ready-made product to trial if minimizing custom code is the priority. Do not deploy full platform before Windows, Docker boundary, access model and executor compatibility review.

### 3.4 Conductor OSS

Conductor is a durable distributed workflow engine with a Java server and JavaScript/TypeScript SDK.

**Strengths**
- Persisted workflow/task state, retries, timeouts, worker leases, wait/human tasks, signals, pause/resume and replay.
- Explicit at-least-once delivery and failure/recovery semantics.
- TypeScript SDK is available.

**Limitations**
- Requires a separately operated server and persistence/queue infrastructure. Production guidance includes PostgreSQL and Redis locking.
- Server is JVM-based; its build/runtime footprint is substantial for a local Next.js/TypeScript project.
- More platform than needed for a first single-user workstation controller.
- At-least-once delivery requires idempotent task side effects; it is not exactly-once execution.

**Fit:** Revisit for shared team service, distributed workers or durable scheduling at scale. Not recommended for initial local-first phase.

### 3.5 Custom TypeScript controller

A small application implementing the engineering lifecycle and invoking existing CLIs through adapters.

**Strengths**
- Exact fit to role model, approval points, retry policy and GitHub lifecycle.
- Direct control over Windows process invocation, PowerShell environment, worktrees, timeouts and output capture.
- Does not require routing agents through one model provider or replacing credentials/configuration.
- Small surface area; state transitions and policies can be tested with Vitest.
- Can adopt OMA later behind an interface.

**Limitations**
- Project owns persistence, locking, recovery, audit, cancellation and safe process management.
- Poorly designed custom state can lose work or duplicate side effects.
- Must resist scope creep; no distributed queue or general-purpose agent runtime in v1.

**Fit:** Best fit if kept narrow, deterministic and single-user.

## 4. Existing CLI and FreeLLMAPI integration

### Claude Code
- Claude Code documents non-interactive print mode, JSON/stream output formats, max-turn limits, permission modes and session resume options.
- FreeLLMAPI documents Windows PowerShell setup using ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN with the local gateway URL.
- First adapter should invoke the installed Claude CLI as a child process, inherit only required environment, use a per-run working directory and explicit output mode.
- Never put API tokens in prompts, command-line arguments, logs or repository files.
- Do not use dangerous permission bypass flags by default.

### Codex
- Codex documents codex exec for non-interactive runs. Its default sandbox is read-only; workspace-write is the documented option for edits.
- Codex project configuration and project MCP servers load only for trusted projects; trust is a security decision.
- Invoke Codex as a separate process/session with explicit working directory and least-privilege sandbox. Capture stdout, stderr and exit code.
- Do not enable danger-full-access or bypass approvals by default.

### VS Code Copilot
Keep Copilot as developer-directed inline assistance in v1. Do not count inline suggestions as independent review or assume a supported headless interface without separate compatibility research.

### FreeLLMAPI
Current documentation lists distinct wire formats/endpoints: Claude Code uses Anthropic Messages; Codex uses an OpenAI Responses-compatible route. Controller should not proxy model requests in v1; launch each CLI with its existing provider configuration. Validate with exact installed versions before claiming end-to-end compatibility.

## 5. Provisional decision

| Area | Recommendation |
|---|---|
| Controller | Small local-first TypeScript application |
| Workflow authority | Deterministic controller-owned state machine |
| Agent invocation | CLI subprocess adapters first |
| Claude | Existing Claude Code CLI and FreeLLMAPI Anthropic environment |
| Codex | Existing Codex CLI exec and current provider/sandbox config |
| Copilot | Inline-only, outside automated reviewer loop |
| Framework | Evaluate OMA behind an adapter; do not commit before spike |
| Persistence | Local transactional database; select Windows-compatible SQLite driver after dependency spike |
| GitHub | GitHub remains source of truth; controller stores durable references/evidence |
| Workspace | Dedicated Git worktree per task/run |
| Approvals | Owner-only explicit approvals; manual merge in v1 |
| Deployment | Local workstation CLI/service; no internet-exposed server |

Why not adopt a framework immediately? The highest-risk unknown is whether exact installed CLI versions work reliably on Windows with the current FreeLLMAPI environment, safe permissions, output capture and recovery. A focused spike answers this before embedding a framework.

## 6. Proof of concept required before implementation approval

Use a disposable repository, not ApexOS staging.

1. Launch Claude Code non-interactively from Node on Windows, inheriting current FreeLLMAPI environment without writing secrets to disk.
2. Launch Codex with codex exec in read-only mode; verify stdout, stderr, exit code and timeout.
3. Prove separate worktrees and prevent agents editing each other's files.
4. Simulate controller termination during a run; restart and reconcile without silently duplicating completed side effects.
5. Pause at an approval boundary, restart, approve and resume.
6. Force a failing command; verify bounded retries, backoff, terminal failure and owner escalation.
7. Run a reviewer that receives spec and actual diff, not implementer's conclusion; capture structured findings.
8. Verify GitHub issue/branch/PR references and no automatic merge permission.
9. Compare custom process adapter with OMA-backed implementation for complexity and correctness.
10. Record exact versions, commands, outputs and limitations.

Exit criteria: tests pass on target Windows machine; no credentials appear in logs/artifacts; recovery is deterministic; reviewer independence is demonstrated; owner approves resulting architecture.

## 7. Risks and controls

| Risk | Control |
|---|---|
| Duplicate work after crash | Persist run/attempt IDs; idempotency keys; reconcile before retry |
| Stale worker writes | Single active controller in v1; transactional leases if multi-process later |
| Self-review | Enforce distinct actor/session IDs and workspaces |
| Secret leakage | Environment allowlist, output redaction, no secrets in prompts/argv/files |
| Unsafe shell execution | Fixed executable and argument arrays; avoid shell interpolation |
| Excess permissions | Read-only first; task-scoped writes; no merge/admin tokens |
| Prompt injection | Treat repository/issues/tool output as untrusted data |
| Sensitive logs | Minimize transcript retention; redact by default |
| Unbounded time/cost | Per-stage timeout, measurable budgets, max attempts and escalation |
| Framework lock-in | Adapter interfaces; project-owned task contract and state schema |

## 8. Sources consulted

Official upstream documentation; claims are not yet validated on the user's machine.

- OMA repository: https://github.com/open-multi-agent/open-multi-agent
- OMA external agents: https://open-multi-agent.com/reference/external-agents/
- OMA run store: https://open-multi-agent.com/reference/run-store/
- OMA durable approvals: https://open-multi-agent.com/reference/durable-approvals/
- OMA self-hosting: https://open-multi-agent.com/reference/self-hosting/
- LangGraph JS persistence: https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/concepts/persistence.md
- LangGraph JS human-in-the-loop: https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/agents/human-in-the-loop.md
- LangGraph self-hosted deployment: https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/concepts/self_hosted.md
- LoopForge repository: https://github.com/Tencent/LoopForge
- LoopForge deployment: https://github.com/Tencent/LoopForge/blob/main/docs/deployment.md
- LoopForge Local: https://github.com/Tencent/LoopForge/blob/main/docs/local/usage.md
- Conductor durable execution: https://docs.conductor-oss.org/architecture/durable-execution.html
- Conductor deployment: https://docs.conductor-oss.org/devguide/running/deploy.html
- Conductor JS SDK: https://docs.conductor-oss.org/documentation/clientsdks/js-sdk.html
- Claude Code CLI: https://docs.anthropic.com/en/docs/claude-code/cli-usage
- Codex non-interactive mode: https://learn.chatgpt.com/docs/non-interactive-mode
- FreeLLMAPI agent clients: https://github.com/emmgmm/FreeLLMAPI/blob/main/docs/en/clients/01-agent-clients.md

## 9. Owner decisions required

- [ ] Approve provisional custom TypeScript controller direction.
- [ ] Approve OMA as a disposable proof-of-concept candidate, not yet a dependency.
- [ ] Confirm initial controller is single-user/local on the Windows workstation.
- [ ] Approve proof-of-concept scope before local installation/configuration changes.
- [ ] Decide whether to trial LoopForge Local too, or whether OMA-vs-custom is sufficient.

Until decisions are made, no controller implementation, framework installation, agent permission change or ApexOS feature work should begin.
