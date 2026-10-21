# ArcShape

ArcShape is an npm-installable deterministic CLI and a separately managed package of agent skills for creating and maintaining Markdown architecture documentation with [arc42](https://arc42.org/). Its generated reader site is designed for technical and non-technical readers.

Browse the [ArcShape architecture site](https://juangcarmona.github.io/arcshape/).

## Get started

Install ArcShape in a project repository with Node.js 22 or newer and run:

```sh
npm install --save-dev @arcshape/cli
npx arcshape init
```

`arcshape init` creates `docs/architecture/` with a navigation README and twelve `NN-slug/README.md` arc42 sections. Additional Markdown files can live inside their owning section directory and are rendered as supporting material. The legacy flat `NN-slug.md` layout remains readable during migration. Init then offers detected agent providers and capabilities. Choose `--no-agents` for CLI-only setup. On non-interactive shells, state the choice and confirmation explicitly:

```sh
npx arcshape init --providers codex,claude --dry-run
npx arcshape init --providers codex,claude --yes
npx arcshape init --no-agents --yes
```

The default install scope is the current repository. Use `--scope user` to install under your home directory. `--providers` accepts `codex`, `claude`, `cursor`, `windsurf`, `gemini`, `opencode`, and `copilot`; `--capabilities` accepts comma-separated names such as `arc-adr,arc-c4`. Without `--capabilities`, all four skills are selected. Detected providers are suggestions and are never selected silently.

Each canonical `SKILL.md` follows the portable Agent Skills format. The provider-neutral skills live in `.agents/skills/` for Codex, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot. Claude Code uses `.claude/skills/`. `arcshape agents detect` reports strong executable signals from `PATH` and weak provider-specific repository markers; the shared `.agents/skills/` directory is ambiguous and does not identify an agent. Some providers discover both shared and Claude roots, so selecting Claude and a shared-path provider may expose the same skill twice. The Windsurf documentation currently redirects to Devin Desktop documentation; ArcShape uses the documented shared skills path and treats that provider's compatibility as provisional.

Manage capabilities after setup with `arcshape agents detect`, `arcshape agents list`, `arcshape agents install`, `arcshape agents update`, and `arcshape agents uninstall`. `install` adds the selected providers and capabilities to the current managed set; it does not remove earlier selections. `update` refreshes the managed set, and `uninstall` removes all unchanged managed files. For example:

```sh
npx arcshape agents install --providers codex,claude --capabilities arc-adr,arc-c4 --dry-run
npx arcshape agents install --providers codex,claude --capabilities arc-adr,arc-c4 --yes
npx arcshape agents update --yes
npx arcshape agents uninstall --yes
```

ArcShape records owned file hashes in `.arcshape/agent-capabilities.json` (or `~/.arcshape/agent-capabilities.json` for user scope). Updates replace only unchanged files ArcShape manages; uninstall removes only unchanged managed files. Edited and untracked files are preserved and reported, and conflicts produce a non-zero exit status. The exact unchanged assistant files from package version 0.1.1 are offered for removal during a confirmed agent capability operation; edited legacy files remain untouched. Agent capabilities ship with the npm package and install offline. ArcShape does not install marketplace plugins, contact an agent service, or execute capability scripts.

The CLI provides repository setup (`init`), resumable evidence-round bookkeeping (`session`), arc42 Markdown structure, local-link and optional ProductShape citation validation (`validate`), Obsidian and Confluence sync (`sync`), and a self-contained reader site (`site build`). The separately installed skills cover reverse engineering, arc42 authoring, ADRs, C4 diagrams, and documentation connections.

Validate arc42 structure and local links. Add `--citations` to verify ProductShape citations when the repository has a model at `docs/product/model`:

```sh
npx arcshape validate --links --citations
```

Citation validation uses the repository's installed `@prodshape/cli`; install it when a ProductShape model is present. Without a model, citation validation is reported as skipped. Stale citations appear as warnings, while unresolved citations or a missing local CLI fail validation.

Start a local analysis session and ask for its next bounded evidence round:

```sh
npx arcshape session start
npx arcshape session next
```

Copy the canonical Markdown into an Obsidian vault:

```sh
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault --include docs/architecture/09-architecture-decisions --dry-run
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault --include docs/architecture/09-architecture-decisions
```

The sync stores a local manifest beside the exported notes, updates copies only while they still match the last ArcShape version, and reports local edits as conflicts.

To publish architecture as an index with one child page per arc42 section, choose a Confluence parent page and set credentials in environment variables. Preview the page plan first:

```sh
CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=... \
  npx arcshape sync confluence \
  --base-url https://example.atlassian.net/wiki \
  --space-id 12345 --parent-id 123456 --title-prefix MyProject \
  --include docs/architecture/09-architecture-decisions --dry-run
```

Remove `--dry-run` to create or update the pages. ArcShape records a local baseline in `.arcshape/confluence-sync/`; later runs stop on remote edits to managed pages. For a single-page destination, use `--page-id <id>` instead of `--space-id` and `--parent-id`.

The session tool inventories files without selecting by programming language and honors root and nested `.gitignore` rules, including negations. It records the human or AI workflow's classifications and notes; it does not read findings into architecture claims by itself.

## Project foundations

- The approved product definition belongs in `docs/product/model` and is managed with [ProductShape](https://github.com/juangcarmona/productshape).
- Architecture documentation will live under `docs/architecture` and follow [arc42](https://arc42.org/).
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) is used for temporary delivery planning, not as a source of product or architecture truth.
- Read the [engineering lifecycle](docs/engineering-lifecycle.md) for issue readiness, review, and merge expectations.

## Development setup

Requirements: [Node.js](https://nodejs.org/) 22 or newer and [npm](https://www.npmjs.com/).

```sh
npm ci
```

The pinned [ProductShape](https://github.com/juangcarmona/productshape) and [OpenSpec](https://github.com/Fission-AI/OpenSpec) CLIs are installed as local development dependencies. Use `npx prodshape <command>` or the package scripts to run them; global installation is not required.

The tracked Codex, Claude, [ProductShape](https://github.com/juangcarmona/productshape), and [OpenSpec](https://github.com/Fission-AI/OpenSpec) integrations are already present in this development repository. Run these only when intentionally regenerating or refreshing the corresponding integration files:

```sh
npm run product:init
npm run openspec:init
```

The initial quality baseline is defined in the [engineering lifecycle](docs/engineering-lifecycle.md). `npm run build` compiles repository helper scripts; it is not the ArcShape CLI build.

## Contributing

Start with the [contribution guide](CONTRIBUTING.md). For non-trivial work, open or refine a GitHub issue before planning implementation.

Release preparation, the first npm publication, and later trusted publishing are documented in [Releasing ArcShape](docs/releasing.md).

## License

ArcShape is licensed under the [Apache License, Version 2.0](LICENSE), the same license used by [ProductShape](https://github.com/juangcarmona/productshape).
