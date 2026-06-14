# CHANGELOG

## Unreleased

### Core Runtime & Window Management

- Implemented `src/core/os-runtime/index.ts` with runtime state, app activation, and subscriber pattern.
- Implemented `src/core/window-manager/index.ts` with window lifecycle management and subscription API.
- Fixed `exactOptionalPropertyTypes` TypeScript constraint by making `activeAppId` property explicit.

### Shell Integration

- Integrated OS runtime and window manager into `src/shells/desktop/index.tsx`.
- Added app launcher behavior that sets active app, opens/focuses windows, and navigates to app entry point.
- Fixed `useSyncExternalStore` to include server snapshot function for SSR compatibility.

### Project Content & Data

- Populated `src/data/projects/projects.json` with initial sample project data.
- Fixed project data aggregation in `src/data/projects/index.ts` to use `process.cwd()` for Turbopack compatibility.
- Verified project schema validation works with aggregated JSON collection.

### Build System

- Resolved all TypeScript compilation errors.
- Fixed Next.js router type constraints in desktop shell app launcher.
- Verified production build passes all checks (TypeScript, static generation, image optimization).

### Documentation

- Updated `docs/TASK_BOARD.md` to reflect completed runtime and window manager scaffolding.
- Updated `docs/PROJECT_STATUS.md` with revised phase progress (48% overall, 85% Foundation Phase).
- Updated `docs/CHANGELOG.md` with runtime and shell integration work.

---

### Previous Unreleased

- `docs/AGENT_GUIDE.md` created for multi-agent onboarding and rules.
- `docs/HANDOFF.md` created for session handoffs and context preservation.
- `docs/PROJECT_STATUS.md` created for progress tracking.
- `docs/DECISIONS.md` created for architectural decision recording.
- `docs/ARCHITECTURE_OVERVIEW.md` created to summarize current architecture.
- `docs/ARCHITECTURE_REVIEW.md` created to review and validate architecture assumptions.
- `docs/DEVELOPMENT_ROADMAP.md` created to define future implementation phases.
- `docs/FUTURE_VISION.md` created to define long-term AI and product goals.
- `docs/TASK_BOARD.md` created as the authoritative execution queue.
- Added adaptive shell host support in `src/shells/index.tsx` and placeholder mobile/tablet shells.
- Implemented desktop shell layout composition and app launcher behavior in `src/shells/desktop`.
- Enhanced `src/app/apps/projects/page.tsx` to render richer validated project content.
- Added project detail routing in `src/app/apps/projects/[slug]/page.tsx` and list navigation links.
- Baseline project documentation and agent collaboration system established.
- Added `src/features/app-registry/index.ts` to expose app metadata for shells and launchers.
- Added `src/data/projects/sample-project.json` as a validated sample project for testing and UI development.

## Notes

This changelog is intentionally lightweight and intended to be updated after major project milestones.
