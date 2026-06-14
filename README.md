# My OS Portfolio

A browser-based personal operating system portfolio for Jainil Pandya.

## Development

```bash
npm run dev
npm run check
npm run build
```

## Foundation

The Foundation Phase establishes:

- strict TypeScript and project aliases
- ESLint and Prettier
- Vitest
- design tokens
- Zod content schemas and validation
- architectural boundaries and documentation

See [docs/architecture/README.md](docs/architecture/README.md) for dependency direction and phase boundaries.

## Agent-First Collaboration

This repository is designed for multi-agent collaboration. Any AI agent should start with:

1. `docs/AGENT_GUIDE.md`
2. `docs/PROJECT_STATUS.md`
3. `docs/HANDOFF.md`

After reading those documents, agents should review changed files, follow the project architecture, and update status, changelog, and handoff documents for major work.
