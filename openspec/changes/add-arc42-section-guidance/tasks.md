# Tasks

<!-- pdac-scope: cited -->

## 1. Establish source provenance

- [x] 1.1 Inventory the arc42 section, tip, and example pages used for the guidance; record each source title, author where given, URL, and applicable license in the arc42 reference attribution notice, then verify that each cited source has an attribution entry.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## 2. Build the section guidance library

- [x] 2.1 Add the arc42 guidance index and section folders with a main `README.md` for Sections 1–4; verify each file covers its purpose, relevant subsections, useful evidence, missing/conflicting evidence, and linked source material.
- [x] 2.2 Add the main `README.md` references for Sections 5–8 with the same content contract; verify source links and the section-specific source attribution.
- [x] 2.3 Add the main `README.md` references for Sections 9–12 with the same content contract; verify source links and the section-specific source attribution.
- [x] 2.4 Extend `tests/arc42-workflow.test.mjs` to assert that all twelve section references exist, the index and skill links resolve, and each section reference contains the required guidance and source fields; verify with the targeted test file.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## 3. Route the architecture workflow to focused references

- [x] 3.1 Update `capabilities/skills/arc-architecture/SKILL.md` with concise discovery frontmatter and instructions to read only the relevant section `README.md` files and linked subsection documents; update `.agents/skills/arcshape-architecture/SKILL.md` to point at the same repository guidance; verify both entrypoints resolve their links and stay aligned with existing evidence rules.
- [x] 3.2 Extend the arc42 workflow examples and `tests/arc42-workflow.test.mjs` with a single-section request and a cross-section request; verify the examples select relevant guidance and continue to preserve evidence, uncertainty, and maintainer review.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DOCS" digest="sha256:a8d8da1da55a7368620ae2a1229bbc38cc0480e2267dc2916dea4bf6e0995a4c" -->
<!-- pdac:cite id="UC-MAINTAIN-ARCHITECTURE-DOCS" digest="sha256:0a93ce4931da4e6c21bfa56260f79aa86758991e202b0dc8b0f4e05761e5b120" -->
<!-- pdac:cite id="UC-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:3a956a71e74d729d9eaa0b4665e1a72c276f33bb458b51ed5737773f84099b24" -->

## 4. Install and manage nested skill resources safely

- [x] 4.1 Extend capability planning and manifest path validation to enumerate packaged files beneath a skill root; verify nested destinations are planned and traversal or symlink paths are rejected.
- [x] 4.2 Extend lifecycle tests for nested-file install, update, edited-file preservation, untracked maintainer-extension preservation, conflict reporting, and uninstall; verify ownership remains tracked by per-file hashes.
- [x] 4.3 Extend the packed npm package smoke test to assert section references are included in the tarball and can be installed for Codex and Claude from the offline package; verify installed paths match the section hierarchy.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

## 5. Verify product and delivery consistency

- [x] 5.1 Run the planned product-model, OpenSpec, citation, format, lint, typecheck, unit, build, and packed-package checks on the final change head; record current results and resolve diagnostics, including stale or unclassified product citations.
- [x] 5.2 Sync the accepted capability deltas into the main OpenSpec specs and refresh affected citations, including the existing `FR-ASSISTED-WORKFLOWS` citation; verify `prodshape citations verify --provider openspec` reports no stale or unclassified current documents.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Verification evidence

Final local verification on 2026-10-18:

- `GITHUB_ACTIONS=true npm test` — 87 tests passed across 22 files, including the packed-package smoke test.
- `npm run format:check`, `npm run lint`, and `npm run typecheck` — passed.
- `npm run build`, `npm run product:model:check`, and `npm exec -- prodshape validate --format json` — passed; 35 Product Definition artifacts, no diagnostics.
- `npm exec -- openspec validate --all --no-interactive` and `npm exec -- openspec validate --specs --strict` — passed.
- `npm exec -- prodshape citations verify --provider openspec` — 7/7 documents bound/current; 60/60 citations current; no stale, tampered, unresolved, or unclassified citations.
- `npm run security:audit` and the synthetic npm audit, license, CodeQL SARIF, and secret-scanner gate fixtures — passed.
- `git diff --check` — passed.
- Runtime install was driven through the ArcShape CLI and inspected in [arc42-guidance-runtime.md](../../../docs/engineering/evidence/arc42-guidance-runtime.md).

## Workflow follow-up

- After the implementation PR is reviewed and accepted, archive this OpenSpec change with `$openspec-archive-change`.
