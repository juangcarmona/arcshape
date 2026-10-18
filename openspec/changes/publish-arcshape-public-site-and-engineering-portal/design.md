<!-- pdac-scope: cited -->

# Design: Public Site and Engineering Portal

## Context

ArcShape currently publishes its generated architecture reader at the GitHub Pages root. The repository's Pages workflow builds that reader from canonical architecture Markdown, while ProductShape can already generate a static HTML snapshot from `docs/product/model`. The Assurance workflow uploads Playwright reports and test results as temporary Actions artifacts, but does not publish a public summary. ArcShape has no product marketing site yet.

The target has two independent static surfaces:

- `https://arcshape.dev`: public product information, using ArcShape branding and the shared ProductShape visual language, hosted on Cloudflare Pages.
- The existing GitHub Pages hostname: a small engineering portal at `/` linking to the Product Snapshot, Architecture Snapshot, optional E2E summary, and public site.

ProductShape's active model and ArcShape's `docs/architecture` remain canonical. Their HTML outputs are generated projections. This boundary follows the approved authority and architecture-documentation requirements.

<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="FR-PRODUCT-DEFINITION-LINKS" digest="sha256:d653de7a070313b78fa267d4419b7f31544e393c3c1ac2721ac0dbc231d92a26" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->

## Goals and Non-Goals

### Goals

- Present ArcShape clearly to prospective users at its purchased domain.
- Keep marketing content and engineering evidence on separate hosting and release lifecycles.
- Publish source-revision-identifiable snapshots from the exact repository revision being deployed.
- Preserve existing architecture-reader section bookmarks.
- Publish only a deliberately allowlisted E2E summary from a completed `main` run.
- Make previews, publication provenance, accessibility, and recovery reviewable.

### Non-Goals

- Change ArcShape product behavior, the ProductShape model, or canonical architecture documentation.
- Add a backend, analytics, forms, or visitor/repository data collection.
- Publish raw Playwright traces, screenshots, test-results, or unrestricted Actions artifacts publicly.
- Add an E2E suite or new CLI integration solely to populate the portal.
- Activate the Cloudflare production hostname or bind the custom domain without maintainer approval.

## Decisions

### 1. Host the public product site on Cloudflare Pages with Git-based previews

Put the standalone site source under `src/public-site/`. Configure a Cloudflare Pages project connected to the ArcShape repository, with pull-request previews and `main` as the designated production branch. GitHub Actions independently builds and validates the same source on pull requests and `main`; it does not deploy to Cloudflare and therefore needs no long-lived Cloudflare API token.

Before production is activated, verify the Cloudflare project is using the intended Git integration and confirm the account's branch and domain settings. Raccord's deployment guide notes that a project may instead be configured for Direct Upload even when the ADR describes Git integration. Keep production deployment and `arcshape.dev` binding disabled until a maintainer has reviewed a preview and approved activation. The precise DNS records and dashboard mode are deployment facts to record in the implementation guide after account inspection.

The site uses the shared ProductShape design system where available, but all product copy and identity are ArcShape-specific. Only approved brand assets belong in tracked public-site assets; files currently present only in local generated output are not a publication source.

This reuses the deployment separation established in Raccord while preserving an approval point for first production activation.

### 2. Keep one complete GitHub Pages publisher for engineering artifacts

Extend `.github/workflows/pages.yml` as the sole writer of the GitHub Pages environment. A build assembles a fresh, complete output tree with these stable routes:

| Route | Content | Source |
| --- | --- | --- |
| `/` | Concise engineering landing page and links | Tracked portal source |
| `/model/` | ProductShape-generated Product Snapshot | `docs/product/model` at `$GITHUB_SHA` |
| `/architecture/` | ArcShape Architecture Snapshot reader | `docs/architecture` at `$GITHUB_SHA` |
| `/e2e/latest/` | Optional allowlisted run summary | Latest eligible completed `main` Assurance run |

Generate the architecture reader with `--source-ref "$GITHUB_SHA"` rather than the current fixed `main` reference. Generate the Product Snapshot using the already-pinned `@prodshape/cli` and copy its generated HTML into `/model/`. Include an explicit commit link or visible revision metadata on the portal so a reader can identify the revision that produced each artifact. Do not check generated snapshots into canonical source directories.

Build into a clean directory and validate all required routes before invoking the existing GitHub Pages deployment action. A failed generation or validation must fail before deployment, leaving the last successful site intact. Keep production concurrency serialized so concurrent runs cannot race or publish partial trees.

Moving the architecture reader under `/architecture/` changes its URL base. Add a root fallback that preserves prior `/#/section/...` bookmarks by transferring the hash to `/architecture/`. Verify the generated reader's relative asset URLs under its new base as part of the migration.

This follows ArcShape's existing generated-reader workflow and Raccord's single-publisher model. A single complete site artifact avoids competing uploads from separately owned workflows.

### 3. Publish E2E as an allowlisted summary, not as an Actions artifact mirror

The current Assurance workflow stores `playwright-report/` and `test-results/` for 30 days. Those artifacts may contain raw traces, screenshots, URLs, or other details that are not reviewed for public disclosure. Keep them in Actions with their current retention and add a separate public projection only after a completed `main` run.

The implementation should create a small summary document containing only the workflow run identifier and URL, source commit, completion time, and overall E2E result. The publisher must obtain it from the exact completed `main` run, validate the expected schema and repository/run identity, and construct the public page from those allowlisted fields. It must never copy arbitrary files from the Actions artifact. Do not publish a report for pull-request runs. If no eligible report exists, omit the route and landing-page link while continuing to publish the other views.

Use a least-privilege workflow trigger and permissions. The implementation must prevent stale or out-of-order runs from replacing a summary from a newer `main` commit; an ordering rule based on the repository commit graph or a validated latest-successful run lookup is required. Ordinary Pages rebuilds must retain the newest eligible summary instead of erasing it. If retrieval or validation fails, preserve the prior safe summary or omit the E2E route on an initial publication; do not fail the portal's other required content. Add workflow tests for these cases.

The current Product Definition prohibits ArcShape-operated data collection; static publication of a minimal, synthetic run result does not add a collection service.

<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

### 4. Keep product claims within the approved capability model

Write the marketing site's copy from currently approved ArcShape capabilities. Separate current capabilities from work that is planned or exploratory, and link technical readers to the engineering portal and its source-backed artifacts. The public site is communication about ArcShape; it does not imply the site itself is a hosted ArcShape product service.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

### Alternatives considered

- **Put both surfaces on GitHub Pages:** rejected because marketing and engineering content have different release and ownership needs, and it would not meet the requested Cloudflare public-site pattern.
- **Deploy Cloudflare with Wrangler from GitHub Actions:** rejected because it would add a deployment credential and create a second CI-controlled production writer. Git integration provides branch previews without that token.
- **Publish raw Playwright artifacts:** rejected because temporary test artifacts are not a safe, stable public interface and may expose unreviewed trace data.
- **Give each engineering artifact its own Pages workflow:** rejected because independent uploads can overwrite one another or expose an incomplete portal.

## Risks and Trade-offs

- **Shared design system or final brand assets may not be ready.** Confirm the consumable design-system package and approved logo/wordmark early; make the public-site build reproducible without copying local generated output.
- **Cloudflare dashboard state may differ from the intended Git integration.** Inspect and document project mode, preview behavior, production branch, and custom-domain configuration before activation.
- **E2E summaries cross a public disclosure boundary.** Keep the schema allowlisted and synthetic, test malformed and PR-origin data rejection, and retain raw artifacts in Actions only.
- **A route migration can break bookmarks or assets.** Test legacy root hash redirects and all reader asset links from `/architecture/` before production deployment.
- **Two hosting providers increase operational surface.** Document ownership, build source, preview URLs, production branch, recovery steps, and the last known-good Pages artifact for each surface.
- **The initial public-site activation is an external production change.** Review the Cloudflare preview and obtain maintainer approval before enabling production deployment or DNS binding.

## Migration Plan

1. Build and review the public site through a Cloudflare preview while production and custom-domain activation remain disabled.
2. Extend the GitHub Pages workflow to assemble the portal and both snapshots; verify routes and legacy links in a preview or local static server before the first publish.
3. Publish the complete portal from `main`. The old root reader entry redirects old section-hash URLs to `/architecture/`.
4. Validate source revisions, links, accessibility, and the optional E2E safe-summary path. Document rollback by redeploying the prior Pages artifact/revision.
5. After a maintainer explicitly approves the reviewed preview, enable Cloudflare production deployment and bind `arcshape.dev`; record verified DNS and project settings in the operations guide.

No product-model migration is needed. Existing canonical Markdown remains authoritative.

## Definition of Done Coverage

The implementation must satisfy these repository Definition of Done dimensions:

1. **Acceptance criteria:** provide demonstrable evidence for every issue criterion, with human judgement for subjective criteria.
2. **Implementation completeness:** complete both surfaces and explain any dropped scope; leave no placeholders or silent omissions.
3. **Tests:** cover site builds, routes, provenance, concurrency, redirects, and safe E2E projection at a risk-appropriate level.
4. **Quality checks:** pass format, lint, typecheck, unit tests, and helper-script build in the supported CI matrix.
5. **Security:** review secret/dependency scanning, CodeQL, SBOM/license policy, passive DAST, scheduled mutation results, exceptions, and public-data disclosure.
6. **Architecture / design conformance:** review changes against the established arc42 documentation and record deviations.
7. **Documentation:** update user, operational, developer, and architecture documentation where the change affects them.
8. **Product / spec consistency:** preserve the approved ProductShape baseline, verify PDAC citations, and archive only minimal useful OpenSpec delivery context.
9. **Evidence:** preserve current-head checks and relevant build, preview, publication, accessibility, and runtime evidence.
10. **Human review:** obtain reviewer approval before merge, including review of the two hosting previews.
11. **Known limitations:** record residual risks and limitations for reviewer acceptance.

Also satisfy **Phased engineering assurance**: do not claim a control is active without current evidence; collect the repository's CI, secret/dependency, SAST, SBOM/license, E2E, passive DAST, and scheduled/manual mutation results, and preserve their advisory/required status as currently configured. Production Cloudflare activation and domain binding remain subject to explicit maintainer approval.

## Open Questions

None block the design. Confirm the Cloudflare project's actual Git integration mode, final approved brand assets, and the shared design-system consumption path during implementation; record any material deviation in the implementation plan before changing the deployment design.
