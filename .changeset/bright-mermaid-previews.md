---
"@arcshape/cli": minor
---

Make native diagram bundles the default authoring workflow: canonical JSON with generated SVG and fenced Mermaid Markdown alternatives. Markdown displays SVG and interactive publication displays native widgets. Add coordinated generation, freshness/provenance checks and overwrite protection, while retaining existing Mermaid and native document compatibility.

**Upgrading existing diagrams (opt-in)**

Update `@arcshape/cli` using your project's package manager, then run `arcshape agents update` to refresh the installed AI guidance. Existing Mermaid and native diagrams remain supported; updating the package does not migrate authored documentation automatically.

Give your coding assistant this prompt:

```text
Use this project's updated ArcShape instructions to migrate its architecture diagrams to native bundles. First inventory the diagrams and review their meaning against the implementation. For each faithfully representable diagram, create a diagrams/ directory in its owning documentation section with <name>.archify.json as the editable source, <name>.svg as the generated preview, and <name>.md containing a fenced mermaid alternative. Show the SVG in the main Markdown page and add the adjacent arcshape-diagram-source comment so the interactive reader displays the native widget. Preserve labels, relationships, notes and the documentation's language. Keep original Mermaid diagrams whenever conversion would lose meaning, and report those exceptions. Do not overwrite hand-edited assets. Run arcshape site diagrams, arcshape site diagrams --check, and build both interactive and self-contained HTML. Review the SVG, Mermaid alternative and interactive rendering; show me screenshots and the diff before committing. Do not merge or publish without approval.
```

See [the diagram bundle guide](https://github.com/juangcarmona/arcshape/blob/main/docs/diagrams.md) for file references, compatibility and export limits.
