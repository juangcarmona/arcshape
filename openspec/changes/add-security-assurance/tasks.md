# Tasks

<!-- pdac-scope: cited -->

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## 1. Static analysis

- [ ] 1.1 Add CodeQL advanced workflow for JavaScript/TypeScript on pull requests, `main`, and weekly schedule; verify the workflow YAML parses and a pull-request run uploads code-scanning results.
- [x] 1.2 Add a safe synthetic CodeQL SARIF alert fixture and automated assertion for the configured High/Critical threshold; verify the fixture fails and Medium findings pass via `node scripts/test-codeql-sarif.mjs`.
- [ ] 1.3 Require the successful `CodeQL / Analyze (javascript-typescript)` status check in the active GitHub `main` ruleset after its first passing run; verify that check blocks merge when the SARIF fixture exceeds threshold.
- [ ] 1.4 Document CodeQL version policy, query suite, thresholds, and the narrow exception record format in `SECURITY.md`; verify the documented threshold matches the workflow and ruleset.

## 2. Runtime SBOM and license policy

- [x] 2.1 Add a CycloneDX license-policy validator and synthetic fixtures; verify allowed SPDX identifiers/expressions pass, GPL is rejected, unknown licenses fail closed, and valid/expired exact exceptions behave as documented via `node scripts/test-license-policy.mjs`.
- [x] 2.2 Add the runtime allowlist and exact-version exceptions for `khroma@2.1.0`, `elkjs@0.9.3`, current `@fontsource` assets, and `@fortawesome/fontawesome-free@7.3.1`; verify each entry has owner, evidence, rationale, expiry, and matches the clean packed-package SBOM.
- [x] 2.3 Extend `security.yml` to pack and clean-install the actual npm tarball with npm 10.9.9, generate the CycloneDX runtime SBOM, run the policy validator, and upload the SBOM; local evidence: 247 components including the packed root and all 246 runtime dependencies.
- [x] 2.4 Extend `publish.yml` to generate the same SBOM before publishing and attach it to the matching GitHub Release; verified `node scripts/test-release-sbom.mjs` and the helper dry-run (`v0.1.1` -> `arcshape-0.1.1-sbom.cdx.json`).
- [x] 2.5 Document the SPDX policy, exception review and expiration rules, npm SBOM source, artifact retention, and known limitations in `SECURITY.md`; verified against the current workflow and policy files.

## 3. Integration

- [x] 3.1 Update `docs/engineering-lifecycle.md` with the SAST, SBOM/license checks, versions, triggers, and expected ruleset evidence; verify the descriptions against workflow configuration. GitHub ruleset activation remains tracked in 1.3.
- [ ] 3.2 Run format, lint, typecheck, all tests, build, product model validation, OpenSpec validation, current-head security workflows, and the packed-package license check; record exact successful evidence in the pull request.

## Workflow follow-up

- Archive this change and verify citations after the Done gate and review are complete.
