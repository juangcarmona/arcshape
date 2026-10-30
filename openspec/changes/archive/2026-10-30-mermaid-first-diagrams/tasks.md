<!-- pdac-scope: cited -->
# Tasks

Implement CHG-MERMAID-FIRST-DIAGRAMS and ADR-0003; acceptance scenarios are in the execution plan.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:12b15427336f47eb5c3b12d7ecec43ccb7c6a7b050ca207321f9d0321ab327fe" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:a712817e0391105d373a939d0cae074861cb3afe8ae6cfd6180cb18cc07cb943" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:7ced0abebbb528485c8fe92cdc6ce20d9e0c53a7e0b60d4fe3678d2cc29bd640" -->

## 1. Mermaid conversion

- [x] 1.1 Implement bounded parser/layout adapter beside native-diagrams.mjs; verify labels, cycles, directions, boundaries, unsupported constructs and invalid sources with focused Vitest tests.
- [x] 1.2 Integrate separate optional Archify pages and new-tab links while retaining Mermaid-rendered primary figures and original source files; verify mixed output order, legacy compatibility and source immutability in builder tests.

## 2. Native previews

- [x] 2.1 Implement confined paired sidecars and site previews generation/check; verify stale previews, unsafe paths/symlinks and image replacement with focused tests and CLI checks.

## 3. Authoring and dogfooding

- [x] 3.1 Update packaged guidance and provider projections for Mermaid-first authoring; document commands and verify packaged consumer installation.
- [x] 3.2 Migrate ArcShape architecture/gallery to Mermaid or generated SVG previews, update arc42 and add Changeset; verify English gallery, valid sources and current citations.

## 4. Integration acceptance

- [x] 4.1 Extend browser E2E for converted flow, unsupported fallback, native sidecar, selection, source and dedicated navigation; verify desktop/mobile, themes, static/offline behavior and capture screenshots before commit.
- [x] 4.2 Run required local checks, product/OpenSpec/citation validation and clean packed-install checks; record results, visual inspection and LAN preview for review.

## Workflow follow-up

- Sync reviewed deltas and archive after implementation and verification.
- Open reviewable PR; merge, release and deploy only under current authorization.
