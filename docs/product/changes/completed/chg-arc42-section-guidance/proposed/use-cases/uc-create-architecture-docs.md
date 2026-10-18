---
id: UC-CREATE-ARCHITECTURE-DOCS
type: use-case
title: Create Architecture Documentation
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

The maintainer obtains an initial, useful description of the repository's architecture.

## Trigger

The maintainer requests architecture documentation for a repository that lacks it or needs a new baseline.

## Preconditions

The repository has been onboarded and the maintainer can provide context or review proposed documentation.

## Main Flow

1. The maintainer asks for architecture documentation.
2. ArcShape uses available repository context and supported AI-assisted workflows to prepare a proposal.
3. The assistant uses section-specific arc42 knowledge across the architecture-documentation workflow to identify relevant evidence, organize information, and prepare the proposal in the arc42 framework.
4. The assistant identifies evidence gaps or conflicts and asks the maintainer for context when needed, rather than presenting unsupported conclusions as facts.
5. The maintainer reviews the proposal and can identify questions or corrections.

## Alternative Flows

If an approved ProductShape definition is present, the proposal may refer to relevant approved artifacts in `docs/product/model` using PDAC citations. The scope of any additional ProductShape model extension remains open.

## Failure Conditions

Repository evidence is insufficient, conflicting, or unavailable, and the proposal cannot be prepared reliably.

## Postconditions

The maintainer has a reviewable architecture-documentation proposal or an explanation of the unresolved evidence gaps.
