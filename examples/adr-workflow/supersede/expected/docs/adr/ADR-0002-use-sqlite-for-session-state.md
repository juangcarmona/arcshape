---
status: Proposed
date: 2026-10-17
deciders:
  - Maintainer
---

# ADR-0002: Use SQLite for session state

## Context

The accepted JSON decision is being reconsidered by the decision owner.

## Decision

The decision owner proposes SQLite for local session state. This proposal remains subject to review.

## Alternatives considered

- **Keep JSON files**: remains possible, pending maintainer review.

## Consequences

- **Positive:** Updates can be transactional.
- **Negative:** The project must manage a database file and schema changes.

## Supersedes

- [ADR-0001](../../current/docs/adr/ADR-0001-use-json-for-session-state.md) (proposed relationship; retain the accepted record until this proposal is accepted)
