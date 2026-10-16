# ArcShape

ArcShape aims to help teams create and maintain useful architecture documentation with arc42, AI-assisted workflows, and an approachable web view for technical and non-technical readers.

This repository is in its foundation stage. The product definition and engineering process are being established before the CLI and publishing experience are implemented.

## Project foundations

- The approved product definition belongs in `docs/product/model` and is managed with ProductShape.
- Architecture documentation will live under `docs/architecture` and follow arc42.
- OpenSpec is used for temporary delivery planning, not as a source of product or architecture truth.
- Read the [engineering lifecycle](docs/engineering-lifecycle.md) for issue readiness, review, and merge expectations.

## Development setup

Requirements: Node.js 22 or newer and npm.

```sh
npm ci
```

The pinned ProductShape and OpenSpec CLIs are installed as local development dependencies. Use `npx prodshape <command>` or the package scripts to run them; global installation is not required.

The tracked Codex, Claude, ProductShape, and OpenSpec integrations are already present in a fresh checkout. Run these only when intentionally regenerating or refreshing the corresponding integration files:

```sh
npm run product:init
npm run openspec:init
```

There is no application test, lint, build, or CI command configured yet. The initial quality baseline is defined in the [engineering lifecycle](docs/engineering-lifecycle.md) and will be implemented as follow-up work.

## Contributing

Start with the [contribution guide](CONTRIBUTING.md). For non-trivial work, open or refine a GitHub issue before planning implementation.

## License

ArcShape is licensed under the [Apache License, Version 2.0](LICENSE), the same license used by ProductShape.
