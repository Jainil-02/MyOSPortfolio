# ARCHITECTURE OVERVIEW

## Purpose

This document summarizes the current repository architecture and the domains that shape the codebase.

## Core Domains

- `src/app`
  - Application entry points and route composition.
  - Hosts providers and the Next.js App Router.

- `src/shells`
  - Device-specific presentation for desktop, tablet, and mobile.
  - Responsible for UI adaptation and interaction patterns.

- `src/apps`
  - Independently registered portfolio applications.
  - Intended to house app-specific interfaces like Projects, Gallery, Files, Terminal, Settings, etc.

- `src/features`
  - Cross-application capabilities such as app launcher, command palette, lock screen, and reels.
  - Features may compose apps, runtime systems, and OS behavior.

- `src/core`
  - Platform runtime behavior, operating-system state, window management, analytics, notifications, and settings.
  - Core modules are the foundation for app and feature behavior.

- `src/shared`
  - Stable primitives that may be reused across domains.
  - Includes schema validation, utilities, motion helpers, UI primitives, styles, and testing helpers.

- `src/config`
  - Static configuration and design tokens.
  - Includes site metadata, reserved app IDs, device definitions, and design tokens.

- `src/data`
  - Validated content and static data assets.
  - Includes portfolio data, filesystem content, wallpapers, and project definitions.

## Dependency Direction

1. `src/app` composes providers and route entry points.
2. `src/shells` composes device-specific presentation.
3. `src/apps` contains independently registered portfolio applications.
4. `src/features` contains cross-app user capabilities.
5. `src/core` owns platform behavior and cannot depend on apps.
6. `src/shared` contains stable, domain-neutral primitives.
7. `src/config` and `src/data` contain static configuration and validated content.

## Current Phase

The repository is in Foundation Phase. This phase prioritizes contract definition, schema validation, tooling, and architecture documentation. Runtime systems and complete app implementations are deferred.

## Relevant Files

- `docs/architecture/README.md`
- `docs/architecture/boundaries.md`
- `src/shared/schemas/project.schema.ts`
- `src/config/site.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/apps`
- `src/core`
- `src/shells`
