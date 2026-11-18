# Engineering Handoff

## Current baseline

- Repository: `Jainil-02/MyOSPortfolio`
- Baseline branch: `staging`
- Baseline commit: `4c2f07f1765013395be01c5d73c50f6d0edf5821`
- Audit snapshot: 18 November 2026
- Documentation branch for this update: `docs/audit-baseline-2026-11-18`

ApexOS is a browser-based OS-style portfolio. The source registry contains 11 apps and the project has desktop, tablet and mobile shells. Read [Project Status](PROJECT_STATUS.md), [Task Board](TASK_BOARD.md), [Architecture Overview](ARCHITECTURE_OVERVIEW.md) and [Known Issues](KNOWN_ISSUES.md) before implementation.

## Important audit outcome

The main near-term work is not adding more apps. Prioritize:

1. Owner-approved portfolio facts and consistent content.
2. Browser iframe/message boundary.
3. Window-manager and app-registry state invariants.
4. Runtime validation of persisted settings and notifications.
5. Automated tests and CI.
6. Accessibility, responsive behavior and honest labeling of simulated features.

## Source areas

- `src/app`: Next.js application entry
- `src/shells`: desktop, tablet and mobile shells
- `src/core`: runtime, window manager, settings, notifications and wallpaper
- `src/features`: app registry, boot, lock screen, reels, command palette and window chrome
- `src/apps`: registered portfolio applications
- `src/data`: portfolio content
- `src/shared`: schemas and reusable UI

## Constraints and cautions

- Do not invent or silently replace personal profile facts. Ask the owner to approve canonical employment, education, certification, achievement and location data.
- Do not connect a Contact form to an unapproved provider or expose credentials in client code.
- Treat iframe content and its messages as untrusted.
- Keep core services independent of app-specific UI.
- Avoid multiple agents editing the same working tree or file concurrently.
- Keep documentation-only and source-code changes on separate branches.
- Do not claim build/test success without actual command output.

## Suggested next task sequence

1. Ask the owner to approve the canonical profile dataset.
2. Create a specification for content normalization and app consumption.
3. Implement core reliability fixes in separate, reviewable tasks.
4. Add tests alongside each fix.
5. Run all package scripts and browser checks locally/CI.
6. Update this handoff with actual commit, test evidence and remaining risks.

## Verification not performed in the audit

The GitHub source review did not run dependency installation, development server, browser automation, unit tests, lint, typecheck, content validation or production build. These checks remain required.

## Agent starting checklist

1. Read [Agent Guide](AGENT_GUIDE.md) and [Agent Rules](AGENT_RULES.md).
2. Read [Project Status](PROJECT_STATUS.md), [Task Board](TASK_BOARD.md) and [Known Issues](KNOWN_ISSUES.md).
3. Confirm current branch and latest commit before editing.
4. Confirm task scope and acceptance criteria.
5. Work on a dedicated branch; review the diff before opening a PR.
6. Update status and handoff only after work is verified.
