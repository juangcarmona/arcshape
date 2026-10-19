<!-- pdac-scope: cited -->

# Tasks

## 1. Capture the migration contract

- [ ] 1.1 Inventory current public and engineering route URLs, navigation, themes, typography, spacing, responsive breakpoints, assets, and host base paths; retain representative desktop/tablet/mobile screenshots and a route manifest for comparison.
- [ ] 1.2 Record the public Cloudflare root/build/output contract and the engineering GitHub Pages output/base/provenance contract; verify which existing scripts and generated snapshot artifacts each workflow consumes.

## 2. Move both site shells to Astro static output

- [ ] 2.1 Add the Astro static build for the public shell under `src/public-site`; preserve its Cloudflare project root, `npm run build`, `dist`, and site-local `test`/`verify` commands. Verify a clean isolated static build and no server adapter or runtime service.
- [ ] 2.2 Convert the engineering portal shell to Astro while retaining independently generated Product and Architecture snapshots, E2E summary allowlist, source revision, route compatibility, and `/arcshape/` output base. Verify the static `_site` contains the complete portal and no public-site output.
- [ ] 2.3 Port current components, styles, assets, routes, navigation, and theme behavior without redesign; keep public and engineering outputs independent while sharing ArcShape-owned shell elements only where that does not couple their routes or deployment. Verify route-manifest parity and screenshot review at desktop, tablet, and phone widths.
- [ ] 2.4 Keep English and Spanish content in locale-specific data with shared templates and explicit route counterparts; add a completeness check for route, navigation, title, description, and language-switch parity. Verify all existing locale routes remain stable and a third locale can be added by data/configuration without duplicating templates.

## 3. Support traceable Markdown diagrams

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:6de872f89c5b3753b22a10f604648315d5993dfda359afdc07e161a6ba0cf228" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:f5d7e3a6b239e2851ee9554633e1a19cddd05a71b703ed1f184ba0d21e4da3f9" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:91f111b3ea40541300039f0b7843433864fd6d6cd379616e415990cfd66c6077" -->
<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
<!-- pdac:cite id="FR-PRODUCT-DEFINITION-LINKS" digest="sha256:d653de7a070313b78fa267d4419b7f31544e393c3c1ac2721ac0dbc231d92a26" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

- [ ] 3.1 Preserve Mermaid fenced-block rendering in the architecture reader. Add visible renderer identification, source links, source revision provenance, and accessible SVG title/description/caption behavior. Verify existing architecture Mermaid diagrams, keyboard flow, and non-colour labels.
- [ ] 3.2 Add Archify as a build-time enhanced static HTML diagram renderer using authored/reproducible Archify artifacts; do not add its browser runtime to the deployed sites. Verify generated HTML identity, artifact/source links, revision provenance, artifact integrity, keyboard access, responsive presentation, and non-colour labels.
- [ ] 3.3 Make site, asset, source, and diagram links base-aware for public root deployment and the engineering `/arcshape/` subpath. Verify both generated outputs when served from `/` and `/arcshape/`, including link integrity and no root-absolute route regression.

## 4. Integrate validation and deployment documentation

- [ ] 4.1 Add or update a path-filtered CI workflow to build and verify both Astro outputs on pull requests and `main`; verify no Cloudflare credential or deployment action is introduced and that output artifacts cannot cross publication boundaries.
- [ ] 4.2 Extend Playwright journeys to cover the established route map, English/Spanish switching, existing theme controls, keyboard navigation, responsive behavior, source links, Mermaid/Archify output, and provenance at root and subpath bases. Verify with the repository's configured E2E command.
- [ ] 4.3 Update both site READMEs and `docs/pages-deployment.md` with the Astro commands, artifact paths, diagram authoring/rendering, source/revision conventions, Cloudflare preview flow, GitHub Pages base path, production approval, and recovery steps. Verify each command and setting against the checked-in configuration.
- [ ] 4.4 Verify a real Cloudflare pull-request preview and record its URL and actual dashboard root/build/output/preview settings. Leave production deployment and `arcshape.dev` domain binding disabled.

## 5. Review integrated evidence

- [ ] 5.1 From a clean checkout, verify both independent Astro outputs, all current URLs, locale parity, themes, design baselines, Mermaid and Archify provenance/accessibility, source revision, and root/subpath behavior; retain current-head CI, E2E, screenshot, and Cloudflare preview evidence.

## Definition of Done coverage

The implementation and review must provide evidence for every applicable ArcShape Done item:

1. Acceptance criteria: route/theme/layout parity, Astro static builds, bilingual expansion, diagram provenance/accessibility, deployment behavior, and preserved ArcShape identity have demonstrable evidence; human reviewer judges visual preservation.
2. Implementation completeness: both shells and their separate host artifacts are complete; explain any dropped route or renderer scope.
3. Tests: route, locale, theme, responsive, keyboard, diagram, provenance, root/subpath, and deployment-boundary checks fit the risk; reviewer judges adequacy.
4. Quality checks: format, lint, typecheck, unit tests, and helper-script build pass in the supported Node 22/24 and Ubuntu/Windows/macOS matrix.
5. Security: review current secret, dependency, CodeQL, SBOM/license, passive DAST, and scheduled/manual mutation evidence. Keep renderer dependencies build-time, preserve the allowlisted E2E summary boundary, and add no Cloudflare credential to Actions.
6. Architecture/design conformance: review public/engineering separation, canonical-source provenance, build outputs, and documented arc42 views; record deviations.
7. Documentation: update the site, diagram, deployment, and recovery instructions and verify their commands against the build.
8. Product/spec consistency: validate public claims against active product artifacts and keep Markdown/diagram sources canonical; verify OpenSpec and citation status.
9. Evidence: retain current-head CI, build, browser, visual comparison, diagram, and reviewed Cloudflare preview evidence.
10. Human review: obtain review approval before merge; Cloudflare production and domain activation remain separately gated.
11. Known limitations: disclose unavailable Cloudflare verification, incomplete fluent translation review, or renderer accessibility/integration limitations before acceptance.

## Workflow follow-up

- After implementation review and merge, archive this OpenSpec delivery change with the minimum useful context under the repository's integrate workflow.
