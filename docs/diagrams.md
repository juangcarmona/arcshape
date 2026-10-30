# Diagrams in architecture documentation

Write standard `mermaid` fences with an `accTitle` by default. Mermaid-capable Markdown readers display the authored diagram. ArcShape automatically publishes a native representation wherever faithful conversion is supported: SVG in a self-contained HTML snapshot, or a compact interactive widget with a full-page link in a folder site. Unsupported diagrams remain fully rendered with Mermaid. Generation never rewrites authored Markdown.

Automatic native conversion coverage includes text rectangle/rounded/decision nodes, directed normal/dashed/thick edges, labels, cycles, TB/TD/LR/BT/RL orientation and representable subgraph boundaries. Native decision nodes use a tagged card rather than an exact diamond. Styling, click/configuration directives, HTML/Markdown labels, self-loops and other shapes/families retain Mermaid. Flowchart conversion is bounded to 100 nodes, 200 edges, 20 boundaries and 90-character plain label lines; quoted two-line labels keep title and detail. Simple sequences support 2–12 plain participants (including aliases), up to 100 ordered messages, and solid/dashed filled-arrow messages (`->>` / `-->>`). Labels are plain text up to 90 characters. Actors, notes, fragments, activations, boxes, self-calls, numbering, asynchronous/open/cross arrows and creation/destruction remain complete Mermaid diagrams. Participant colors are presentation, not inferred architecture roles. Use `--diagram-engine mermaid` to retain Mermaid rendering throughout (the earlier `--archify-deep-dives off` is also accepted). Invalid sources or renderer failures stop the build; valid unsupported syntax uses Mermaid with a located diagnostic.

Existing `archify` JSON fences remain supported. For new native-only diagrams, keep JSON in a local sidecar and show its generated SVG in Markdown:

Automatic conversion applies to top-level Mermaid fences. Diagrams nested inside lists or blockquotes retain Mermaid; fenced Markdown examples remain literal examples.

```markdown
![System context](./diagrams/context.svg)
<!-- arcshape-diagram-source: ./diagrams/context.archify.json -->
```

The image and comment must be adjacent standalone blocks. JSON is the editable source; SVG is generated. Both paths must stay within the documentation root. After editing a sidecar:

```sh
arcshape site previews
arcshape site previews --check
```

The first command explicitly regenerates previews; the second checks freshness. Site builds fail on missing/stale previews and never change authored files. Existing authored SVGs are protected from overwrite. The gallery demonstrates all ten native-only families.

The default command still writes one self-contained HTML file, including static diagram images:

```sh
arcshape site build --out docs/architecture-site/index.html
```

For interactive diagrams, generate a directory:

```sh
arcshape site build --format interactive --out docs/architecture-interactive
```

Serve that directory with any static web server. Diagrams fill the article width in a viewport between 260 and 560 pixels high. Click elements to inspect relationships; use the diagram controls to zoom and drag to pan. Ordinary wheel scrolling moves the document. The link beneath each diagram opens a dedicated page and carries the selected element and appearance. Both runtimes are isolated from the reader's document and storage.

Generated directories are owned outputs. Builds refuse to overwrite arbitrary directories, changed generated files, symlinks or authored documentation. Choose a fresh output directory when preserving a modified export. Publish the entire generated directory; its relative links support hosting under a subpath. Default snapshots still work through `file://` and without network access.

## Asking the assistant

For example: “Create a C4-style container view of this repository as Mermaid. Keep unknown boundaries explicit and show me screenshots before committing.” For a migration: “Review the diagrams in sections 03, 05 and 06; convert those whose meaning and publication targets can be preserved, and leave the rest as Mermaid.”

Native families are architecture (context/container/component), sequence, workflow/activity, lifecycle, dataflow, ERD, class, tree, timeline and waterfall. This is not every Mermaid construct. Keep Mermaid when notation or semantics do not fit. Package and skill updates do not convert existing documents automatically.

Obsidian and Confluence do not acquire a native viewer through this feature. Keep an existing Mermaid diagram if your configured publication workflow cannot preserve a readable native representation. Native conversion is a build-time operation; it does not migrate sources or add image uploads.

## Source limits

The dedicated page exports the sanitized SVG generated at build time. Upstream PNG, video and HTML exports are not exposed; the isolated runtime has no download permission. The SVG does not capture the current selection or theme.

Native sources require a title, use family-specific schema versions and default to Blueprint. ArcShape supplies output paths; `meta.output` is not accepted from authored input. Brand artwork, remote resources, custom translations and repository-evidence access are excluded. Labels are bounded plain text. Invalid input fails the build; it is never silently rendered with another engine. The renderer and system-font styling are packaged locally, with no CDN or build-time LLM.
