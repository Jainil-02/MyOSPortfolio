# Architecture and Project Decisions

This file records decisions that affect project direction. Proposed items remain proposals until approved by the project owner.

## D-001 — ApexOS is a browser-based portfolio OS experience

**Status:** Existing product direction  
ApexOS imitates selected desktop/tablet/mobile operating-system patterns in a browser. It does not have privileged access to the visitor's host operating system.

## D-002 — Three presentation shells share one application/runtime

**Status:** Existing implementation direction  
Desktop, tablet and mobile shells are presentation modes over shared application features and core state.

## D-003 — Core state is centralized behind service APIs

**Status:** Existing implementation direction; hardening required  
Runtime, window, settings and notification modules expose state through functions and subscriber APIs. Public APIs should return defensive snapshots and enforce invariants.

## D-004 — Static portfolio content is separate from UI components

**Status:** Existing direction; consistency improvement required  
Content lives under `src/data`. A canonical, owner-approved profile source should be established and reused across About, Resume, Skills, Achievements and Terminal where appropriate.

## D-005 — Simulated OS experiences must be clearly represented

**Status:** Adopted documentation rule  
Files, Terminal and device/network status are simulated unless a real supported integration is explicitly implemented. Contact success must not imply message delivery without a verified backend.

## D-006 — GitHub is the source of truth for reviewed project state

**Status:** Adopted workflow rule  
Use focused branches and pull requests. Keep audit documentation changes separate from application implementation. Do not commit directly to `main` or `staging` for routine work.

## D-007 — Independent review must not self-approve implementation

**Status:** Adopted workflow principle  
The implementation author and reviewer should be separate sessions/agents where practical. Human approval remains required for product decisions and high-impact changes.

## D-008 — Documentation baseline is evidence-based

**Status:** Adopted on 18 November 2026  
Project phase claims and feature completion statements must distinguish source presence from runtime verification. Do not publish progress percentages without a testable denominator and evidence.

## D-009 — Browser iframe content is untrusted

**Status:** Security requirement  
Any message from embedded content that affects the parent app must validate origin, source and payload schema. Sandbox permissions should follow least privilege.

## Pending owner decisions

- Approve the canonical portfolio profile facts and replace unverified/sample claims.
- Decide whether Contact should deliver real messages or remain a clearly labeled demo.
- Approve any change to product scope, design references or Phase 5 AI capabilities.
