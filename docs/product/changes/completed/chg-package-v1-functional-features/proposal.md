# Refinement record

## Scope and evidence

The engineer set this sitting's scope: turn the requested first package version into concrete capabilities and separately define the CLI tool interface and AI workflow interface. The accepted product baseline validates cleanly. Local precedents reviewed:

- Agent Toolkit: canonical Markdown skills and arc42 docs; provider-specific command/skill distribution, with thin commands dispatching to canonical skills.
- Raccord: Markdown arc42 and ADR files, indexed from documentation README files; Mermaid diagram sources alongside architecture docs.
- DomusMind: Markdown arc42 sections and ADRs, with a documentation index that distinguishes product intent, architecture, decisions, and implementation evidence.
- ProductShape recovery workflow: evidence inventory, bounded batches, classification and reconciliation, leads/questions, progress checks, and a resumable report.

## Graph-guided integrity pass

| Changed/proposed node | Neighbour and relationship | Classification | Reason |
| --- | --- | --- | --- |
| FR-ONBOARD-REPOSITORY | UC-ONBOARD-REPOSITORY (`derived-from`), TERM-ARCHITECTURE-DOCUMENTATION (`uses-terms`) | Affected | The npm package installs CLI tools and separately makes Codex and Claude workflow commands and skills available. |
| FR-ASSISTED-WORKFLOWS | UC-CREATE-ARCHITECTURE-DOCS and UC-MAINTAIN-ARCHITECTURE-DOCS (`derived-from`) | Affected | Adds Markdown-based Codex/Claude AI workflows that use CLI tools for deterministic operations. |
| FR-ARC42-DOCUMENTATION | UC-CREATE-ARCHITECTURE-DOCS, UC-MAINTAIN-ARCHITECTURE-DOCS, CON-ARC42-FRAMEWORK | Affected | Markdown is the canonical source for arc42 documentation. |
| FR-READER-VIEW | UC-PUBLISH-ARCHITECTURE-VIEW, UC-READ-ARCHITECTURE | Affected | Static reader view is generated from Markdown. |
| New ADR, C4, reverse-engineering, sync, and command capabilities | Repository Maintainer, AI Assistant, BC-ARCHITECTURE-KNOWLEDGE, architecture terms | Affected | These are explicit first-version outcomes requested by the engineer. |
| BR-PRODUCT-DEFINITION-AUTHORITY | New ADR, C4, and reverse-engineering use cases | Affected | Keeps approved product intent authoritative where generated architecture material refers to it. |
| CON-NO-ARCSHAPE-DATA-COLLECTION | New ADR, C4, reverse-engineering, and documentation-sync use cases | Affected | Carries the accepted no-ArcShape-service data constraint across the new workflows. |
| FR-PRODUCT-DEFINITION-LINKS and UC-LINK-PRODUCT-DEFINITION | Adjacent product-intent connection | Checked and unaffected | Existing capability already states how approved ProductShape artifacts are linked; this change does not redefine citation semantics. |
| Product reader actor, arc42 framework constraint, quality requirement, and architecture vocabulary | Adjacent support nodes | Checked and unaffected | Their accepted meaning remains compatible; no new quality threshold or terminology decision is needed. |

## Recorded decisions

- “Let's start with Codex and claude” — first-version assistant environments are Codex and Claude.
- “Let's focus only on markdown as it's done in the other repos (agnet-toolkit, Raccord, DomusMind)” — Markdown is the canonical authored documentation format.
- “Any, we don't care the language, this is language agnostic” — no implementation-language allowlist; analysis is based on available repository evidence.
- “Yes, all initial scope man, all that is already done, you just have to copy, paste and cook” — all listed capabilities belong in the first package version.
- “Yes, can you guess which commands? invokable by human and by agents” — infer the commands for both interfaces; the later correction establishes that they are separate interfaces.

## Proposed tool and AI workflow interfaces

The engineer corrected the earlier conflation: “No, man, tools are tools and AI commands and skills are for AI... You didn't think too much”. The `change.md` interface section now separates deterministic `arcshape` CLI tools from Codex/Claude AI commands and skills. CLI examples cover `init`, resumable `session` bookkeeping, `validate`, `site build`, and `docs sync`. AI workflow names cover `onboard`, `recover`, `architecture`, `refine`, `adr`, `c4`, and `publish`; provider-appropriate commands dispatch to skills, and skills invoke CLI tools where deterministic operations are needed.

## Remaining questions and exclusions

No unresolved product questions remain from this sitting. Implementation choices such as command parser, diagram syntax, package layout, connector APIs, authentication mechanisms, and rendering technology remain out of scope for this product change.

## Readiness

The first-version capability set and target users are explicit. The overlay is ready for product review; this refinement did not approve or apply it.
