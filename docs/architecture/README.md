# Architecture

My OS Portfolio is organized by domain. The App Router is the delivery boundary; operating-system behavior lives outside `src/app` in client-side modules.

## Dependency direction

1. `src/app` composes providers and route entry points.
2. `src/shells` composes device-specific presentation and desktop/mobile adapters.
3. `src/apps` contains independently registered portfolio applications.
4. `src/features` contains cross-app user capabilities (e.g. window controls, reels, command palette).
5. `src/core` owns platform behavior (runtime, window manager, notifications) and cannot depend on apps.
6. `src/shared` contains stable, domain-neutral primitives.
7. `src/config` and `src/data` contain static configuration and validated content.

The core runtime systems, settings/wallpaper stores, window-management state layers, and recruiter-critical portfolio applications are fully implemented and integrated.
