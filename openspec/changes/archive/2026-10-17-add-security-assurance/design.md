# Design

<!-- pdac-scope: cited -->

## Context

`security.yml` currently runs TruffleHog and a High/Critical npm audit gate. `publish.yml` runs `npm pack --dry-run` but does not retain a component inventory. The published `@arcshape/cli@0.1.1` tarball was installed into a clean consumer project and produced a 247-component CycloneDX SBOM; 246 components had SPDX metadata. `khroma@2.1.0` omits SPDX metadata in its npm manifest, while the package's own `package/license` states MIT. The runtime graph also currently contains EPL-2.0 (`elkjs`), OFL-1.1 fonts, and a CC-BY-4.0 composite font package, which require visible, scoped policy treatment.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Goals / Non-Goals

**Goals:** Block newly introduced High/Critical SAST findings; inventory and check the complete runtime dependency graph of the package actually produced; retain the resulting SBOM for CI and releases; make exceptions narrow, traceable, and expiring.

**Non-Goals:** Change CLI features, dependency versions, npm publication policy, secret scanning, npm audit severity, mutation testing, DAST, or any Product Definition artifact.

## Decisions

1. **SAST engine and enforcement.** Add `.github/workflows/codeql.yml` using `github/codeql-action` v4 on PRs to `main`, pushes to `main`, and a weekly schedule. Analyze `javascript-typescript` with `security-extended`. A SARIF parser in the CodeQL job fails on High/Critical security severity (7.0+), while lower-severity findings remain visible in GitHub. Require the resulting CodeQL job as a status check in the active `main` ruleset after observing a successful run.
2. **SBOM source.** In security CI and release verification, pack the project, install that tarball in a fresh temporary consumer directory using pinned npm 10.9.9, and run `npm sbom --sbom-format=cyclonedx --omit=dev`. This includes the package itself and resolves licenses from installed package metadata. Do not use `--package-lock-only`.
3. **License policy.** A small Node script validates CycloneDX components against an explicit SPDX allowlist and versioned exceptions. Parse SPDX `AND`/`OR` expressions: all licenses in a conjunctive expression must be accepted; a disjunction passes if at least one option is accepted. Missing/unsupported license metadata is rejected unless an exact `pkg:npm/...@version` exception supplies a reviewed license override and contains owner, reason, evidence, and a future expiry date. Exact package exceptions are used for the existing EPL-2.0, OFL-1.1, and CC-BY composite packages until the maintainer re-evaluates those obligations; they are not global allowlist additions. Record the manually verified `khroma@2.1.0` MIT file as a package/version-specific exception.
4. **Evidence retention.** Upload the generated SBOM as a named Actions artifact from the security job. The release workflow generates the same SBOM before publish, transfers it to the publish job, and uploads it to the matching GitHub Release using `gh release upload`; only that job receives `contents: write`.
5. **Fixture coverage.** A safe CodeQL fixture uses an intentionally insecure JavaScript source pattern and asserts that the configured query emits a SARIF finding at or above the blocking threshold. A policy test fixture includes a GPL-only component and asserts the license gate rejects it. No real credentials or third-party license contents are copied into fixtures.
6. **Exceptions and thresholds.** Store license exceptions under `security/license-exceptions.json` and the allowlist in a reviewed policy file. Each exception names `owner`, rationale, source/evidence, and ISO expiry. Expired or stale entries fail. Store SAST exceptions under `security/codeql-exceptions.json`, keyed to one CodeQL rule and repository-relative path, with reason, owner, and expiry. Expired, unused, duplicate, or malformed entries fail. Both the license and SARIF validators have synthetic fixtures for rejected, allowed, and exception cases.

## Risks / Trade-offs

- GitHub code-scanning merge protection is a repository setting in addition to workflow code. The CodeQL check must run successfully before the ruleset threshold is configured, and the exact required-tool entry must be verified on GitHub.
- Runtime license metadata is incomplete for one current dependency, so a manually verified exact-version exception is required. Any version change invalidates that exception and blocks until reviewed.
- A fixed SPDX allowlist may require reviewed exceptions when upstream introduces or changes runtime components. This is intentional fail-closed behavior.
- `npm sbom` requires network access to install the package graph in CI; offline generation is not supported by this workflow.
- GitHub Actions artifacts have finite retention; the GitHub Release asset provides the durable release copy.

## Open Questions

None blocking. The initial policy and threshold are selected in this design and remain reviewable in code, CI evidence, and the active ruleset.
