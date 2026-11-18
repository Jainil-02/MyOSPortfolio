# Skill Ecosystem Research

> **Status:** Research baseline for Workstream B; recommendations are provisional until owner approval.
> **Reviewed:** 18 November 2026
> **Scope:** The six repositories selected for evaluation. This is a source-level review, not a security certification or execution test.

## Executive recommendation

Adopt the Agent Skills format as the canonical packaging convention for skills we author. Select a small number of task-focused skills rather than installing entire repositories. Keep the repository as the source of truth, pin third-party versions, record provenance and licenses, and test each skill against Claude Code, Codex and GitHub Copilot before enabling it.

**Do not install all six repositories.** They overlap substantially and several include hooks, broad always-on instructions, installers or agent-specific configuration that should be reviewed separately from their Markdown skill content.

Recommended initial direction:

1. Use the Agent Skills specification as the packaging standard, while treating client compatibility as something to verify rather than assume.
2. Evaluate a curated subset of Matt Pocock's engineering skills for implementation workflow: `tdd`, `diagnosing-bugs`, and selected implementation guidance. Keep ChatGPT responsible for high-level analysis/specification and keep final independent code review with Codex, not the implementing Claude session.
3. Use Karpathy's four principles (clarify assumptions, simplicity, surgical edits, measurable outcomes) as concise project policy. Do not add a second always-on plugin if those rules are already represented in project instructions.
4. Treat Ponytail as an alternative consolidated coding/review policy, not an additional always-on layer. Its hooks and plugin behavior require separate review and opt-in.
5. Evaluate Everything Claude Code (ECC) selectively for reusable TypeScript/testing/security skills and its security guidance. Do not import its full agent, hook, command, memory or MCP stack.
6. Keep Impeccable as an optional, task-triggered frontend design skill for ApexOS UI work, not a core engineering skill.

No third-party skills, plugins, hooks, scripts or MCP servers are installed by this research change.

## Repository-by-repository assessment

### 1. Matt Pocock Skills — `mattpocock/skills`

**What it provides:** A composable collection of engineering and productivity skills. The current README groups user-invoked workflows such as `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, and model-invoked skills such as `tdd`, `diagnosing-bugs`, `codebase-design` and `code-review`. The repository has a native Claude Code plugin and documents installation paths for Codex and GitHub Copilot. The project states that the plugin and editable skills.sh copy should not both be installed for the same agent, or duplicate skills result.

**Relevant candidates:**
- `tdd`: test-first implementation at agreed public seams.
- `diagnosing-bugs`: structured reproduce/minimize/hypothesize/instrument/fix/regression-test loop.
- `implement`: scoped implementation from a spec/ticket, regular typechecking and tests, then a review handoff.
- `codebase-design`: shared vocabulary for module depth and interfaces.
- `to-spec` / `to-tickets`: useful patterns, but not initially delegated because ChatGPT is the designated technical lead for analysis and specifications.

**Risks and fit:**
- Several workflows assume an issue tracker and repository setup conventions; the setup skill may create labels and configure conventions. Inspect before use.
- The current implementation flow asks the implementer to call a code-review skill. That can be a useful self-check, but it cannot satisfy our independent-review requirement if Claude also implemented the change.
- The repo's newer workflow is opinionated and changes over time; pin a release/commit and review updates.
- License: MIT, confirmed from the repository LICENSE file.

**Recommendation:** Strong candidate for selected engineering skills. Trial only the relevant skills and preserve Codex as the independent reviewer. Do not install the entire set by default.

Sources: https://github.com/mattpocock/skills ; https://github.com/mattpocock/skills/releases ; https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md ; https://github.com/mattpocock/skills/blob/main/docs/engineering/tdd.md

### 2. Everything Claude Code — `affaan-m/everything-claude-code`

**What it provides:** A broad agent-harness toolkit: skills, specialized agents, hooks, commands, rules, MCP examples, memory/instinct workflows, security scanning, evaluation and orchestration helpers. The README describes support across multiple agent harnesses, including Claude Code and Codex, and includes TypeScript and other language ecosystems.

**Relevant candidates:**
- TypeScript/JavaScript engineering and testing skills.
- Security review and configuration auditing guidance.
- Documentation, test and build-error specialist agent patterns.
- Evaluation and verification-loop patterns.
- Selected memory/state patterns for future controller design, subject to separate architecture review.

**Risks and fit:**
- ECC is a system, not just a skill pack. Wholesale installation would introduce overlapping agents, hooks, commands, rules, MCP configuration and memory mechanisms.
- Hooks can execute automatically on lifecycle events. Every hook and script must be read, traced to its command, checked for network/file-system side effects and tested in an isolated workspace before enabling.
- Its built-in orchestration helpers must not be mistaken for our chosen durable controller until their state, recovery, idempotency and human approval behavior are verified.
- License: MIT is stated by the upstream README and mirrored repository metadata. Confirm the LICENSE file at the exact upstream commit before copying or redistributing any component.

**Recommendation:** Reference library only for now. Select individual skills/patterns after inspecting their exact source and scripts. Do not install the full ECC plugin or its hooks in this phase.

Sources: https://github.com/affaan-m/everything-claude-code ; https://github.com/affaan-m/everything-claude-code/blob/main/README.md

### 3. Karpathy-inspired guidelines — `multica-ai/andrej-karpathy-skills`

**What it provides:** A small instruction set focused on four behaviors: think before coding, simplicity first, surgical changes and goal-driven execution. The upstream README describes a Claude Code-oriented `CLAUDE.md`, a skill representation and a Cursor rule.

**Relevant value:** These principles directly address silent assumptions, overengineering, unrelated edits and weak success criteria. They are valuable as concise baseline behavior, not as a complex workflow engine.

**Risks and fit:**
- Significant overlap with Ponytail and the project’s existing AGENT_RULES.
- The README states MIT, but the repository fetch did not expose a LICENSE file and GitHub did not return one at the expected path. Treat redistribution rights as unverified; do not copy its text verbatim into this repository until the upstream license is confirmed.
- Its primary packaging is Claude-oriented; cross-agent support should not be inferred solely from the existence of a SKILL.md.

**Recommendation:** Adopt the ideas as original, project-authored policy where they improve existing rules; do not install a duplicate always-on skill or copy the upstream file.

Sources: https://github.com/multica-ai/andrej-karpathy-skills ; https://github.com/multica-ai/andrej-karpathy-skills/blob/main/README.md

### 4. Ponytail — `DietrichGebert/ponytail`

**What it provides:** A compact, opinionated coding policy centered on YAGNI, reuse, standard-library/native solutions, minimal changes and risk-aware testing. The repository also provides review/audit commands, multiple host adapters and lifecycle hooks.

**Relevant value:** A strong counterweight to overengineering. Its review guidance looks beyond the diff to affected callers and risky logic, and it explicitly says minimal code must not mean cutting validation, security, error handling or accessibility.

**Risks and fit:**
- Its default behavior is broadly active for coding tasks, overlapping with existing project instructions and Karpathy principles.
- Codex installation asks the user to trust lifecycle hooks. These hooks must be reviewed before approval; do not enable them automatically.
- Performance figures in the README are maintainer-reported benchmarks, not independently validated for ApexOS or our models.
- License: MIT, confirmed from the repository LICENSE file.

**Recommendation:** Do not install alongside Karpathy guidelines as a second always-on policy. Consider its review/audit skill in a later isolated trial, but only after hook and script inspection. For now, translate the non-duplicative YAGNI and risk-aware testing principles into our own rules.

Sources: https://github.com/DietrichGebert/ponytail ; https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md ; https://github.com/DietrichGebert/ponytail/blob/main/LICENSE

### 5. Agent Skills specification — `agentskills/agentskills`

**What it provides:** An open format for packaging skills as a directory containing a required `SKILL.md` plus optional scripts, references and assets. The specification defines YAML frontmatter fields, naming constraints, progressive disclosure and a validation tool.

**Relevant value:** A stable packaging convention for skills authored by us and a way to avoid binding the content itself to one vendor's plugin format.

**Compatibility caveat:** The format is adopted by multiple agent products, but support for optional metadata, allowed-tools, invocation controls, scripts and installation locations differs by host. A valid skill file does not guarantee identical runtime behavior across Claude Code, Codex and Copilot.

**License:** The repository states code is Apache-2.0 and documentation is CC-BY-4.0. We rely on the format/specification, not on copying its documentation into our project.

**Recommendation:** Adopt as our canonical authoring format. Maintain small host adapters and a compatibility test matrix. Validate authored skills with `skills-ref validate` where available.

Sources: https://github.com/agentskills/agentskills ; https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx

### 6. Impeccable — `pbakaus/impeccable`

**What it provides:** A frontend design skill with commands for shaping, critique/audit, polish, layout, typography, motion, accessibility, responsive behavior and design-system documentation. Its README documents installation for Claude Code, Codex CLI and GitHub Copilot, among other hosts.

**Relevant value:** ApexOS is a UI-heavy portfolio OS, so design critique, accessibility and responsive polish can be useful when UI work resumes.

**Risks and fit:**
- It is specialized for frontend/UI work and adds little to backend, orchestration or controller design.
- The installer may write skills and hooks and download/use a self-contained engine binary. Review the installer, hook content, binary provenance and update behavior before running it.
- Manual skill copying skips some hook/subagent functionality; don't assume all adapters are equivalent.
- License: Apache-2.0, confirmed from the repository LICENSE file.

**Recommendation:** Optional project-level skill for frontend tasks only. Defer installation until the ApexOS UI implementation phase and audit the installer/hooks first.

Sources: https://github.com/pbakaus/impeccable ; https://github.com/pbakaus/impeccable/blob/main/plugin/skills/impeccable/SKILL.md ; https://github.com/pbakaus/impeccable/blob/main/LICENSE

## Cross-repository comparison

| Repository | Main value | Portability | Automation surface | License confidence | Decision |
|---|---|---|---|---|---|
| Matt Pocock | SDD-adjacent engineering workflow, TDD, bug diagnosis | Documented Claude/Codex/Copilot paths; verify per skill | Plugins and issue-tracker workflows | High: MIT LICENSE fetched | Selective trial |
| Everything Claude Code | Broad agent toolkit, TypeScript, security, agents | Multi-harness claims; verify component by component | High: hooks, scripts, agents, commands, MCP and state | Medium: MIT stated; verify exact upstream LICENSE before reuse | Reference only |
| Karpathy guidelines | Assumption control, simplicity, surgical edits | Claude-first package; other adapters need verification | Low: mostly instruction files | Low: README says MIT; LICENSE file not found | Adopt ideas, no copy |
| Ponytail | Minimal changes, risk-aware review | Multiple host adapters documented | Medium/high: plugin commands and lifecycle hooks | High: MIT LICENSE fetched | Alternative, not additive |
| Agent Skills | Portable packaging standard | Broad ecosystem, runtime differences remain | Low in the spec itself; skills may include scripts | High: Apache-2.0 code / CC-BY-4.0 docs | Adopt format |
| Impeccable | Frontend design critique and polish | Documented Claude/Codex/Copilot support | Medium: installer, hooks, engine binary | High: Apache-2.0 LICENSE fetched | Optional UI skill |

## Proposed curated catalogue

### Core engineering (candidate set)
- **TDD:** selected from Matt Pocock; Claude implementation guidance, with test seams and acceptance behaviors defined in the approved spec.
- **Bug diagnosis:** selected from Matt Pocock; used when a defect is not yet understood.
- **Minimal-change policy:** original project-authored rules informed by Karpathy/Ponytail principles; not a third-party plugin.
- **Implementation handoff:** use a project-authored task contract and handoff format; do not let implementer self-review satisfy independent review.

### Independent quality assurance
- **Codex independent review:** a separate session, with implementation context limited to the approved spec, diff, tests and relevant architecture. It must report evidence and severity.
- **Automated QA:** deterministic project scripts/CI are the source of truth for pass/fail. Agent claims are not evidence.

### Optional UI
- **Impeccable:** task-triggered only for frontend design work; do not load for backend or orchestration tasks.

### Reference-only
- ECC: mine individual patterns after source/script inspection.
- Ponytail: alternative to the minimal-change policy; don't layer it on top.
- Karpathy repo: reference for behavioral principles; no direct copying pending license verification.
- Matt Pocock's full catalogue: don't install wholesale.

## Security and supply-chain review requirements

Before any third-party skill/plugin/hook is installed:
1. Pin repository commit or release tag; record source URL, version, commit SHA and license.
2. Read the complete `SKILL.md`, every referenced file, every script and every hook.
3. Enumerate commands and permissions; reject implicit network access or broad file-system access unless justified.
4. Inspect dependencies, install scripts, binary downloads, telemetry and update behavior.
5. Run static checks and any upstream-provided tests in an isolated disposable workspace.
6. Confirm it does not request secrets in prompts, logs, source files or telemetry.
7. Test host-specific behavior in a disposable repository for Claude Code, Codex and Copilot.
8. Record accepted capabilities, unsupported features and rollback/uninstall steps.
9. Require owner approval before changing user-level config, installing global plugins, trusting hooks or granting elevated execution.

MCP access is not a skill permission boundary. Skills should not receive broader tools or credentials simply because the agent has MCP servers configured.

## Limitations of this research

- Repository source pages and available README/specification/skill/license files were inspected. Not every file in the six repositories has yet been audited.
- No scripts, hooks, installers, binaries or plugins were executed.
- No performance claim has been independently reproduced.
- ECC's exact upstream LICENSE file could not be retrieved through the available repository reader during this pass; its README says MIT, but exact upstream license verification remains a pre-install gate.
- Karpathy's README says MIT, but no LICENSE file was found at the expected path during this pass; direct redistribution remains blocked pending clarification.
- Compatibility statements are based on repository documentation, not live install tests on the user's machine.

## Decision requested

Approve or amend the curated direction in `SKILL_ARCHITECTURE.md`. Approval of this research does not authorize enabling third-party hooks, running installers, changing global agent settings or granting new permissions.
