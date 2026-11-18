# Curated Skill Architecture

> **Status:** Proposed for owner approval; no third-party skills are installed by this document.
> **Reviewed:** 18 November 2026

## 1. Goals

- Give Claude Code, Codex and GitHub Copilot consistent, task-relevant engineering guidance.
- Prefer portable Agent Skills packaging for content we author.
- Keep the number of always-loaded instructions small.
- Separate skills (procedural knowledge) from agents (execution identity), MCP servers (tool connectivity), hooks (event-triggered automation) and the future controller (durable orchestration).
- Preserve ChatGPT as technical lead/specification author, Claude Code as implementer and Codex as independent reviewer.
- Avoid duplicate rules, unreviewed executable hooks and uncontrolled automatic updates.

## 2. Layered model

| Layer | Responsibility | Source of truth |
|---|---|---|
| Project policy | Non-negotiable ApexOS constraints, security, scope and evidence rules | `docs/AGENT_RULES.md` and concise root agent entry points |
| Portable skills | Task-specific procedures such as TDD and bug diagnosis | Agent Skills-compatible skill directories |
| Host adapters | Discoverability/invocation differences for each agent | Thin Claude/Codex/Copilot adapter files only where required |
| Hooks | Deterministic pre/post tool or lifecycle checks | Explicitly reviewed scripts and host-specific hook manifests |
| MCP | Access to GitHub, Context7 and Playwright | Existing agent MCP configurations |
| Orchestrator | Task state, routing, approvals, retries, durable evidence | Future Workstream B controller specification/implementation |

A skill is not an agent. An MCP server is not an orchestrator. A hook is executable automation, not just documentation.

## 3. Canonical repository layout (proposed)

Use the repository as the versioned source of truth:

```text
.agents/
  skills/
    apexos-task-contract/
      SKILL.md
      references/
        task-contract.md
    apexos-implementation/
      SKILL.md
      references/
        implementation-checklist.md
    apexos-independent-review/
      SKILL.md
      references/
        review-evidence.md
    apexos-qa-verification/
      SKILL.md
      references/
        qa-evidence.md
    apexos-bug-diagnosis/
      SKILL.md
      references/
        diagnosis-record.md
    apexos-ui-design/
      SKILL.md
      references/
        ui-quality-checklist.md
  README.md
docs/
  agent-system/
    SKILL_ECOSYSTEM_RESEARCH.md
    SKILL_ARCHITECTURE.md
```

The skill names and initial file list above are a target design, not a claim that those directories already exist. Build the minimum useful set and avoid creating a skill for a one-off instruction.

### Why `.agents/skills`?

It is the portable Agent Skills convention and is a documented skill location for Codex. Claude Code and GitHub Copilot may use different discovery locations and/or plugin mechanisms depending on version. Therefore, do not assume that placing a skill in `.agents/skills` automatically makes it available in every host.

For each client, test native discovery first. If a client requires another path, generate or copy a versioned adapter from the canonical source and validate drift. Do not maintain three independently edited copies.

## 4. Candidate skills and ownership

| Skill | Purpose | Primary user | Initial status |
|---|---|---|---|
| `apexos-task-contract` | Normalize approved request into task ID, scope, dependencies, acceptance criteria, risk and evidence | ChatGPT / controller | Author in-house |
| `apexos-implementation` | Execute only approved task scope, use TDD where appropriate, preserve branch isolation | Claude Code | Author in-house; informed by selected Matt Pocock practices |
| `apexos-independent-review` | Review implementation against spec and inspect actual diff independently | Codex | Author in-house |
| `apexos-qa-verification` | Run defined checks and record exact command/output evidence | Claude + CI; reviewer verifies | Author in-house |
| `apexos-bug-diagnosis` | Reproduce, isolate, hypothesize, instrument, fix and regression-test | Claude Code | Candidate; may adapt Matt Pocock approach |
| `apexos-ui-design` | UI/UX critique, accessibility, responsive and visual polish | Claude Code / Copilot | Optional; evaluate Impeccable later |

ChatGPT is the technical lead and creates the specification in the agreed workflow. It does not need a local skill installation to author the spec. The controller will later serialize the approved spec and task contract.

## 5. Third-party source policy

- Do not install all of Matt Pocock Skills, ECC, Ponytail or Impeccable wholesale.
- Prefer upstream plugin installation only if it is required and version-pinned; otherwise use a reviewed, minimal, editable copy where license and update policy allow it.
- Do not mix a plugin-managed copy and a skills.sh editable copy of the same Matt Pocock skill in one agent environment.
- Do not install Ponytail and Karpathy guidelines as simultaneous always-on layers.
- Do not install ECC hooks, agents, memory or MCP configs as a side effect of selecting one ECC skill.
- Do not execute Impeccable's installer or hooks until the installer, hook scripts and binary acquisition path are audited.
- Every third-party skill must retain required attribution/license notices and record its exact upstream version/commit.

## 6. Skill authoring contract

Every project-authored skill must:
- Use valid Agent Skills YAML frontmatter: lowercase hyphenated `name` matching its directory, and a precise `description` explaining what it does and when to use it.
- Have one clear responsibility and a narrow activation description.
- State prerequisites, inputs, outputs, steps, stop conditions and escalation behavior.
- Reference project docs instead of duplicating long policy blocks.
- Avoid hidden assumptions about tools or MCP connectivity.
- Avoid executing scripts or granting permissions by default.
- Separate deterministic checks from LLM judgment.
- Include examples and failure cases where they improve reliability.
- Keep `SKILL.md` concise; move long references into `references/`.
- Be validated with `skills-ref validate` or an equivalent parser and manually tested in each target host.

The experimental Agent Skills `allowed-tools` field must not be treated as a security boundary. Host permissions and execution policies remain authoritative.

## 7. Agent-specific behavior

### ChatGPT — technical lead
- Own requirement analysis, specification, architecture, task decomposition and final acceptance.
- Record decisions and uncertainties explicitly.
- Do not claim local execution or tests without evidence.
- Do not silently hand specification authority to the implementer.

### Claude Code — implementer
- Read approved spec and task contract before editing.
- Work only on the assigned branch/worktree and scoped files.
- Use tests first for behavior with meaningful observable seams.
- Do not merge, alter branch protection, delete branches or change global configuration.
- Provide a handoff with changed files, commit, commands and evidence.
- A self-review is not the independent review gate.

### Codex — independent reviewer
- Use a separate session from the implementation session.
- Inspect the exact diff and originating specification.
- Do not rely solely on Claude's summary.
- Classify findings by severity and cite file/line and reasoning.
- Verify corrections after changes; do not author the implementation unless explicitly reassigned.

### GitHub Copilot — inline assistant
- Assist with local, developer-directed edits and explanations.
- Follow the same project policy.
- Do not count inline assistance as independent review or approval.

## 8. Skill lifecycle and versioning

Each third-party skill entry in a future `skills.lock.json` (or equivalent manifest) should include:
- skill name and local path;
- upstream repository and source path;
- release/tag and immutable commit SHA;
- license identifier and attribution location;
- content hash;
- supported hosts and tested host versions;
- scripts/hooks present and audit status;
- install method, update policy and rollback procedure;
- owner approval date and reviewer.

Update flow:
1. Detect upstream update.
2. Fetch into a temporary review directory.
3. Diff skill text, scripts, hooks, dependencies and metadata.
4. Re-run security and compatibility checks.
5. Approve update.
6. Update pinned manifest and changelog.
7. Test all adapters.
8. Roll back by restoring the previous pinned version if validation fails.

No automatic upstream skill updates in the initial deployment.

## 9. Compatibility matrix to validate

| Capability | Claude Code | Codex | VS Code Copilot |
|---|---|---|---|
| Read canonical `.agents/skills` | Verify current version/discovery | Verify current version/discovery | Verify current version/discovery |
| Native skill invocation | Verify | Verify | Verify |
| Skill references/resources | Verify | Verify | Verify |
| User-invoked vs automatic invocation controls | Host-specific | Host-specific | Host-specific |
| Scripts and permissions | Audit/verify | Audit/verify | Audit/verify |
| Hook behavior | Separate audit | Separate audit | Separate audit |
| MCP tool access | Already connected per user output | Configured per user config | Configured per user config |

A skill is marked supported only after a disposable-repository test confirms discovery, invocation, references, output and permissions. Documentation claims alone are not sufficient.

## 10. Implementation sequence

1. Owner approves the curated catalogue and canonical layout.
2. Create only the minimum in-house skills needed for task contract, implementation, independent review and QA.
3. Validate frontmatter and directory structure.
4. Test canonical skill discovery on the current versions of Claude Code, Codex and Copilot in a disposable branch/repository.
5. Add only necessary host adapters; document differences.
6. Trial selected third-party skills one at a time, with hooks disabled unless separately approved.
7. Record compatibility results and pin versions.
8. Integrate the approved skill set with the future controller after the controller contract is defined.

## 11. Acceptance criteria

- [ ] Owner approves the catalogue and layering model.
- [ ] No duplicated always-on policy is introduced.
- [ ] Canonical source and adapter generation/update strategy are documented.
- [ ] Every enabled skill has provenance, license, version and hash recorded.
- [ ] Every script/hook is reviewed before execution.
- [ ] Claude, Codex and Copilot each pass a discovery/invocation test for the skills claimed to be supported.
- [ ] Independent review remains separate from implementation.
- [ ] Uninstall and rollback instructions are tested.
- [ ] No credentials or broad permissions are added by skill installation.

## 12. Explicit non-goals

This architecture does not yet:
- implement the multi-agent controller;
- automatically invoke agents or schedule background tasks;
- add hooks, scripts, MCP servers or global plugins;
- change Codex sandbox settings or any agent permissions;
- change ApexOS application source code;
- enable autonomous merges or unattended repository writes.
