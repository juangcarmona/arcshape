---
id: FR-READER-VIEW
type: functional-requirement
title: Generate an arc42 Architecture Web View
status: active
derived-from:
  - UC-PUBLISH-ARCHITECTURE-VIEW
  - UC-READ-ARCHITECTURE
verification:
  - scenario: A maintainer can generate a static web view from available Markdown arc42 architecture documentation in the repository.
  - scenario: A reader can navigate the view to find architecture information relevant to a question.
  - scenario: A maintainer can continue generating a self-contained reader without external runtime resources, including readable static representations of native diagrams.
  - scenario: A maintainer can explicitly generate an interactive folder site with dedicated diagram pages and locally packaged assets.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
  - TERM-ARCHITECTURE-VIEW
---

## Requirement

ArcShape must generate a static web-based view of Markdown arc42 architecture documentation in the repository, intended to be understandable to technical and non-technical readers. Markdown remains the canonical narrative, referring to native bundles whose JSON is the canonical diagram source; existing Mermaid-authored documents remain supported. The repository maintainer chooses where to host the generated view.

The existing self-contained HTML reader remains supported, including local-file use and native static SVGs. Standard Markdown images display bundle PNGs directly in ordinary Markdown readers, including readers without SVG support. Existing SVG-backed documents remain supported. Interactive folder publication resolves their paired native JSON and uses the compact native widget in the same position, with a dedicated page. Existing Mermaid documents retain supported native enhancement and complete Mermaid fallback. Both outputs derive from the same canonical Markdown and diagram sources; generating either output must not modify authored files. The folder site is statically hostable under a maintainer-selected path without a backend, runtime CDN, or ArcShape-operated service. Native diagrams have readable static representations in self-contained output; full interactive behavior is provided by the folder site.

## Rationale

The web view makes the architecture documentation shareable with system stakeholders without requiring ArcShape to host it.
