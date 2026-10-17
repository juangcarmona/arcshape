---
status: Proposed
date: 2026-10-17
deciders:
  - Maintainer
---

# ADR-0001: Use SQLite for local session state

## Context

ArcShape needs local persistence for resumable analysis sessions. The repository evidence shows that the CLI runs locally and current session state is stored under `.arcshape/sessions/`.

## Decision

The decision owner proposes SQLite for the local analysis session store. This proposal remains subject to review.

## Alternatives considered

- **JSON files**: not selected in this proposal because session updates need atomic persistence.
- **Remote database**: not selected in this proposal because the CLI has no service dependency.

## Consequences

- **Positive:** Local sessions can be stored transactionally.
- **Negative:** The package must manage a database file and schema evolution.

## References

- Repository evidence: `.arcshape/sessions/`
