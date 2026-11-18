# Agent Rules

These rules apply to humans and AI agents contributing to My OS Portfolio (ApexOS).

## 1. Source of truth and session start

- Repository content, current Git history and verified command output are the durable project record.
- Do not rely on chat history as the only source of important decisions.
- Before work, read `docs/TASK_BOARD.md`, `docs/PROJECT_STATUS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md` and relevant architecture/issue documents.
- Inspect the current branch, commit and working-tree state before editing.
- Check that referenced product/design documents exist before treating them as mandatory inputs.

## 2. Scope and approval

- Work only within the agreed task scope.
- Ask the owner to resolve ambiguous product behavior and approve material product/architecture changes.
- Never invent personal profile facts or publish unverified employment, education, certification, achievement, location or experience claims.
- Do not add credentials, API keys, tokens or private user data to source, logs, prompts committed to the repository or browser bundles.

## 3. Architecture boundaries

- `src/app` owns Next.js route/application entry.
- `src/shells` owns desktop/tablet/mobile presentation.
- `src/apps` owns portfolio applications.
- `src/features` owns cross-app capabilities.
- `src/core` owns platform/runtime services and must not import app implementations.
- `src/shared` contains stable, domain-neutral primitives and schemas.
- `src/data` contains content; validate at appropriate boundaries.
- `src/config` contains static configuration.
- Keep core state behind APIs, enforce invariants and avoid exposing mutable internal references.

## 4. Design governance

- Use approved screenshots and design documentation present in the repository as the visual reference.
- Reuse design tokens, typography, shared components and established app layouts.
- Do not redesign approved screens or introduce conflicting visual patterns without owner approval.
- If a reference is missing, contradictory or stale, report the discrepancy; do not fabricate a new design authority.
- Preserve accessible semantics, keyboard operation, visible focus and responsive behavior.

## 5. Browser and data security

- Treat iframe content, URL input, persisted browser storage and external content as untrusted.
- Validate message origin, source and payload schema before acting on iframe messages.
- Apply least-privilege iframe sandbox permissions and explicitly review navigation protocols.
- Runtime-validate persisted settings/notifications and recover safely from malformed or outdated values.
- Clearly distinguish simulated Files, Terminal, network and device experiences from real integrations.
- Do not claim Contact messages were delivered without a verified backend response.

## 6. Branching and multi-agent safety

- Use a focused branch and pull request for each task or tightly related task group.
- Do not commit routine work directly to `main` or `staging`.
- Keep documentation-only work separate from application implementation.
- Never have multiple agents edit the same working tree or file concurrently; use separate worktrees/clones for parallel tasks.
- The implementation author must not be the sole independent reviewer of their own change.
- GitHub/MCP access is tooling, not an autonomous orchestration controller. Do not imply automatic scheduling or background agent execution unless configured and verified.
- Do not force-push, merge, delete branches or change repository protections without explicit approval.

## 7. Testing and evidence

- Inspect `package.json` and use the scripts actually defined there.
- Add tests for changed behavior and relevant edge cases.
- Record exact commands, environment and outcomes.
- Distinguish source inspection from executed tests, browser checks and production builds.
- Never report a check as passing unless it was actually run and passed.
- Separate confirmed defects from risks, assumptions and product questions.

## 8. Documentation and handoff

- `docs/TASK_BOARD.md` is the execution queue.
- `docs/PROJECT_STATUS.md` records evidence-based project state; do not invent completion percentages.
- `docs/DECISIONS.md` records material architecture/product decisions and their rationale.
- `docs/CHANGELOG.md` records completed changes.
- `docs/HANDOFF.md` preserves branch/commit, completed work, files changed, test evidence, blockers, risks and next action.
- Update documents when the underlying work is actually complete; do not mark planned or unverified work as done.
- Prefer repository-relative links; do not commit machine-specific `file:///` paths.

## 9. Completion standard

A task is complete only when its acceptance criteria are met, relevant checks have been run, independent review findings are addressed or explicitly accepted, and the handoff/status records reflect verified reality.
