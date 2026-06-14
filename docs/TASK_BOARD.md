# TASK BOARD

## Purpose

This document is the authoritative execution queue for My OS Portfolio.
It is the single source of truth for what is completed, what is in progress, what is blocked, and what should be worked on next.

Every AI agent must read `docs/TASK_BOARD.md` before choosing work and must update it when task statuses change.

---

## Current Phase

Foundation Phase

The repository has a functioning architecture scaffold, validation tooling, and baseline documentation. The next phase of work is to turn the scaffold into a real web-based OS runtime, expand shell composition, and build core portfolio applications.

---

## Status Overview

- Completed: core documentation, architecture boundaries, validation schema, app registry, sample project content, desktop shell composition, app launcher behavior, OS runtime scaffolding, window manager scaffolding, and build system validation.
- In progress: shell device adaptation and reel playback for Projects app.
- Blocked: no technical blockers. The main constraint is the need for deliberate incremental delivery within protected architecture boundaries.
- Next: verify runtime state subscription works in the desktop shell, extend shell device modes for tablet/mobile, and implement Projects app reel playback and navigation.

---

## Completed Tasks

1. Established multi-agent documentation and rules.
2. Created `docs/AGENT_GUIDE.md`, `docs/AGENT_RULES.md`, `docs/PROJECT_STATUS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`, and `docs/DEVELOPMENT_ROADMAP.md`.
3. Added `src/features/app-registry` for app metadata discovery.
4. Added validated project content under `src/data/projects/projects.json` and `src/data/projects/sample-project.json`.
5. Added a placeholder desktop shell integration in `src/shells/desktop` with app launcher behavior.
6. Added adaptive shell host support in `src/shells/index.tsx` with mobile/tablet shell placeholders.
7. Enhanced `src/app/apps/projects/page.tsx` to render richer validated project details, media, and status content.
8. Added `src/app/apps/projects/[slug]/page.tsx` to support project detail routing and project list navigation.
9. Added content validation tooling and collection discovery support.
10. Created `docs/TASK_BOARD.md` as the authoritative execution queue.
11. Implemented `src/core/os-runtime/index.ts` with runtime state, subscriber pattern, and app activation API.
12. Implemented `src/core/window-manager/index.ts` with window lifecycle scaffolding and subscription API.
13. Integrated runtime and window manager into desktop shell app launch behavior with proper `useSyncExternalStore` server snapshot support.
14. Fixed TypeScript compilation issues with `exactOptionalPropertyTypes` and Next.js router type constraints.
15. Fixed project data aggregation path resolution from `__dirname` to `process.cwd()` for Turbopack compatibility.
16. Verified production build succeeds with all TypeScript checks passing.

---

## In Progress

1. Verify runtime state subscription works end-to-end in the desktop shell.
2. Extend shell device adaptation in `src/shells` for tablet and mobile with proper layout and interaction patterns.
3. Add reel playback and navigation controls for the Projects app detail view.
4. Keep documentation and handoff state aligned with actual repository changes.

---

## Blocked

1. No active technical blocker is present.
2. The primary risk is documentation drift if this task board or related status docs are not updated after each session.
3. Future architectural work must preserve protected boundaries in `src/core`, `src/shared`, `src/config`, `src/data`, and `src/shells`.

---

## Next Actions

1. Test the desktop shell in development mode to verify runtime state and window manager integration work.
2. Verify that app launcher buttons correctly update active app state and open windows.
3. Extend the tablet shell with adaptive grid layout and touch-friendly controls.
4. Extend the mobile shell with full-screen app presentation and back navigation.
5. Add reel slide navigation and playback controls to the Projects app detail page.
6. Update `docs/PROJECT_STATUS.md` and `docs/CHANGELOG.md` after verifying runtime integration.

---

## Backlog

1. Gallery app implementation.
2. Files app and file browser behavior.
3. Browser app integration for external links.
4. Terminal app with command interactions.
5. Settings persistence, analytics, and notifications.
6. Future AI-driven assistant and content editing features.

---

## Usage

- Read this document before starting new work.
- If a task status changes, update this file immediately.
- Use this file together with `docs/PROJECT_STATUS.md`, `docs/HANDOFF.md`, and `docs/CHANGELOG.md`.
- If the task board is stale, stop and refresh it before continuing.
