# Architectural Boundaries

## Rules

- Applications may consume typed core APIs but may not mutate core state directly.
- Core modules must not import application implementations.
- Shared code must remain independent of app, shell, and core domains.
- Device shells may vary presentation and interaction, not business data or application behavior.
- Portfolio content must enter the application through schema validation.
- Settings will be the persistence authority; runtime stores introduced later will project persisted values.
- App and route modules should use lazy boundaries when browser-only behavior or large application bundles are introduced.

## Deferred systems

The following directories are reserved but contain no implementation during Foundation Phase:

- `src/apps`
- `src/core/os-runtime`
- `src/core/window-manager`
- `src/shells`
- UI-oriented feature folders
