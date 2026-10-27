---
id: BR-PRODUCT-DEFINITION-AUTHORITY
type: business-rule
title: Preserve Approved Product Definition as the Product-Intent Authority
status: active
applies-to:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - UC-LINK-PRODUCT-DEFINITION
  - UC-CREATE-ADRS
  - UC-CREATE-C4-DIAGRAMS
  - UC-CREATE-ARCHITECTURE-DIAGRAMS
  - UC-REVERSE-ENGINEER-ARCHITECTURE
uses-terms:
  - TERM-APPROVED-PRODUCT-DEFINITION
---

## Rule

When an approved ProductShape definition exists, ArcShape must link or cite its relevant approved artifacts rather than copying or replacing them as a competing source of product truth.

## Rationale

Product intent and architecture documentation answer related but distinct questions. Keeping their sources authoritative prevents drift and duplication.

## Examples

Architecture documentation, ADRs, and C4 diagrams can cite approved product artifacts when they explain product goals or constraints that shape the system.

## Exceptions

None.
