# Diagram bundles

The default is a native bundle in the owning section's `diagrams/` directory:

```text
context.archify.json  # canonical editable source
context.svg           # generated Markdown image
context.md            # generated fenced Mermaid alternative
```

Markdown displays the SVG. The interactive ArcShape reader resolves the adjacent native-source comment and displays one compact native widget with full-page access. Self-contained HTML embeds the native static SVG. The JSON is the source of truth; edit it and regenerate its companions rather than maintaining three independent sources.

```markdown
![System context](./diagrams/context.svg)
<!-- arcshape-diagram-source: ./diagrams/context.archify.json -->
```

```sh
arcshape site diagrams
arcshape site diagrams --check
arcshape site build --format interactive --out docs/architecture-interactive
arcshape site build --out docs/architecture-site/index.html
```

`site previews` remains a compatibility alias. Generation validates native input and Mermaid syntax, then writes SVG and standard Markdown companions with source/content hashes. Checks detect missing, modified or stale assets. Generation refuses authored or modified files; ordinary site builds only verify and never regenerate them. All references remain inside the real documentation root; symlink targets and ambiguous associations are rejected. Generated companion-only Markdown does not create duplicate reader pages. Ordinary authored supporting Markdown still does.

## Mermaid alternatives

A companion is a normal `.md` file containing only one fenced `mermaid` block. Its generated provenance is a Mermaid comment inside that block. Ordered native sequences export as sequence diagrams with notes and solid/dashed messages. Other supported native families export as semantic flowcharts: they retain labeled elements, relationships, boundaries, attributes, cardinalities, states, timing and explanatory notes. This is a portable semantic view, not a promise of identical layout or native effects. Unsupported semantics fail export explicitly; successful syntax parsing alone does not establish semantic equivalence. Review both representations when changing a diagram.

The ten gallery families and the context, container, initialization, reader-build and deployment diagrams each have all three files. The initialization activity view preserves the loop and three exclusive per-file outcomes.

## Existing Mermaid and native sources

Existing Mermaid fences and legacy native fences remain supported. Compatible top-level Mermaid flowcharts and simple sequences still derive native publication input in memory; unsupported constructs stay complete Mermaid. `--diagram-engine mermaid` opts out of that conversion (the earlier `--archify-deep-dives off` is retained as an alias). Package/skill updates and builds never migrate sources automatically. Mermaid-only documents can remain canonical when native conversion cannot preserve their meaning.

The existing conversion subset includes normal/dashed/thick directed relationships, plain rectangle/rounded/decision nodes, cycles, five directions and representable boundaries. Simple sequence conversion covers plain participants and solid/dashed filled-arrow messages, not fragments, notes, activations, creation/destruction or special arrows. The native renderer has broader coverage than this import adapter. Do not infer import/export parity from a family name.

## Publication and safety

Folder output packages the isolated runtime locally, with no backend, runtime CDN or LLM. The diagram fills the article width in a 260–560px viewport; wheel scrolling stays with the document, while deliberate zoom/pan and keyboard selection remain available. Full-page links retain selection and theme. Dedicated artifacts include SVG, native JSON and the available Mermaid Markdown companion.

Generated output ownership prevents overwriting unrelated or modified exports. Native input cannot provide privileged output paths, resource URLs or repository access. Runtime storage/parent access is sandboxed and generated SVG is sanitized. Native diagrams do not add a viewer or automatic image-upload support to Confluence/Obsidian; configured external publication must retain a readable representation before a migration is accepted.
