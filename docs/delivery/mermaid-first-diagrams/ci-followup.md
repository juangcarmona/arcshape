# Release guidance and passive DAST correction

The maintainer accepted the native diagram presentation, requested copyable upgrade instructions and rejected internal development hostnames in public GitHub material. This follow-up does not publish a release or claim production deployment.

## Release guidance

The pending changeset includes the opt-in migration prompt. Updating the package or installed agent guidance does not rewrite authored diagrams. The prompt requires semantic review, preservation of the documentation's language, all three bundle files, supported Mermaid fallback, generation/checking, both HTML formats and screenshots before committing.

The publisher previously used only GitHub's generated change summary, which would omit the upgrade instructions stored in Changesets. It now prepends the exact package-version changelog entry when creating a new GitHub Release. The extractor rejects missing or empty version entries; its test covers version selection and fenced prompt preservation. Existing immutable versions, tags and recovery behavior are unchanged.

Public documentation and the PR description now use reproducible preview instructions and repository evidence links instead of internal machine names or private-network URLs. The public release-writing rule lives in `docs/releasing.md`.

## Observed security failure

On head `c292b3f`, the [Assurance run](https://github.com/juangcarmona/arcshape/actions/runs/41031503334/job/123982060606) failed in the second pinned ZAP scan, not in the browser journeys. The retained `native-report.json` reports rule `10062`, High-risk PII Disclosure with Medium confidence, at `/diagrams/82128e66e9739edab209/`. Its evidence is `674 240 666 240 `, classified as a Maestro card.

Inspection identifies that exact sequence in the SVG path's quadratic curve, `Q 674 240 666 240`. These are drawing coordinates, not a payment card or user data. ZAP is scanning a generated loopback preview on the runner, not a production site.

The native viewer now serializes numeric SVG path separators as commas: `Q 674,240,666,240`. SVG accepts both forms, with the same geometry. Only SVG path attributes are normalized; numeric labels and script text remain intact. No rule is disabled, finding filtered, scan removed or severity threshold changed. The existing synthetic High finding continues to block under the report policy.

The regression test checks the exact failing coordinate run, signs, fractions and exponents; it also proves that labels and scripts are not rewritten. The existing passive DAST gate caught this before merge, so no additional process gate or permanent security exception is warranted.

## Follow-up verification

- `npm run verify`: 202 tests across 33 files, format, lint, typecheck and helper build passed locally on Node 22 after isolating the bundle journeys. The local count includes two previously emitted helper tests; clean CI discovers 200 source tests.
- Full Playwright suite: 14 passed, including native interaction, keyboard/mobile behavior, isolated runtime and existing Mermaid compatibility.
- Both real passive scans passed with the workflow's pinned ZAP 2.17.0 image and unchanged report policy. A third scan targeted the exact previously failing page directly, since the spider's one-minute crawl does not guarantee visiting every diagram. All three reported 13 alert types (4 Medium, 6 Low, 3 Informational), zero High. These are reported warnings, not a claim of zero security findings.
- The synthetic High policy self-test passed. All 15 native bundles passed coordinated checking. Product model, OpenSpec, architecture links and dependency audit passed.
- Public Markdown and the updated PR description contain no internal development hostname or private preview URL.

Local verification does not stand in for the new head's remote CI, cross-platform matrix or protected publication approval. Full scanner reports remain diagnostic artifacts rather than being copied into the documentation.

## macOS test isolation

On head `10ceacd`, ZAP, E2E, security and CodeQL passed remotely. The Node 24 macOS matrix job then exposed a separate issue: the single coordinated-bundle test timed out at 60 seconds while sequentially running compatibility, navigation, regeneration and output-protection journeys, repeatedly starting Chromium. The other five matrix variants passed.

Those four journeys now have independent temporary fixtures and individual tests. Assertions and the existing 60-second per-test bound remain; no retry, skipped assertion or blanket timeout increase was added. This makes each failure independently actionable and prevents unrelated rendering work from exhausting one shared deadline. The complete matrix must verify the revised tests; a Linux run alone cannot prove macOS behavior.
