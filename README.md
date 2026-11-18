# My OS Portfolio (ApexOS)

A browser-based personal operating-system-style portfolio built with Next.js, React, TypeScript and Tailwind CSS. It presents portfolio content through desktop, tablet and mobile shells, with app-like experiences.

## Repository status

The current `staging` baseline reviewed for the documentation audit is commit `4c2f07f1765013395be01c5d73c50f6d0edf5821` (18 November 2026).

The repository contains three shells and an app registry with 11 applications: About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Terminal and Achievements. Boot, lock-screen, reels and command-palette features are present in the source tree.

The earlier project documents disagree about phase completion and current focus. See [Project Status](docs/PROJECT_STATUS.md) and [Task Board](docs/TASK_BOARD.md) for the reconciled documentation baseline. Completion statements inherited from earlier project notes are historical claims unless explicitly re-verified.

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Zod schemas
- Vitest

See [Architecture Overview](docs/ARCHITECTURE_OVERVIEW.md) for the current source layout and architectural observations.

## Local development

Install dependencies using the package manager and lockfile committed to the repository, then use the scripts defined in `package.json`.

Typical commands:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Check `package.json` before running a command; script names may change. The documentation audit was read-only and did not execute these commands.

## Project documentation

Recommended reading order:

1. [Agent Guide](docs/AGENT_GUIDE.md)
2. [Project Status](docs/PROJECT_STATUS.md)
3. [Task Board](docs/TASK_BOARD.md)
4. [Architecture Overview](docs/ARCHITECTURE_OVERVIEW.md)
5. [Known Issues](docs/KNOWN_ISSUES.md)
6. [Handoff](docs/HANDOFF.md)

The [Multi-Agent Engineering Architecture](docs/agent-system/PROPOSED_ARCHITECTURE.md) describes the proposed spec-driven workflow. It is a design document, not evidence that an automated orchestrator currently exists.

## Contribution and change safety

- Use a focused feature or documentation branch; do not commit audit changes directly to `staging` or `main`.
- Keep application source changes separate from documentation-only changes.
- Review the diff and run the relevant checks before opening a pull request.
- Do not publish unverified personal, employment, education, certification or achievement claims. The owner must approve portfolio facts.
