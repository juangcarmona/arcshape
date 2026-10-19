# ArcShape public and engineering sites

ArcShape publishes two independent static surfaces:

- **Public product site:** `https://arcshape.dev`, sourced only from `src/public-site/` and intended for Cloudflare Pages Git integration. It uses ArcShape-owned copy, styles, and assets. No ProductShape site package or assets are imported.
- **Engineering portal:** `https://juangcarmona.github.io/arcshape/`, built and deployed by `.github/workflows/pages.yml`. Its `/model/` and `/architecture/` routes are generated projections of `docs/product/model/` and `docs/architecture/` from the exact checked-out commit.

ProductShape and ArcShape remain independent products and repositories. ArcShape uses its existing `@prodshape/cli` development dependency to render ArcShape's own canonical model; neither public site has a runtime dependency on the other product.

## Engineering portal build and recovery

Pull requests build the complete portal and validate the public-site source without deploying Pages. Pushes to `main` and completed Assurance runs build one clean Pages artifact; the production concurrency group serializes publication. The workflow has repository `contents: read` and `actions: read` permissions. Only its deployment job receives `pages: write` and `id-token: write`.

The portal's landing page links to the Product Snapshot, Architecture Snapshot, and `arcshape.dev`. The snapshots include their producing commit and links to the matching canonical source paths. The former root reader URL's `/#/section/...` bookmark is redirected to the same fragment under `/architecture/`.

Assurance retains full Playwright reports and traces as private, temporary Actions artifacts. A separate private Actions artifact carries the validation envelope `repository`, `run_id`, `source_commit`, `completed_at`, and `result`; Pages requires the selected run ID and repository identity to match. The public `/e2e/latest/summary.json` projection contains exactly:

```json
{
  "run_id": 123456789,
  "source_commit": "<40-character commit SHA>",
  "completed_at": "2026-10-18T12:00:00.000Z",
  "result": "success"
}
```

The publisher selects the latest completed Assurance run on `main` by run ID. When a download is absent, malformed, or older than the published summary, it carries forward the newest valid public summary; it never carries the private envelope forward. Missing summary data on an initial publication does not block the two required snapshots. To remove a published summary, run the Pages workflow manually from `main` with **Remove the public E2E summary** selected; the new complete publication omits the route and link. No trace, screenshot, or raw test-results directory is copied to Pages.

If a Pages build fails, it fails before upload/deploy and the previous deployment remains available. Correct the source or workflow and rerun the publisher from `main`. To roll back, rerun the workflow from the last known-good commit or redeploy the previous GitHub Pages artifact from Actions. To unpublish the engineering portal, use repository Settings → Pages → Unpublish site.

## Cloudflare Pages setup and status

The repository contains no Cloudflare credential and Git integration is configured in the Cloudflare dashboard. The project mode, preview URL behavior, production branch, custom-domain state, and rollback route still need live dashboard verification; this repository change cannot prove that account state. Do not record the site as deployed until those values are checked.

When configuring the project, connect the ArcShape repository, set the build root to `src/public-site`, use no framework build command, and publish that directory as the static output. Enable pull-request preview deployments and verify a preview URL from an actual PR. GitHub Actions independently validates the source and does not deploy to Cloudflare. Keep production deployment and `arcshape.dev` domain activation disabled until the maintainer reviews a preview and authorizes activation. Record the actual dashboard mode, branch, preview URL, domain state, and rollback steps here after verification.

The Cloudflare project is separate from GitHub Pages: marketing content does not enter the engineering portal build, and a portal deployment does not publish the public site.

## Implementation verification evidence

Local verification on 2026-10-19, using Linux, Node `v22.22.1`, and the checked-out implementation tree. The repository CI matrix also covers Windows and macOS and Node 24; those matrix runs require CI.

| Command | Result |
| --- | --- |
| `npm run format:check` | Passed. |
| `npm run lint` | Passed. |
| `npm run typecheck` | Passed. |
| `GITHUB_ACTIONS=true TMPDIR=/var/tmp npm test` | Passed: 23 files, 104 tests, including portal assembly, workflow, summary validation, and route compatibility tests. |
| `npm run build` | Passed. |
| `npm run product:model:check` | Passed; all model artifacts have accepted statuses. |
| `npm exec -- prodshape validate --format json` | Passed; 35 artifacts, no diagnostics. |
| `npm exec -- openspec validate --all --no-interactive` | Passed; 4 items. |
| `npm exec -- prodshape citations verify --provider openspec` | Passed; 70 citations current, none stale, tampered, or unresolved. |
| `npm run security:audit` | Passed; no unexcepted High or Critical dependency findings. |
| `RUNNER_TEMP=/tmp bash scripts/test-secret-scan.sh` | Passed; the scanner blocked its harmless synthetic fixture. |
| `node scripts/test-npm-audit-gate.mjs` | Passed; the synthetic High finding was rejected. |
| `node scripts/test-license-policy.mjs` | Passed; synthetic allow, deny, unknown, and exception cases behaved as expected. |
| `node scripts/test-codeql-sarif.mjs` | Passed; synthetic High finding was rejected. |
| `node scripts/validate-public-site.mjs` | Passed. |
| `npx --yes --package=npm@10.9.9 -c 'PATH="$(dirname "$(command -v npm)"):$PATH" bash scripts/generate-release-sbom.sh /tmp/arcshape-62-sbom'` and `node scripts/check-license-policy.mjs /tmp/arcshape-62-sbom/arcshape-0.1.1-sbom.cdx.json` | Passed; generated a CycloneDX SBOM with 247 components and passed the license policy with 5 active, scoped exceptions. |
| Pinned ZAP Baseline `2.17.0` against the built local architecture reader, followed by `node scripts/check-zap-report.mjs` | Passed the configured severity policy; 58 checks passed, with 4 Medium, 6 Low, and 2 Informational alerts. No High alerts. |
| `GITHUB_ACTIONS=true TMPDIR=/var/tmp npm run test:e2e` | Passed: 5 Playwright tests, including public-site accessibility, the generated portal mounted under `/arcshape/`, and the section 07 deployment diagram. |

The portal browser test builds the model and architecture snapshots from the current checkout, checks their source revision, follows both routes, and opens a prior `/#/section/01` bookmark at `/architecture/#/section/01`. The public-site browser test checks keyboard focus, image alternatives, primary-action contrast, and overflow at mobile and desktop widths. I also inspected local browser screenshots of both pages: `/tmp/arcshape-62-public-site.png` and `/tmp/arcshape-62-engineering-portal.png`. Cloudflare dashboard configuration and a Cloudflare-hosted preview were not available to inspect from this environment; those external deployment facts remain unverified. The full TruffleHog scan and cross-platform CI matrix are also not reproduced locally.
