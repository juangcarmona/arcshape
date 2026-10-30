<!-- pdac-scope: cited -->
# Proposal

## Why

Issue #117's maintainer approved CHG-NATIVE-DIAGRAM-BUNDLES and clarified that Mermaid companions must be standard Markdown with a fenced Mermaid block. All current ArcShape architecture diagrams must adopt the gallery's SVG/native presentation.

## What Changes

- Generate and verify JSON/SVG/Markdown diagram bundles through the packaged CLI.
- Keep canonical native JSON editable; derive SVG and supported Mermaid semantic projections with provenance and overwrite guards.
- Exclude generated companion-only Markdown from duplicate reader navigation.
- Explicitly migrate the architecture diagrams, including deployment and initialization, and rebuild the local development preview.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `interactive-architecture-diagrams`: native bundles become the default authoring contract while existing Mermaid stays supported.

## Impact

The five applied product artifacts below govern authoring, generation and reader behavior. The existing native reader/preview and Markdown loader are reused. Graph neighbours (read/publish/C4 use cases, authority/privacy rules, terms and actors) keep their intent. No new dependency or external service is required. Human review and publication gates remain separate.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:02d4c9bc5238c5d6bc5e162f0cda52dee6c00a5b0229f8b841f811a533b8f06c" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:c49ed716a9b078b766666bf79afa2e999a366a9444732c659691b34baba853e1" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:fb9d6549efa4555755042489cd9eda2439cf6afad7d0171663ef2b9edeecd33d" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:8372d5e6f9b51e0e9d468289d65d352a7c930089dea72897a9bffe56f894e053" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:e1297804e0fc64a188b066d06c7c6acddb0c897f7554f99f0454898c4f545c4e" -->
