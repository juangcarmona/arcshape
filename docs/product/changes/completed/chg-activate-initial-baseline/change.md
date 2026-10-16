---
id: CHG-ACTIVATE-INITIAL-BASELINE
type: product-change
title: 'Activate the accepted initial ProductShape baseline'
status: applied
base-revision: '3053550e9ff0c9a66e0929e2db9b01b2f2207937'
operations:
  add: []
  modify:
    - ACT-AI-ASSISTANT
    - ACT-ARCHITECTURE-READER
    - ACT-REPOSITORY-MAINTAINER
    - BR-PRODUCT-DEFINITION-AUTHORITY
    - BC-ARCHITECTURE-KNOWLEDGE
    - CON-ARC42-FRAMEWORK
    - CON-NO-ARCSHAPE-DATA-COLLECTION
    - FR-ARC42-DOCUMENTATION
    - FR-ASSISTED-WORKFLOWS
    - FR-ONBOARD-REPOSITORY
    - FR-PRODUCT-DEFINITION-LINKS
    - FR-READER-VIEW
    - JRN-ESTABLISH-ARCHITECTURE-DOCS
    - JRN-UNDERSTAND-ARCHITECTURE
    - QR-READER-COMPREHENSION
    - TERM-APPROVED-PRODUCT-DEFINITION
    - TERM-ARCHITECTURE-DOCUMENTATION
    - TERM-ARCHITECTURE-VIEW
    - UC-CREATE-ARCHITECTURE-DOCS
    - UC-LINK-PRODUCT-DEFINITION
    - UC-MAINTAIN-ARCHITECTURE-DOCS
    - UC-ONBOARD-REPOSITORY
    - UC-PUBLISH-ARCHITECTURE-VIEW
    - UC-READ-ARCHITECTURE
  remove: []
---

## Problem

The accepted initial Product Definition contains 24 artifacts that were approved by the product owner but remain marked `draft`. ProductShape's greenfield definition process requires approved artifacts to enter the canonical model as `active`. This status mismatch weakens trust in the model and its use as the source for PDAC citations.

## Intended Product Outcome

The same approved product intent remains in the canonical model, and all 24 artifacts from `CHG-INITIAL` have `status: active`. No requirement, relationship, or open product decision changes.

## Rationale

The initial baseline was approved and merged, but its artifact lifecycle state did not reflect that approval. Correcting the state makes the source of product truth unambiguous before downstream work cites it.

## Affected Product Areas

The complete initial product baseline: actors, business rule, bounded context, terms, journeys, constraints, functional and quality requirements, and use cases.

## Open Questions

None. The three product-scope questions recorded in `CHG-INITIAL` remain open and are not resolved by this status-only change.

## Product Acceptance

The product owner has approved the initial baseline; every proposed artifact is unchanged except that its status is `active`; the Product Change and resulting model validate; and the accepted model exposes all 24 artifacts as active for inspection and citation.

## Out of Scope

This change does not alter product meaning, resolve the deferred scope questions, add or remove artifacts, or implement runtime behavior. It records the approved artifact lifecycle state only.
