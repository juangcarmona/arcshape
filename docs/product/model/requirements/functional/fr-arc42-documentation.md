---
id: FR-ARC42-DOCUMENTATION
type: functional-requirement
title: Create and Maintain Markdown arc42 Architecture Documentation
status: active
derived-from:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - CON-ARC42-FRAMEWORK
verification:
  - scenario: A maintainer can obtain and review arc42 architecture documentation as Markdown structured according to the product's arc42 expectations.
  - scenario: A maintainer can request an update when repository or product evidence changes and review the proposed Markdown documentation changes.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must help maintainers create and maintain architecture documentation as Markdown for a software repository using the arc42 framework. Markdown files in the repository are the canonical source from which reader-facing views and supported documentation-system connections are generated.

## Rationale

Keeping architecture documentation aligned with a changing system is the central product outcome.
