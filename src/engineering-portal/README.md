# ArcShape engineering portal

The portal is a static Astro shell assembled with Product and Architecture snapshots and the allowlisted E2E summary. GitHub Pages publishes the complete `/arcshape/` artifact from `main`; pull requests build and verify it without deploying.

## Build

From the repository root:

```sh
npm ci --prefix src/engineering-portal
SITE_BASE=/arcshape/ npm --prefix src/engineering-portal run build
node scripts/verify-engineering-shell.mjs src/engineering-portal/dist /arcshape/
```

Astro writes the shell and checked-in static diagram assets to `src/engineering-portal/dist/`. The Pages workflow assembles that output with generated snapshots into `_site/` and validates it using `scripts/verify-engineering-portal.mjs`. Set `SITE_BASE=/` to build the shell at a root path; CI verifies both root and `/arcshape/` builds. Do not copy public-site files into this publication.

The portal routes to `/model/`, `/architecture/`, `/diagrams/publication-boundaries.html`, and the optional public `/e2e/latest/` summary. The raw E2E report and trace files remain private Actions artifacts. The portal is a projection; canonical product and architecture Markdown remain the source of truth.

## Architecture diagrams

Write Mermaid diagrams as fenced `mermaid` blocks in `docs/architecture/`. Each diagram needs an `accTitle:` line; generated output labels the renderer, Markdown source, and exact source revision. The generated inline SVG has an accessible title and description. Build the reader for the Pages subpath with:

```sh
node packages/cli/src/bin/arcshape.mjs site build \
  --out _site/architecture/index.html \
  --title ArcShape \
  --source-ref "$(git rev-parse HEAD)" \
  --site-base /arcshape/
```

Use `--site-base /` for a root-hosted reader. Links from Markdown to published diagram HTML are resolved against this base.

Use Archify only for an authored explanatory diagram that benefits from its interactive standalone viewer. The reviewed candidate is `.archify/arcshape-publications/arcshape-publication-boundaries.json`; its checked-in HTML lives at `public/diagrams/publication-boundaries.html`, and `public/diagrams/manifest.json` pins candidate and artifact SHA-256 hashes, the source revision, and the Archify release commit. Regeneration uses the pinned Archify v3.1.0 CLI and the candidate's recorded revision:

```sh
node /path/to/archify-3.1.0/bin/archify.mjs finalize architecture \
  .archify/arcshape-publications/arcshape-publication-boundaries.json \
  src/engineering-portal/public/diagrams/publication-boundaries.html \
  --repo-root . --quality showcase --json \
  --out-dir docs/delivery/issue-78/archify-regeneration
```

Update the manifest hashes after a reviewed regeneration and retain the finalize/browser evidence under `docs/delivery/issue-78/`. Keep Archify as an authoring-time tool: do not add it to this site's package dependencies or bundle its viewer into the Astro shell. The standalone HTML is self-contained and includes the Archify viewer; its MIT license and third-party notices are published beside it.

Every Archify component has source references verified against its pinned repository revision. Preserve the visible renderer/revision caption and inspect its source panel for links; use non-colour labels, keep the artifact keyboard navigable, and check desktop and narrow viewport rendering before publication.

## Publishing and recovery

The Pages workflow validates pull requests and publishes the complete `_site/` output on `main`. A failed build stops before deployment, leaving the previous deployment available. Fix the source and rerun CI; to roll back a published regression, rerun the workflow from a known-good commit and verify the resulting portal. Remove only the allowlisted E2E summary through the workflow's explicit removal input; never publish raw test artifacts.
