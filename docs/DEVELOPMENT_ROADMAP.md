# Development Roadmap

## Roadmap principles

ApexOS should prioritize trustworthy portfolio content, reliable core behavior and release quality before adding more simulated features. Every milestone needs owner-approved scope, acceptance criteria and verification evidence.

## Milestone 0 — Documentation and product truth

- Reconcile project status, task board and architecture documentation.
- Confirm the product vision and approved design references.
- Owner-approve the canonical personal/professional profile data.
- Identify all sample/demo content and decide whether to remove, replace or label it.

**Exit criteria:** documentation agrees on the current baseline; portfolio facts are approved.

## Milestone 1 — Core reliability and browser boundary

- Harden window manager invariants and public read APIs.
- Validate persisted settings and notifications at runtime.
- Secure Browser app message handling and review iframe sandbox/navigation policy.
- Guard command palette behavior for empty results.
- Review subscriptions, listeners, timers and browser API failure paths.

**Exit criteria:** core behavior is covered by tests; untrusted browser content cannot issue unvalidated parent commands.

## Milestone 2 — Test and CI foundation

- Add unit tests for runtime, window manager, registry, settings and notifications.
- Add tests for URL handling, message validation and command-palette navigation.
- Confirm the package scripts and supported Node/package-manager versions.
- Add or verify CI for formatting, lint, typecheck, tests, content validation and production build.

**Exit criteria:** required checks run consistently in local development and CI, with recorded results.

## Milestone 3 — Portfolio experience quality

- Validate all app content against the approved profile source.
- Review desktop, tablet and mobile behavior.
- Improve keyboard accessibility, focus management and semantic controls.
- Respect reduced-motion preferences.
- Verify resume download, print, share and contact flows.
- Clearly label simulated Files, Terminal, network and device information.

**Exit criteria:** recruiter-critical flows work, content is accurate, and core accessibility checks pass.

## Milestone 4 — Multi-agent workflow maturity

- Define task/spec/design/review templates.
- Keep implementation and independent review roles separate.
- Use isolated branches/worktrees for parallel work.
- Require evidence-backed QA and human approval at defined gates.
- Document retry, timeout, escalation and merge rules.
- Evaluate external agent skills individually before adoption.

**Exit criteria:** workflow is reproducible and does not rely on assumed autonomous orchestration.

## Milestone 5 — Future vision

Only after release readiness, evaluate future AI integration and other Phase 5 concepts. Keep user-facing AI capabilities isolated from development credentials and internal engineering tools.

## Deferred decisions

- Whether to lazy-load app components should be decided from bundle/performance measurements.
- Whether Contact needs a real backend depends on the intended public product behavior.
- Any new core service or app should have a written requirement and acceptance criteria before implementation.
