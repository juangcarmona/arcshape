# Diagrams in architecture documentation

ArcShape accepts `mermaid` and `archify` fences in the same Markdown document. Existing Mermaid diagrams keep working. Native `archify` fences contain JSON: the diagram type, its schema version, a title and the family-specific elements. The installed architecture skill includes examples for all ten supported families.

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

For example: “Create a C4-style container view of this repository using native diagrams. Keep unknown boundaries explicit and show me screenshots before committing.” For a migration: “Review the diagrams in sections 03, 05 and 06; convert those whose meaning and publication targets can be preserved, and leave the rest as Mermaid.”

Native families are architecture (context/container/component), sequence, workflow/activity, lifecycle, dataflow, ERD, class, tree, timeline and waterfall. This is not every Mermaid construct. Keep Mermaid when notation or semantics do not fit. Package and skill updates do not convert existing documents automatically.

Obsidian and Confluence do not acquire a native viewer through this feature. Keep an existing Mermaid diagram if your configured publication workflow cannot preserve a readable native representation. Automatic conversion and image upload are not included.

## Source limits

The dedicated page exports the sanitized SVG generated at build time. Upstream PNG, video and HTML exports are not exposed; the isolated runtime has no download permission. The SVG does not capture the current selection or theme.

Native sources require a title, use family-specific schema versions and default to Blueprint. ArcShape supplies output paths; `meta.output` is not accepted from authored input. Brand artwork, remote resources, custom translations and repository-evidence access are excluded. Labels are bounded plain text. Invalid input fails the build; it is never silently rendered with Mermaid. The renderer and system-font styling are packaged locally, with no CDN or build-time LLM.
