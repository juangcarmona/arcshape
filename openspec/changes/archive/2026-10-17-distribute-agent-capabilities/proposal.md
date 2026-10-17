# Proposal

<!-- pdac-scope: cited -->

## Why

`arcshape init` currently installs architecture templates and Codex/Claude instructions as one unconditional file copy. This couples the deterministic CLI to two agent layouts, has no provider or capability selection, and leaves later updates and removal without a safe way to distinguish ArcShape-owned files from user edits.

This change implements the accepted Product Change `CHG-AGENT-CAPABILITY-DISTRIBUTION` and keeps agent-facing workflows independent from deterministic CLI operations.

## What Changes

- Package provider-neutral ArcShape skills and their resources separately from provider adapters, at the same version as the npm CLI.
- Add a provider registry for Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot. Each entry records verified project/user paths and local detection signals; unsupported paths and uncertain signals are reported rather than guessed.
- Add `arcshape agents` operations to detect, preview/install, update, list, and uninstall selected capabilities. Extend `arcshape init` to keep architecture setup independent and offer opt-in agent selection.
- Default to repository scope. Use only local executable/configuration signals for detection; do not call agents, access the network, or run installed capability scripts.
- Preview all destinations, existing files, and conflicts before writing. Track ArcShape-managed files and content hashes so updates replace only unchanged managed content and removal deletes only unchanged managed files. Preserve edited or untracked files and report them for manual review.
- Provide an explicit non-interactive provider selection and confirmation path, and a CLI-only onboarding option. Keep Git and marketplaces optional.
- Remove the temporary exemption for the old `codex/...` branch after PR #48 has closed.

## Capabilities

### New Capabilities

- `agent-capability-distribution`: Package, select, detect, install, update, list, and remove ArcShape capabilities through verified provider adapters while preserving user-owned content.

### Modified Capabilities

- None. This implements existing accepted requirements without changing their product behavior.

## Product Definition Impact

The implementation depends on or is governed by these active ProductShape artifacts:

- `FR-AGENT-CAPABILITY-DISTRIBUTION` defines the portable capability package, initial providers, adapters, npm versioning, and compatibility limits.
  <!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
- `FR-ONBOARD-REPOSITORY` defines selection, preview, CLI-only onboarding, explicit non-interactive selection, default project scope, preservation, and offline installation.
  <!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
- `FR-CLI-COMMANDS` keeps detection and lifecycle management deterministic and excludes agent reasoning from the CLI.
  <!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
- `FR-ASSISTED-WORKFLOWS` requires provider-neutral workflows with provider-specific adapters where needed.
  <!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:98014c03adfa2316adefc39599fe80d1fce075121947d88b186d31400cffd64b" -->
- `UC-MANAGE-AGENT-CAPABILITIES` defines evidence-based detection, selection, preview, confirmation, and edit-safe update/removal.
  <!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->
- `UC-ONBOARD-REPOSITORY` defines the onboarding path and the CLI-only alternative.
  <!-- pdac:cite id="UC-ONBOARD-REPOSITORY" digest="sha256:ac5e91032100634e83b8d426343000decfc67811e30c00f6a9838e67305dce01" -->
- `CON-NO-ARCSHAPE-DATA-COLLECTION` constrains provider detection and installation to local operations.
  <!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->
- `BR-PRODUCT-DEFINITION-AUTHORITY` keeps agent workflows from copying or replacing adopting repositories' product intent.
  <!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->

Impact analysis also checked `ACT-REPOSITORY-MAINTAINER`, `ACT-AI-ASSISTANT`, `TERM-ARCHITECTURE-DOCUMENTATION`, `TERM-APPROVED-PRODUCT-DEFINITION`, `TERM-ARCHITECTURE-VIEW`, `BC-ARCHITECTURE-KNOWLEDGE`, `JRN-ESTABLISH-ARCHITECTURE-DOCS`, and adjacent architecture authoring use cases. They remain unchanged because this implementation does not change actor goals, architecture content, or product-definition authoring.

No product-definition drift was found. The governing Product Change is applied and accepted in `main` by PR #48.

## Impact

- `bin/init.mjs`, `bin/arcshape.mjs`, package file inclusion, CLI help, and `README.md`.
- New deterministic provider detection, install planning, manifest, and file-lifecycle modules.
- Existing Codex and Claude workflow templates and tests; new provider layout and package smoke coverage.
- Agent-specific paths and discovery behavior for seven providers; no runtime dependency on network access or marketplace tooling.
