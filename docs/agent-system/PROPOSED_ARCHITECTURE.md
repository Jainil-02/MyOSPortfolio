# Multi-Agent Engineering Architecture

> **Document purpose**: Comprehensive architecture specification for the Multi-Agent Engineering System used to develop and maintain My OS Portfolio (ApexOS).  
> **Status**: Reference - synthesizes current state and future vision  
> **Authority**: This document governs the internal engineering workflow, distinct from the ApexOS application architecture.  
> **Version**: 1.0  
> **Last Updated**: 2026-11-18

---

## 1. Executive Summary

This document defines a **Spec-Driven Development (SDD)** workflow for the My OS Portfolio project, establishing:

- **Three distinct systems**: ApexOS (product), Internal Multi-Agent Engineering System (development), and Future User-Facing AI Assistant
- **Complete 12-stage SDD workflow** from requirement gathering to documentation
- **Continuous feedback loop** with independent review gates
- **Agent roles and responsibilities** with clear ownership boundaries
- **GitHub-based orchestration** strategy with branch naming and PR lifecycle
- **Security architecture** protecting credentials and core systems
- **Implementation roadmap** with phased milestones

---

## 2. Three-System Separation

**CRITICAL**: These are three distinct concerns with separate security boundaries.

| System | Purpose | Audience | Security Boundary |
|--------|---------|----------|-------------------|
| **ApexOS** | Browser-based portfolio operating system | Recruiters, visitors | Production deployment |
| **Internal Multi-Agent Engineering System** | AI-assisted development workflow | Claude Code agents | Development environment |
| **Future User-Facing AI Assistant** | Embedded AI chat inside ApexOS | Recruiters (Phase 5) | Isolated from development tools |

### 2.1 ApexOS Architecture Context

ApexOS is a **browser-based personal operating system** built with:
- **Next.js 16.2.9** with App Router
- **React 19** with client/server component architecture
- **TypeScript** with strict type checking
- **Zod** for schema validation

The system implements:
- Desktop shell with wallpaper, taskbar, desktop icons
- Window management with drag/resize/focus
- 11 portfolio applications (About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Terminal, Achievements)
- Lock screen, boot sequence, command palette, notifications

### 2.2 Internal Engineering System Overview

The Multi-Agent Engineering System is a **spec-driven development workflow** where AI agents collaborate through well-defined stages, with independent review gates preventing self-approval.

### 2.3 Future User-Facing AI Assistant

A Phase 5 feature that will be embedded inside ApexOS:
- Chat interface inside an app window
- MCP integration for portfolio knowledge
- **Isolated** from internal development tools and credentials

---

## 3. Complete SDD Workflow (12 Stages)

The Spec-Driven Development workflow ensures quality through independent review and verification at each stage.

### Stage 1: Requirement Gathering

**Agent**: Orchestrator + User (human input)

**Responsibilities**:
- Receive user request or identify gap
- Clarify requirements with user if ambiguous
- Document acceptance criteria

**Inputs**: User request, `docs/TASK_BOARD.md`, `docs/PROJECT_STATUS.md`

**Outputs**: Clarified requirement with acceptance criteria

**Completion Condition**: Requirement is unambiguous and testable

---

### Stage 2: Specification Creation

**Agent**: Planning and Specification Agent

**Responsibilities**:
- Create functional specification (what)
- Create technical specification (how)
- Define data structures and APIs
- Identify design tokens and patterns

**Inputs**: Requirement, `docs/DESIGN_SYSTEM.md`, `docs/PROPOSED_ARCHITECTURE.md`

**Outputs**: `docs/specs/SPEC_<task-name>.md`

**Completion Condition**: Specification covers all edge cases

---

### Stage 3: Architecture Review

**Agent**: Architecture Reviewer (independent from planner)

**Responsibilities**:
- Verify architectural fit with `docs/PROPOSED_ARCHITECTURE.md`
- Check dependency direction compliance
- Ensure design system governance
- Validate data schemas

**Inputs**: Specification document

**Outputs**: Review report with approve/reject status

**Completion Condition**: Specification approved or revision requests issued

---

### Stage 4: Technical Design

**Agent**: Planning and Specification Agent

**Responsibilities**:
- Create detailed implementation plan
- Identify files to create/modify
- Define component structure
- Plan testing approach

**Inputs**: Approved specification

**Outputs**: `docs/designs/DESIGN_<task-name>.md`

**Completion Condition**: Technical design is complete and testable

---

### Stage 5: Independent Specification Review

**Agent**: Technical Reviewer

**Responsibilities**:
- Verify implementation plan matches specification
- Check for edge cases and error handling
- Confirm test plan is adequate

**Inputs**: Technical design document

**Outputs**: Sign-off for implementation

**Completion Condition**: Design review approved

---

### Stage 6: Human Approval

**Agent**: Human Project Owner (Jainil Pandya)

**Responsibilities**:
- Final approval of specification and design
- Priority confirmation

**Inputs**: Approved specification and design

**Outputs**: Go-ahead for implementation

**Completion Condition**: Explicit human approval granted

---

### Stage 7: Implementation

**Agent**: Appropriate Domain Agent (UI/UX, Core, Frontend, etc.)

**Responsibilities**:
- Write code according to spec and design
- Use shared components from `src/shared/`
- Follow design tokens from `DESIGN_SYSTEM.md`
- Implement tests

**Inputs**: Approved spec and design

**Outputs**: Code changes in feature branch

**Completion Condition**: Implementation complete and tests passing

---

### Stage 8: Independent Code Review

**Agent**: Independent Code Reviewer

**Responsibilities**:
- Review code for correctness
- Check design system compliance
- Verify no hardcoded values
- Validate test coverage

**Inputs**: Pull request with implementation

**Outputs**: Review comments, approve/reject

**Completion Condition**: All review comments addressed or accepted

---

### Stage 9: Automated QA and Testing

**Agent**: QA and Testing Agent

**Responsibilities**:
- Run type checking: `npm run typecheck`
- Run linting: `npm run lint`
- Run tests: `npm run test`
- Validate Zod schemas
- Check for broken references

**Inputs**: Approved PR

**Outputs**: Test results, pass/fail status

**Completion Condition**: All checks pass

---

### Stage 10: Feedback and Correction

**Agent**: Implementation Agent (at receiving end)

**Responsibilities**:
- Receive feedback from review/QA
- Implement corrections
- Push fixes

**Inputs**: Review/QA findings

**Outputs**: Corrected implementation

**Completion Condition**: All feedback addressed

---

### Stage 11: Re-review and Acceptance

**Agent**: Code Reviewer + QA Agent

**Responsibilities**:
- Verify corrections address feedback
- Sign-off on final implementation

**Inputs**: Corrected changes

**Outputs**: Final approval to merge

**Completion Condition**: Re-review approved

---

### Stage 12: Documentation and Project-State Update

**Agent**: Documentation Agent

**Responsibilities**:
- Update `docs/CHANGELOG.md`
- Update `docs/PROJECT_STATUS.md`
- Update `docs/TASK_BOARD.md`
- Update `docs/HANDOFF.md`

**Inputs**: Merged implementation

**Outputs**: Updated documentation

**Completion Condition**: All documents updated with accurate state

---

## 4. Continuous Feedback Loop

### 4.1 Loop Protocol

```
Implementation → PR → Code Review → QA → Feedback → Correction → Re-review → Merge → Document Update
                    ↑__________ No self-approval _________↓
```

### 4.2 Finding Recording

Findings are recorded in:
- **Pull request comments** (primary)
- **Agent reports** (summaries)
- **Test failure logs** (automated)

### 4.3 Finding Assignment

| Finding Type | Assigned To |
|--------------|-------------|
| Bug/Logic Error | Implementation Agent |
| Design Deviation | UI/UX Agent |
| Schema Violation | Implementation Agent |
| Security Issue | Architecture Reviewer |
| Test Failure | QA Agent |

### 4.4 Feedback Delivery to Implementation

1. Create GitHub PR comment with finding
2. Tag implementation agent
3. Reference spec section violated
4. Provide reproduction steps if applicable

### 4.5 Reviewer Verification of Corrections

1. New commit pushed to branch
2. Reviewer checks "Files changed" diff
3. Re-run relevant tests if modified
4. Approve if corrections verified

### 4.6 Unresolved Disagreements

**Escalation Path**:
1. Agent attempts to resolve internally
2. Post to PR with "DISPUTE" label
3. Human reviewer (Jainil Pandya) makes final decision
4. Document decision in `docs/DECISIONS.md`

### 4.7 Retry/Limit Rules

- **Maximum review iterations**: 3
- **Maximum QA fixes**: 2
- **Timeout**: 24 hours per iteration
- **Escalation**: After limits reached, document and notify human

---

## 5. Agent Roles and Responsibilities

### 5.1 Required Separate Agents

| Role | Name | Separation Rationale |
|------|------|---------------------|
| Orchestrator | claude (primary session) | Coordinates workflow |
| Planning Agent | claude (via Plan skill) | Creates specs |
| Architecture Reviewer | claude (fork) | Independent review |
| Implementation Agent | claude (domain-specific) | Writes code |
| Code Reviewer | claude (different instance) | Cannot approve own work |
| QA Agent | claude (QA-focused) | Automated verification |
| Documentation Agent | claude | Updates project state |

### 5.2 Capabilities (Combined Roles)

These should be implemented as **skills** within the agent environment, not separate agents:

- **UI/UX Agent**: Skill that verifies `DESIGN_SYSTEM.md` compliance
- **Core Runtime Agent**: Skill that manages `src/core` code
- **Frontend Agent**: Skill that manages `src/apps` and `src/features`
- **Security Reviewer**: Skill that checks for credential exposure

### 5.3 Agent Skill vs Agent

```
Use AGENT when:
- Long-running task (e.g., "Build all 11 apps")
- Multi-file changes across domains
- Need parallel execution

Use SKILL when:
- Reusable patterns (design system check, code formatting)
- Single-responsibility tasks
- Helper functions for other agents
```

---

## 6. Agent Communication Protocol

### 6.1 GitHub as Source of Truth

All project state must be accessible via GitHub:
- Branch names follow convention
- PR descriptions explain changes
- Commit messages use conventional format
- No out-of-band state storage

### 6.2 Markdown Specifications

Specifications are stored as:
```
docs/specs/
  SPEC_<task-name>.md     # Functional spec
docs/designs/
  DESIGN_<task-name>.md   # Technical design
docs/reviews/
  REVIEW_<task-name>.md   # Review findings
```

### 6.3 Required Information Before Agent Starts

Every agent must read before working:

1. `docs/AGENT_GUIDE.md` - Project rules
2. `docs/TASK_BOARD.md` - Current task queue
3. `docs/PROJECT_STATUS.md` - Phase progress
4. Relevant spec/design documents
5. Changed files (if PR exists)

### 6.4 Stale Context Prevention

- Agents check last commit date before starting
- If >24 hours since last update, agent refreshes
- Agents verify `TASK_BOARD.md` matches current state
- Conflicts trigger re-planning

---

## 7. Shared Memory and Project State

### 7.1 GitHub Files (Persistent)

| File | Purpose |
|------|---------|
| `docs/TASK_BOARD.md` | Current task queue |
| `docs/PROJECT_STATUS.md` | Phase progress tracking |
| `docs/HANDOFF.md` | Session context preservation |
| `docs/CHANGELOG.md` | Chronological changes |
| `docs/DECISIONS.md` | Architecture decisions |
| `docs/PROPOSED_ARCHITECTURE.md` | Main architecture doc |

### 7.2 Agent Handoff Reports

When agent session ends:

```markdown
## HANDOFF REPORT

**Session**: <session-id>
**Agent**: <agent-type>
**Task**: <task-name>

## Summary
<what was accomplished>

## Key Findings
- <finding 1>
- <finding 2>

## Next Steps
1. <step 1>
2. <step 2>

## Risks
- <risk 1>
```

### 7.3 Conflicting Updates Prevention

1. Branch-per-task ensures isolation
2. PR review catches conflicts
3. Merge queue enforces sequential integration
4. Agents refresh from remote before starting

---

## 8. Orchestration Architecture

### 8.1 File-Based Workflow (Recommended)

```
Feature Branch → Pull Request → Review → QA → Correction → Merge
```

**Pros**:
- Simple, reliable
- Native GitHub support
- Full audit trail
- Windows compatible

**Cons**:
- Manual coordination required
- No real-time notifications

### 8.2 Comparison Table

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| File-Based Workflow | Simple, reliable, audit trail | Manual coordination | Low |
| GitHub Issues + PRs | Structured, traceable | More setup | Medium |
| Dedicated Orchestration | Real-time, automated | Requires infrastructure | High |
| Custom Controller | Full control | Maintenance overhead | High |

### 8.3 Recommended Architecture

**Start with**: File-based workflow  
**Evolve to**: GitHub Issues + PR templates with agent automation

---

## 9. GitHub and Workspace Strategy

### 9.1 Branch Strategy

```
main                   # Production/stable
  └── staging           # Integration branch
        ├── feature/agent-task-name  # Individual work
        └── chore/agent-task-name    # Documentation updates
```

### 9.2 Feature Branch Naming

```
feature/<agent-type>-<short-task>
examples:
  feature/ui-projects-app
  feature/core-notifications
  feature/qa-schema-validation
  feature/docs-update-handoff
```

### 9.3 Pull Request Lifecycle

1. **Title**: "[<agent>] <Short description>"
2. **Description**: Links to spec, changes summary
3. **Reviewers**: At least one domain agent + one QA agent
4. **Status**: Work in Progress → Ready for Review → Approved → Merged

### 9.4 Commit Responsibilities

| Role | Commit Access |
|------|---------------|
| Implementation Agent | Write to feature branch |
| Documentation Agent | Write to main/staging |
| Human Owner | Merge to main |

### 9.5 Parallel Task Execution

- Each task gets own branch
- No simultaneous edits to same file
- Agent checks for conflicts on start

### 9.6 File Ownership Matrix

| Path Pattern | Owner |
|--------------|-------|
| `src/apps/*` | Frontend/UI Agent |
| `src/core/*` | Core Runtime Agent |
| `src/shared/*` | UI/UX Agent (read-only) |
| `src/shells/*` | Frontend Agent |
| `src/data/*` | Data Agent |
| `docs/specs/*` | Planning Agent |
| `docs/...` | Documentation Agent |

### 9.7 Merge Approval

1. Two agent approvals (implementation + review)
2. All CI checks pass
3. Human owner final merge

### 9.8 Rollback and Recovery

- Reverts done via GitHub UI
- Previous state always preserved in git history
- Agent reports contain recovery steps

---

## 10. MCP and Tool Integration

### 10.1 Existing MCP Servers

| Server | Access | Used By |
|--------|--------|---------|
| GitHub | Read/Write | All agents |
| Context7 | Read | Documentation, Implementation |
| Playwright | Read/Write | QA Agent |

### 10.2 Tool Permissions

```yaml
Implementation Agent:
  - GitHub: Read PR, Write branch
  - Context7: Query docs
  - Filesystem: Read/Write files

Code Reviewer:
  - GitHub: Read PR, Read branch
  - Filesystem: Read files

QA Agent:
  - GitHub: Read PR
  - Playwright: Execute tests
  - Shell: Run npm commands
```

### 10.3 No Additional Servers Required

Current MCP coverage is sufficient for the workflow. Additional servers would increase complexity without clear benefit.

---

## 11. Security Architecture

### 11.1 Credential Protection

- No hardcoded credentials
- `.env` files never committed
- MCP servers use read-only tokens where possible
- Sensitive output redacted in logs

### 11.2 Least-Privilege Access

| Agent Type | GitHub Scope | Purpose |
|------------|--------------|---------|
| Implementation | repo (write to branch) | Write code changes |
| Review | repo (read) | Review changes |
| QA | repo (read) | Access test data |
| Documentation | repo (write) | Update docs |

### 11.3 Tool Permission Boundaries

```
Filesystem Access:
  - /src/apps/   : Full (implementation)
  - /src/core/   : Read (review), Write (core agent)
  - /src/shared/ : Read (all), Write (UI/UX agent)
  - /docs/       : Read (all), Write (documentation agent)
  - Root level  : Read only
```

### 11.4 Human Approval Checkpoints

1. **Specification Approval** (Stage 6): Human reviews functional spec
2. **Design Sign-off** (Stage 5): Human reviews technical design
3. **Final Merge** (Stage 11): Human merges to main

### 11.5 Protected Core Systems

| Path | Protection |
|------|------------|
| `src/core/*` | Requires core agent specialization |
| `src/shared/*` | Requires UI/UX agent review |
| `src/config/*` | Read-only for most agents |
| `src/data/*` | Requires data validation |

### 11.6 Production Deployment Restrictions

- Only `main` branch deploys (via CI/CD)
- Agents cannot deploy
- Human must trigger production release
- Deployment requires successful QA gate

### 11.7 Destructive Operations

Blocked by default:
- `npm run deploy` - requires human
- Git push to `main` - requires merge
- File deletion - requires approval

---

## 12. Failure Recovery and Retry Strategy

### 12.1 Retry Limits

| Process | Max Retries | Timeout |
|---------|-------------|---------|
| Code Review | 3 iterations | 24h |
| QA Fixes | 2 iterations | 24h |
| Implementation | 5 re-runs | 48h |

### 12.2 Escalation Path

1. Agent attempts resolution
2. Post to PR with `DISPUTE` label
3. Human reviewer intervenes
4. Decision documented in `DECISIONS.md`

### 12.3 Recovery Actions

| Failure Type | Recovery Action |
|--------------|-----------------|
| Test failure | Revert commit, fix, re-test |
| Merge conflict | Pull latest, rebase, re-push |
| Review disagreement | Escalation to human |
| Agent crash | Restore from git, restart |

---

## 13. Directory and Documentation Structure

### 13.1 New Directories Structure

```
docs/
├── agent-system/
│   ├── PROPOSED_ARCHITECTURE.md  # This document
│   ├── AGENT_GUIDE.md            # Per-agent instructions
│   ├── DECISIONS.md              # Architecture decisions
│   └── templates/
│       ├── SPEC_TEMPLATE.md
│       └── DESIGN_TEMPLATE.md
├── specs/
│   └── SPEC_<task-name>.md       # Specifications
├── designs/
│   └── DESIGN_<task-name>.md     # Technical designs
└── reviews/
    └── REVIEW_<task-name>.md     # Review findings
```

### 13.2 Documentation Creation Protocol

1. Create spec in `docs/specs/`
2. Create design in `docs/designs/`
3. Keep review in PR comments
4. Archive to `docs/reviews/` if needed

---

## 14. Implementation Roadmap

### 14.1 Milestone 1: Workflow Foundation (🟡 10% complete)

**Objectives**:
- Establish branch strategy
- Create agent templates
- Define communication protocol

**Files to Create**:
- `docs/agent-system/AGENT_GUIDE.md`
- `docs/agent-system/templates/SPEC_TEMPLATE.md`
- `docs/agent-system/templates/DESIGN_TEMPLATE.md`

**Validation**:
- Template files render correctly
- Branch naming works
- Agent can read required docs

---

### 14.2 Milestone 2: Review Agents (🔴 0% complete)

**Objectives**:
- Separate code reviewer agent
- Separate QA agent
- Review criteria defined

**Files to Change**:
- `docs/agent-system/PROPOSED_ARCHITECTURE.md`

**Validation**:
- Reviewer catches issues
- QA runs automated checks

---

### 14.3 Milestone 3: Workflow Integration (🔴 0% complete)

**Objectives**:
- Integrate SDD into task process
- Update TASK_BOARD.md format
- Create feedback loop mechanism

**Validation**:
- Tasks follow 12-stage workflow
- Review gates prevent self-approval

---

### 1.4 Milestone 4: Documentation Automation (🔴 0% complete)

**Objectives**:
- Auto-generate HANDOFF.md
- Automate CHANGELOG updates
- Create decision logging tool

---

## 15. Risks and Trade-offs

### 15.1 Identified Risks

| Risk | Mitigation | Owner |
|------|------------|-------|
| Agent self-approval | Separate review agents | Workflow |
| Inconsistent specs | Template enforcement | Planning Agent |
| Branch conflicts | Small, frequent PRs | All agents |
| Credential exposure | No `.env` files, redaction | Security |

### 15.2 Key Trade-offs

| Choice | Benefit | Cost |
|--------|---------|------|
| File-based workflow | Simple, native GitHub | Manual coordination |
| Separate review agents | Prevents self-approval | More complexity |
| Template requirements | Consistency | More boilerplate |

---

## 16. Decisions Requiring Human Approval

### 16.1 Before Implementation

1. [ ] Accept 12-stage SDD workflow
2. [ ] Accept agent role definitions
3. [ ] Accept branch naming convention
4. [ ] Accept retry limits

### 16.2 During Implementation

1. All specification approvals
2. All design sign-offs
3. Final merge to main

---

## 17. References

- [PRODUCT_BLUEPRINT.md](../PRODUCT_BLUEPRINT.md) - Product vision
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Visual specification
- [AGENT_GUIDE.md](../AGENT_GUIDE.md) - Agent operational guide
- [TASK_BOARD.md](../TASK_BOARD.md) - Current task queue
- [PROJECT_STATUS.md](../PROJECT_STATUS.md) - Phase progress

---

## 18. Change History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-11-18 | Initial architecture | Claude Code |