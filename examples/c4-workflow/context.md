# System context example

Evidence: `package.json` exposes the `arcshape` executable as `bin/arcshape.mjs`. `README.md` documents installing the package in a project repository and invoking `npx arcshape init`. The CLI reads and writes files in the selected repository, including `docs/architecture/` and `.arcshape/sessions/`.

External systems are omitted because these interactions require no external service.

```mermaid
C4Context
  accTitle: ArcShape context with its maintainer and project repository
  title ArcShape system context
  Person(maintainer, "Repository maintainer", "Installs and invokes ArcShape")
  System(arcshape, "ArcShape CLI", "Initializes and maintains Markdown architecture docs")
  System_Ext(repository, "Project repository", "Stores source code and architecture Markdown")
  Rel(maintainer, arcshape, "Installs and invokes")
  Rel(arcshape, repository, "Reads evidence and writes documentation")
```
