# KNOWN ISSUES

## Current Known Issues

- The project is currently in Foundation Phase and contains mostly scaffolding.
- Runtime systems in `src/core` are not implemented.
- `src/shells` and `src/apps` are reserved but not yet populated with UI components.
- The homepage remains placeholder content.
- There is no app registry or project launcher implementation yet.
- Project data sources are defined by schema but may still be missing actual content.

## Documentation Gaps

- The repo lacks explicit `docs/PROJECT_PLANS.md` or sprint-level tracking beyond `PROJECT_STATUS.md`.
- The `README.md` is minimal and does not summarize the new multi-agent workflow.
- No direct guidance exists for adding or validating new portfolio content beyond schema files.

## Recommended Fixes

- Populate the app registry and shell composition to make the OS runtime tangible.
- Add sample project content in `src/data/projects` or another validated content source.
- Expand `README.md` with a brief summary of the agent-first documentation system.
- Add a `docs/CHANGELOG.md` entry whenever major architecture or runtime work is completed.
