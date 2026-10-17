---
id: UC-SYNC-ARCHITECTURE-DOCS
type: use-case
title: Connect Architecture Documentation to External Documentation Systems
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors: []
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by: []
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Goal

The maintainer can use architecture documentation together with documentation stored in the systems used by the project.

## Trigger

The maintainer wants to locate, reference, or make architecture documentation available through an external documentation system.

## Preconditions

The repository's architecture documentation and the target documentation system are available to the maintainer.

## Main Flow

1. The maintainer identifies an external documentation system used by the project.
2. ArcShape relates repository architecture documentation to the selected system in the supported manner.
3. The maintainer reviews the resulting links or documentation changes.

## Alternative Flows

When the target system is unavailable or not supported, the maintainer can continue to use the repository documentation and generated web view.

## Failure Conditions

The target documentation cannot be located or updated reliably, or the maintainer cannot review the resulting changes.

## Postconditions

The maintainer can trace or access the relevant architecture documentation through the supported connection, or is told what prevented it.
