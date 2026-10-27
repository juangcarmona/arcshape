<!-- pdac-scope: cited -->

# Tasks — issue 109

## 1. Pinned renderer and safe sources

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

- [x] 1.1 Vendor the pinned minimal renderer/schema/locale subset without brand/font payloads; record MIT origin, integrity and tailoring, and verify hashes plus no excluded payloads.
- [x] 1.2 Implement bounded native JSON/schema/safe-subset validation and isolated staging/render deadlines; test invalid source, unsafe fields, relationships and resource limits.
- [x] 1.3 Generate standalone HTML and sanitized static SVG with the installed browser and blocked network; render all ten family fixtures, compare repeat output, and test title accessibility.
- [x] 1.4 Include vendor origin/license components in runtime SBOM assurance without weakening the allowlist; verify policy and integrity tests.

## 2. Reader and publication

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->

- [x] 2.1 Add native fences to Markdown rendering and the explicit interactive folder mode while preserving snapshot/Mermaid behavior; test mixed order, source immutability, safe output ownership, symlinks and failed builds.
- [x] 2.2 Add sandboxed compact and dedicated viewers, CSP, a validated source-bound bridge, reachable no-JavaScript markup, startup-failure fallback and dedicated links; test parent/storage/opener denial including direct artifact navigation, forged messages, theme/focus and blocked network.
- [x] 2.3 Verify responsive height/width, ordinary wheel versus deliberate pan/zoom, keyboard selection/reset and routing cleanup in browser tests at desktop and 390px.
- [x] 2.4 Extend packed-install regression coverage to build both modes and a native fixture without checkout paths; document reproducible commands and supported limitations.

## 3. Authoring and own documentation

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:2721d6d68d994addd06a0b270bef3fad3efc21639c97c63ba3c43005c788070e" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->

- [x] 3.1 Ship focused native authoring instructions/examples through existing skills; verify packaged installation contains references and engine/migration/visual-review guidance.
- [x] 3.2 Document opt-in migration and external-target preservation, including unsupported families/features; test no automatic rewrite on install/update.
- [x] 3.3 Migrate representative ArcShape context, building-block and runtime diagrams from repository evidence, retain Mermaid coverage, and add the family gallery; compare source semantics and capture actual rendered screenshots before committing visual changes.
- [x] 3.4 Record proposed ADR-0002 and update affected arc42 mechanisms/risks, README/CLI usage and the minor Changeset; validate docs, links and product references.
- [x] 3.5 Reconcile affected existing OpenSpec and architecture citations with the applied product changes using ProductShape; verify current citations without deleting historical evidence.

## 4. Integrated acceptance

- [x] 4.1 Run the full applicable local quality/product/OpenSpec lanes and real browser journeys, inspect the new screenshots, and serve a separate Bastion LAN review build.
- [ ] 4.2 Exercise malformed/hostile native output through the assurance fixture and passive DAST; inspect required CI, SBOM/license, CodeQL and Assurance outcomes on the final candidate.
- [ ] 4.3 Obtain an independent Done audit against plan, diff and current evidence; resolve findings within the FF bounds and report outstanding human-owned judgement separately.

## Definition of Done coverage

All configured dimensions apply: acceptance, implementation completeness, test adequacy, quality checks, security, architecture conformance, documentation, product/spec consistency, current evidence, human review and known limitations. CI success cannot substitute for the human-owned judgement lane. No package/source changes are complete merely because product application or planning validation passed.

## Workflow follow-up

- Recheck final head and applicable human/forge approvals before integration; do not claim approval of unwritten implementation from product approval.
- Synchronize/archive the delivery spec through the configured workflow only when its gates permit, merge the linked PR, verify issue closure and record the per-item retrospective.
- Protected production/package publication is outside this issue.
