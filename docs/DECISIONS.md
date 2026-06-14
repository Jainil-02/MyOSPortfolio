# DECISIONS

## Browser Strategy

Decision: Hybrid browser strategy.

- The project is implemented as a Next.js application.
- The App Router is the delivery boundary.
- The browser layer should feel like an OS presentation layer, not a traditional website.

## Projects and Reels

Decision: One Reel = One Project in the current model.

- Project content is organized as `projectSchema` with `reelSlides`.
- Each reel requires either a video or image asset.
- Reel IDs and orders are enforced by schema validation.

Future decision: One Project = Multiple Reels once the content model evolves.

## Desktop Experience

Decision: Multi-window desktop behavior is the expected desktop experience.

- Desktop mode should simulate a productivity OS.
- Desktop should support floating windows, a taskbar, and app switching.

## Terminal Experience

Decision: Terminal is functional, not decorative.

- The terminal should be a real interactive feature.
- It should support operating-system-like commands and developer-style interactions.

## Projects App Priority

Decision: The Projects app is a high-priority portfolio experience.

- Projects should show reels, project details, and visual content.
- The launcher and project navigation should be smooth and memorable.

## Domain Boundaries

Decision: Strict architectural boundaries are required.

- `src/core` is the platform authority and may not depend on `src/apps`.
- `src/shared` is domain-neutral and may not import app or shell implementations.
- `src/apps` contains app-specific code and can consume typed core APIs.
- `src/features` contains cross-app UX patterns and capabilities.
- `src/shells` adapts presentation for mobile, tablet, and desktop.

## Content Validation

Decision: Portfolio content must be schema-validated.

- Use Zod schemas for project and reel data.
- Validate asset paths, URLs, identifiers, and content shapes.
- Enforce uniqueness across project IDs, slugs, reel IDs, and reel orders.

---

## Phase 2 Re-prioritization (2026-06-14)

Decision: Reel playback moved from Phase 2 to Phase 3. Phase 2 reorganized into 2a (OS Shell Foundation) and 2b (OS Runtime Services).

**Context:** An architecture audit evaluated the desktop shell against nine OS components: wallpaper system, taskbar, app launcher, window chrome, window controls, window animations, desktop icons, boot sequence, and lock screen. Zero of nine were implemented. The desktop shell was a sidebar+content layout, not an OS desktop.

**Problem:** Building the reel player (an in-app media feature) before the OS shell that hosts it undermines the project vision of "an operating system experience — NOT a traditional portfolio website" (AGENT_RULES.md). In a real OS, the boot → lock → desktop → window → app sequence is foundational.

**Revised Phase 2 order:**

1. Boot sequence (src/features/boot) — splash animation on first visit
2. Lock screen (src/features/lock-screen) — clock, wallpaper preview, unlock
3. Wallpaper system (src/core/wallpaper) — CSS-variable-driven backgrounds
4. Desktop shell rewrite — wallpaper, taskbar (clock, system tray, app indicators), desktop icons, floating window surface
5. Window chrome — floating window container with title bar, controls, drag
6. Window controls & animations — wire minimize/maximize/focus to behaviors
7. Desktop icons — icon grid launching apps into windows
8. Core settings (src/core/settings) — persistence, wallpaper/theme preferences
9. Core notifications (src/core/notifications) — queue, badge, system tray integration
10. Command palette (src/features/command-palette) — Ctrl+K quick launcher

**Reel playback moved to Phase 3** — it belongs inside a Projects app window on the desktop, not before the desktop exists.

**Impact:**

- Phase 2 completion estimate revised from 45% to 25% after removing empty stubs from the count
- Overall project estimate revised from 30% to 25%
- Previous task board "Next Actions" reordered completely
- Desktop shell rewrite is now the largest single work item in Phase 2
- Tablet and mobile shells are less affected (they use dock/tab patterns closer to mobile OS conventions) but will benefit from wallpaper and boot/lock integration
