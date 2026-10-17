# System context example

Evidence: `package.json` exposes the `arcshape` executable as `bin/arcshape.mjs`. `README.md` documents installing the package in a project repository and invoking `npx arcshape init`. The CLI reads and writes files in the selected repository, including `docs/architecture/` and `.arcshape/sessions/`. `bin/confluence.mjs` implements explicit publication of selected Markdown to Confluence Cloud.

Publication is always explicit and uses a maintainer-selected destination.

```mermaid
C4Context
  accTitle: ArcShape context including optional Confluence publication
  title ArcShape system context
  Person(maintainer, "Repository maintainer", "Installs and invokes ArcShape")
  System(arcshape, "ArcShape CLI", "Initializes and maintains Markdown architecture docs")
  System_Ext(repository, "Project repository", "Stores source code and architecture Markdown")
  System_Ext(confluence, "Confluence Cloud", "Optional publication destination")
  Rel(maintainer, arcshape, "Installs and invokes")
  Rel(arcshape, repository, "Reads evidence and writes documentation")
  Rel(arcshape, confluence, "Publishes selected pages on explicit request")
```
