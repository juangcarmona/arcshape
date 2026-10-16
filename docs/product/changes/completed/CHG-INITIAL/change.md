---
id: CHG-INITIAL
type: product-change
title: Establish ArcShape's initial product definition
status: applied
base-revision: '0000000'
operations:
  add:
    - ACT-REPOSITORY-MAINTAINER
    - ACT-ARCHITECTURE-READER
    - ACT-AI-ASSISTANT
    - BC-ARCHITECTURE-KNOWLEDGE
    - TERM-ARCHITECTURE-DOCUMENTATION
    - TERM-ARCHITECTURE-VIEW
    - TERM-APPROVED-PRODUCT-DEFINITION
    - JRN-ESTABLISH-ARCHITECTURE-DOCS
    - JRN-UNDERSTAND-ARCHITECTURE
    - UC-ONBOARD-REPOSITORY
    - UC-CREATE-ARCHITECTURE-DOCS
    - UC-MAINTAIN-ARCHITECTURE-DOCS
    - UC-PUBLISH-ARCHITECTURE-VIEW
    - UC-READ-ARCHITECTURE
    - UC-LINK-PRODUCT-DEFINITION
    - BR-PRODUCT-DEFINITION-AUTHORITY
    - CON-ARC42-FRAMEWORK
    - CON-NO-ARCSHAPE-DATA-COLLECTION
    - FR-ONBOARD-REPOSITORY
    - FR-ARC42-DOCUMENTATION
    - FR-ASSISTED-WORKFLOWS
    - FR-READER-VIEW
    - FR-PRODUCT-DEFINITION-LINKS
    - QR-READER-COMPREHENSION
  modify: []
  remove: []
---

## Problem

ArcShape has an initial direction but no accepted product definition. The product's target users, outcomes, capabilities, first-release boundary, and quality expectations need a shared, reviewable baseline before implementation is planned.

## Intended Product Outcome

The proposed initial-release scope for human review is an npm-installable CLI that maintainers can install in any repository and use to create and maintain architecture documentation using arc42, with AI-assisted workflows for Codex and Claude, a generated static web view in the repository for technical and non-technical readers, and links or PDAC citations to approved ProductShape artifacts when a product model is present. The repository maintainer chooses where to host the generated site. ArcShape itself does not collect or send user or repository information to an ArcShape-operated service; the product makes no claims about external AI providers' data practices. The supported repository stacks for architecture analysis, whether ArcShape adds architecture-specific capabilities to the ProductShape model, and the reader-comprehension threshold remain explicit open questions rather than implied commitments.

Potential later capabilities include additional assistant environments and architecture-specific extensions to the ProductShape model. Their priority and release boundary have not been decided.

## Rationale

An explicit baseline gives the backlog and implementation a stable account of the product's purpose while preserving open decisions instead of turning assumptions into requirements.

## Affected Product Areas

- Repository onboarding and architecture-documentation workflows.
- AI-assisted creation and maintenance workflows.
- A reader-facing architecture view.
- Discovery and citation of an approved product definition.
- First-release scope, product constraints, and quality expectations.

## Open Questions

- Which repository stacks receive architecture-analysis support first, beyond the commitment that the npm CLI can be installed in any repository?
- Does first-release ProductShape integration discover and cite approved product artifacts only, or also extend the product model with architecture capabilities?
- How should reader comprehension and accessibility be evaluated, and what threshold makes the output acceptable?

## Product Acceptance

A human reviewer confirms that the proposed baseline captures the intended users and outcomes, distinguishes first-release capabilities from later possibilities, answers or explicitly retains the open questions, and is structurally valid under ProductShape.

## Out of Scope

This change defines product intent only. It does not implement the CLI, extract or publish architecture documentation, implement AI workflows, extend ProductShape schemas, or establish technical architecture.
