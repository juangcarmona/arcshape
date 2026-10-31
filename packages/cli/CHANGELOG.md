# @arcshape/cli

## 0.4.0

### Minor Changes

- 3cf354a: Add portable lossless PNG previews to native diagram bundles. New authoring guidance uses PNG in Markdown while preserving canonical Archify JSON, vector SVG, fenced Mermaid Markdown and native interactive HTML. PNG generation reuses the packaged browser, bounds raster dimensions and verifies source/content provenance without requiring identical pixels across platforms. Existing SVG-only bundles remain supported and are never migrated implicitly.

  To update existing diagrams, refresh ArcShape and its managed instructions with `arcshape agents update`, then give your assistant this prompt:

  ```text
  Use the updated ArcShape diagram guidance. Migrate the selected native diagram bundles to portable PNG images in Markdown, preserving each canonical JSON, vector SVG, fenced Mermaid Markdown companion and the adjacent arcshape-diagram-source comment. Keep other Mermaid and legacy diagrams unchanged. Run arcshape site diagrams and arcshape site diagrams --check; build interactive and self-contained HTML and verify the native presentation is retained. Inspect labels, light-background PNG readability, dimensions and file sizes; show me screenshots and the diff before committing. Do not overwrite edited assets or claim live Azure DevOps validation without testing my target.
  ```

  See the [bundle guide](https://github.com/juangcarmona/arcshape/blob/main/docs/diagrams.md) for compatibility and raster limits.

## 0.3.0

### Minor Changes

- b0e1ddf: Make native diagram bundles the default authoring workflow: canonical JSON with generated SVG and fenced Mermaid Markdown alternatives. Markdown displays SVG and interactive publication displays native widgets. Add coordinated generation, freshness/provenance checks and overwrite protection, while retaining existing Mermaid and native document compatibility.

  **Upgrading existing diagrams (opt-in)**

  Update `@arcshape/cli` using your project's package manager, then run `arcshape agents update` to refresh the installed AI guidance. Existing Mermaid and native diagrams remain supported; updating the package does not migrate authored documentation automatically.

  Give your coding assistant this prompt:

  ```text
  Use this project's updated ArcShape instructions to migrate its architecture diagrams to native bundles. First inventory the diagrams and review their meaning against the implementation. For each faithfully representable diagram, create a diagrams/ directory in its owning documentation section with <name>.archify.json as the editable source, <name>.svg as the generated preview, and <name>.md containing a fenced mermaid alternative. Show the SVG in the main Markdown page and add the adjacent arcshape-diagram-source comment so the interactive reader displays the native widget. Preserve labels, relationships, notes and the documentation's language. Keep original Mermaid diagrams whenever conversion would lose meaning, and report those exceptions. Do not overwrite hand-edited assets. Run arcshape site diagrams, arcshape site diagrams --check, and build both interactive and self-contained HTML. Review the SVG, Mermaid alternative and interactive rendering; show me screenshots and the diff before committing. Do not merge or publish without approval.
  ```

  See [the diagram bundle guide](https://github.com/juangcarmona/arcshape/blob/main/docs/diagrams.md) for file references, compatibility and export limits.

## 0.2.0

### Minor Changes

- 1289709: Add native diagram fences, compact interactive publication and dedicated diagram pages while preserving Mermaid and self-contained snapshots. Ship evidence-grounded authoring and opt-in migration guidance for the supported diagram families.

## 0.1.6

### Patch Changes

- 2bb75cc: Update Puppeteer to remove vulnerable transitive browser dependencies.

## 0.1.5

### Patch Changes

- f6f2262: Widen generated architecture reader content and link the engineering portal brand to the public ArcShape site.

## 0.1.4

### Patch Changes

- 88bc0e8: Render nested supporting architecture documents as collapsible reader navigation with contextual breadcrumbs.

## 0.1.3

### Patch Changes

- 67d8f35: Support canonical one-directory-per-arc42-section architecture documentation, including discoverable supporting Markdown, validation diagnostics, generated reader routes, and the section 09 ADR collection. Consolidate ArcShape's ADR workflow into `arc-adr` and package the canonical skills for dogfooding while preserving legacy flat-layout compatibility.
