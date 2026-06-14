# PROJECT SPEC

This file is a companion to `MY_OS_PORTFOLIO_SPEC.md` and summarizes the repository-level purpose, architecture, and requirements in accessible project terms.

## Project Purpose

My OS Portfolio is a browser-based personal operating system portfolio for Jainil Pandya. It should feel like a custom OS experience rather than a normal portfolio website.

## Key Goals

- Create a memorable, interactive portfolio experience.
- Demonstrate frontend engineering with React, Next.js, and TypeScript.
- Support adaptive experiences for mobile, tablet, and desktop.
- Maintain strong architecture boundaries and validated content.
- Enable future AI agents to continue development through documentation.

## Current Implementation Status

- Foundation Phase scaffold is complete.
- App Router and Next.js setup exist.
- Validation schemas exist under `src/shared/schemas`.
- Architecture docs exist under `docs/architecture`.
- UI and runtime systems are largely unimplemented.

## Important Repo Areas

- `src/app`: application entry points and layout.
- `src/shells`: device shell composition.
- `src/apps`: application modules.
- `src/features`: cross-app capabilities.
- `src/core`: OS runtime and platform behavior.
- `src/shared`: stable primitives and schema validation.
- `src/config`: static configuration and design tokens.
- `src/data`: content and project data.
