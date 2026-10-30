# ArcShape repository

ArcShape's repository separates canonical documentation, implementation, distributable packages, and public-site source. The npm workspace root owns repository automation and development dependencies; the public CLI package lives under `packages/cli/`.

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
src/public-site/       ArcShape-owned public marketing site for Cloudflare Pages
src/engineering-portal/ Engineering portal landing page for GitHub Pages
tests/                Unit, integration, and package smoke tests
```

ArcShape publishes two independent static surfaces. The public marketing site is sourced from `src/public-site/` and hosted separately from GitHub Pages. The engineering portal is generated from the canonical product and architecture sources and published by one GitHub Pages workflow. See the [deployment guide](docs/pages-deployment.md) for routes, provenance, operational boundaries, and recovery.

- Public site: [arcshape.dev](https://arcshape.dev)
- Engineering portal: [GitHub Pages](https://juangcarmona.github.io/arcshape/)

## Development

Author diagrams as native JSON/SVG/Markdown bundles. `arcshape site diagrams` generates the SVG shown in Markdown and a standard fenced Mermaid `.md` alternative; `--check` verifies freshness. Interactive publication shows the native viewer. Existing Mermaid/native documents remain supported. See [diagram authoring and migration](docs/diagrams.md).

Use Node.js 22 or newer and npm:

```sh
npm ci
npm test
npm run test:e2e
```

The publishable `@arcshape/cli` package retains its existing package name, `arcshape` command, version, and CLI behavior. Package metadata and distributable files are in [`packages/cli/`](packages/cli/README.md).
