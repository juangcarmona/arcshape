---
id: UC-CREATE-C4-DIAGRAMS
type: use-case
title: Create and Maintain C4 Architecture Diagrams
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors:
  - ACT-AI-ASSISTANT
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by: []
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Goal

The maintainer explains the system's structure through C4 diagrams that can be reviewed and maintained with the repository.

## Trigger

The maintainer needs to create or update a C4 view of the system.

## Preconditions

The repository is available to ArcShape and the maintainer can review proposed diagrams.

## Main Flow

1. The maintainer requests a C4 diagram or set of diagrams.
2. ArcShape uses available repository evidence and maintainer context to prepare a proposal.
3. The proposal communicates the requested C4 view of the system.
4. The maintainer reviews and decides what to accept.

## Alternative Flows

When evidence is incomplete, the maintainer supplies context or identifies assumptions that need resolution.

## Failure Conditions

The system elements or relationships needed for the requested view cannot be established reliably.

## Postconditions

The maintainer has a reviewable C4 diagram proposal or a clear account of unresolved evidence gaps.
