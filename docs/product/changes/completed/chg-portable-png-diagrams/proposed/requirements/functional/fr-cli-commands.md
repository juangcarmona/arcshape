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
  - UC-CREATE-ARCHITECTURE-DIAGRAMS
  - UC-REVERSE-ENGINEER-ARCHITECTURE
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-SYNC-ARCHITECTURE-DOCS
  - UC-MANAGE-AGENT-CAPABILITIES
verification:
  - scenario: A maintainer can use the CLI to set up a repository, validate Markdown documentation, generate the static site, and connect documentation systems.
  - scenario: Native and Mermaid diagram sources produce deterministic, validated output without an LLM call or changes to authored files.
  - scenario: The packaged CLI can generate both self-contained output and an opt-in interactive folder site without relying on a development checkout or runtime CDN.
  - scenario: An AI workflow can use CLI tools to record and resume repository analysis progress.
  - scenario: A maintainer can use the CLI to detect, select, install, update, and remove ArcShape agent capabilities without invoking AI reasoning inside the CLI.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide deterministic CLI tools for repository onboarding, agent-capability selection and lifecycle management, analysis-session bookkeeping, documentation validation, static site generation, and connections with supported external documentation systems. The CLI may detect local provider signals and install selected packaged instructions, but it does not perform AI reasoning or author architecture documentation. Agent skills may invoke the tools when they need deterministic operations.

Deterministic tooling must validate declared diagram sources and generate their supported representations with actionable diagnostics. The packaged toolchain must include the runtime assets and instructions required by the supported publication modes, without depending on a source checkout or prototype paths. The CLI does not infer missing architecture or rewrite diagram sources during a build. Native diagram bundles are the default tooling contract: explicit commands validate canonical Archify JSON, generate SVG and portable PNG previews and supported faithful Mermaid companions, and check freshness and provenance without an LLM call. Existing SVG-only preview operations remain compatible. Site generation presents the PNG- or SVG-backed native source through the appropriate static or interactive view without modifying committed assets. Existing Mermaid sources remain supported, including bounded Mermaid-to-native conversion and explicit Mermaid-only output. Unsupported features produce precise diagnostics rather than fabricated or lossy companions. Generation protects authored and modified output from silent overwrite.

## Rationale

The CLI owns repeatable repository operations and persisted analysis-session state. AI interpretation and documentation authoring belong to the assistant workflow layer.
