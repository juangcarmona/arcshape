# Authoring readable diagrams

Write standard `mermaid` fences with an `accTitle` by default. Mermaid-capable Markdown readers display the authored diagram. ArcShape automatically publishes a native representation wherever faithful conversion is supported: SVG in a self-contained HTML snapshot, or a compact interactive widget with a full-page link in a folder site. Unsupported diagrams remain fully rendered with Mermaid. Generation never rewrites authored Markdown. Use repository evidence for nodes and relationships, and identify assumptions.

## Automatic native conversion coverage

Flowcharts support TB/TD/LR/BT/RL, text rectangles and rounded nodes, decision nodes, directed normal/dashed/thick relationships, labels, cycles and representable subgraph boundaries. Native decisions use a tagged card instead of an exact diamond outline. Styling, click/configuration directives, HTML/Markdown labels, self-loops, boundary endpoints and other shapes remain Mermaid. Quoted two-line labels become a title and detail line. Labels are bounded plain text (up to 90 characters per line for enhancement); conversion is limited to 100 nodes, 200 edges and 20 boundaries. Simple sequences support 2–12 plain participants (including aliases), up to 100 ordered messages, and solid/dashed filled-arrow messages (`->>` / `-->>`). Labels are plain text up to 90 characters. Actors, notes, fragments, activations, boxes, self-calls, numbering, asynchronous/open/cross arrows and creation/destruction remain complete Mermaid diagrams. Participant colors are presentation, not inferred architecture roles. C4-specific DSL and other families remain Mermaid. A family existing in Archify does not imply its Mermaid syntax is convertible.

Use `arcshape site build --diagram-engine mermaid` to explicitly retain Mermaid rendering. Default snapshot builds embed native SVGs; interactive folder builds embed native widgets and provide dedicated pages. Invalid source and renderer errors must be corrected; they are not unsupported-feature fallback.

## Native-only features

Keep one local JSON sidecar and a generated SVG in Markdown, with this adjacent pair:

```markdown
![System context](./diagrams/context.svg)
<!-- arcshape-diagram-source: ./diagrams/context.archify.json -->
```

After editing JSON, run `arcshape site previews` and `arcshape site previews --check`. Builds check freshness and never rewrite source files. Reference paths must stay inside the documentation root; external resources and symlink escape are rejected. Use the adjacent family example as a starting point and replace its fictional Brisa content with evidence. Existing `archify` fences remain supported for compatibility; new native-only diagrams use the readable preview path.

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

Conversion uses the installed parser and layout engine without an LLM call. Inspect the generated native representation as well as the Mermaid source. Keep one editable source; never maintain Mermaid and JSON versions of the same diagram by hand.
