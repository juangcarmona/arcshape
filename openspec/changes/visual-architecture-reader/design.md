<!-- pdac-scope: cited -->

# Design

## Context

`docs/architecture` is the canonical Markdown source. The reader generator loads its README and twelve arc42 sections, extracts fenced Mermaid blocks, renders them at build time through the pinned Mermaid CLI and Puppeteer, sanitizes SVG, then embeds the SVG in a self-contained HTML reader. The generated reader has responsive diagram styling and section routes. The existing context, building-block, and runtime views demonstrate C4 and sequence diagrams in sections 03, 05, and 06.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->

`arcshape validate` checks the arc42 document structure and optional links/citations; it does not parse Mermaid. `arcshape site build` is the actual diagram validation path: it rejects a missing `accTitle`, then Mermaid CLI parsing/rendering fails the build for invalid syntax, before the generated HTML is written. The Pages workflow builds the reader for pull requests and publishes the generated output from `main`.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->

The product model already describes Markdown arc42 authoring, C4 diagram workflows, a generated reader, and reader comprehension. The existing `arc42-section-guidance` capability covers the twelve arc42 sections. This change is documentation and test coverage for behavior already present, so it introduces no product requirement and uses `skip_specs: true`.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->

## Goals / Non-Goals

**Goals:**

- Show a deployment view authored in the section it explains and published through the existing pipeline.
- Lock the Markdown-to-SVG-to-reader path with browser-visible end-to-end coverage.
- Keep generation local, deterministic, self-contained, and within the current security and design conventions.

**Non-Goals:**

- Add a diagram editor, diagram runtime, CLI command, or new rendering dependency.
- Adopt a second source of truth for diagrams or architecture data.
- Add interactive Archify output to the current reader.
- Change the ProductShape model or existing OpenSpec capabilities.

## Decisions

### Keep Mermaid as the canonical diagram source

Add the section 07 view as a fenced Mermaid block in its Markdown file. Existing sections 03, 05, and 06 remain examples of context, building-block, and runtime views; together with section 07 they demonstrate the arc42 use cases without introducing separate image assets or export steps.

**Alternatives considered:** linked PNG/SVG exports duplicate the source and can drift; remote rendering services such as Kroki add a network or service dependency to authoring/publication; PlantUML or a Structurizr workspace would add a second DSL and build toolchain. Structurizr can export Mermaid or static HTML, but does not simplify the initial slice because the repository already has Mermaid in Markdown and a static reader pipeline.

### Treat `site build` as the diagram validation and publication gate

Keep validation at the point where it is already enforced: the same command used by the Pages pull-request build checks accessible titles, parses and renders diagrams, sanitizes SVG, and writes the HTML. Add E2E assertions against the generated section rather than expanding `arcshape validate`; changing that command would be new CLI behavior and is not needed to demonstrate the current publication path.

Mermaid’s official usage guidance documents `mermaid.parse` for syntax-only validation and a `strict` security mode that encodes HTML and disables click behavior. ArcShape already uses the local Mermaid CLI with strict security settings and sanitizes the resulting SVG, so no browser-side Mermaid JavaScript or external request is needed.

**Alternatives considered:** a separate syntax-only validator duplicates the build renderer’s parsing path and could diverge; browser-side rendering weakens deterministic static generation and introduces runtime assets.

### Defer Archify to a separate decision

Archify’s current typed JSON pipeline emits interactive standalone HTML, so static hosting does not require a runtime backend. However, its documented Mermaid input is an authoring dialect rather than automatic Mermaid parsing; using it would require a separate JSON source or a maintained conversion layer. Embedding script-driven HTML should be isolated in a sandboxed iframe and reviewed for network/resource behavior. Its standalone output can also be published as a separate page, but that still creates parallel architecture content and navigation/maintenance work. Do not include it in the first slice.

**Alternatives considered:** embed standalone HTML in an iframe, deploy a separate linked HTML page, or generate an Archify JSON file from Markdown. Each needs an additional artifact/transform and security or maintenance ownership that the static Mermaid slice does not need.

Research references: [Mermaid usage and security](https://mermaid.js.org/config/usage.html), [Archify README](https://github.com/tt-a1i/archify/blob/main/README_EN.md), [Archify authoring skill](https://github.com/tt-a1i/archify/blob/main/archify/SKILL.md), [Kroki documentation](https://docs.kroki.io/), [Structurizr export](https://docs.structurizr.com/export), and [Structurizr static site generation](https://docs.structurizr.com/static/generating).

## Risks / Trade-offs

- **A diagram can be valid but factually wrong** → Build it only from current checked-in deployment/release evidence and keep the labels scoped to ArcShape’s actual deployment contexts.
- **A rendered diagram may not be accessible or usable on narrow screens** → Give it an `accTitle`; test the published section and assert the generated SVG is inside the existing responsive diagram container.
- **Existing release facts in section 07 are stale** → Reconcile them against `package.json`, the release workflow, and repository release evidence while editing the section. Section 11 has a related issue and remains a separate follow-up.
- **Archify changes rapidly and generated HTML is active content** → Keep it outside this scope; any later trial should pin a version, inspect its output/resource policy, and use isolation if embedded.

## Migration Plan

No migration or rollback mechanism is needed. The change updates authored documentation and E2E coverage; reverting the commit restores the prior example and test.
