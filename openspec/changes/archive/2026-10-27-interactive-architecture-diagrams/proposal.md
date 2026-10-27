<!-- pdac-scope: cited -->

# Proposal

## Why

Issue #109 brings the accepted compact interactive prototype into the installed product so maintainers can request diagrams from their AI assistant and readers can explore them inside arc42 documentation. CHG-INTERACTIVE-DIAGRAMS-001 was explicitly approved by the maintainer and applied on this branch; implementation and merge acceptance remain separate.
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:2721d6d68d994addd06a0b270bef3fad3efc21639c97c63ba3c43005c788070e" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

## What Changes

- Add native JSON diagram fences inside Markdown, with one authored source generating embedded interaction, a dedicated page and static output. Preserve Mermaid fences and the default single-file reader.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
- Package an offline, pinned Archify renderer subset and a sandboxed reader integration. Support context/container/component through architecture diagrams, plus sequence and workflow; exercise all ten demonstrated native families with fixtures and state limitations explicitly.
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->
- Update portable skills with source examples, engine selection, validation, visual review and opt-in migration. Existing external publication must remain readable; otherwise leave that diagram as Mermaid.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
- Keep the approved product definition authoritative, record a proposed ADR, migrate representative ArcShape diagrams, and ship a minor Changeset without publishing a release.
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->

## Capabilities

### New Capabilities

- `interactive-architecture-diagrams`: supported native source, deterministic publication, safe interactive reader and opt-in assisted migration.

### Modified Capabilities

None. Existing capability-distribution and arc42-guidance requirements continue unchanged; their citations require refresh after the applied Product Change.

## Impact

Touches the CLI site command, Markdown rendering, site generator and browser shell; adds a pinned vendor asset subset, diagram adapter, packaged skill guidance, fixtures, regression/E2E/security tests, migration documentation and architecture examples. No hosted service or universal Mermaid converter is introduced.

Product impact analysis examined all 37 resulting model artifacts and structural neighbours. The ten cited artifacts above govern this delivery. Actors, terms, the knowledge bounded context, reading/publication/C4 use cases, arc42 structure, ADR authoring, onboarding, capability lifecycle, reverse engineering and general comprehension were checked and retain their definitions. No additional product drift is proposed.

The earlier visual-reader slice's deferral of Archify remains valid history; this new approved product scope motivates a separate implementation decision. The PoC's unsandboxed same-origin iframe and absolute source imports will not be distributed.
