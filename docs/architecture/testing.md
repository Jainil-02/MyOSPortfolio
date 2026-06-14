# Testing Strategy

Vitest is configured for colocated `*.test.ts` files and TypeScript path aliases.

Foundation tests focus on pure contracts:

- schema acceptance and rejection
- content collection uniqueness
- configuration invariants
- future store reducers and registries without rendering

React component tests and browser-level tests will be added only when their corresponding phases introduce UI and critical user flows. Async Server Components should be covered by end-to-end tests rather than Vitest.
