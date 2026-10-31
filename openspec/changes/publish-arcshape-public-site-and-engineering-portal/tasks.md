<!-- pdac-scope: cited -->

# Tasks

The tasks preserve ArcShape's canonical product model and architecture sources, and constrain public claims to its approved capabilities.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:ac09dcb4dd5f8d437006a51f654c3f1b3d218dc223ca1ebb0a67311bdfe6b0ed" -->

## 1. Hosting and public-site foundation

- [ ] 1.1 Inspect the Cloudflare Pages account/project configuration and record Git integration mode, preview URL behavior, production branch, domain state, and rollback path; verify the findings against the Cloudflare dashboard and keep production and domain activation disabled.
- [x] 1.2 Confirm the approved ArcShape logo/wordmark, then add ArcShape-owned styles and approved assets with the public-site source to `src/public-site/`; verify a clean site build needs no ProductShape site package or assets.
- [x] 1.3 Implement the ArcShape public site at `arcshape.dev` with current-capability copy and links to the engineering portal; build and verify all published claims against ArcShape's active product model.
- [ ] 1.4 Add pull-request and `main` build validation plus Cloudflare preview configuration for `src/public-site/`; verify a PR preview is reviewable without changing production, and document the verified branch and preview behavior in the deployment guide.
- [x] 1.5 Add responsive and accessibility checks for the public site, including keyboard navigation, visible focus, image alternatives, contrast, and narrow viewport overflow; verify the checks against representative pages and document any accepted limitation.

## 2. GitHub Pages engineering portal

- [x] 2.1 Implement the portal landing page and stable `/model/` and `/architecture/` routes; generate the Product Snapshot from `docs/product/model` and the architecture reader from `docs/architecture` at the exact workflow revision, then verify source-revision provenance and canonical source locations.
- [x] 2.2 Extend the existing Pages workflow as the single serialized publisher of a clean, complete output tree; test required routes, failure-before-deploy behavior, and concurrency, and update `docs/pages-deployment.md` with build, publication, and recovery instructions.
- [x] 2.3 Preserve root `/#/section/...` architecture-reader bookmarks when the reader moves to `/architecture/`, and verify legacy hashes, nested asset paths, and ordinary deep links in workflow or static-site tests.
- [x] 2.4 Update the README and relevant architecture deployment/building-block documentation to describe both surfaces, canonical sources, generated projections, ownership, and release boundaries; verify links and deployment descriptions match the implemented workflows.
- [x] 2.5 Verify portal and architecture-reader accessibility and responsive behavior at desktop and mobile widths; add or update automated checks and document the observed evidence and any known limitations.

## 3. Safe E2E summary publication

- [x] 3.1 Define and document the allowlisted public summary schema and exact completed-`main` run selection rule; verify examples contain only run identifier/link, source commit, completion time, and overall E2E result.
- [x] 3.2 Implement retrieval and validation of the selected Assurance run summary using least-privilege workflow permissions; add workflow tests rejecting pull-request runs, mismatched repository/run identity, malformed summaries, and unexpected fields.
- [x] 3.3 Assemble `/e2e/latest/` from validated allowlisted fields only, prevent older runs from replacing newer `main` evidence, and preserve the latest safe summary across ordinary Pages rebuilds; test initial absence, carry-forward, out-of-order runs, and validation/retrieval failure without blocking other portal content.
- [x] 3.4 Update Assurance and Pages operational documentation to distinguish private/temporary Actions artifacts from the public summary and record retention, provenance, and removal/recovery procedures; verify no raw traces, screenshots, or test-results are copied into the Pages artifact.

## 4. Integrated review and release readiness

- [x] 4.1 Run the repository's applicable quality, security, workflow, accessibility, link, and site-build checks for the final change; record the exact commands and results as review evidence.
- [ ] 4.2 Review both hosting previews and the GitHub Pages output for product-claim accuracy, source provenance, navigation, accessibility, route compatibility, and public-data safety; attach preview/build evidence and record reviewer findings.
- [ ] 4.3 Confirm all issue #62 acceptance criteria and applicable Definition of Done items are satisfied or explicitly recorded as limitations, and verify production Cloudflare activation/domain binding remains disabled until maintainer approval.

## Workflow follow-up

- After the implementation pull request is approved and merged, enable Cloudflare production deployment and bind `arcshape.dev` only with explicit maintainer approval; record the verified DNS and production configuration.
- Archive this OpenSpec change after implementation is complete and the repository's review requirements are satisfied.
