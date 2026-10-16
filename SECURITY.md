# Security Policy

## Supported versions

ArcShape is in its initial development stage and has no released version or long-term support branches. Security fixes will be made on the current default branch.

## Reporting a vulnerability

Please do not report suspected vulnerabilities in a public issue. Use GitHub's private vulnerability reporting for this repository if it is enabled. Otherwise, contact the repository maintainer privately with the affected commit or version, impact, and reproduction steps.

## Scope

ArcShape is intended to run locally in a developer's repository. The CLI and hosted documentation experience are not yet implemented; update this section as those capabilities and their data flows are established.

## Automated checks

GitHub Actions runs TruffleHog OSS v3.99.2 (action revision `e76dff8a7e57d6df0c60ad8cbf5d5cba505a8fc9`) on pull requests and pushes to `main`, plus a scheduled full-history scan. Credential verification is disabled so detected values are not sent to external credential-verification endpoints. Any scanner result blocks the check; do not add broad secret allowlists. Triage a suspected false positive by recording its file, detector, reason, owner, and expiry in a reviewed change; prefer rewriting safe example data so it no longer resembles a credential.

The dependency audit runs `npm audit` against the committed lockfile and blocks High and Critical findings. Lower severities are reported by npm but do not fail this initial gate. The dependency-audit parser fails closed if npm cannot return a valid report.

An exceptional High/Critical finding may be temporarily excepted only when `security/dependency-exceptions.json` names the exact package and advisory URL, states the reason and accountable owner, and gives an ISO expiry date. The check fails on expired, malformed, duplicate, or stale exceptions. Resolve or renew an exception in a reviewed pull request before its expiry; never use exceptions to conceal a secret that may be live.

These workflows are separate from GitHub's repository ruleset. The active `main` ruleset currently requires pull requests, blocks deletion and non-fast-forward updates, but does not require CI checks or approvals. Treat the scans as configured evidence, not enforced merge gates, until the ruleset requires them.
