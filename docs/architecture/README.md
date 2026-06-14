# Architecture

My OS Portfolio is organized by domain. The App Router is the delivery boundary; operating-system behavior will live outside `src/app`.

## Dependency direction

1. `src/app` composes providers and route entry points.
2. `src/shells` composes device-specific presentation.
3. `src/apps` contains independently registered portfolio applications.
4. `src/features` contains cross-app user capabilities.
5. `src/core` owns platform behavior and cannot depend on apps.
6. `src/shared` contains stable, domain-neutral primitives.
7. `src/config` and `src/data` contain static configuration and validated content.

Foundation Phase creates contracts and tooling only. Runtime systems, stores, applications, and UI primitives are intentionally deferred.
