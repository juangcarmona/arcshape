<!-- pdac-scope: cited -->
# Design

## Context

See proposal.md. The existing adapter parses flowcharts in a bounded worker and the existing native pipeline already produces static SVG and sandboxed interactive views.

## Goals / Non-Goals

Reuse that pipeline for faithful Mermaid conversions. Do not add a second editable JSON source or promise universal Mermaid support.

## Decisions

Replace supported Mermaid tokens with native fences only in the build's in-memory document. Record original Mermaid in origin metadata and publish source.mmd beside interactive artifacts. This reuses native validation, isolation, ordered rendering and output ownership rather than adding a second rendering path. Parse simple sequences using Mermaid's database and reject the entire conversion on fragments, notes, activations, creation/destruction, boxes or unsupported arrows. Keep static single-file output offline; full interactivity stays in the folder output. Add --diagram-engine auto|mermaid and retain the earlier off option as a compatibility alias.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:89a85bdce2b2abebe4b214d005673812cbfe6951fbedce009c8b7e7ee5815ce8" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:69b3896c64d3974d75ede346a61c67b9527c2b205b5d14c81921a1e7db40ff4b" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:03f8db70084a9f2ece5ae7ac432334aa62a0a23d6145c711d184683e2d744f3a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:73f884ab8bce44e3950b5c42b17912546f69e2f2045f3df2106b0ce59d99cfee" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:67954319dd8f19a50a9a15b09e024c343bae2d018e37dade767957254c6d689b" -->

## Risks / Trade-offs

Lossy conversion → whole-diagram unsupported classification and regression fixtures. Larger snapshots → retain local SVG, no runtime CDN. Sequence branches exceed current mapping → complete Mermaid fallback with location. Native-only gallery → preserve existing sources, demonstrate conversion with additional Mermaid fixtures.

## Migration Plan

Update the existing issue #117 branch and PR. Rebuild existing documentation without rewriting it. Inspect screenshots before commit, verify packed output and CI, then human review and protected Changesets release. Mermaid-only mode provides a presentation rollback.
