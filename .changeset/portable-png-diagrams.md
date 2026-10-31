---
"@arcshape/cli": minor
---

Add portable lossless PNG previews to native diagram bundles. New authoring guidance uses PNG in Markdown while preserving canonical Archify JSON, vector SVG, fenced Mermaid Markdown and native interactive HTML. PNG generation reuses the packaged browser, bounds raster dimensions and verifies source/content provenance without requiring identical pixels across platforms. Existing SVG-only bundles remain supported and are never migrated implicitly.

To update existing diagrams, refresh ArcShape and its managed instructions with `arcshape agents update`, then give your assistant this prompt:

```text
Use the updated ArcShape diagram guidance. Migrate the selected native diagram bundles to portable PNG images in Markdown, preserving each canonical JSON, vector SVG, fenced Mermaid Markdown companion and the adjacent arcshape-diagram-source comment. Keep other Mermaid and legacy diagrams unchanged. Run arcshape site diagrams and arcshape site diagrams --check; build interactive and self-contained HTML and verify the native presentation is retained. Inspect labels, light-background PNG readability, dimensions and file sizes; show me screenshots and the diff before committing. Do not overwrite edited assets or claim live Azure DevOps validation without testing my target.
```

See the [bundle guide](https://github.com/juangcarmona/arcshape/blob/main/docs/diagrams.md) for compatibility and raster limits.
