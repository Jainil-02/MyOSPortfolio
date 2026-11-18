# Agent Guide

## Purpose

This is the entry point for AI-assisted work in My OS Portfolio (ApexOS). Repository files are the durable source of truth; do not assume previous chat/session context is available.

## Product context

ApexOS is a browser-based personal operating-system-style portfolio for Jainil Pandya. It adapts across desktop, tablet and mobile shells and presents portfolio content through app-like experiences. It is not a real operating system and must not claim access to a visitor's host files, terminal, hardware or network.

The inspected app registry contains 11 applications: About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Terminal and Achievements. Core runtime services and features are described in [Architecture Overview](ARCHITECTURE_OVERVIEW.md).

## Session start

Before selecting work:

1. Read [Task Board](TASK_BOARD.md), [Project Status](PROJECT_STATUS.md), [Handoff](HANDOFF.md) and [Decisions](DECISIONS.md).
2. Read [Known Issues](KNOWN_ISSUES.md) and [Architecture Overview](ARCHITECTURE_OVERVIEW.md) for relevant risks and boundaries.
3. Inspect the current branch, latest commit and relevant source files; do not assume docs are perfectly current.
4. For product/UI work, read the applicable product and design references that exist in this repository, including `PRODUCT_BLUEPRINT.md`, `DESIGN_SYSTEM.md`, `APP_STANDARDS.md`, `PHASE_3_ARCHITECTURE.md`, and relevant app specifications. Confirm their paths before relying on them.
5. Clarify ambiguous requirements and obtain owner approval for product decisions or high-impact changes.

## Architecture boundaries

- `src/app`: Next.js routes and application entry.
- `src/shells`: desktop, tablet and mobile presentation.
- `src/apps`: portfolio application UI.
- `src/features`: cross-app capabilities such as registry, boot, lock screen, reels, command palette and window chrome.
- `src/core`: platform/runtime services; must not depend on app implementations.
- `src/shared`: stable, domain-neutral UI, schemas and utilities.
- `src/data`: static content; validate untrusted or persisted data at boundaries.
- `src/config`: static configuration.

Applications may consume core APIs but must not mutate internal core state. Keep dependencies flowing inward toward core/shared primitives; avoid circular or app-specific dependencies in core.

## Portfolio content integrity

Never invent or silently alter personal facts. Employment, education, location, certifications, achievements, dates, contact details and experience claims must be confirmed by the owner. Treat sample or conflicting data as unverified until approved. Keep a canonical source for profile facts where practical.

## Simulated experiences

Files and Terminal are simulated portfolio applications, not host OS integrations. Device/network indicators are simulated unless explicitly backed by real browser APIs. Contact form success must not imply message delivery unless a real backend is connected and verified.

## Design and UI work

Use approved design references in the repository as the visual source of truth. Prefer existing tokens, shared UI and established layout patterns. Do not invent a replacement design system. If references conflict or are missing, report the conflict and ask for a product decision rather than guessing.

## Development workflow

1. Define a task with scope, exclusions and observable acceptance criteria.
2. Inspect the implementation and related schemas before editing.
3. Work on a focused branch; keep documentation-only changes separate from source changes.
4. Do not let multiple agents edit the same working tree or file concurrently.
5. Implement the smallest coherent change and add/update tests.
6. Run commands that actually exist in `package.json`; record exact commands and results.
7. Request independent review from a session/agent that did not implement the change.
8. Update [Task Board](TASK_BOARD.md), [Project Status](PROJECT_STATUS.md), [Changelog](CHANGELOG.md) and [Handoff](HANDOFF.md) only when supported by actual evidence.

## Multi-agent collaboration

See [Multi-Agent Engineering Architecture](agent-system/PROPOSED_ARCHITECTURE.md). It describes a proposed workflow, not an automatically running orchestrator. MCP/tool connectivity alone does not schedule, coordinate or persist separate agent sessions.

## Session handoff

Before pausing or ending substantial work, update [Handoff](HANDOFF.md) with:

- Branch and commit
- Work completed and files changed
- Commands actually run and results
- Remaining work and blockers
- Risks and decisions needed from the owner
- One recommended next task

Never claim background progress unless a real automation/process exists and has reported evidence.
