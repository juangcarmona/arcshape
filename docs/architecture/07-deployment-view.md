---
title: Deployment view
arc42-section: "07"
description: Infrastructure and environment mapping for the system.
---

# 7. Deployment view

## Infrastructure overview

ArcShape runs as a local Node.js process in the adopter's repository. The package is prepared for public npm distribution and can be assembled as a tarball. The first registry publication remains pending; later GitHub releases use the reviewed, environment-gated workflow.

Session state is stored locally in `.arcshape/sessions/<session-id>/session.json`. It is not sent to an ArcShape service.

Obsidian sync writes Markdown into the selected local vault and stores its manifest beside those notes. Confluence sync stores page mappings and content hashes in `.arcshape/confluence-sync/`; multi-page mode publishes an index and the twelve arc42 sections plus any explicitly selected Markdown beneath the chosen Confluence Cloud parent page only when run without `--dry-run`.

## Deployment mapping

| Environment               | Artifact                              | Current state                                                                                                                                        |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developer checkout        | Node.js source and Markdown templates | Available                                                                                                                                            |
| Local tarball install     | `arcshape@0.1.0` package              | Packed-package initialization smoke check passed                                                                                                     |
| Local generated reader    | `docs/architecture-site/index.html`   | Optional self-contained local snapshot built from canonical Markdown                                                                                |
| GitHub Pages              | ArcShape engineering portal           | One serialized workflow publishes `/`, `/model/`, `/architecture/`, and the optional allowlisted `/e2e/latest/` summary from `main`                 |
| Cloudflare Pages          | ArcShape public product site          | Source is `src/public-site/`; Git integration, preview URLs, production branch, and custom-domain state require dashboard verification               |
| Obsidian vault            | Markdown notes and sync manifest      | Local filesystem path selected by the maintainer                                                                                                     |
| Confluence Cloud          | Selected parent and child pages       | Updated only by explicit sync; remote edits stop subsequent updates                                                                                  |
| GitHub Actions            | npm release workflow                  | Verifies version and package, then waits for the `npm-publish` environment                                                                           |
| GitHub Actions            | Assurance workflow                    | Runs E2E against a temporary repository, passive DAST against an ephemeral loopback preview, and scheduled/manual mutation analysis; retains reports |
| npm registry              | Published ArcShape package            | Pending issue [#12](https://github.com/juangcarmona/arcshape/issues/12)                                                                              |
| ArcShape-operated service | None                                  | Not part of the architecture                                                                                                                         |

The public product site and engineering portal are independent static publishing surfaces. ArcShape uses its existing `@prodshape/cli` development dependency only to generate a snapshot of ArcShape's own product model; the deployed sites do not depend on each other or on ProductShape's public site.
