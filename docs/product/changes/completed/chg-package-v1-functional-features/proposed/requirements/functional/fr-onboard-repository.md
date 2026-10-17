---
id: FR-ONBOARD-REPOSITORY
type: functional-requirement
title: Install and Onboard a Repository for Architecture Documentation
status: active
derived-from:
  - UC-ONBOARD-REPOSITORY
verification:
  - scenario: A maintainer can install ArcShape from its npm package in a repository and reach a documented starting point for architecture work.
  - scenario: Onboarding makes the supported Codex and Claude workflow commands and skills available in the repository.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must be distributed as an npm-installable CLI package that a repository maintainer can install in a software repository. Onboarding must establish the repository context and make the supported Codex and Claude AI workflow commands and skills available so the maintainer can create and maintain Markdown architecture documentation. These assistant interfaces are separate from the CLI tools.

## Rationale

ArcShape is intended to be installed and used in repositories beyond its own source repository. Repository setup is the entry point to the product's documentation capabilities.
