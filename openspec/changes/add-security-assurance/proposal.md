# Proposal

<!-- pdac-scope: cited -->

## Why

The repository currently blocks exposed secrets and High/Critical dependency vulnerabilities, but it has no blocking static analysis, reproducible inventory of the actual npm release payload, or transitive runtime license policy. These are gaps in engineering and release assurance, not changes to ArcShape's user-facing product behavior.

## What Changes

- Add CodeQL JavaScript/TypeScript analysis on pull requests, `main`, and a weekly schedule, using the security-extended suite and a High-or-Critical blocking threshold through GitHub code scanning merge protection. Keep narrow, expiring exceptions documented.
- Build a CycloneDX SBOM from a clean installation of the packed npm tarball, run an SPDX license policy against all runtime transitive components, and retain the SBOM with workflow evidence and as an asset on the corresponding GitHub Release.
- Add safe fixtures demonstrating that a representative SAST alert and a disallowed license fail their gates.
- Document tool versions, the threshold, policy ownership, exception evidence and expiration, and the limits of each check.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Capabilities

### New Capabilities

None. This is repository engineering and release assurance, with no product capability change. `skip_specs: true` records that boundary.

### Modified Capabilities

None.

## Impact

- `.github/workflows/security.yml`: add SAST, package SBOM generation, and runtime license-policy validation to current PR, default-branch, and scheduled security scans.
- `.github/workflows/publish.yml`: attach the release package SBOM to the corresponding GitHub Release.
- `security/` and `scripts/`: versioned policy, narrowly scoped exceptions, and deterministic policy gate.
- `SECURITY.md` and `docs/engineering-lifecycle.md`: explain the controls and current evidence.

Product impact review: the complete Product Definition was read. The only applicable artifact is `CON-NO-ARCSHAPE-DATA-COLLECTION`, because repository content is analyzed by GitHub-hosted Actions; this change sends no repository data to an ArcShape-operated service. Its structural impact was checked: nine directly governed use cases and their seven transitive neighbors (two actors, one bounded context, one business rule, and three domain terms) are unaffected because no product behavior or data handling changes. No Product Change is needed.

## Decisions

- Use CodeQL advanced setup with its supported major-version action, JavaScript/TypeScript analysis, and the security-extended query suite. Configure the GitHub ruleset to block High/Critical security alerts and errors. This provides an explicit blocking merge threshold while preserving lower-severity findings for review.
- Generate CycloneDX with npm 10.9.9 from a clean install of the exact `npm pack` tarball and `--omit=dev`; do not generate from `package-lock-only`, which omits installed package license metadata.
- Enforce an SPDX allowlist over every runtime transitive component. Exact package/version exceptions require an owner, rationale, evidence, and expiry. An absent or expired exception fails closed.
- Retain a CI SBOM artifact and upload the release SBOM as a GitHub Release asset, beside the npm package publication.

## Product definition drift

None. This change adds repository assurance controls and does not alter product behavior or the accepted Product Definition.
