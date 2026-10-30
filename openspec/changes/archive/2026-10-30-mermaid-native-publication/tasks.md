<!-- pdac-scope: cited -->
# Tasks
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:89a85bdce2b2abebe4b214d005673812cbfe6951fbedce009c8b7e7ee5815ce8" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:69b3896c64d3974d75ede346a61c67b9527c2b205b5d14c81921a1e7db40ff4b" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:03f8db70084a9f2ece5ae7ac432334aa62a0a23d6145c711d184683e2d744f3a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:73f884ab8bce44e3950b5c42b17912546f69e2f2045f3df2106b0ce59d99cfee" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:67954319dd8f19a50a9a15b09e024c343bae2d018e37dade767957254c6d689b" -->

## 1. Native publication

- [x] 1.1 Replace supported Mermaid only in generated documents, preserve original-source exports and implement Mermaid-only selection; verify mixed order, snapshot, folder, explicit opt-out and source immutability tests.
- [x] 1.2 Convert bounded simple sequence sources with preserved participants, message order, labels and arrow kinds; verify supported cases and whole-diagram fallback for unsupported semantics.

## 2. Adoption and evidence

- [x] 2.1 Update architecture, ADR, packaged authoring guidance, Changeset and affected product citations; verify product, OpenSpec, architecture and citation checks.
- [x] 2.2 Update browser acceptance, inspect desktop/mobile and light/dark screenshots before commit, and run deterministic plus packed-install verification and complete E2E.

## Workflow follow-up

- Synchronize specs and archive verified delivery artifacts.
- Update PR #118 and wait for implementation approval and protected publication gates; verify npm release evidence separately.
