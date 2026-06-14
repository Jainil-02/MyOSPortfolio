# DECISIONS

## Browser Strategy

Decision: Hybrid browser strategy.

- The project is implemented as a Next.js application.
- The App Router is the delivery boundary.
- The browser layer should feel like an OS presentation layer, not a traditional website.

## Projects and Reels

Decision: One Reel = One Project in the current model.

- Project content is organized as `projectSchema` with `reelSlides`.
- Each reel requires either a video or image asset.
- Reel IDs and orders are enforced by schema validation.

Future decision: One Project = Multiple Reels once the content model evolves.

## Desktop Experience

Decision: Multi-window desktop behavior is the expected desktop experience.

- Desktop mode should simulate a productivity OS.
- Desktop should support floating windows, a taskbar, and app switching.

## Terminal Experience

Decision: Terminal is functional, not decorative.

- The terminal should be a real interactive feature.
- It should support operating-system-like commands and developer-style interactions.

## Projects App Priority

Decision: The Projects app is a high-priority portfolio experience.

- Projects should show reels, project details, and visual content.
- The launcher and project navigation should be smooth and memorable.

## Domain Boundaries

Decision: Strict architectural boundaries are required.

- `src/core` is the platform authority and may not depend on `src/apps`.
- `src/shared` is domain-neutral and may not import app or shell implementations.
- `src/apps` contains app-specific code and can consume typed core APIs.
- `src/features` contains cross-app UX patterns and capabilities.
- `src/shells` adapts presentation for mobile, tablet, and desktop.

## Content Validation

Decision: Portfolio content must be schema-validated.

- Use Zod schemas for project and reel data.
- Validate asset paths, URLs, identifiers, and content shapes.
- Enforce uniqueness across project IDs, slugs, reel IDs, and reel orders.
