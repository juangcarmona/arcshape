<!-- pdac-scope: cited -->

# Tasks

<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:c3b23d66ee088a457d58ae8bd22645d99e0f0618ff30fa242bd7ddf700a1f7c7" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:8ef95cb49549967275a46362840b5e8b272696b14cabb7c80a321e5b7719ffff" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:1ec5f68cf7a73bff2e6d29613b060430717f21a418e0abf353fc9ec349de4e02" -->

## 1. Portable bundle generation

- [x] 1.1 Implement bounded raster generation and PNG provenance/integrity handling; verify metadata, edited-output and bounds tests.
- [x] 1.2 Support PNG references, coordinated generation/checks and dedicated exports while retaining SVG-only compatibility; verify bundle and packed-install tests.

## 2. Authoring and documentation

- [x] 2.1 Update packaged/provider guidance, public migration instructions and architecture mechanism; verify the documented commands and refresh all affected current citations.
- [x] 2.2 Explicitly migrate the fifteen architecture/gallery previews to PNG, retain SVG/JSON/Mermaid and inspect generated image dimensions, weights and screenshots before commit.

## 3. Verification and handoff

- [x] 3.1 Run the complete applicable local verification, browser journeys and security/product checks; preserve evidence and residual limits.

## Workflow follow-up

- Open the PR and verify current-head remote CI/Assurance; preserve the maintainer's approval separately from forge/protected release permissions. This is delivery follow-up, not implementation progress.
- Synchronize and archive the completed delivery slice before integration.
- Integrate only after applicable checks pass; prepare and verify the Changesets version PR. Stop at npm publication or the protected environment gate as requested.

