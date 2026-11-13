# Contributing to ArcShape

Thank you for helping build ArcShape. The project is in its foundation stage: its product definition, architecture, CLI, and human-readable documentation experience are being shaped together.

## Before starting

- For non-trivial work, start with a GitHub issue. Use the general-work or bug form where applicable; blank issues are welcome as intake and can be refined with a maintainer.
- Describe the intended outcome, scope, and acceptance criteria before designing the solution.
- Keep approved product intent in `docs/product/model`; use [ProductShape](https://github.com/juangcarmona/productshape)/PDAC citations when delivery artifacts rely on it.
- Keep architecture decisions and [arc42](https://arc42.org/) documentation under `docs/architecture` as that documentation is established. [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes are temporary delivery slices, not canonical product or architecture sources.

## Development environment

Requirements: [Node.js](https://nodejs.org/) 22 or newer and [npm](https://www.npmjs.com/).

```sh
npm ci
```

[ProductShape](https://github.com/juangcarmona/productshape) and [OpenSpec](https://github.com/Fission-AI/OpenSpec) are installed locally from the pinned package dependencies. Use `npx prodshape <command>` or the npm scripts. The tracked Codex, Claude, [ProductShape](https://github.com/juangcarmona/productshape), and [OpenSpec](https://github.com/Fission-AI/OpenSpec) files are already present after checkout; run `npm run product:init` or `npm run openspec:init` only when intentionally regenerating or refreshing those integrations.

## Making a change

1. Use an issue-linked branch named `<type>/<issue-number>-<short-slug>` from the latest `origin/main`.
2. Keep the pull request focused, link the issue, and include `Closes #<number>` in its body when the merge should close that issue.
3. Update product or architecture documentation when intent, behavior, or design changes.
4. Regenerate provider-owned skills through their owning CLI. Refresh [OpenSpec](https://github.com/Fission-AI/OpenSpec) integrations with `npm run openspec:init` rather than editing generated files by hand.
5. Run `npm run verify` and the affected browser checks. The workflows under `.github/workflows/` define CI; report the commands and results actually observed.
6. Request human review before merging. Record known limitations and unresolved risks.

## Commits

Use concise Conventional Commit messages, for example `docs: establish contribution guidance` or `feat(cli): scaffold architecture documentation`.

## License

By contributing, you agree that your contributions are licensed under the project's [Apache-2.0 license](LICENSE).
