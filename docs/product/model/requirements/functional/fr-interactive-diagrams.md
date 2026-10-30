---
id: FR-INTERACTIVE-DIAGRAMS
type: functional-requirement
title: Explore Architecture Diagrams with Compatible Source Formats
status: active
derived-from:
  - UC-CREATE-ARCHITECTURE-DIAGRAMS
  - UC-CREATE-C4-DIAGRAMS
  - UC-READ-ARCHITECTURE
  - UC-PUBLISH-ARCHITECTURE-VIEW
verification:
  - scenario: A reader selects supported elements and relationships within a compact embedded diagram and opens a dedicated page with the current selection.
  - scenario: A reader uses keyboard controls and deliberate zoom or pan when a diagram exceeds the readable viewport, while normal document scrolling remains available.
  - scenario: A maintainer publishes a page containing both default native diagram bundles and existing Mermaid diagrams without rewriting sources during site generation.
  - scenario: A Markdown reader sees the generated SVG, an ArcShape folder-site reader sees the paired native widget, and a supported Mermaid companion preserves diagram meaning.
  - scenario: A missing, stale, modified or semantically unsupported generated representation is reported before it is treated as a synchronized bundle.
  - scenario: A maintainer sees actionable diagnostics for invalid declared sources rather than an unexplained renderer substitution.
  - scenario: A maintainer reviews an opt-in conversion that preserves diagram meaning and leaves unsupported Mermaid diagrams unchanged.
  - scenario: A reader can inspect a readable static representation when interactive scripting is unavailable.
  - scenario: Hostile diagram labels, links or interaction data cannot read or modify the parent document or its storage, or navigate it without a reader action.
  - scenario: A migrated diagram remains readable through the maintainer's existing supported documentation connections; when that cannot be provided, the original diagram is retained and the limitation is reported before conversion.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

The default diagram-authoring workflow must create a native diagram bundle under the owning documentation's diagrams directory. A bundle has one canonical editable Archify JSON source, a generated SVG displayed through a standard Markdown image, and a generated Mermaid companion for supported faithful exports. SVG and Mermaid companions are derived representations, not independently editable architecture authorities. The supported export matrix must distinguish unavailable translations from successful ones and must not silently discard semantic content.

In Markdown, the document displays the SVG without requiring Mermaid support. In an interactive ArcShape folder site, the builder resolves the paired native source and displays one compact native viewer at the same location, using available width and bounded responsive height without an extra explanatory card or nested document scrollbar. One unobtrusive link opens a dedicated page with selection and theme preserved. The viewer supports keyboard interaction and deliberate zoom/pan; light/dark and narrow screens remain usable. Self-contained HTML embeds the native static SVG without external runtime dependencies.

Native authoring must cover C4-style context, container and component views, sequence diagrams and activity flows, with additional families and limitations documented. Native appearance need not reproduce exact C4 notation but must preserve abstraction levels and architectural meaning. The default bundle workflow applies across these families, rather than only to examples or native-only exceptions.

Explicit generation tooling must render SVG and export supported Mermaid companions from the declared canonical source, validate generated output and detect stale or missing companions. It must record enough provenance to detect divergence, protect authored or modified files from silent overwrite, and report unsupported exports precisely. A syntactically valid Mermaid file is not by itself proof of semantic equivalence. Ordinary site generation verifies bundle integrity without changing authored or committed diagram assets.

Existing Mermaid fences, Mermaid-authored documents, legacy native fences and paired JSON/SVG documents remain supported. Mermaid remains an explicit authoring or publication choice and the fallback when required semantics have no native representation. A migration requires a maintainer request and reviewable source/rendered evidence; it must preserve elements, relationships, ordering, conditions and boundaries. Existing canonical Mermaid may remain the source for an unconvertible diagram; generated SVGs can still provide portable Markdown images. Unsupported conversion must not produce fake native JSON, incomplete Mermaid or a misleading success report.

Native bundle paths and paired references must remain inside the documentation root, without external-resource references. Package or skill installation and ordinary site builds must not migrate or rewrite authored diagrams. The assistant proposes diagram bundles and migration edits for human review; generated rich views, SVGs and supported Mermaid exports all derive from the declared canonical source.

Generated output must include a readable static representation for use without interactive scripting. Generated diagram content must not execute arbitrary author-supplied code in the documentation page, navigate the parent page without a reader action, or require an ArcShape-operated service or runtime CDN. Interactive diagram code must not directly read or modify the parent document or its storage; integration with the documentation page is restricted to the explicitly supported diagram presentation and reader actions.

Existing supported external documentation connections must retain a readable representation after migration; native interactivity is not required on those targets. If ArcShape cannot provide that representation for the maintainer's configured targets, migration must retain the original diagram and report the limitation before conversion. A warning alone is not a substitute for preserving previously usable documentation.

## Rationale

Readers need to inspect relationships without leaving the architectural explanation. Maintainers need a gradual path from existing diagrams to richer views without duplicating sources or losing meaning.
