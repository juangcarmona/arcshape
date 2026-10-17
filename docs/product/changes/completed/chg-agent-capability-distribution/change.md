---
id: CHG-AGENT-CAPABILITY-DISTRIBUTION
type: product-change
title: Separate CLI distribution from provider-specific agent capabilities
status: applied
base-revision: '83d6bb26abd793378b1ac261d9a7037b8d54ca45'
operations:
  add:
    - UC-MANAGE-AGENT-CAPABILITIES
    - FR-AGENT-CAPABILITY-DISTRIBUTION
  modify:
    - ACT-AI-ASSISTANT
    - FR-ASSISTED-WORKFLOWS
    - FR-CLI-COMMANDS
    - FR-ONBOARD-REPOSITORY
    - UC-ONBOARD-REPOSITORY
  remove: []
---

## Problem

ArcShape already distributes deterministic CLI tools and AI workflows from one npm package, but onboarding currently copies its Codex and Claude templates without detecting or asking which agent integrations the maintainer wants. The accepted Product Definition names only Codex and Claude and does not define a provider-neutral capability format, provider-specific adapters, selective installation, or how user edits are handled during updates and removal. This makes the two product interfaces difficult to evolve independently and prevents ArcShape from serving maintainers who use other major agents.

## Intended Product Outcome

ArcShape remains one npm-distributed product with two clearly separated interfaces: a deterministic CLI and agent-facing capabilities. The package includes a provider-neutral set of Agent Skills and provider adapters at the same version as the CLI. The initial supported providers are Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot. The CLI detects available provider signals, lets the maintainer select one or more providers and capabilities, previews changes, and installs only after confirmation. If it finds no provider, it asks interactively; non-interactive use requires an explicit provider selection. Project-scoped files are the default where supported, with other supported scopes selected explicitly. Installation works from the npm package without a marketplace or network access.

Updates and removal preserve user-edited files and report conflicts for review. ArcShape identifies its own capabilities with the `arc-` prefix. Skills and adapters are reviewed as instructions and resources; installation does not execute bundled scripts or silently grant agent permissions.

## Rationale

The CLI owns deterministic operations such as setup, validation, session bookkeeping, generation, and synchronization. Skills own agent-led reasoning, questions, and authoring. Keeping those interfaces distinct lets the CLI remain useful without a particular agent and lets agent support grow without changing the CLI's product boundary.

The maintainer requested support for all major agents, bundled capability and command versions that follow the npm package version, the `arc-` prefix, and optional marketplaces. They also requested provider detection with explicit selection when no usable signal is found, plus a documented selection option for non-interactive use. The maintainer accepted project-scoped installation as the default where supported, with user scope available explicitly. The existing CLI and its skills provide direct implementation evidence for the current coupling: `arcshape init` currently copies architecture and assistant templates together, and those assistant templates target Codex and Claude.

The supported-provider set includes GitHub Copilot based on current official documentation confirming Agent Skills support across its VS Code, CLI, app, and cloud-agent surfaces. Windsurf's current Cascade skills documentation is served under Devin Desktop documentation; it documents `.devin/skills/` as preferred, `.windsurf/skills/` as legacy, and compatibility discovery through `.agents/skills/`. These are provider-specific integration details, not universal conventions.

## Affected Product Areas

- Repository onboarding and agent-provider selection.
- Separation and coordinated distribution of deterministic CLI tools and agent capabilities.
- Compatibility across supported agent environments.
- Safe installation, update, and removal of project agent instructions.
- Trust, offline use, and maintainer control of generated files.

## Open Questions

None identified in this refinement pass. Provider-specific behavior remains subject to verification before each compatibility claim or release.

## Product Acceptance

- The accepted Product Definition distinguishes the deterministic CLI interface from agent-facing skills and provider-specific adapters.
- The initial provider set is Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot; compatibility claims are limited to behavior verified for each provider.
- A maintainer can select providers and capabilities during onboarding, review the planned changes, and install only after confirmation. Detection alone never writes files.
- If no provider can be detected, interactive onboarding asks the maintainer to choose; non-interactive onboarding requires a documented explicit selection.
- Skills and adapters are distributed with the npm package at the same product version and can be installed offline from that package.
- Updates and removal preserve user-edited content and make conflicts reviewable.
- The product does not require an agent marketplace, execute capability scripts during installation, or silently expand agent permissions.

## Out of Scope

- Publishing ArcShape through a required marketplace or agent package manager.
- A hosted ArcShape service or remote collection of repository or agent data.
- Claiming identical commands, rules, permissions, or runtime behavior across providers.
- Implementing the CLI changes in this Product Change; implementation follows product acceptance and remains tracked by issue #47.
