# ArcShape repository

ArcShape's repository separates canonical documentation, implementation, distributable packages, and future site source. The npm workspace root owns repository automation and development dependencies; the public CLI package lives under `packages/cli/`.

## Repository layout

```text
docs/                 Canonical product, architecture, and engineering documentation
e2e/                  Playwright end-to-end journeys
examples/             Workflow and repository fixtures
packages/cli/
  src/bin/             CLI implementation
  src/arc42-site/      Architecture reader implementation
  assets/architecture/ Packaged architecture templates
  assets/capabilities/ Packaged agent capabilities
scripts/              Repository automation and CI helpers
src/public-site/       Reserved source boundary for a future ArcShape-owned static site
tests/                Unit, integration, and package smoke tests
```

`src/public-site/` is intentionally only a documented boundary. It contains no site implementation or deployment configuration. The public site and engineering portal are tracked separately in [issue #62](https://github.com/juangcarmona/arcshape/issues/62).

## Development

Use Node.js 22 or newer and npm:

```sh
npm ci
npm test
npm run test:e2e
```

The publishable `@arcshape/cli` package retains its existing package name, `arcshape` command, version, and CLI behavior. Package metadata and distributable files are in [`packages/cli/`](packages/cli/README.md).
