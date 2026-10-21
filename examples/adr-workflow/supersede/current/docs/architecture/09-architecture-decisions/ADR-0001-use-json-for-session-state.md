---
id: ADR-0001
title: Use JSON files for session state
status: Accepted
date: "2026-01-10"
deciders:
  - Maintainer
---

# ADR-0001: Use JSON files for session state

## Context

The CLI needs to persist local sessions.

## Decision

Use JSON files for local session state.

## Alternatives considered

- **Remote database**: rejected because the CLI is local-first.

## Consequences

- State is easy to inspect and edit.

## References

- None.
