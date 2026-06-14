# AGENT GUIDE

## Purpose

This document is the primary entry point for any AI agent working on My OS Portfolio. It defines the project vision, collaboration rules, workflow expectations, architectural constraints, and the protocol for preserving context across sessions.

## Project Vision

My OS Portfolio is a browser-based personal operating system portfolio for Jainil Pandya. It should feel like an interactive OS experience rather than a static website. The system must support mobile, tablet, and desktop modes in one adaptive application, and it should present portfolio content as apps, windows, settings, files, and immersive project reels.

The product must demonstrate:

- Frontend engineering skill with Next.js, React, and TypeScript.
- UX and product thinking through an OS-like interface.
- A scalable foundation for future AI-assisted development.
- A distinctive, memorable portfolio experience.

## How to Use This Guide

1. Read `docs/AGENT_GUIDE.md` first.
2. Read `docs/TASK_BOARD.md` second.
3. Read `docs/PROJECT_STATUS.md` third.
4. Read `docs/HANDOFF.md` fourth.
5. Review the changed files before writing or modifying code.
6. Update `docs/PROJECT_STATUS.md` after completing major work.
7. Update `docs/CHANGELOG.md` after major work.
8. Update `docs/HANDOFF.md` before ending a session.

## Agent Rules

All future AI agents must follow these rules:

- Always start by reading `docs/AGENT_GUIDE.md`, `docs/TASK_BOARD.md`, `docs/PROJECT_STATUS.md`, and `docs/HANDOFF.md`.
- Use `docs/TASK_BOARD.md` as the authoritative task queue when selecting next work.
- Review relevant architecture docs under `docs/architecture/` before changing architecture-related code.
- Review changed files before applying code changes.
- Do not assume prior conversation history is available.
- Keep changes aligned with existing domain boundaries and architecture principles.
- Update status and changelog after any major work.
- Update `docs/HANDOFF.md` before stopping or when context is ending.

## Development Workflow

1. Read the current documentation and status.
2. Inspect the relevant code and schema definitions.
3. Identify the current phase and the problem being solved.
4. Plan the next change in a short list of tasks.
5. Apply code changes in small, safe increments.
6. Run validation commands when available (e.g. `npm run check`).
7. Update `docs/PROJECT_STATUS.md`, `docs/CHANGELOG.md`, and `docs/HANDOFF.md`.

## Architecture Constraints

The current repository is organized by domain. Respect these architectural constraints:

- `src/app` is the delivery boundary and composes providers and route entry points.
- `src/shells` provides device-specific presentation and interaction.
- `src/apps` contains independently registered portfolio applications.
- `src/features` contains cross-app user capabilities.
- `src/core` owns platform behavior and cannot depend on `src/apps`.
- `src/shared` contains stable, domain-neutral primitives.
- `src/config` and `src/data` contain static configuration and validated content.
- Applications may consume typed core APIs but must not mutate core state directly.
- Core modules must not import application implementations.
- Shared code must remain independent of apps, shells, and core domains.
- The portfolio content path must use Zod schema validation.
- The repository uses Next.js App Router conventions with a custom OS-like experience.

## Protected Systems

The following systems are protected and should be changed only with strong justification:

- `src/core`: platform runtime, OS state, window management, notifications.
- `src/shared`: stable primitives, schemas, utilities, styles.
- `src/config`: design tokens, site metadata, static configuration.
- `src/data`: validated content and portfolio data.
- `src/shells`: device-specific presentation and device adaptation.

## Reels Architecture

The portfolio uses a reel-based project content model:

- `src/shared/schemas/project.schema.ts` defines `projectSchema` and `projectReelSchema`.
- Each project includes `reelSlides`.
- Each reel is associated with a project via `projectId`.
- Reels require either an image or a video asset.
- Reel ordering is enforced through the schema.

Core decisions about reels:

- One Reel = One Project in the current architecture.
- Future evolution may treat one project as multiple reel collections.

## Browser Strategy

The current browser strategy is hybrid:

- The site is a Next.js application served through the App Router.
- It targets desktop, tablet, and mobile as adaptive device modes.
- The product should feel like an operating system rather than a traditional website.
- The browser layer is the presentation boundary; runtime OS behavior should live in `src/core` and `src/features`.

## Future AI / MCP Vision

Future agents should be able to continue development using only repository content and documentation. This repository is setting up a knowledge management system that enables:

- multi-agent collaboration without prior conversation context
- intentional handoff between sessions
- documented architectural decisions and workflows
- safe, rule-guided code changes
- persistence of project state through docs and changelog entries

## Context Preservation Protocol

When an AI agent believes any of the following is true:

- the context window is becoming full
- the session is ending
- token limit may be reached
- a major change set is complete

Then the agent must update `docs/HANDOFF.md` before continuing or stopping.

`docs/HANDOFF.md` must always include:

- current phase
- completed work
- pending work
- important decisions
- files modified
- risks
- recommended next steps

Failure to update `docs/HANDOFF.md` is not acceptable for session closure.
