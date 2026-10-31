# Authoring diagram bundles

For new diagrams, author one native Archify JSON source in the owning section's `diagrams/` directory. Reference its generated PNG in Markdown and associate the native JSON immediately below it:

```markdown
![System context](./diagrams/context.png)
<!-- arcshape-diagram-source: ./diagrams/context.archify.json -->
```

Run `arcshape site diagrams` to generate the SVG, PNG and a standard `context.md` containing a fenced Mermaid alternative. Run `arcshape site diagrams --check` before publication. JSON is the editable source; SVG, PNG and Mermaid Markdown are derived and protected against silent overwrite. Site builds verify freshness and do not rewrite sources. Source paths stay within the documentation root. Existing `site previews` remains an alias.

Markdown shows the PNG. An interactive folder build replaces that image with the existing compact native viewer and full-page link; a single-file snapshot embeds static SVG. The Mermaid companion is a semantic view, not an identical rendering: sequences preserve ordered messages and notes; other supported families use labeled flowcharts preserving structural facts, properties, timing and annotations. Unsupported exports must be reported rather than fabricated. Inspect meaning as well as syntax.

## Family selection

| Question | Native family / example |
| --- | --- |
| Context, containers, components | [architecture](examples/architecture.json) |
| Ordered messages | [sequence](examples/sequence.json) |
| Activities and decisions | [workflow](examples/workflow.json) |
| States and transitions | [lifecycle](examples/lifecycle.json) |
| Data transformations | [dataflow](examples/dataflow.json) |
| Entities and cardinalities | [erd](examples/erd.json) |
| Types and contracts | [class](examples/class.json) |
| Hierarchy | [tree](examples/tree.json) |
| Events and timing | [timeline](examples/timeline.json), [waterfall](examples/waterfall.json) |

## Review and compatibility

Ground nodes and relationships in repository evidence. Keep uncertainty explicit. Render both publication formats, compare the Mermaid alternative, inspect labels and relationships, exercise selection/zoom/full-page navigation, and capture desktop/mobile plus light/dark screenshots before committing visual changes. A successful render does not prove an architectural claim.

Respect explicit Mermaid choices and retain unsupported semantics in Mermaid. Existing fences and paired JSON/SVG documents remain supported. Package updates never migrate authored documentation. For an explicitly requested migration, inspect configured external publication targets and preserve their readable representation; native interactivity and automatic image uploads are not added to Confluence or Obsidian.
