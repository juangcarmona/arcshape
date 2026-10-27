<!-- pdac-scope: cited -->

# Proposal

## Why

ArcShape already authors Mermaid beside arc42 Markdown and publishes sanitized, responsive diagrams in its generated reader, but the public documentation does not yet demonstrate the full authoring-to-publication path consistently. A focused deployment-view example and end-to-end regression coverage will make that existing capability easy to see and keep reliable without introducing a second diagram source.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->

## What Changes

- Add an evidence-backed Mermaid deployment view to arc42 section 07, authored in the Markdown that the reader publishes. Reconcile stale deployment facts in that section against current repository and release evidence as part of the same edit.
- Extend the browser end-to-end coverage to build the reader from Markdown and verify the section route, accessible diagram name, generated inline SVG, and responsive rendering.
- Document that `arcshape site build` is the diagram syntax/accessibility validation gate used by the Pages pull request build. `arcshape validate` remains the structural Markdown validator.
- Record an Archify integration assessment for a possible separate interactive view. Keep it out of this first slice: Archify can emit standalone HTML, but its Mermaid input is prompt-guided authoring rather than a parser, so reusing the Markdown diagram would require a second architecture definition or a new conversion path.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This proposal changes an example and regression coverage for existing behavior; it adds no product requirement. The OpenSpec change opts out of specs with `skip_specs: true`.

## Impact

- Source example: `docs/architecture/07-deployment-view.md`.
- Reader regression coverage: `e2e/onboarding-reader.playwright.mjs` (or the existing focused reader E2E test selected during implementation).
- Existing pipeline only: Mermaid CLI, Puppeteer, SVG sanitization, standalone HTML generation, and GitHub Pages build/deploy workflow. No dependency or public CLI change is proposed.
- Product artifacts considered: `FR-ARC42-DOCUMENTATION`, `FR-READER-VIEW`, `FR-C4-DIAGRAM-WORKFLOWS`, `QR-READER-COMPREHENSION`, and `CON-ARC42-FRAMEWORK`.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:91f111b3ea40541300039f0b7843433864fd6d6cd379616e415990cfd66c6077" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->

Checked and excluded neighbors: `FR-CLI-COMMANDS` is not changed because site generation already renders and rejects invalid Mermaid; `CON-NO-ARCSHAPE-DATA-COLLECTION` is not changed because no rendering service or data transmission is introduced; `BR-PRODUCT-DEFINITION-AUTHORITY` remains authoritative and no product model text changes. The existing `arc42-section-guidance` spec already covers section 07 documentation, and its requirements do not change.

Product documentation drift found during review: section 07 still describes package version 0.1.0 and initial npm publication as pending, while the current package and release evidence show a later publication. Reconcile section 07 as stated above. Section 11 contains a related stale release statement; leave it for a separately scoped documentation correction.

Archify is technically capable of producing self-contained interactive HTML, which can be hosted as a static file. It still requires a distinct typed JSON architecture source, and embedding its script-driven viewer would need an isolated-frame security review. Archify’s MIT license and rapidly changing schema/viewer add dependency and upgrade work. Defer an Archify spike until ArcShape has a concrete need for an interactive view that cannot be met by the canonical Mermaid source.
