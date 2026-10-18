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

| Environment               | Artifact                              | Current state                                                                                                                                        |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developer checkout        | Node.js source and Markdown templates | Available                                                                                                                                            |
| Local tarball install     | `@arcshape/cli@0.1.1` package         | Current published package; packed-package initialization smoke check passed                                                                         |
| Generated reader site     | `docs/architecture-site/index.html`   | Self-contained snapshot built from canonical Markdown                                                                                                |
| GitHub Pages              | Public ArcShape architecture reader   | Deployed from `main` after a workflow build; adopters choose their own host                                                                          |
| Obsidian vault            | Markdown notes and sync manifest      | Local filesystem path selected by the maintainer                                                                                                     |
| Confluence Cloud          | Selected parent and child pages       | Updated only by explicit sync; remote edits stop subsequent updates                                                                                  |
| GitHub Actions            | npm release workflow                  | Verifies version and package, then waits for the `npm-publish` environment                                                                           |
| GitHub Actions            | Assurance workflow                    | Runs E2E against a temporary repository, passive DAST against an ephemeral loopback preview, and scheduled/manual mutation analysis; retains reports |
| npm registry              | `@arcshape/cli@0.1.1`                 | Published with npm provenance; subsequent releases use the protected `npm-publish` environment ([release record](https://github.com/juangcarmona/arcshape/issues/12)) |
| ArcShape-operated service | None                                  | Not part of the architecture                                                                                                                         |

## Published artifacts and adopter deployment

The source repository publishes two different artifacts. The Pages workflow builds the architecture reader on pull requests and deploys it to GitHub Pages from `main`. A published GitHub Release triggers the npm workflow, which verifies the package and SBOM before publication through the protected `npm-publish` environment. Adopters install the npm package into their own repository, build a self-contained reader locally, and choose their own hosting. The diagram shows these boundaries; it does not imply that ArcShape operates an adopter's runtime or hosting.

```mermaid
accTitle: ArcShape documentation and package deployment paths
flowchart LR
    maintainer[Repository maintainer]

    subgraph source[ArcShape source repository]
        markdown[Architecture Markdown and reader source]
        release[Published GitHub Release]
    end

    subgraph actions[GitHub Actions]
        pages[Pages workflow: build reader]
        publish[Release workflow: verify package and SBOM]
        approval[Protected npm-publish environment]
    end

    subgraph public[ArcShape public artifacts]
        reader[GitHub Pages reader]
        registry[npm registry: @arcshape/cli]
    end

    subgraph adopter[Adopter-controlled environment]
        project[Adopter repository]
        localcli[Local ArcShape CLI]
        html[Self-contained reader HTML]
        host[Adopter-selected hosting]
    end

    maintainer -->|changes documentation or source| markdown
    markdown -->|pull request validates build| pages
    markdown -->|push to main deploys| pages
    pages --> reader
    maintainer -->|publishes release| release
    release --> publish
    publish --> approval
    approval --> registry
    registry -->|install package| project
    project --> localcli
    localcli -->|arcshape site build| html
    html -->|optional publication| host
```
