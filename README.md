# ArcShape

ArcShape is an npm-installable CLI and a set of AI workflows for creating and maintaining Markdown architecture documentation with [arc42](https://arc42.org/). Its generated reader site is designed for technical and non-technical readers.

Browse the [ArcShape architecture site](https://juangcarmona.github.io/arcshape/).

## Get started

After the first npm release, install ArcShape in a project repository with Node.js 22 or newer and run:

```sh
npm install --save-dev @arcshape/cli
npx arcshape init
```

This creates `docs/architecture/` with a README and the twelve arc42 sections, and installs ArcShape skills for Codex and Claude under `.agents/skills/` and `.claude/skills/`, plus Claude slash commands under `.claude/commands/arcshape/`. In Codex, invoke a skill with its `$arcshape-*` name. Initialization is repeatable and never overwrites different existing files. Use `npx arcshape init --dry-run` to preview the files, or `npx arcshape init --target ../my-project` to select a repository directory.

The CLI provides repository setup (`init`), resumable evidence-round bookkeeping (`session`), arc42 Markdown structure, local-link and optional ProductShape citation validation (`validate`), Obsidian and Confluence sync (`sync`), and a self-contained reader site (`site build`). Codex and Claude skills cover reverse engineering, arc42 authoring, ADRs, C4 diagrams, and documentation connections; Claude also receives matching slash commands.

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
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault --include docs/adr --dry-run
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault --include docs/adr
```

The sync stores a local manifest beside the exported notes, updates copies only while they still match the last ArcShape version, and reports local edits as conflicts.

To publish architecture as an index with one child page per arc42 section, choose a Confluence parent page and set credentials in environment variables. Preview the page plan first:

```sh
CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=... \
  npx arcshape sync confluence \
  --base-url https://example.atlassian.net/wiki \
  --space-id 12345 --parent-id 123456 --title-prefix MyProject \
  --include docs/adr --dry-run
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
