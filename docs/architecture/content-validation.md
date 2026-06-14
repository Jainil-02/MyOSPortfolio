# Content Validation

Portfolio content is authored under `src/data` and validated with Zod before use.

## Workflow

1. Define reusable schemas in `src/shared/schemas`.
2. Keep raw content serializable and independent of React.
3. Parse content at its domain entry point with `validateContent`.
4. Run `npm run validate:content` locally and in CI.
5. Treat validation failures as build-blocking content errors.

The initial project model supports an ordered reel collection even though version one uses one reel per project. Cross-record rules enforce unique project IDs and slugs, unique reel IDs and orders, and matching project references.
