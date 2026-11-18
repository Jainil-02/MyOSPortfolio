# Task Board

## Purpose

This is the authoritative engineering queue for ApexOS. Keep tasks small, evidence-based and linked to a specification, issue or pull request where possible. Do not mark a task complete merely because code exists; define and verify its acceptance criteria.

**Baseline:** `staging` commit `4c2f07f1765013395be01c5d73c50f6d0edf5821` (18 November 2026).

## Current focus

**Audit remediation and release readiness.** The project documents previously marked the app ecosystem complete, while the README and status document described it as in progress. The source registry currently contains 11 apps. This board records that structural fact without asserting that every app has passed runtime acceptance.

## Backlog

### P0 — Owner decisions and content integrity

- [ ] Review all profile data in `src/data` and approve the canonical name, location, summary, employment history, education, skills, certifications, achievements and dates.
- [ ] Identify placeholder/sample content and remove or clearly label it before public release.
- [ ] Establish a single canonical profile data source; derive About, Resume, Skills, Achievements and Terminal output from it where practical.
- [ ] Confirm whether Contact is intended to deliver messages; if yes, specify and implement a real backend/provider rather than a simulated success state.

**Acceptance:** every public-facing personal/professional claim is owner-approved and consistent across apps.

### P1 — Core correctness and security

- [ ] Harden Browser app `postMessage` handling: validate `event.origin`, `event.source` and message shape against the intended iframe/document contract.
- [ ] Review iframe sandbox permissions and URL protocols; document the intended threat model and supported browsing behavior.
- [ ] Enforce unique window IDs in `openWindow`; define behavior for unknown IDs and focus/minimize/maximize transitions.
- [ ] Return defensive snapshots from window-manager and app-registry APIs so callers cannot mutate internal state.
- [ ] Add runtime schemas and safe migration/recovery for persisted settings and notifications.
- [ ] Review event listeners, timers, clipboard access and browser APIs for cleanup and failure handling.

**Acceptance:** invariants are documented and covered by tests; untrusted iframe messages cannot mutate app state outside the intended contract.

### P1 — Automated quality

- [ ] Add unit tests for OS runtime transitions and subscriber behavior.
- [ ] Add window-manager tests for duplicate IDs, focus exclusivity, minimize/restore, maximize and close.
- [ ] Add settings and notification tests for valid, malformed, missing and legacy localStorage values.
- [ ] Add app-registry tests for duplicate registration and immutable read APIs.
- [ ] Add Browser app tests for URL normalization and message validation.
- [ ] Add component-level tests for boot/lock flow, command palette empty results and key interactions.
- [ ] Confirm the actual package scripts and run formatting, lint, typecheck, tests, content validation and production build.
- [ ] Add or verify GitHub Actions CI for the required checks.

**Acceptance:** commands and results are recorded with the commit/PR; no test/build pass is claimed without execution.

### P2 — UX and accessibility

- [ ] Review all three shells at representative mobile, tablet and desktop breakpoints.
- [ ] Audit semantic HTML, accessible names, keyboard navigation, focus management and visible focus states.
- [ ] Verify touch gestures do not conflict with click behavior.
- [ ] Respect reduced-motion preferences for boot, window and reel animations.
- [ ] Distinguish simulated OS indicators and data from real device/network status.
- [ ] Verify download, print and share actions, including failure states.

### P2 — Documentation and workflow

- [x] Reconcile README, project status, task board, architecture overview, known issues and handoff with the audit baseline.
- [ ] Review agent guide/rules for duplicated or conflicting requirements.
- [ ] Update the multi-agent architecture to distinguish proposed orchestration from currently available tools.
- [ ] Define a task/spec/review evidence template and explicit human approval gates.
- [ ] Remove machine-specific absolute file links from remaining documentation.

## Historical phase record

| Phase | Prior project record | Current audit interpretation |
|---|---|---|
| 1 — Foundation | Complete | Historical completion; no re-execution |
| 2 — OS Runtime and Shells | Complete | Source present; no runtime test |
| 2.5 — Design Governance | Complete | Historical completion |
| 3 — App Ecosystem | Complete in status/task board; ~50% in README | Registry has 11 apps; app acceptance not re-verified |
| 4 — Polish and AI Integration | In progress in older documents | Use remediation backlog above as immediate focus |
| 5 — Future Vision | Not started | Not assessed |

## Working rules

- One task should have one clear owner, scope, acceptance criteria and verification evidence.
- Use a dedicated branch and pull request; do not work directly on `main` or `staging`.
- Keep docs-only changes separate from application implementation.
- Do not let two agents edit the same working tree or file concurrently.
- Independent review must be performed by an agent/session that did not implement the change.
- Escalate ambiguous product decisions to the owner instead of inventing behavior.
- Update this board only when the task's state has actually changed.
