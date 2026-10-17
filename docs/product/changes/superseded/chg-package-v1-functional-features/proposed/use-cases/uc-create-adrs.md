---
id: UC-CREATE-ADRS
type: use-case
title: Create and Maintain Architecture Decision Records
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors:
  - ACT-AI-ASSISTANT
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by:
  - BR-PRODUCT-DEFINITION-AUTHORITY
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Goal

The maintainer records architecture decisions and keeps their rationale available alongside the system's architecture documentation.

## Trigger

The maintainer needs to record a new architecture decision or revise documentation for an existing decision.

## Preconditions

The repository is available to ArcShape and the maintainer can review proposed decision documentation.

## Main Flow

1. The maintainer requests an ADR to be created or updated.
2. ArcShape uses the supplied decision context and available repository evidence to prepare a proposal.
3. The proposal records the decision and its reasoning in a form that can be maintained with the repository.
4. The maintainer reviews and decides what to accept.

## Alternative Flows

The maintainer may provide decision context directly when repository evidence does not establish the decision or its rationale.

## Failure Conditions

The decision or its rationale is unclear, or available evidence conflicts, and a trustworthy proposal cannot be prepared.

## Postconditions

The maintainer has a reviewable ADR proposal or has identified the missing information needed to prepare one.
