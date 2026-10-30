<!-- pdac-scope: cited -->
# Proposal

## Why

Implement the maintainer-approved and applied CHG-MERMAID-NATIVE-PUBLICATION in issue #117. Markdown readers need Mermaid while generated ArcShape documentation needs native presentation wherever faithful conversion is supported.

## What Changes

- Convert compatible Mermaid into native publication input in memory, without modifying authored Markdown.
- Publish native SVG in self-contained output and compact native widgets plus dedicated pages in folder output.
- Add bounded simple sequence conversion; retain the complete Mermaid for unsupported constructs and an explicit Mermaid-only option.
- Update AI guidance, architecture, tests and visual evidence.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `interactive-architecture-diagrams`: native publication from Mermaid replaces Mermaid-primary/deep-dive-only presentation.

## Impact

The five applied product artifacts below govern the generator, adapter, packaged guidance and reader. The graph neighbours UC-READ-ARCHITECTURE, UC-PUBLISH-ARCHITECTURE-VIEW, UC-CREATE-C4-DIAGRAMS, authority/privacy rules, terms and actors were checked: their intent is unchanged. External sync and capability distribution remain unchanged; no new dependency is needed. Native renderer coverage is broader than conversion coverage. Product drift is resolved by the explicitly approved Product Change, not silently inferred.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:89a85bdce2b2abebe4b214d005673812cbfe6951fbedce009c8b7e7ee5815ce8" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:69b3896c64d3974d75ede346a61c67b9527c2b205b5d14c81921a1e7db40ff4b" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:03f8db70084a9f2ece5ae7ac432334aa62a0a23d6145c711d184683e2d744f3a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:73f884ab8bce44e3950b5c42b17912546f69e2f2045f3df2106b0ce59d99cfee" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:67954319dd8f19a50a9a15b09e024c343bae2d018e37dade767957254c6d689b" -->
