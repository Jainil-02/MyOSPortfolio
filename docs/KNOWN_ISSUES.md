# Known Issues and Audit Findings

**Last reviewed:** 18 November 2026  
**Baseline:** `staging` commit `4c2f07f1765013395be01c5d73c50f6d0edf5821`.

This is a source-review register. Items are findings or risks to verify, not proof that an exploit or runtime failure has occurred. Track fixes and evidence in [Task Board](TASK_BOARD.md).

## High priority

### K-01 — Inconsistent or unverified portfolio facts

Several content modules and app views contain differing or apparently sample biography, location, employment, education, certification and achievement details. These claims cannot be treated as verified profile facts from repository source alone.

**Action:** obtain owner approval for the canonical profile dataset; align all apps and remove unapproved claims.

### K-02 — Browser iframe message trust boundary

The Browser app has a `postMessage` handler for messages with a recognized type. The audit did not establish a complete sender-origin/source allowlist in the inspected handler.

**Risk:** messages from untrusted embedded pages may be able to trigger parent-side behavior if the handler does not validate sender identity and payload shape.

**Action:** inspect the complete handler contract, validate `origin`, `source` and schema, and test rejected messages. Do not assume the iframe sandbox alone makes parent message handling safe.

### K-03 — Window manager state invariants

`openWindow` appends a window without checking whether its ID already exists. `listWindows` returns the internal array reference, while its readonly type only constrains TypeScript callers.

**Action:** define duplicate-ID behavior, return defensive snapshots, and test focus/minimize/maximize/close invariants.

## Medium priority

### K-04 — Persisted settings are not fully runtime-validated

Settings loading parses localStorage JSON and merges it with defaults without validating each persisted field against a runtime schema.

**Action:** validate, migrate or safely discard invalid persisted values.

### K-05 — Persisted notifications are not item-validated

Notification loading checks that the parsed value is an array but does not validate each notification object.

**Action:** introduce a notification schema and handle malformed/legacy entries safely.

### K-06 — App registry exposes mutable state

`listApps` returns the underlying registry array under a readonly TypeScript return type. `registerApp` prevents duplicate IDs but does not establish a fully immutable public view or validate the full metadata contract.

**Action:** return defensive snapshots and validate registration.

### K-07 — Command palette empty-result navigation

Arrow-key navigation uses modulo arithmetic based on filtered result count. When there are no results, the calculation can produce an invalid selected index.

**Action:** guard empty results and test ArrowUp/ArrowDown/Enter behavior.

### K-08 — Automated test coverage is limited

The inspected test-file search found the project schema test as the only matching test file. This does not prove there are no other test forms, but core stores and interactions lack visible coverage in the reviewed paths.

**Action:** expand unit/component tests and run the configured quality scripts.

## Low priority / product clarity

### K-09 — Simulated OS data may look real

Files, Terminal, network status, device details and recruiter notification content are simulated. Ensure labels and copy do not mislead visitors into believing these are actual host system capabilities or live events.

### K-10 — Contact submission is simulated

The Contact app waits and displays a success state without a verified message-delivery integration.

**Action:** either connect and test a real submission endpoint or clearly present the form as a demo and avoid claiming successful delivery.

### K-11 — Documentation drift and machine-specific links

Older docs disagree on phase status and contain absolute `file:///c:/Users/...` links. Replace machine-specific links with repository-relative links and keep one authoritative status/task queue.

## Verification status

No local install, runtime session, test, lint, typecheck, production build, browser automation or deployed-site check was executed during this audit. Findings should be confirmed during implementation and QA.
