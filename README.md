# ArcShape

ArcShape is an npm-installable CLI and a set of AI workflows for creating and maintaining Markdown architecture documentation with [arc42](https://arc42.org/). Its generated reader site is designed for technical and non-technical readers.

## Get started

After the first npm release, install ArcShape in a project repository with Node.js 22 or newer and run:

```sh
npm install --save-dev arcshape
npx arcshape init
```

This creates `docs/architecture/` with a README and the twelve arc42 sections, and installs ArcShape skills and slash commands for Codex and Claude under `.agents/` and `.claude/`. Initialization is repeatable and never overwrites different existing files. Use `npx arcshape init --dry-run` to preview the files, or `npx arcshape init --target ../my-project` to select a repository directory.

The CLI provides repository setup (`init`), resumable evidence-round bookkeeping (`session`), arc42 Markdown structure validation (`validate`), Obsidian and Confluence sync (`sync`), and a self-contained reader site (`site build`). Codex and Claude workflows cover reverse engineering, arc42 authoring, ADRs, C4 diagrams, and documentation connections. Cross-document link validation remains tracked in the [v1 feature epic](https://github.com/juangcarmona/arcshape/issues/25).

Start a local analysis session and ask for its next bounded evidence round:

```sh
npx arcshape session start
npx arcshape session next
```

Copy the canonical Markdown into an Obsidian vault:

```sh
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault --dry-run
npx arcshape sync obsidian --vault ~/Documents/ObsidianVault
```

The sync stores a local manifest beside the exported notes, updates copies only while they still match the last ArcShape version, and reports local edits as conflicts.

To sync to an existing, blank Confluence page, set credentials in environment variables and preview the Markdown conversion first:

```sh
CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=... \
  npx arcshape sync confluence \
  --base-url https://example.atlassian.net/wiki --page-id 123456 --dry-run
```

Remove `--dry-run` to publish. On the first sync the page must be blank. Later runs stop if someone edited the page since ArcShape last synchronized it.

The session tool inventories files without selecting by programming language. It records the human or AI workflow's classifications and notes; it does not read findings into architecture claims by itself.

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

## License

ArcShape is licensed under the [Apache License, Version 2.0](LICENSE), the same license used by [ProductShape](https://github.com/juangcarmona/productshape).
