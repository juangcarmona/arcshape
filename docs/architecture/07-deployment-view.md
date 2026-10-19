---
title: Deployment view
arc42-section: "07"
description: Infrastructure and environment mapping for the system.
---

# 7. Deployment view

## Infrastructure overview

ArcShape runs as a local Node.js process in the adopter's repository. The `@arcshape/cli` package is published on npm; version 0.1.0 was the manual first publication and version 0.1.1 was published through the reviewed GitHub Actions workflow with npm provenance. Later releases follow the same environment-gated workflow ([release record](https://github.com/juangcarmona/arcshape/issues/12)).

Session state is stored locally in `.arcshape/sessions/<session-id>/session.json`. It is not sent to an ArcShape service.

Obsidian sync writes Markdown into the selected local vault and stores its manifest beside those notes. Confluence sync stores page mappings and content hashes in `.arcshape/confluence-sync/`; multi-page mode publishes an index and the twelve arc42 sections plus any explicitly selected Markdown beneath the chosen Confluence Cloud parent page only when run without `--dry-run`.

## Deployment mapping

| Environment               | Artifact                              | Current state                                                                                                                                                                            |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developer checkout        | Node.js source and Markdown templates | Available                                                                                                                                                                                |
| Local tarball install     | `@arcshape/cli@0.1.1` package         | Current published package; packed-package initialization smoke check passed                                                                                                              |
| Local generated reader    | `docs/architecture-site/index.html`   | Optional self-contained local snapshot built from canonical Markdown                                                                                                                     |
| GitHub Pages              | ArcShape engineering portal           | One serialized workflow publishes the Astro shell, `/model/`, `/architecture/`, `/diagrams/publication-boundaries.html`, and the optional allowlisted `/e2e/latest/` summary from `main` |
| Cloudflare Pages          | ArcShape public product site          | Astro static output is `src/public-site/dist/`; Git integration, preview URLs, production branch, and custom-domain state require dashboard verification                                 |
| Obsidian vault            | Markdown notes and sync manifest      | Local filesystem path selected by the maintainer                                                                                                                                         |
| Confluence Cloud          | Selected parent and child pages       | Updated only by explicit sync; remote edits stop subsequent updates                                                                                                                      |
| GitHub Actions            | npm release workflow                  | Verifies version and package, then waits for the `npm-publish` environment                                                                                                               |
| GitHub Actions            | Assurance workflow                    | Runs E2E against a temporary repository, passive DAST against an ephemeral loopback preview, and scheduled/manual mutation analysis; retains reports                                     |
| npm registry              | `@arcshape/cli@0.1.1`                 | Published with npm provenance; subsequent releases use the protected `npm-publish` environment ([release record](https://github.com/juangcarmona/arcshape/issues/12))                    |
| ArcShape-operated service | None                                  | Not part of the architecture                                                                                                                                                             |

## Published artifacts and adopter deployment

The source repository publishes separate product, engineering, and package artifacts. The ArcShape-owned public site builds to static files from `src/public-site/`, prepared for Cloudflare Pages Git integration; the live dashboard configuration remains unverified. One Pages workflow builds and validates the complete engineering Astro shell with its generated snapshots and reviewed static Archify artifact on pull requests, then publishes from `main`; Assurance runs contribute only the allowlisted E2E summary. A published GitHub Release triggers the npm workflow, which verifies the package and SBOM before publication through the protected `npm-publish` environment. Adopters install the npm package into their own repository, build a self-contained reader locally, and choose their own hosting. The diagram shows these boundaries; it does not imply that ArcShape operates an adopter's runtime or hosting.

The companion [Archify publication-boundaries diagram](../../src/engineering-portal/public/diagrams/publication-boundaries.html) is a standalone static artifact generated from the reviewed candidate at `.archify/arcshape-publications/arcshape-publication-boundaries.json`.

```mermaid
accTitle: ArcShape site, documentation, and package deployment paths
flowchart TB
    maintainer[Repository maintainer]

    subgraph source[ArcShape source repository]
        product[Public product site source]
        markdown[Architecture Markdown and reader source]
        release[Published GitHub Release]
    end

    subgraph actions[GitHub Actions]
        pages[Pages workflow: assemble portal and snapshots]
        publish[Release workflow: verify package and SBOM]
        approval[Protected npm-publish environment]
    end

    subgraph public[ArcShape public artifacts]
        portal[GitHub Pages engineering portal]
        productsite[Cloudflare Pages product site]
        registry[npm registry: @arcshape/cli]
    end

    subgraph adopter[Adopter-controlled environment]
        project[Adopter repository]
        localcli[Local ArcShape CLI]
        html[Self-contained reader HTML]
        host[Adopter host]
    end

    maintainer -->|changes documentation or source| markdown
    product -->|Git integration builds previews and main| productsite
    markdown -->|pull request validates; main push publishes| pages
    pages --> portal
    maintainer -->|publishes release| release
    release --> publish
    publish --> approval
    approval --> registry
    registry -->|install package| project
    project --> localcli
    localcli -->|arcshape site build| html
    html -->|optional publication| host
```
