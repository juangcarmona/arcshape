<!-- pdac-scope: cited -->

# Tasks

These tasks exercise the established Arc42 and reader requirements with an illustrative example; they do not change canonical product behavior.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## 1. Adapt the bilingual example

- [ ] 1.1 Add `examples/starwars-deathstar/` with English and Spanish reader inputs; preserve an attribution, source link/revision, CC BY-NC 4.0 license notice, modification statement, and Star Wars disclaimer, then verify those appear in both locale entry points.
- [ ] 1.2 Adapt each locale's overview and sections 01–12 to the reader's README/filename/frontmatter contract; run the real reader build for both locales and verify twelve sections are present in each output.
- [ ] 1.3 Review the adapted narrative and diagrams for consistency; fix the source's scenario/sequence mismatches and image alternative-text language issue, then verify the relevant section content and diagram labels in both builds.
- [ ] 1.4 Keep referenced images and supporting files inside the example's publication boundary; build the reader at root and `/arcshape/` prefixes and verify all image and navigation links resolve.

## 2. Demonstrate Mermaid and Archify

- [ ] 2.1 Confirm representative Mermaid diagrams render from the adapted Markdown with accessible titles/descriptions and revision-pinned source links; verify with the built pages and Playwright assertions.
- [ ] 2.2 Add one focused Archify static HTML view plus its source/manifest in the example folder, following the contract pinned from draft PR #79 at `eb4974b8db8b158fa907ceff15c247d198d07cff`; verify renderer identity, provenance, accessible labeling, and no external runtime fetches in the built output.
- [ ] 2.3 Extend Playwright to exercise both locale outputs, Mermaid and Archify identity, source/revision links, keyboard interaction, expected architecture sections, and no horizontal overflow at a narrow viewport; preserve report and trace in Actions.
- [ ] 2.4 Exclude only the pinned generated Archify HTML from CodeQL after evaluating the generated-code alerts; keep ArcShape-authored sources and tests scanned, and verify the manifest hash/provenance checks.

## 3. Publish review evidence

- [ ] 3.1 Capture and inspect desktop and narrow screenshots from the locally built example; commit them under `docs/delivery/issue-80/evidence/`.
- [ ] 3.2 Add an evidence README embedding the captures and recording source revision, tested ArcShape commit, exact viewport dimensions, observations, Actions run/report/trace links, source license note, and limits; verify the images render in the PR.
- [ ] 3.3 Confirm the report and trace are retained by the linked Actions run and that the evidence README explicitly says no public-site or Cloudflare publication was tested.

## 4. Definition of Done evidence

- [ ] 4.1 **DoD 1 — Acceptance criteria:** map each issue #80 criterion to a build/test, screenshot/README artifact, or named human judgement in the PR.
- [ ] 4.2 **DoD 2 — Implementation completeness:** confirm all bilingual adaptation, diagram, E2E, and evidence tasks are complete; explain dropped content.
- [ ] 4.3 **DoD 3 — Tests:** report reader builds and focused E2E results; have the reviewer judge test adequacy.
- [ ] 4.4 **DoD 4 — Quality checks:** link current-head CI results for format, lint, typecheck, unit/integration, helper build, and supported matrix combinations.
- [ ] 4.5 **DoD 5 — Security:** link current-head security scan results and document new findings or applicable exceptions.
- [ ] 4.6 **DoD 6 — Architecture/design conformance:** verify the example is isolated under `examples/` and introduces no runtime/publication boundary; record deviations.
- [ ] 4.7 **DoD 7 — Documentation:** verify both locales, attribution/license notice, disclaimer, and evidence README are complete.
- [ ] 4.8 **DoD 8 — Product/spec consistency:** verify citations and confirm no canonical ArcShape product or architecture facts changed.
- [ ] 4.9 **DoD 9 — Evidence:** open screenshot files, match them to the tested revision/viewports, and follow the linked current-head report/trace.
- [ ] 4.10 **DoD 10 — Human review:** obtain maintainer judgement on clarity, visual appeal, bilingual adaptation, and test adequacy before marking the PR ready.
- [ ] 4.11 **DoD 11 — Known limitations:** disclose fictional content, CC BY-NC restrictions, Archify accessibility limitations, and absence of a deployed public route.
- [ ] 4.12 **Additional — Phased assurance:** distinguish advisory E2E/DAST results from required branch-protection checks; verify the PR does not overstate enforcement.
- [ ] 4.13 Revalidate the example's Archify artifact against the merged #78 contract before integrating #80; record the merged revision and any compatibility changes.
