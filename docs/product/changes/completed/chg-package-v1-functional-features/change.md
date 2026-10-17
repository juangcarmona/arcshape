---
id: CHG-PACKAGE-V1-FUNCTIONAL-FEATURES
type: product-change
title: Define the first package version's user-facing capabilities
status: applied
base-revision: 'a6ce1875c212756cfa15c2df48814605488fcded'
operations:
  add:
    - UC-CREATE-ADRS
    - UC-CREATE-C4-DIAGRAMS
    - UC-REVERSE-ENGINEER-ARCHITECTURE
    - UC-SYNC-ARCHITECTURE-DOCS
    - FR-ADR-WORKFLOWS
    - FR-C4-DIAGRAM-WORKFLOWS
    - FR-REVERSE-ENGINEER-ARCHITECTURE
    - FR-EXTERNAL-DOCS-INTEGRATIONS
    - FR-CLI-COMMANDS
  modify:
    - FR-ONBOARD-REPOSITORY
    - FR-ASSISTED-WORKFLOWS
    - FR-READER-VIEW
    - FR-ARC42-DOCUMENTATION
    - BR-PRODUCT-DEFINITION-AUTHORITY
    - CON-NO-ARCSHAPE-DATA-COLLECTION
  remove: []
---

## Problem

The Product Definition captures the broad intent to provide an npm-installable CLI, AI-assisted architecture documentation, and a static reader view. It does not define the user-facing capabilities that make the first package useful in an existing repository: guided repository setup, dedicated ADR and C4 workflows, evidence-based reverse engineering and refinement, or links to documentation systems such as Confluence and Obsidian. The supported first-release scope and boundaries of those capabilities are also unclear.

## Intended Product Outcome

ArcShape is a CLI distributed as an npm package and installed into a software repository. Markdown is the canonical format for architecture documentation, ADRs, and C4 diagrams. The product is language-agnostic: repository analysis derives architecture understanding from available evidence rather than requiring support to be declared per programming language. It provides deterministic CLI tools for repository setup, analysis-session bookkeeping, validation, site generation, and documentation connections. Separately, it provides Codex and Claude skills and AI-facing workflow commands for repository analysis, arc42 authoring and refinement, ADRs, C4 diagrams, publishing, and documentation connections. The AI workflows reason over repository evidence and use CLI tools for deterministic operations; the two interfaces are distinct. Proposed changes remain reviewable by the maintainer.

## Rationale

The product needs to be useful as an installable tool in repositories beyond its own source repository. The first package version includes the full requested capability set. The user confirmed Markdown-only documentation, Codex and Claude support, language-agnostic repository analysis, and the complete initial scope. The user later clarified the interface boundary: “No, man, tools are tools and AI commands and skills are for AI... You didn't think too much”. This change therefore distinguishes deterministic CLI tools from AI-facing commands and skills rather than making one command surface serve both roles.

## Affected Product Areas

- Repository onboarding and availability of assistant workflows.
- Deterministic CLI tools for setup, analysis-session state, validation, site generation, and documentation connections.
- Codex and Claude commands and skills for AI-led analysis, authoring, refinement, and review workflows.
- Creation and maintenance of arc42 documentation, ADRs, and C4 diagrams.
- Language-agnostic, evidence-tracked repository analysis rounds, documentation refinement, and maintainer review.
- Generation of a static reader-facing web view.
- Markdown connections to Confluence and Obsidian.

## Open Questions

None.

## Product Acceptance

- The accepted definition distinguishes deterministic CLI tools from Codex and Claude workflow commands and skills; AI workflows use CLI tools without conflating the interfaces.
- Markdown is the canonical documentation format; arc42 documentation, ADRs, and C4 diagrams are all in scope for the first package version.
- Repository analysis is language-agnostic and proceeds in evidence-tracked rounds that surface gaps and conflicts for maintainer review.
- The product generates a static arc42 web view and connects repository Markdown documentation with both Confluence and Obsidian.

## Proposed interfaces

The CLI exposes deterministic tools. Names below describe the likely CLI shape and do not perform AI reasoning or author documentation autonomously.

| CLI tool | Purpose |
| --- | --- |
| `arcshape init` | Install/configure ArcShape's Markdown structure and Codex/Claude integration in a repository. |
| `arcshape session start|status|next|mark|unmark|evidence|lead|question|check|report` | Create and maintain bounded analysis-session state, source coverage, findings, leads, questions, and resumable progress. |
| `arcshape validate` | Check documentation structure, links, and supported diagram syntax. |
| `arcshape site build` | Generate the static arc42 reader-facing web view from Markdown. |
| `arcshape docs sync --target confluence|obsidian` | Perform explicit documentation import/export or synchronization to a selected system. |

Codex and Claude have separate AI-facing commands and skills. Commands stay thin and dispatch to canonical Markdown skills, following the adjacent repos' pattern. Skills perform evidence analysis and authoring; they invoke the CLI tools for deterministic setup, progress tracking, validation, generation, and synchronization.

| AI workflow command / skill | Purpose |
| --- | --- |
| `onboard` | Guide repository setup and call `arcshape init`. |
| `recover` | Analyze an unfamiliar repository in evidence-tracked rounds, using session tools to record coverage and questions. |
| `architecture` | Create or maintain the twelve-section arc42 Markdown documentation. |
| `refine` | Review and improve existing architecture documentation against current repository evidence. |
| `adr` | Create or update Markdown architecture decision records from supplied decisions and evidence. |
| `c4` | Create or update C4 diagram source and explanatory Markdown from repository evidence. |
| `publish` | Prepare a reader-facing site or a reviewed documentation-system publication, calling build/sync tools. |

These are distinct interfaces: `arcshape ...` names CLI tools; AI workflow names are projected as provider-appropriate commands and skills for Codex and Claude. Exact provider command syntax follows each assistant's installation conventions.

## Out of Scope

- Package architecture, storage formats beyond Markdown as the canonical source, diagram/rendering technologies, and connector APIs.
- Hosting the generated web view as a service.
- Implementation plans, delivery sequencing, release status, and verification evidence.
- Treating AI-generated content as accepted without maintainer review.
