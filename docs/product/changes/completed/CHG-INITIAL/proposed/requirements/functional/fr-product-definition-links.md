---
id: FR-PRODUCT-DEFINITION-LINKS
type: functional-requirement
title: Link Architecture Documentation to Approved Product Artifacts
status: draft
derived-from:
  - UC-LINK-PRODUCT-DEFINITION
  - BR-PRODUCT-DEFINITION-AUTHORITY
verification:
  - scenario: When an approved ProductShape definition is present, a maintainer can identify relevant approved artifacts from the architecture documentation through resolvable links or citations.
  - scenario: When no approved product definition is present, architecture-documentation workflows remain available without product citations.
uses-terms:
  - TERM-APPROVED-PRODUCT-DEFINITION
---

## Requirement

When an approved ProductShape definition exists, ArcShape must let maintainers connect relevant architecture documentation to approved product artifacts using PDAC citations, without treating delivery plans as product truth.

## Rationale

Product definition and architecture documentation are complementary sources that should remain traceable without being duplicated. Whether the first release also adds architecture-specific capabilities to the ProductShape model remains open. Approved product artifacts in `docs/product/model` remain the product source of truth.
