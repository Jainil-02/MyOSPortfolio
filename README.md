# My OS Portfolio

A browser-based personal operating system portfolio for Jainil Pandya (ApexOS).

## Current Status

- **Phase 1 (Foundation)**: ✅ Complete (100%)
- **Phase 2 (OS Runtime & Shells)**: ✅ Complete (100%)
- **Phase 2.5 (Design Governance)**: ✅ Complete (100%)
- **Phase 3 (App Ecosystem)**: 🟡 In Progress (~50%)
  - Flagship recruiter apps (**About**, **Projects**, **Resume**, **Contact**, **Settings**) are fully implemented and verified.
  - Secondary apps (Skills, Files, Browser, Gallery, Terminal, Achievements) are in queue.

## Development

```bash
npm run dev     # Run local development server
npm run check   # Run type checks and lints
npm run build   # Build production bundle
```

See [docs/architecture/README.md](docs/architecture/README.md) for dependency direction and phase boundaries.

## Agent-First Collaboration

This repository is designed for multi-agent collaboration. Any AI agent should start with:

1. [docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md)
2. [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)
3. [docs/HANDOFF.md](docs/HANDOFF.md)

After reading those documents, agents should review changed files, follow the project architecture, and update status, changelog, and handoff documents for major work.
