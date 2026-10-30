---
title: Deployment view
arc42-section: "07"
description: Infrastructure and environment mapping for the system.
---

# 7. Deployment view

## Infrastructure overview

ArcShape runs as a local Node.js process in the adopter's repository. The source repository publishes the `@arcshape/cli` package through a reviewed, environment-gated release workflow; release mechanics and recovery belong in [`docs/releasing.md`](../../releasing.md), not in this topology view.

Session state is stored locally in `.arcshape/sessions/<session-id>/session.json`. It is not sent to an ArcShape service.

Obsidian sync writes Markdown into the selected local vault and stores its manifest beside those notes. Confluence sync stores page mappings and content hashes in `.arcshape/confluence-sync/`; multi-page mode publishes an index and the twelve arc42 sections plus any explicitly selected Markdown beneath the chosen Confluence Cloud parent page only when run without `--dry-run`.

## Deployment mapping

| Environment | What lives there | Boundary |
| --- | --- | --- |
| ArcShape source repository | CLI source, templates, canonical product and architecture Markdown | Maintained by the project; CI reads it and produces projections. |
| GitHub Actions | Engineering portal build, release verification, and assurance jobs | Ephemeral execution; the protected publish environment gates npm publication. |
| GitHub Pages | Engineering portal and source-revision-stamped snapshots | Public static artifact generated from the source repository. |
| Cloudflare Pages | Public product site static output | Separate product-site publication path. |
| npm registry | Versioned `@arcshape/cli` package | Distribution only; it does not store adopter documentation. |
| Adopter repository | Local CLI process, canonical architecture Markdown, and `.arcshape/` state | The primary runtime boundary. |
| Selected destination | Obsidian notes or Confluence pages | Written only by an explicit sync command; conflicts stop overwrites. |

## Published artifacts and adopter deployment

The source repository produces three independent kinds of output: the public product site, the engineering portal, and the npm package. Adopters install the package into their own repository, run the CLI locally, and choose whether to publish the generated reader. ArcShape does not operate the adopter's runtime, reader host, Obsidian vault, or Confluence space.

The companion [Archify publication-boundaries diagram](../../../src/engineering-portal/public/diagrams/publication-boundaries.html) is a standalone static artifact generated from the reviewed candidate at `.archify/arcshape-publications/arcshape-publication-boundaries.json`.

```mermaid
%%{init: {"flowchart": {"padding": 40, "nodeSpacing": 50, "rankSpacing": 60}}}%%
    accTitle: ArcShape publication and adopter deployment boundaries
flowchart TB
    subgraph governance[Project governance]
        direction LR
        maintainer([Maintainer])
    end

    subgraph source[ArcShape source repository]
        direction LR
        architecture[(Canonical architecture Markdown)]
        product[Public product site source]
        package[CLI package source]
    end

    subgraph automation[GitHub Actions]
        direction LR
        pages[Build portal]
        release[Verify release]
        gate{Protected publish gate}
    end

    subgraph published[Published artifacts]
        direction LR
        portal([GitHub Pages portal])
        publicsite([Cloudflare Pages site])
        registry[(npm registry)]
    end

    subgraph adopter[Adopter-controlled repository]
        direction LR
        localcli[Local ArcShape CLI]
        docs[(Architecture Markdown)]
        reader[Self-contained reader]
    end

    destination([Optional host or docs destination])

    maintainer -->|authors and reviews| architecture
    maintainer -->|maintains| product
    maintainer -->|releases| package
    architecture --> pages --> portal
    product --> publicsite
    package --> release --> gate --> registry
    registry -->|install| localcli
    localcli -->|init, validate, sync| docs
    docs -->|site build| reader
    reader -->|optional publication| destination

    classDef source fill:#eef6ff,stroke:#2563eb,color:#0f172a
    classDef automation fill:#fff7ed,stroke:#ea580c,color:#431407
    classDef published fill:#ecfdf5,stroke:#059669,color:#064e3b
    classDef adopter fill:#f5f3ff,stroke:#7c3aed,color:#2e1065
    classDef boundary fill:#f8fafc,stroke:#64748b,color:#0f172a
    class architecture,product,package source
    class pages,release,gate automation
    class portal,publicsite,registry published
    class localcli,docs,reader adopter
    class maintainer,destination boundary
```
