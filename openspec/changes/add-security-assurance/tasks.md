# Tasks

<!-- pdac-scope: cited -->

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## 1. Static analysis

- [ ] 1.1 Add CodeQL advanced workflow for JavaScript/TypeScript on pull requests, `main`, and weekly schedule; verify the workflow YAML parses and a pull-request run uploads code-scanning results.
- [ ] 1.2 Add a safe vulnerable-code fixture and automated assertion for the configured High/Critical SARIF threshold; verify the fixture fails and clean source passes.
- [ ] 1.3 Enable and verify GitHub ruleset code-scanning merge protection at High/Critical security severity and error-level non-security findings; verify the required CodeQL tool appears in the active ruleset.
- [ ] 1.4 Document CodeQL version policy, query suite, thresholds, and the narrow exception record format in `SECURITY.md`; verify the documented threshold matches the workflow and ruleset.

## 2. Runtime SBOM and license policy

- [ ] 2.1 Add a CycloneDX license-policy validator and unit fixtures; verify allowed SPDX identifiers/expressions pass, GPL fixture fails, unknown licenses fail closed, and valid/expired exact exceptions behave as documented.
- [ ] 2.2 Add the current runtime allowlist and exact-version exceptions for `khroma@2.1.0`, `elkjs@0.9.3`, current `@fontsource` assets, and `@fortawesome/fontawesome-free@7.3.1`; verify every exception has owner, evidence, rationale, and future expiry.
- [ ] 2.3 Extend `security.yml` to pack and clean-install the actual npm tarball with npm 10.9.9, generate the CycloneDX runtime SBOM, run the policy validator, and upload the SBOM; verify the report contains the packed ArcShape root and all runtime transitive components.
- [ ] 2.4 Extend `publish.yml` to generate the same SBOM before publishing and attach it to the matching GitHub Release; verify a workflow test or dry-run confirms the asset name and package version match the release tag.
- [ ] 2.5 Document the SPDX policy, exception review and expiration rules, npm SBOM source, artifact retention, and known limitations; verify each matches CI and policy files.

## 3. Integration

- [ ] 3.1 Update `docs/engineering-lifecycle.md` with active SAST, SBOM/license checks, versions, triggers, and evidence; verify its deterministic-check and ruleset descriptions match observed GitHub configuration.
- [ ] 3.2 Run format, lint, typecheck, all tests, build, product model validation, OpenSpec validation, current-head security workflows, and the packed-package license check; record exact successful evidence in the pull request.

## Workflow follow-up

- Archive this change and verify citations after the Done gate and review are complete.
