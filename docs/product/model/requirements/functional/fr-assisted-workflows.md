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
  - UC-CREATE-ARCHITECTURE-DIAGRAMS
verification:
  - scenario: A maintainer can invoke ArcShape skills through Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, or GitHub Copilot to create and maintain Markdown architecture documentation, ADRs, and C4 diagrams.
  - scenario: A maintainer can request a native or Mermaid diagram, inspect validated source and rendered evidence, and accept or reject the proposed change.
  - scenario: A maintainer can request migration of selected diagrams without implicitly converting every diagram in the repository.
  - scenario: Provider-specific commands or rules dispatch to the shared skill workflow where the provider requires an adapter.
  - scenario: The maintainer can inspect proposed changes before deciding what to accept.
  - scenario: The architecture-documentation workflow uses section-specific arc42 knowledge to support the complete evidence-analysis, creation, and maintenance outcome.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must provide provider-neutral Agent Skills for repository maintainers to analyze repository evidence, create and maintain arc42 architecture documentation, ADRs, and C4 diagrams as Markdown, and connect or publish those documents. The initial supported providers are Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot. Provider-specific commands, rules, or other adapters may expose the shared workflows according to each provider's verified conventions. Skills own the AI reasoning, questioning, and authoring workflow and may use the CLI for deterministic operations such as session bookkeeping, validation, generation, and synchronization. Agent capabilities are distinct from the CLI tools, and proposed documentation changes remain reviewable by the maintainer.

For architecture-documentation work, the skills must be supported by section-specific arc42 knowledge across the full documentation workflow. That knowledge helps the assistant interpret evidence and prepare or maintain documentation; the product outcome is not limited to isolated section-by-section requests.

Diagram skills must cover structural and behavioral diagrams in addition to C4. They select a supported family and engine from evidence and maintainer intent, author standard Mermaid in Markdown by default, invoke deterministic validation and rendering, inspect the result, and present source changes with visual evidence for review. The workflow retains Mermaid as the rendered diagram in the main documentation and links compatible Archify deep dives on separate pages. It respects explicit engine choices and retains unsupported semantics in Mermaid. Native-only diagrams use a local JSON sidecar with a generated SVG preview, so the Markdown reader sees a diagram rather than JSON. Existing native fences remain supported; their migration requires an explicit request. If visual inspection is unavailable, the assistant reports that gap rather than claiming the rendered result has been reviewed. These instructions ship through the existing provider-neutral capability distribution; package installation or update must not migrate authored documentation.

## Rationale

Installable skills make ArcShape's documentation workflows available in the maintainer's AI-assisted work without making the assistant itself the authority for accepting documentation changes. Section-specific arc42 knowledge helps the assistant achieve the broader architecture-documentation outcome while preserving a shared workflow across supported providers.
