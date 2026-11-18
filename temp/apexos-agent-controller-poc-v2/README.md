# OMA POC v2: Controller Baseline Comparison

## Overview

Proof-of-concept comparing two implementations of an agent invocation workflow:
- **Minimal Custom TypeScript Controller:** Direct `child_process.spawn` with explicit state management
- **OMA @open-multi-agent/core 1.24.0:** OMA's documented process backend

## Purpose

This POC was designed to comparatively evaluate OMA as a framework candidate against a minimal custom controller for the ApexOS engineering workflow. The test matrix covers 15+ dimensions including process reliability, timeout/cancellation, durable approvals, restart recovery, Windows CLI integration, and GitHub permission boundaries.

**NOTICE:** Test results must not be generated or claimed until an independent review of the source is completed. Do not execute `npm test` or `vitest run` until the source has been verified.

## Directory Structure

```
apexos-agent-controller-poc-v2/
├── package.json          # Dependencies: @open-multi-agent/core@1.24.0, vitest, tsx, typescript
├── tsconfig.json         # TypeScript configuration, ES2022, commonjs
├── vitest.config.ts      # Vitest configuration, node environment
├── README.md             # This file
├── TEST_PLAN.md          # Test plan with coverage mapping
├── TEST_RESULTS.json     # Schema for machine-readable results (populated after execution)
├── src/
│   ├── custom-baseline.ts    # CustomProcessRunner implementation
│   ├── oma-adapter.ts        # OmaProcessRunner implementation
│   └── types.ts              # Shared type definitions
└── test/
    ├── custom-baseline.test.ts    # Test suite for custom baseline
    └── oma-adapter.test.ts        # Test suite for OMA adapter
```

## Key Differences from v1

1. **Proper Vitest project** — `npm test` runs a real test suite, not a standalone script
2. **Equivalent test scenarios** — both implementations run the exact same assertions
3. **No simulated capabilities** — no fabricated JSON; actual process execution and verification
4. **Proper process termination** — verified via process IDs, not assumption
5. **Secret redaction verification** — actual assertions that secrets are removed, not present
6. **Durable approval mechanism** — real approval flow, not hash-comparison-only stubs
7. **Git worktree isolation** — actual Git worktrees, not ordinary directory comparisons
8. **Windows CLI integration** — test for Claude Code and Codex CLI availability
9. **Machine-readable results** — `TEST_RESULTS.json` with schema validation

## Safety Constraints

- Tests run in a disposable workspace only
- No modifications to ApexOS repository, MCP settings, or global agent configurations
- No installation of CLIs in the POC environment (CLI integration tested on target Windows workstation)
- All secrets redacted from persisted state and execution evidence