---
id: FR-CLI-COMMANDS
type: functional-requirement
title: Provide Deterministic Architecture Documentation CLI Tools
status: active
derived-from:
  - UC-ONBOARD-REPOSITORY
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - UC-CREATE-ADRS
  - UC-CREATE-C4-DIAGRAMS
  - UC-REVERSE-ENGINEER-ARCHITECTURE
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-SYNC-ARCHITECTURE-DOCS
verification:
  - scenario: A maintainer can use the CLI to set up a repository, validate Markdown documentation, generate the static site, and connect documentation systems.
  - scenario: An AI workflow can use CLI tools to record and resume repository analysis progress.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide deterministic CLI tools for repository onboarding, analysis-session bookkeeping, documentation validation, static site generation, and connections with supported external documentation systems. The CLI tools do not replace the AI workflows that interpret repository evidence and author documentation. Codex and Claude skills may invoke the tools when they need deterministic operations.

## Rationale

The CLI owns repeatable repository operations and persisted analysis-session state. AI interpretation and documentation authoring belong to the assistant workflow layer.
