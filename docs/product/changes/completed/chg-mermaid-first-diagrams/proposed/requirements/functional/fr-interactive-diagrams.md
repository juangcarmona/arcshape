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
  - scenario: A maintainer publishes a page containing both native and existing Mermaid diagrams without rewriting the Mermaid source.
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

ArcShape must provide an interactive architecture-diagram experience for its generated folder site. The diagram occupies the available content width with a bounded responsive height, without an extra explanatory card or nested document scrollbar. A single unobtrusive link opens its dedicated page, retaining the selected element or relationship where one exists. The embedded experience supports meaningful selection, accessible keyboard interaction, and deliberate zoom or pan for large diagrams. Light and dark presentation and narrow screens remain usable.

Native authoring must cover C4-style context, container and component views, sequence diagrams, and activity flows. The supported family and feature matrix must identify additional coverage and limitations. A native appearance need not reproduce C4's exact visual notation, but must preserve its abstraction levels and architectural meaning.

Standard Mermaid fences are the default authoring format so repository documentation remains readable in Mermaid-capable Markdown viewers. A documented, bounded subset is enhanced automatically with native interaction during generation; valid unsupported constructs render through Mermaid without losing meaning. Classification applies to the entire diagram and preserves labels, directions, ordering and boundaries. Explicit Mermaid rendering remains available. Malformed input or conversion/rendering failures are errors, not permission for silent fallback. Existing native fences remain supported.

Each diagram has one canonical editable source: normally a Mermaid fence in Markdown, or a local native JSON sidecar referenced beside its generated SVG preview in Markdown for native-only features. A sidecar and its generated preview are not two editable sources. Explicit tooling generates previews and detects missing or stale previews; ordinary site generation does not modify authored files. Native sidecars are confined to the documentation root and cannot reference external resources. Interactive pages, embedded views and static representations are generated from that source. Migration requires an explicit maintainer request and a reviewable proposal; it must preserve elements, relationships, ordering, conditions and meaning. Unconvertible diagrams stay Mermaid. An ArcShape upgrade alone must not rewrite authored diagrams.

Readers can inspect the original Mermaid source through a discreet disclosure in generated output without displaying duplicate diagrams or raw JSON by default.

Generated output must include a readable static representation for use without interactive scripting. Generated diagram content must not execute arbitrary author-supplied code in the documentation page, navigate the parent page without a reader action, or require an ArcShape-operated service or runtime CDN. Interactive diagram code must not directly read or modify the parent document or its storage; integration with the documentation page is restricted to the explicitly supported diagram presentation and reader actions.

Existing supported external documentation connections must retain a readable representation after migration; native interactivity is not required on those targets. If ArcShape cannot provide that representation for the maintainer's configured targets, migration must retain the original diagram and report the limitation before conversion. A warning alone is not a substitute for preserving previously usable documentation.

## Rationale

Readers need to inspect relationships without leaving the architectural explanation. Maintainers need a gradual path from existing diagrams to richer views without duplicating sources or losing meaning.
