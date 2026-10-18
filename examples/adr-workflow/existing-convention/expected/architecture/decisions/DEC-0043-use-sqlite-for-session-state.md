---
id: DEC-0043
title: Use SQLite for session state
status: Proposed
date: "2026-10-18"
deciders:
  - Maintainer
---

# DEC-0043: Use SQLite for session state

## Context

The CLI needs atomic, local persistence for analysis sessions. Existing session state lives under `.arcshape/sessions/`.

## Decision

Use SQLite for the local analysis session store.

## Alternatives considered

- **Continue with individual JSON files**: rejected because coordinating atomic updates across files is more complex.
- **Use a remote database**: rejected because the CLI runs locally and should not require a service.

## Consequences

- Session updates can be committed atomically in a local database.
- The application gains a database dependency and must handle schema evolution.
