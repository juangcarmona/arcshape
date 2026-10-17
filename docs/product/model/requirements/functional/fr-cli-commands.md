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
  - UC-MANAGE-AGENT-CAPABILITIES
verification:
  - scenario: A maintainer can use the CLI to set up a repository, validate Markdown documentation, generate the static site, and connect documentation systems.
  - scenario: An AI workflow can use CLI tools to record and resume repository analysis progress.
  - scenario: A maintainer can use the CLI to detect, select, install, update, and remove ArcShape agent capabilities without invoking AI reasoning inside the CLI.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide deterministic CLI tools for repository onboarding, agent-capability selection and lifecycle management, analysis-session bookkeeping, documentation validation, static site generation, and connections with supported external documentation systems. The CLI may detect local provider signals and install selected packaged instructions, but it does not perform AI reasoning or author architecture documentation. Agent skills may invoke the tools when they need deterministic operations.

## Rationale

The CLI owns repeatable repository operations and persisted analysis-session state. AI interpretation and documentation authoring belong to the assistant workflow layer.
