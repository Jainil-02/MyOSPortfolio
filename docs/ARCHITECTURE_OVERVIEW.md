# Architecture Overview

## Product boundary

ApexOS is a browser-based portfolio experience styled as a personal operating system. It is not a real operating system and must not imply access to a visitor's local files, hardware, network configuration or terminal.

## High-level structure

```text
src/
├── app/          Next.js routes, root layout and global styles
├── shells/       Desktop, tablet and mobile presentation shells
├── core/         Runtime state and OS-like services
├── features/     App registry, boot, lock screen, reels, command palette, window chrome
├── apps/         Portfolio applications
├── data/         Static portfolio and app content
├── shared/       Shared schemas, UI and styles
└── config/       Static application configuration
```

## Runtime composition

- `src/app` provides the Next.js application entry and root layout.
- `src/shells` selects a desktop, tablet or mobile shell based on viewport width.
- `src/core/os-runtime` owns boot/lock/active-app runtime state and subscriptions.
- `src/core/window-manager` owns open-window lifecycle and focus/minimize/maximize state.
- `src/core/settings` persists user preferences in browser storage.
- `src/core/notifications` manages notification state and persistence.
- `src/features/app-registry` maps app IDs and metadata to React components.
- `src/features/boot` and `src/features/lock-screen` provide startup and unlock presentation.
- `src/features/command-palette` provides keyboard-driven app discovery and launch.
- `src/features/reels` renders project/reel slides.
- `src/apps` contains the registered portfolio app experiences.
- `src/data` provides static content consumed by apps; `src/shared` contains reusable UI and validation.

## App registry

The inspected registry statically imports and registers 11 apps: About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Terminal and Achievements. App metadata includes IDs, titles, descriptions, icons, entry paths, default window dimensions and pinned status where supplied.

Static imports make the registry straightforward but eagerly couple the registry module to all app components. Consider lazy loading only if measured bundle size or startup performance justifies the additional complexity.

## State model

Core services use module-level state and subscriber sets. React consumers subscribe to these stores. This keeps the OS-like state centralized, but requires explicit invariants, defensive snapshots and tests. The current source review identified mutable-reference exposure in window-manager and app-registry read APIs, and missing runtime validation for persisted settings/notification payloads.

## Browser application boundary

The Browser app embeds external content in an iframe with sandbox permissions. Treat iframe content as untrusted. Any message from embedded content that can influence parent application state must validate origin, source and message schema. Revisit sandbox permissions against the minimum required capabilities.

## Simulated experiences

Files and Terminal are portfolio simulations, not host OS integrations. Network status and device-like details in Settings are presentation content unless backed by real browser APIs. Contact submission currently presents a simulated completion path; do not describe it as delivering messages until a backend is connected and verified.

## Dependency direction

Preferred dependency direction:

```text
app / shells / apps
        ↓
features and shared UI
        ↓
core services and shared schemas
        ↓
static config / data
```

Keep core modules independent of app-specific UI. Keep data validation at boundaries where static or persisted content enters the application.

## Quality requirements

- Runtime-validate external and persisted data.
- Keep state transitions deterministic and testable.
- Do not expose mutable internal collections.
- Clean up event listeners, subscriptions and timers.
- Keep browser-only APIs behind client components/effects or guarded runtime paths.
- Maintain accessible controls and responsive behavior across shells.

This document describes the source structure observed in the 18 November 2026 audit. It does not certify runtime behavior or replace focused feature specifications.
