---
id: FR-ONBOARD-REPOSITORY
type: functional-requirement
title: Install and Onboard a Repository for Architecture Documentation
status: active
derived-from:
  - UC-ONBOARD-REPOSITORY
verification:
  - scenario: A maintainer can install ArcShape from its npm package in a repository and reach a documented starting point for architecture work.
  - scenario: Onboarding detects supported agent providers, lets a maintainer choose integrations, and previews files before installing them.
  - scenario: A maintainer can initialize ArcShape's deterministic CLI without installing an agent integration.
  - scenario: Non-interactive onboarding accepts a documented explicit provider selection and works from the installed npm package without network access.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must be distributed as an npm-installable package with separate deterministic CLI tools and agent-facing capabilities. Repository onboarding must establish the repository context, detect supported agent-provider signals, and let the maintainer select providers and capabilities before installation. Detection alone must not write files. When no provider is detected, interactive onboarding asks the maintainer to choose; non-interactive onboarding requires an explicit provider selection. The maintainer can use the deterministic CLI without installing agent capabilities.

Onboarding must preview planned files and conflicts before installation. It must preserve user-edited files during updates and removal and support project-scoped installation by default where the selected provider supports it. Capabilities are bundled at the same version as the npm package and do not require network access or a marketplace to install.

## Rationale

ArcShape is intended to be installed and used in repositories beyond its own source repository. Repository setup is the entry point to the product's documentation capabilities.
