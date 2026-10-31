---
id: CHG-PORTABLE-PNG-DIAGRAMS
type: product-change
title: Portable PNG diagram previews in Markdown
status: applied
base-revision: 'a8310cd'
operations:
  add: []
  modify:
    - FR-INTERACTIVE-DIAGRAMS
    - FR-ASSISTED-WORKFLOWS
    - FR-CLI-COMMANDS
    - FR-READER-VIEW
    - UC-CREATE-ARCHITECTURE-DIAGRAMS
  remove: []
---

## Problem

Markdown readers that do not render repository SVG images cannot display the default diagram previews. Adopters report this limitation in Azure Repos after upgrading to ArcShape 0.3.0.

## Intended Product Outcome

New native bundles provide a readable PNG image for Markdown, while preserving vector SVG, editable JSON, the standard Mermaid Markdown alternative and the native HTML presentation. Existing sources and bundles remain compatible and are not migrated implicitly.

## Rationale

A portable raster preview extends readability without replacing the diagram authority or requiring a hosting-provider-specific authoring workflow. The maintainer explicitly accepted PNG as the general Markdown default and authorized application and continuation through release preparation in the accompanying request.

## Affected Product Areas

Diagram authoring, deterministic generation and integrity checking, Markdown readability and static/interactive publication.

## Open Questions

None.

## Product Acceptance

The definition makes PNG the new Markdown default, retains the richer representations, requires bounded readable output and integrity checks, and preserves opt-in migration and existing SVG/Mermaid compatibility.

## Out of Scope

New external documentation connectors, guaranteed support in every Azure DevOps surface, lossy image formats, external account configuration, implementation and release evidence.
