# AGENT RULES

This document defines the mandatory rules for any AI agent working on the My OS Portfolio repository.

---

# Core Principle

Repository documentation is the source of truth.

Conversation history is NOT the source of truth.

Important project knowledge must never exist only inside an AI conversation.

All important decisions, progress, and architectural changes must be documented.

---

# Mandatory Session Start Procedure

Before making any code changes:

## Step 1: Read Project Documentation

Read in the following order:

1. docs/AGENT_GUIDE.md
2. docs/TASK_BOARD.md
3. docs/PROJECT_STATUS.md
4. docs/HANDOFF.md
5. docs/DECISIONS.md
6. [DESIGN_SYSTEM.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/DESIGN_SYSTEM.md)
7. [PRE_PHASE_3_AUDIT.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PRE_PHASE_3_AUDIT.md)
8. [PHASE_3_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PHASE_3_ARCHITECTURE.md)
9. [PROJECTS_APP_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PROJECTS_APP_ARCHITECTURE.md)

If additional context is needed:

10. docs/ARCHITECTURE_OVERVIEW.md
11. docs/ARCHITECTURE_REVIEW.md
12. docs/DEVELOPMENT_ROADMAP.md
13. docs/MY_OS_PORTFOLIO_SPEC.md

---

## Step 2: Analyze Current Repository State

Review:

- Current folder structure
- Existing implementation
- Recent changes
- Modified files

Determine:

- Current development phase
- Completed work
- In-progress work
- Pending work
- Current blockers

---

## Step 3: Documentation Validation

Compare:

- Documentation state
- Actual repository state

Identify:

- Missing updates
- Inconsistent documentation
- Documentation drift

Do not begin implementation until project state is understood.

---

# Design & Architecture Governance Rules

## Rule D-1: Screenshots Are the Visual Source of Truth

The screenshots in `docs/design/` are the **highest authority** for all visual decisions.

- `docs/design/boot-screen.png` — Boot screen
- `docs/design/lock-screen.png` — Lock screen
- `docs/design/desktop-home.png` — Desktop with app windows
- `docs/design/file-app.png` — Files application
- `docs/design/setting-app.png` — Settings application

If any code conflicts with these screenshots, the screenshot wins. The conflict must be documented. The code must be corrected.

---

## Rule D-2: DESIGN_SYSTEM.md Overrides AI Assumptions

`docs/DESIGN_SYSTEM.md` is the canonical design specification extracted from the approved screenshots.

- AI model training data, design instincts, and prior conventions are **overridden** by `docs/DESIGN_SYSTEM.md`.
- Do not invent new visual patterns. Use only the patterns documented in `docs/DESIGN_SYSTEM.md`.
- If a visual pattern is needed but not documented, document it in `docs/DESIGN_SYSTEM.md` first, then implement it.

---

## Rule D-3: Mandatory Design & Architecture Review Before Any UI Work

Before implementing any UI component, feature, or application:

1. Read `docs/DESIGN_SYSTEM.md` and `docs/PHASE_3_ARCHITECTURE.md` completely.
2. Identify which layout pattern applies (Layout A: Profile/Dashboard or Layout B: Master-Detail with Sidebar).
3. Identify which color tokens apply.
4. Identify which typography scale applies.
5. Confirm the component patterns (button, card, list, input) that apply.
6. Verify sizing matches the `defaultSize` specifications in `docs/PHASE_3_ARCHITECTURE.md` and app routing follows the direct mounting model.

Skipping this step is a rule violation.

---

## Rule D-4: Future Agents May Extend the Design System But May Not Replace It

New design patterns may be added to `docs/DESIGN_SYSTEM.md` when a genuinely new UI pattern is needed.

Agents may NOT:

- Replace the color system with a new palette.
- Replace the glassmorphism style with a different visual treatment.
- Replace the OS window metaphor with a website layout.
- Introduce typography outside the documented type scale without updating `docs/DESIGN_SYSTEM.md`.

Additions must be **compatible with and consistent with** the existing approved design.

---

## Rule D-5: Do Not Redesign Approved Screens

The following screens are **approved and locked**:

- Boot screen
- Lock screen
- Desktop home
- Files app layout
- Settings app layout
- About app layout

These screens must not be redesigned. Implementation must match the approved screenshots. Minor implementation-level polish is acceptable. Structural redesign is not.

---

## Rule D-6: Do Not Introduce Conflicting Visual Patterns

Prohibited patterns that conflict with the approved OS design:

- ❌ Website-style hero sections with full-page background images
- ❌ Scrolling landing pages with stacked sections
- ❌ Top navigation bars (navbars) inside app windows
- ❌ Footer sections inside app windows
- ❌ Bright/light backgrounds inside app content areas
- ❌ Gradient-filled cards (not in approved designs)
- ❌ Font sizes larger than 32px inside app content areas
- ❌ Ad-hoc colors not in `docs/DESIGN_SYSTEM.md` tokens
- ❌ Ad-hoc font sizes not in the typography scale
- ❌ External link behavior that exits the OS without using the Browser app

---

## Rule D-7: Do Not Create Website-Style Layouts Inside Applications

Every application must:

1. Look like an installed OS application.
2. Never look like a website.
3. Use `WindowChrome` as its outer frame — never render its own title bar.
4. Use sidebar + tab navigation (Layout B) or flat card layout (Layout A).
5. Never use browser-style URL bars or breadcrumbs unless the app is a file browser or internal browser.

---

# Development Workflow

For every task:

1. Understand the requirement.
2. Read `docs/DESIGN_SYSTEM.md` and `docs/PHASE_3_ARCHITECTURE.md` if the task involves UI or app implementation.
3. Review related documentation.
4. Review existing implementation.
5. Plan changes using `docs/TASK_BOARD.md` as the authoritative queue.
6. Implement changes.
7. Validate architecture consistency.
8. Validate visual consistency against `docs/design/` screenshots.
9. Update documentation if required.

Keep changes small, focused, and aligned with existing architecture.

Avoid unnecessary refactors.

---

# Task Board Rule

`docs/TASK_BOARD.md` is the single source of truth for active and queued work.

- Read it before selecting new work.
- Update it whenever task statuses change.
- Use it together with `docs/PROJECT_STATUS.md`, `docs/HANDOFF.md`, and `docs/CHANGELOG.md`.

---

# Documentation Drift Rule

Repository documentation must accurately reflect repository reality.

If code and documentation disagree:

1. Identify the mismatch.
2. Report the mismatch.
3. Update documentation or code as appropriate.

Major documentation drift should be resolved before continuing development.

---

# Architecture Decision Rule

When introducing any of the following:

- New architectural patterns
- New stores
- New core systems
- New infrastructure
- New boundaries
- Significant refactors

Update:

docs/DECISIONS.md

Document:

- Decision
- Reasoning
- Alternatives considered
- Impact
- Future implications

---

# Protected Systems

The following systems are considered architectural foundations:

- src/core
- src/shared
- src/config
- src/data
- src/shells

Changes to these systems require:

- Architectural review
- Documentation updates
- Update to DECISIONS.md if boundaries change

These systems may be modified when necessary, but changes must be deliberate and documented.

---

# Multi-Agent Compatibility Rule

This repository is designed to support multiple AI agents.

All agents must be able to continue work using repository documentation alone.

Never assume access to:

- Previous chats
- Previous prompts
- Previous AI sessions

Always document important context.

---

# Context Preservation Protocol

If an AI agent believes:

- Context window exceeds roughly 70%
- Token budget is becoming limited
- Session may terminate unexpectedly
- Work must be paused
- Another AI agent may continue

The agent must update:

- docs/HANDOFF.md

before continuing or stopping.

Context preservation takes priority over implementation.

---

# Mandatory Session End Procedure

Before ending a session:

Update:

## docs/HANDOFF.md

Include:

- Current phase
- Completed work
- In-progress work
- Pending work
- Files modified
- Architectural decisions
- Risks
- Blockers
- Recommended next task

Assume the next AI agent has never seen this session.

---

## docs/PROJECT_STATUS.md

Update:

- Current phase
- Progress percentage
- Completed milestones
- Remaining milestones
- Current focus
- Blockers

---

## docs/CHANGELOG.md

Add:

- Date
- Summary of work completed
- Files affected
- Significant changes
- Architectural updates

---

# Handoff Quality Rule

Before ending a session verify:

A new AI agent should be able to:

1. Read documentation.
2. Understand current project state.
3. Understand what was completed.
4. Understand what remains.
5. Continue development without previous conversation history.

If this is not possible, improve HANDOFF.md before ending the session.

---

# Project-Specific Rules

## My OS Portfolio Vision

This project is an Operating System experience.

It is NOT a traditional portfolio website.

Architectural decisions should reinforce:

- OS experience
- Multi-device support
- App-based navigation
- Window management
- Future AI extensibility

---

## Projects App Priority

The Projects App is the flagship experience.

The Reels experience is a core differentiator.

Current model:

One Reel = One Project

Future model:

One Project = Multiple Reels

Implementations must not block future expansion.

---

## Browser Strategy

Hybrid Browser Model:

Internal Browser:

- Project Details
- Resume
- Case Studies
- Internal Content

External Browser:

- GitHub
- LinkedIn
- Live Deployments
- External Websites

Do not violate this strategy without updating DECISIONS.md.

---

## Future Architecture Protection

Future systems are reserved:

- ai-assistant
- mcp-hub
- agent-workspace
- knowledge-base
- memory-center
- prompt-library
- tool-registry

Do not repurpose these identifiers.

---

# Golden Rule

When uncertain:

1. Read documentation.
2. Analyze existing implementation.
3. Document decisions.
4. Preserve architecture.
5. Optimize for long-term maintainability.

The repository should remain understandable and maintainable by both humans and future AI agents.
