# Container view example

Evidence: `packages/cli/package.json` maps the `arcshape` command to `src/bin/arcshape.mjs`. `packages/cli/src/bin/arcshape.mjs` dispatches deterministic commands to the CLI modules under `packages/cli/src/bin/`. `packages/cli/assets/capabilities/skills/` contains provider-neutral skills installed into supported agent discovery locations. `README.md` describes the maintainer invoking an assistant skill separately from a deterministic CLI command.

The assistant runtime is external; ArcShape does not host an AI service.

```mermaid
C4Container
  accTitle: ArcShape containers inside a project repository
  title ArcShape container view
  Person(maintainer, "Repository maintainer", "Uses CLI and an assistant")
  System_Ext(assistant, "Codex or Claude", "Runs installed skills with repository context")
  System_Boundary(repository, "Project repository") {
    Container(cli, "ArcShape CLI", "Node.js package", "Initializes, validates, and synchronizes Markdown docs")
    Container(skills, "ArcShape skills", "Markdown files", "Guide AI-assisted analysis and documentation")
    ContainerDb(markdown, "Architecture documentation", "Markdown", "Stores canonical arc42 docs and ADRs")
  }
  Rel(maintainer, cli, "Runs deterministic commands")
  Rel(maintainer, assistant, "Requests documentation work")
  Rel(assistant, skills, "Follows installed workflow")
  Rel(assistant, markdown, "Proposes reviewed Markdown changes")
  Rel(cli, markdown, "Reads and writes")
```
