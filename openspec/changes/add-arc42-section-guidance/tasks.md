# Tasks

<!-- pdac-scope: cited -->

## 1. Establish complete source provenance

- [x] 1.1 Pin the public arc42 documentation repository revision; enumerate all 12 section pages, 145 practical tips, and 35 worked examples in that snapshot, recording title, source URL, arc42 section, creator/contributor attribution where given, and license. Verify the source inventory against the snapshot and preserve the upstream license notice.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## 2. Build the section-organized reference library

- [x] 2.1 Keep the twelve section folders in two-digit, lowercase kebab-case with a `README.md` landing page. Add concise YAML frontmatter to the index, source register, and all section READMEs; link all section-local tips and examples from their section README.
- [x] 2.2 Add one complete source-content document per tip, preserving the upstream tip ID in its lowercase kebab-case filename and including frontmatter for kind, title, section, source URL, source attribution, license, source revision, and tags where available.
- [x] 2.3 Add one complete source-content document per worked example, preserving source text and referenced image assets while warning that example-system facts do not establish facts about another system; include the same source and kind metadata.
- [x] 2.4 Complete `SOURCES.md` with a source-register entry for every source-derived document, including page title, URL, creator/contributors, and license. Keep the CC BY-SA 4.0 scope explicit and distinct from the software license.
- [x] 2.5 Extend `tests/arc42-workflow.test.mjs` to assert the source snapshot totals, all expected tip and example references, frontmatter fields, source-register coverage, valid local links, and section assignment.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## 3. Route architecture work to focused references

- [x] 3.1 Update the packaged architecture skill and repository-local skill to select relevant section READMEs and only the tips/examples useful for the current task; preserve evidence and uncertainty rules.
- [x] 3.2 Update the single-section and cross-section workflow examples to show selection of relevant tips and examples without loading the full library; extend tests for focused routing.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DOCS" digest="sha256:a8d8da1da55a7368620ae2a1229bbc38cc0480e2267dc2916dea4bf6e0995a4c" -->
<!-- pdac:cite id="UC-MAINTAIN-ARCHITECTURE-DOCS" digest="sha256:0a93ce4931da4e6c21bfa56260f79aa86758991e202b0dc8b0f4e05761e5b120" -->
<!-- pdac:cite id="UC-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:3a956a71e74d729d9eaa0b4665e1a72c276f33bb458b51ed5737773f84099b24" -->

## 4. Keep ADRs canonical and discoverable

- [x] 4.1 Update the ADR skill to follow an existing repository convention or default to `docs/adr/`, sequential `ADR-0001-kebab-case-title.md` files, and a maintained `docs/adr/README.md` index. Include frontmatter for ID, title, status, date, and deciders.
- [x] 4.2 Update the ADR examples/tests and Section 9 guidance to verify default and existing-convention behavior, index updates, source frontmatter, and links to the canonical ADR collection without duplicating ADR bodies.
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## 5. Install and manage nested skill resources safely

- [x] 5.1 Enumerate packaged files beneath each skill root and validate nested manifest paths; reject traversal and symlinks.
- [x] 5.2 Verify nested installation, updates, edited-file preservation, untracked extension preservation, conflict reporting, uninstall, and per-file hash ownership.
- [x] 5.3 Extend offline package smoke coverage to assert the full tips/examples catalog is packed and installs at the same hierarchy for Codex and Claude.
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="UC-MANAGE-AGENT-CAPABILITIES" digest="sha256:adf18d2e641041617408bb55db6b91d2011f3073870ecafa98b454378d446bf1" -->

## 6. Verify product and delivery consistency

- [x] 6.1 Run the complete product-model, OpenSpec, citation, format, lint, typecheck, unit, build, packed-package, and security checks on the final implementation head; record results and resolve diagnostics.
- [x] 6.2 Sync the updated guidance requirements to the main OpenSpec spec and verify current ProductShape citations with no stale, tampered, unresolved, or unclassified documents.
- [x] 6.3 Capture runtime evidence for installing and using the expanded library and verify the ADR workflow examples; retain the evidence in a reviewer-accessible repository path.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->

## Workflow follow-up

- After implementation and current-head checks pass, mark the existing PR ready for review and move issue #63 to `stage:integrate`. Merge only after the maintainer's review.
