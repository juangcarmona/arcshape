<!-- pdac-scope: cited -->

# Tasks

These tasks deliver and verify an illustrative example using the established Arc42 and reader requirements; no canonical product behavior is changed.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## 1. Example content and portal route

- [ ] 1.1 After issue #78 merges, update from its merged base and record the commit; inspect the final Astro route, build, diagram manifest, and base-path contracts in the PR notes.
- [ ] 1.2 Add a compact Arc42 example with visible illustrative labeling and Mermaid source/provenance; verify the actual ArcShape reader build renders its sections and diagrams.
- [ ] 1.3 Add one focused Archify source and static HTML output with renderer identity, source/revision evidence, and accessible labeling; verify the published HTML and source links load from the built site.
- [ ] 1.4 Add the portal entry using the shared theme/navigation and cover it in Playwright; verify keyboard activation reaches the showcase route.

## 2. End-to-end behavior

- [ ] 2.1 Extend Playwright to build and visit the full portal-to-showcase journey at root and `/arcshape/` prefixes; verify all internal and source links resolve.
- [ ] 2.2 Assert expected story sections, Mermaid and Archify renderer identities, accessible diagram names, source/revision provenance, keyboard access, and no horizontal overflow at the agreed narrow viewport; preserve the Playwright report and trace in the Actions run.
- [ ] 2.3 Run the focused E2E journey and relevant CI-equivalent checks; record current-head check results in the PR and investigate regressions to existing routes or themes.

## 3. Screenshot evidence

- [ ] 3.1 Capture desktop and narrow screenshots from the built static showcase and inspect both images; commit them under `docs/delivery/issue-80/evidence/`.
- [ ] 3.2 Add an evidence README embedding the screenshots and recording the tested source revision, exact viewport dimensions, observed results, Actions run link, Playwright report/trace names, and limits; verify the images render in the GitHub PR view.
- [ ] 3.3 Confirm the Actions run retains the HTML report and trace, and the evidence README explains that captures do not prove Cloudflare production deployment; verify both links from the PR.

## 4. Definition of Done evidence

- [ ] 4.1 **DoD 1 — Acceptance criteria:** map each issue #80 criterion to a test, screenshot/README evidence, or named human judgement in the PR description.
- [ ] 4.2 **DoD 2 — Implementation completeness:** review all planned content, route, E2E, and evidence work against the accepted scope; document any dropped work.
- [ ] 4.3 **DoD 3 — Tests:** report focused E2E and relevant test results; ask the reviewer to judge E2E adequacy.
- [ ] 4.4 **DoD 4 — Quality checks:** link current-head CI for format, lint, typecheck, unit/integration, helper build, and supported matrix combinations.
- [ ] 4.5 **DoD 5 — Security:** link current-head security scan results and document any applicable new findings or expiring exceptions.
- [ ] 4.6 **DoD 6 — Architecture/design conformance:** compare the final route and publication behavior with the established deployment view; record deviations in the PR.
- [ ] 4.7 **DoD 7 — Documentation:** verify the example, source pointers, and evidence README are discoverable from the portal/PR.
- [ ] 4.8 **DoD 8 — Product/spec consistency:** run PDaC citation verification and confirm no canonical product or architecture facts changed.
- [ ] 4.9 **DoD 9 — Evidence:** verify screenshot files open, match the tested source revision/viewports, and link to the current-head report/trace.
- [ ] 4.10 **DoD 10 — Human review:** obtain maintainer judgement on clarity, visual appeal, and test adequacy before the PR is marked ready.
- [ ] 4.11 **DoD 11 — Known limitations:** list static-build-only evidence, fictional sample content, and any remaining renderer limitations for reviewer acceptance.
- [ ] 4.12 **Additional — Phased assurance:** identify advisory E2E/DAST results separately from required branch-protection checks; verify the PR does not overstate enforcement.
