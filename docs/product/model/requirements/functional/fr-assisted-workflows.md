---
id: FR-ASSISTED-WORKFLOWS
type: functional-requirement
title: Provide AI-Assisted Architecture Workflows
status: draft
derived-from:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
verification:
  - scenario: A maintainer can invoke an AI-assisted workflow in each assistant environment declared as supported by the product.
  - scenario: The maintainer can inspect proposed architecture-documentation changes before deciding what to accept.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide AI-assisted workflows in Codex and Claude that help a maintainer create and maintain architecture documentation.

## Rationale

The product is intended to make architecture-documentation work available in the maintainer's Codex and Claude workflows. Additional assistant environments may be considered later.
