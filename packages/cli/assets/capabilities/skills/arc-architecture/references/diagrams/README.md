# Authoring native diagrams

Read this guide when creating a diagram or when the maintainer explicitly requests conversion. Keep the only editable diagram source in an `archify` JSON fence in its owning arc42 Markdown document. Use the adjacent family example as a starting point; replace its fictional Brisa content with repository evidence. Do not imply that proposed systems already exist.

| Question | Native family / example |
| --- | --- |
| Context, deployable containers, internal components | [architecture](examples/architecture.json) |
| Ordered messages among participants | [sequence](examples/sequence.json) |
| Activity, decisions and feedback | [workflow](examples/workflow.json) |
| States and transitions | [lifecycle](examples/lifecycle.json) |
| Data transformations and boundaries | [dataflow](examples/dataflow.json) |
| Relational entities and cardinalities | [erd](examples/erd.json) |
| Types and their relationships | [class](examples/class.json) |
| Hierarchical decomposition | [tree](examples/tree.json) |
| Events on a time axis | [timeline](examples/timeline.json) |
| Overlapping timed operations | [waterfall](examples/waterfall.json) |

Preserve the example's family-specific `schema_version`; versions are not interchangeable. Require a concise `meta.title`. Blueprint is the default visual preset. Some families use explicit geometry; inspect label clearance, arrow direction and clipping rather than trusting valid JSON. Exact schemas are distributed in the CLI package's `assets/archify/schemas/` directory.

ArcShape owns output paths: omit `meta.output`. Brand artwork, remote resources, custom translations and repository/source-evidence lookup fields are unsupported. Labels are plain text, not HTML or URLs. Timeline's `meta.evidence` is an observed/illustrative classification, not a file lookup. Builds validate input and fail on errors; correct the source rather than hiding errors with another engine.

## Verify the result

1. Build the default snapshot with `arcshape site build --out <new-file.html>`.
2. Build interactive output with `arcshape site build --format interactive --out <new-directory>`.
3. Inspect both representations. In the interactive reader, check node/relationship selection, ordinary document scrolling, deliberate pan/zoom, the dedicated-page link and theme at desktop and 390px width. Capture actual screenshots before committing visual changes.
4. Review each node and relationship against evidence. Present the source diff, screenshots, unresolved assumptions and any limitations to the maintainer. A successful render does not establish architectural truth.

## Engine choice and migration

Honor explicit engine choices. Use Mermaid for unsupported families, strict notation, or constructs whose meaning cannot be preserved. Examples include pie, mindmap, git graphs, and sequence fragments not represented by the native schema. Native family coverage does not imply complete Mermaid feature coverage.

Updating ArcShape or its skills does not authorize rewriting documents. On an explicit migration request, inspect current diagrams and configured Obsidian/Confluence or other publication targets first. Convert only diagrams whose actors, boundaries, labels, cardinalities, ordering and exceptions can be preserved. If a target cannot receive a demonstrated readable representation, leave the original Mermaid unchanged and report the limitation before conversion. Native interactivity and automatic image upload to those tools are not provided by this release.

There is no automatic universal converter and no second authored Mermaid copy required. The build generates both static and interactive representations from the native fence, without an LLM call.
