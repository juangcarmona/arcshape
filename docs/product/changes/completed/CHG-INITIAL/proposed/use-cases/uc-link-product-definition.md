---
id: UC-LINK-PRODUCT-DEFINITION
type: use-case
title: Connect Architecture Documentation to Product Intent
status: draft
primary-actor: ACT-REPOSITORY-MAINTAINER
supporting-actors: []
bounded-context: BC-ARCHITECTURE-KNOWLEDGE
governed-by:
  - BR-PRODUCT-DEFINITION-AUTHORITY
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-APPROVED-PRODUCT-DEFINITION
---

## Goal

The maintainer can relate architecture documentation to approved product intent when a ProductShape definition exists in the repository.

## Trigger

The maintainer works on architecture documentation in a repository that contains an approved ProductShape definition.

## Preconditions

The product definition is available and its approved artifacts can be identified.

## Main Flow

1. ArcShape detects or is directed to the approved product definition.
2. The maintainer identifies product artifacts relevant to architecture documentation.
3. ArcShape provides links or citations that preserve the product artifacts as the authority for product intent.

## Alternative Flows

The product definition may be absent. Adding architecture-specific capabilities to the ProductShape model is an open scope decision.

## Failure Conditions

The product definition cannot be identified or its artifact references cannot be resolved reliably.

## Postconditions

Relevant approved product artifacts can be traced from the architecture documentation, or the maintainer is told why they could not be linked.
