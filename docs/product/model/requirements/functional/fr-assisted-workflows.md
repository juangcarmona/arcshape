---
id: FR-ASSISTED-WORKFLOWS
type: functional-requirement
title: Provide AI Commands and Skills for Architecture Documentation Workflows
status: active
derived-from:
  - UC-CREATE-ARCHITECTURE-DOCS
  - UC-MAINTAIN-ARCHITECTURE-DOCS
  - UC-REVERSE-ENGINEER-ARCHITECTURE
  - UC-CREATE-ADRS
  - UC-CREATE-C4-DIAGRAMS
verification:
  - scenario: A maintainer can invoke Codex or Claude skills to create and maintain Markdown architecture documentation, ADRs, and C4 diagrams.
  - scenario: Codex and Claude workflow commands dispatch to skills that reason over repository evidence and invoke CLI tools for deterministic operations.
  - scenario: The maintainer can inspect proposed changes before deciding what to accept.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide Codex and Claude commands and skills that help repository maintainers analyze repository evidence, create and maintain arc42 architecture documentation, ADRs, and C4 diagrams as Markdown, and connect or publish those documents. AI commands dispatch to skills; skills own the AI reasoning, questioning, and authoring workflow and may use the CLI for deterministic operations such as session bookkeeping, validation, generation, and synchronization. AI workflow commands and skills are a distinct interface from the CLI tools. Proposed documentation changes remain reviewable by the maintainer.

## Rationale

Installable skills make ArcShape's documentation workflows available in the maintainer's AI-assisted work without making the assistant itself the authority for accepting documentation changes.
