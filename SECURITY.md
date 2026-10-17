# Security Policy

## Supported versions

ArcShape publishes `@arcshape/cli` releases from the current default branch. Security fixes are made on `main`; there are no long-term support branches.

## Reporting a vulnerability

Please do not report suspected vulnerabilities in a public issue. Use GitHub's private vulnerability reporting for this repository if it is enabled. Otherwise, contact the repository maintainer privately with the affected commit or version, impact, and reproduction steps.

## Scope

ArcShape's CLI runs locally in a developer's repository. GitHub Actions scans this repository during pull requests, pushes to `main`, and scheduled runs. These scans use GitHub-hosted infrastructure and do not send repository content to an ArcShape-operated service.

## Automated checks

GitHub Actions runs TruffleHog OSS v3.99.2 (action revision `e76dff8a7e57d6df0c60ad8cbf5d5cba505a8fc9`) on pull requests and pushes to `main`, plus a scheduled full-history scan. Credential verification is disabled so detected values are not sent to external credential-verification endpoints. Any scanner result blocks the check; do not add broad secret allowlists. Triage a suspected false positive by recording its file, detector, reason, owner, and expiry in a reviewed change; prefer rewriting safe example data so it no longer resembles a credential.

The dependency audit runs `npm audit` against the committed lockfile and blocks High and Critical findings. Lower severities are reported by npm but do not fail this initial gate. The dependency-audit parser fails closed if npm cannot return a valid report.

CodeQL Advanced Setup analyzes JavaScript and TypeScript with the `security-extended` query suite on pull requests to `main`, pushes to `main`, weekly, and on manual dispatch. CodeQL Action v4 uploads SARIF results for code-scanning alerts. A local SARIF threshold check fails the required `CodeQL / Analyze (javascript-typescript)` status for any High or Critical security-severity finding (score 7.0 or higher); Medium and Low alerts remain visible in GitHub for triage. Safe synthetic SARIF fixtures verify that a High finding fails the gate and a Medium finding passes. An exception in `security/codeql-exceptions.json` must identify the exact CodeQL rule, repository-relative path, accountable owner, rationale, and expiry; unused, duplicate, malformed, and expired exceptions fail the gate. Broad query exclusions are not allowed.

The `SBOM and license policy` check packs the release candidate, installs that exact tarball in a clean temporary consumer, and uses npm 10.9.9 to generate a CycloneDX SBOM from the installed runtime graph with development dependencies omitted. The check validates every transitive runtime component against `security/license-policy.json`; SPDX expressions are interpreted as alternatives (`OR`) and cumulative obligations (`AND`). Unknown or disallowed licenses fail closed. Exact package/version exceptions in `security/license-exceptions.json` require an owner, reason, evidence, and expiry, and are printed in the CI log. The synthetic GPL fixture verifies that a disallowed license blocks the check. CI retains each generated SBOM as an Actions artifact for 90 days. The release workflow attaches the version-matched SBOM to the GitHub Release before npm publication.

The current license policy allows `0BSD`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `BlueOak-1.0.0`, `CC0-1.0`, `ISC`, `MIT`, `MIT-0`, `Python-2.0`, and `Unlicense`. Five exceptions cover the current `khroma@2.1.0` missing manifest metadata (manually verified MIT license file), `elkjs@0.9.3` under EPL-2.0, two exact OFL-1.1 font packages, and the exact Font Awesome package with its CC-BY-4.0/OFL-1.1/MIT composite license. They expire on 2027-10-17 and must be re-reviewed before dependency or release changes.

An exceptional High/Critical finding may be temporarily excepted only when `security/dependency-exceptions.json` names the exact package and advisory URL, states the reason and accountable owner, and gives an ISO expiry date. The check fails on expired, malformed, duplicate, or stale exceptions. Resolve or renew an exception in a reviewed pull request before its expiry; never use exceptions to conceal a secret that may be live.

The active `main` ruleset requires pull requests, blocks deletion and non-fast-forward updates, and requires all six quality-matrix checks, Product model validation, Secrets scan, Dependency audit, SBOM and license policy, and the CodeQL analysis/threshold check. As a single-maintainer project, zero required GitHub approvals is intentional; human review remains part of the engineering Done gate.
