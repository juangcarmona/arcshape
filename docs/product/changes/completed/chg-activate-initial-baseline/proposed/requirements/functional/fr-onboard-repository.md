---
id: FR-ONBOARD-REPOSITORY
type: functional-requirement
title: Onboard a Repository for Architecture Documentation
status: active
derived-from:
  - UC-ONBOARD-REPOSITORY
verification:
  - scenario: A maintainer can make ArcShape available in a repository and reach a documented starting point for architecture work.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must be an npm-installable CLI package that a repository maintainer can install in any repository to establish the product's architecture-documentation workflows. The depth of architecture analysis supported for different repository stacks remains to be decided.

## Rationale

The product is intended to be installable and useful in repositories beyond its own source repository. Supported repository languages and environments remain to be decided.
