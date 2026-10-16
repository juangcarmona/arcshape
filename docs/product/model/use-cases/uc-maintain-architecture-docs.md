---
id: UC-MAINTAIN-ARCHITECTURE-DOCS
type: use-case
title: Maintain Architecture Documentation
status: active
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors:
  - ACT-AI-ASSISTANT
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by:
  - BR-PRODUCT-DEFINITION-AUTHORITY
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-APPROVED-PRODUCT-DEFINITION
---

## Goal

The maintainer keeps architecture documentation useful as the repository and its product evolve.

## Trigger

The maintainer identifies a repository or product change that may affect architecture documentation.

## Preconditions

Architecture documentation exists and the maintainer can review the relevant repository context.

## Main Flow

1. The maintainer requests an architecture-documentation update.
2. ArcShape uses available repository context and supported AI-assisted workflows to identify relevant documentation changes.
3. ArcShape presents a proposal that preserves the arc42 structure.
4. The maintainer reviews the proposal and decides what to accept.

## Alternative Flows

When product intent is relevant and an approved ProductShape definition is present, the workflow may cite applicable approved artifacts in `docs/product/model` using PDAC citations. The scope of any additional ProductShape model extension remains open.

## Failure Conditions

Evidence is insufficient or inconsistent to determine a trustworthy update.

## Postconditions

The maintainer has reviewed proposed documentation changes or has identified unresolved questions that prevent a trustworthy update.
