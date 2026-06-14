# DEVELOPMENT ROADMAP

## Purpose

This roadmap defines the planned phases and milestones for the My OS Portfolio project.

---

## Phase 1: Foundation

Goal: Establish architecture, validation, tooling, and documentation.

Completed items:

- Next.js App Router scaffold created (`src/app`).
- ESLint, Prettier, TypeScript, and Vitest configured.
- Zod schema validation for projects and reels defined.
- Architecture documentation and boundary rules established.
- Dynamic data accessors and project validation scripts.
- Initial single-project sample database (`projects.json`).

---

## Phase 2: OS Runtime and Shells

Goal: Build the operating system runtime, shells, and system services.

Completed items:

- Core OS state manager (`src/core/os-runtime`) and boot/lock sequences.
- Window management system (`src/core/window-manager`) with focus, minimize, and maximize behaviors.
- Adaptive shell host (`src/shells`) with responsive desktop, tablet, and mobile shells.
- Component-based window execution mapping and registry (`src/features/app-registry`).
- Settings store (`src/core/settings`) for wallpaper configuration and lock screen gating.
- Wallpaper system (`src/core/wallpaper`) bound to system settings.
- Desktop icon grids, hover interactions, double-click launch, and context menu support.
- Core notification queue, badge counts, tray popovers, and lock screen notifications.
- System-wide command palette (`src/features/command-palette`) overlay with arrows and keyboard quick app launching.

---

## Phase 2.5: Design System Governance

Goal: Lock down visual aesthetics and establish multi-agent design rules.

Completed items:

- Analyzed approved design screenshots in `docs/design/`.
- Created [DESIGN_SYSTEM.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/DESIGN_SYSTEM.md) as the visual source of truth for the entire repository.
- Created [DESIGN_REVIEW.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/DESIGN_REVIEW.md) and [PRE_PHASE_3_AUDIT.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PRE_PHASE_3_AUDIT.md) to log design gaps.
- Updated agent rules with mandatory layout, token, typography, and button conventions.

---

## Phase 3: App Ecosystem

Goal: Scaffold reusable UI structures and implement 10 portfolio applications.

Planned Infrastructure Items (Phase 3 Prerequisites):

- Load **Inter** font globally and declare all custom CSS tokens in `src/app/globals.css`.
- Fix macOS control button ordering (Close → Minimize → Maximize) in `WindowChrome`.
- Extend `AppMeta` in registry with `defaultSize` and `pinned` values.
- Build reusable Layout B primitives (`AppSidebar`, `AppContentArea`, `AppTagBadge`, `AppInfoCard`) under `src/shared/ui/`.
- Implement portable `ReelPlayer` (`src/features/reels/index.tsx`).

Planned Applications (see [PHASE_3_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PHASE_3_ARCHITECTURE.md) and [PROJECTS_APP_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PROJECTS_APP_ARCHITECTURE.md)):

- **Projects**: Sidebar project selection + full detail tabs + reel viewer (v1 & v2 compatible).
- **About**: Profile card, tags, CTAs, and dynamic current project focus card.
- **Resume**: Styled OS document viewer reading static resume data.
- **Contact**: OS-styled form fields with client validation and static submission API integration.
- **Skills**: Sidebar categories + skill card grid with level badges (no progress bars).
- **Files**: High-fidelity file explorer matching `file-app.png` folders and breadcrumbs.
- **Browser**: OS-style address bar + iframe/page renderer for external URL compatibility.
- **Gallery**: Photo/thumbnail flex-grid media viewer.
- **Terminal**: Simulated monospace prompt supporting `whoami`, `neofetch`, and application launch commands.
- **Achievements**: Grid of trophy/contribution notification-style cards.

---

## Phase 4: Polish and AI Integration

Goal: Refine UX, add transitions, and prepare for AI-driven capabilities.

Planned items:

- Add window open/close/minimize transitions and animations.
- Implement app drag-to-resize handles on window edges.
- Add taskbar pinned vs. running icon distinction.
- Add persistent settings state and custom wallpaper uploads.
- Add AI assistant widgets or prompt integration.

---

## Phase 5: Future Vision

Goal: Expand the portfolio into a fully interactive OS with AI-managed content.

Future ideas:

- Project timeline storytelling.
- Right-click desktop contexts and settings extensions.
- Adaptive multi-window snap layouts.
- Dynamic session handoff logs and AI-managed file structures.
