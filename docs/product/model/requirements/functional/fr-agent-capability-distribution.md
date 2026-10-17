---
id: FR-AGENT-CAPABILITY-DISTRIBUTION
type: functional-requirement
title: Distribute Portable Agent Capabilities with Provider Adapters
status: active
derived-from:
  - UC-MANAGE-AGENT-CAPABILITIES
verification:
  - scenario: A maintainer can use ArcShape's provider-neutral skills with each initially supported agent through its documented discovery mechanism.
  - scenario: A provider-specific command or rule is available where needed without changing the canonical skill workflow.
  - scenario: The published npm package contains the selected capabilities and can install them without marketplace access or network access.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must distribute its agent-facing capabilities as a provider-neutral set of skills with provider-specific adapters where an agent requires them. The initial supported providers are Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot. ArcShape must describe the verified capabilities and limits of each provider integration rather than imply identical behavior across agents. Capability files and adapters are versioned and distributed with the ArcShape npm package.

## Rationale

A shared skill format reduces duplicated workflow instructions, while adapters allow ArcShape to follow each provider's discovery and invocation conventions. Bundling the capabilities with the npm package keeps the distribution independent of a marketplace and available offline after package installation.
