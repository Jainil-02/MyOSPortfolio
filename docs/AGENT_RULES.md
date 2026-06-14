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

If additional context is needed:

6. docs/ARCHITECTURE_OVERVIEW.md
7. docs/ARCHITECTURE_REVIEW.md
8. docs/DEVELOPMENT_ROADMAP.md
9. docs/MY_OS_PORTFOLIO_SPEC.md

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

# Development Workflow

For every task:

1. Understand the requirement.
2. Review related documentation.
3. Review existing implementation.
4. Plan changes using `docs/TASK_BOARD.md` as the authoritative queue.
5. Implement changes.
6. Validate architecture consistency.
7. Update documentation if required.

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

Examples:

- GitHub Copilot
- OpenAI Codex
- Claude Code
- Gemini CLI
- Cursor
- OpenHands
- Future AI agents

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
