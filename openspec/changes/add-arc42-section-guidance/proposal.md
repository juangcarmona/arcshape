# Proposal

<!-- pdac-scope: cited -->

## Why

ArcShape's architecture skill has a concise workflow but no section-specific arc42 reference material, so assistants must infer section intent and useful evidence from general instructions. A hierarchical reference library lets the assistant use precise guidance across documentation creation, reverse engineering, and maintenance without loading every section's detail into context.

## What Changes

- Add a complete, section-organized reference catalog of the published arc42 section pages, all 145 practical tips, and all 35 worked examples from a recorded upstream snapshot. Preserve each tip and example's full source text in its own file with source links and attribution, so AI can consult details without relying on lossy summaries. Link illustrations to the upstream source host instead of bundling binary assets.
- Add concise YAML frontmatter to the reference index, all section README files, and every tip and example reference so an assistant can identify its kind, section, source, license, and topics without reading unrelated detail.
- Keep the architecture skill as the short entry point. Its frontmatter and instructions route the assistant from a section `README.md` to only the relevant tip and example documents for the current task.
- Store guidance under numbered, lowercase kebab-case section folders. Each section folder has a main `README.md` and can contain additional focused Markdown documents; installed user-authored additions remain user-owned.
- Make ADR records discoverable through the repository's ADR folder and index. When no repository convention exists, the ADR skill uses `docs/adr/`, `ADR-0001-kebab-case-title.md` names, and ADR frontmatter for ID, title, status, date, and deciders.
- Ship the ADR Markdown template with the packaged ADR capability and instruct the skill to copy it for each new record.
- Extend capability distribution to package, install, update, and uninstall nested skill resources while preserving edited, conflicting, and untracked files.
- Keep this delivery's npm package below 300 files and 800 KB unpacked; enforce the limits in the packed-package smoke test alongside the no-image-binaries rule.
- Include source attribution and CC BY-SA 4.0 licensing information for arc42-derived guidance; retain the upstream license and copyright notice in the reference subtree.

## Capabilities

### New Capabilities

- `arc42-section-guidance`: complete, selectively loaded arc42 source references that support evidence-based creation and maintenance across the full architecture-documentation workflow, while allowing projects to omit, combine, or adapt sections.

### Modified Capabilities

- `agent-capability-distribution`: installable skills include nested reference resources, with the existing ownership, conflict, update, and removal protections applied per file.

## Impact

This implements the applied Product Change `CHG-ARC42-SECTION-GUIDANCE`. The applied Product Change updates these product artifacts:

- `CON-ARC42-FRAMEWORK` — sets all twelve sections as the guidance baseline and permits project-specific document adaptation.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
- `FR-ARC42-DOCUMENTATION` — requires section and subsection guidance across evidence analysis, creation, and maintenance.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
- `FR-ASSISTED-WORKFLOWS` — makes section-specific knowledge part of the complete AI-assisted workflow.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
- `UC-CREATE-ARCHITECTURE-DOCS`, `UC-MAINTAIN-ARCHITECTURE-DOCS`, and `UC-REVERSE-ENGINEER-ARCHITECTURE` — apply that knowledge while gathering evidence and preparing proposals.
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DOCS" digest="sha256:a8d8da1da55a7368620ae2a1229bbc38cc0480e2267dc2916dea4bf6e0995a4c" -->
<!-- pdac:cite id="UC-MAINTAIN-ARCHITECTURE-DOCS" digest="sha256:0a93ce4931da4e6c21bfa56260f79aa86758991e202b0dc8b0f4e05761e5b120" -->
<!-- pdac:cite id="UC-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:3a956a71e74d729d9eaa0b4665e1a72c276f33bb458b51ed5737773f84099b24" -->

The workflow also relies on `FR-REVERSE-ENGINEER-ARCHITECTURE` for bounded, evidence-grounded analysis and `FR-AGENT-CAPABILITY-DISTRIBUTION` plus `UC-MANAGE-AGENT-CAPABILITIES` for packaging and safely managing files in adopter repositories.
<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

Impacted and adjacent artifacts checked include `TERM-ARCHITECTURE-DOCUMENTATION`, `ACT-AI-ASSISTANT`, `ACT-REPOSITORY-MAINTAINER`, `BC-ARCHITECTURE-KNOWLEDGE`, `BR-PRODUCT-DEFINITION-AUTHORITY`, `TERM-APPROVED-PRODUCT-DEFINITION`, `CON-NO-ARCSHAPE-DATA-COLLECTION`, `FR-CLI-COMMANDS`, `FR-PRODUCT-DEFINITION-LINKS`, `FR-ADR-WORKFLOWS`, `UC-CREATE-ADRS`, `UC-CREATE-C4-DIAGRAMS`, `UC-LINK-PRODUCT-DEFINITION`, and `JRN-ESTABLISH-ARCHITECTURE-DOCS`. They remain unchanged because this work adds arc42 guidance and safe distribution of its files; it does not change terminology, product authority, data collection, CLI behavior, ADR/C4 guidance, or the wider journey.

The implementation touches the architecture and ADR skills, their examples, `capabilities/skills/arc-architecture/`, capability installation, and the arc42, ADR, installer, and packed-package tests. The captured upstream source snapshot is the public `arc42/docs.arc42.org-site` repository at commit `3cb35782b62d0cd4103aedcc75fc4ba748f043ad` (2026-10-14): 145 tip pages and 35 worked examples. The site identifies arc42 documentation content as [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); preserve creator and contributor attribution, source links, and the applicable share-alike license for adapted guidance. Keep upstream image URLs in Markdown and leave image binaries out of the install package. For this delivery, treat the 300-file and 800 KB unpacked ceilings as measurable packaging guardrails, not changes to the product's architecture-guidance outcome.

### Definition of Done impact

This change must satisfy the lifecycle's Definition of Done for acceptance criteria, implementation completeness, tests, quality checks, security, architecture/design conformance, documentation, product/spec consistency, evidence, human review, and known limitations. In particular, the reviewed evidence must show all twelve references, safe nested-file lifecycle behavior, current product citations, passing required CI checks, and clear licensing boundaries for arc42-derived content.

### Work-item follow-up

Issue #63's `FR-ARC42-DOCUMENTATION` citation still has the digest from before the applied Product Change. Refresh that citation from the current artifact and transition the issue to `stage:propose` when the plan is published for review.
