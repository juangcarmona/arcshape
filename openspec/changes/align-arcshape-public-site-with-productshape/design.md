<!-- pdac-scope: cited -->

# Design

## Context

The public site is an ArcShape-owned static landing page. The engineering publication currently combines a hand-authored portal page with generated Product and Architecture snapshots on GitHub Pages. The architecture snapshot already renders Mermaid fences into accessible inline SVG. ProductShape provides the visual and content-organization reference, including localized pages and committed standalone Archify HTML diagrams. Raccord's deployment record remains the reference for Cloudflare Pages Git integration.

This change replaces the rendering engine for both site shells with Astro while preserving their established UI and URL contracts. The site shells, generated engineering artifacts, and Cloudflare/GitHub Pages outputs remain separate. Public claims remain bounded by these active Product Definition artifacts:

<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:ad28a7a6a80b8c334af9daa92a36c929b812c654611bebe10aac9b487072ef98" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-ADR-WORKFLOWS" digest="sha256:1301b243301cd5655ee38a47d55af3b9713bd2396d6db5d15e50a910d0fb9254" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="FR-REVERSE-ENGINEER-ARCHITECTURE" digest="sha256:03fea6b807b52d2c0a6b5a45578f39a2c17bd7a6bc9f62505c27ddebbdc2ee5e" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
<!-- pdac:cite id="FR-PRODUCT-DEFINITION-LINKS" digest="sha256:d653de7a070313b78fa267d4419b7f31544e393c3c1ac2721ac0dbc231d92a26" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## Goals / Non-Goals

**Goals:**

- Use Astro's static build for both public and engineering site shells.
- Preserve the established page appearance, route URLs, themes, responsive behavior, typography, spacing, and navigation through the migration.
- Keep the existing English `/` route and add a Spanish `/es/` counterpart through locale data and route mapping that support adding languages without duplicating shell templates.
- Keep Mermaid in Markdown and support Archify as an enhanced static HTML diagram renderer, with renderer labels, source links, revision provenance, accessibility, and root/subpath-safe links.
- Produce separate static output artifacts for Cloudflare Pages and GitHub Pages, preserving their existing publication boundary and approval gates.

**Non-Goals:**

- Redesigning either site's visual system, navigation, route hierarchy, or responsive behavior as part of the engine migration.
- Changing ArcShape product behavior, canonical Product Definition, or canonical architecture facts.
- Adding an Archify browser runtime, hosted diagram service, ProductShape runtime dependencies, or ProductShape-branded assets.
- Activating Cloudflare production deployment or `arcshape.dev` DNS.

## Decisions

### 1. Use Astro for two independent static site builds

Use Astro's static output for the public-site shell and engineering-portal shell. Keep the public application rooted at `src/public-site` with `npm run build` producing Cloudflare's `dist/`, preserving the selected Raccord Git integration contract. Build the engineering shell as its own static artifact for the existing GitHub Pages workflow. Keep canonical content, generated snapshots, and deployment workflows independent; do not make either site depend on the other's generated output.

The build implementation may share small ArcShape-owned Astro shell components and design tokens, but each site keeps its own route inventory, localized content, navigation configuration, and output directory. The public app remains buildable within its Cloudflare project root. Set Astro's documented `base` and `outDir` options per output so the public root and GitHub Pages `/arcshape/` publication resolve local links and assets correctly ([Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)).

Astro is selected as the static generator only. No server adapter, request-time rendering, or client framework is introduced. Any browser-side JavaScript remains limited to existing site controls and is emitted as static assets.

### 2. Freeze the established UX contract during migration

Capture the current public and engineering route trees, navigation, screenshots, appearance, typography, spacing, and responsive states before replacing templates. Port those structures into Astro without changing their visible result or URLs. The repository baseline contains only English public `/` and neither shell has an appearance selector; retain that route and light appearance, add public `/es/` for the approved Spanish parity requirement, and provide an equivalent-page language link. Store locale text and route counterparts separately from templates, and make locale completeness a build validation rule for future additions. See `docs/delivery/issue-78/baseline.md` for the evidence-based baseline correction.

ProductShape remains the quality reference for the agreed visual relationship, but this change is an engine migration and must not redesign the established presentation. ArcShape-owned branding and assets remain unchanged.

### 3. Render Markdown diagrams as static, traceable artifacts

Retain Mermaid fenced blocks in canonical Markdown and the existing deterministic build-time Mermaid-to-SVG path. Add visible renderer identification and source links to the diagram presentation, and retain the source revision on engineering pages. Accessibility checks cover diagram titles/descriptions, keyboard reachability of surrounding controls, captions, and labels that do not rely on colour alone.

Support Archify as a second, enhanced renderer by publishing its generated standalone HTML diagram artifacts. Markdown pages reference the checked-in or reproducibly generated diagram artifact and its canonical source; the site build copies the standalone HTML and provides an accessible caption/link rather than loading a remote renderer. Preserve Archify's identity inside the diagram page, add source and revision provenance, and validate its links at both root and `/arcshape/` bases. The build does not bundle Archify as a runtime package.

Do not convert Mermaid diagrams to Archify automatically or treat either rendered artifact as canonical. Markdown and authored diagram sources remain authoritative.

### 4. Preserve Cloudflare and GitHub Pages publication boundaries

Cloudflare Pages continues to use Git integration with project root `src/public-site`, build command `npm run build`, output `dist`, pull-request previews, and `main` designated for production. Keep production deployment and custom-domain activation gated for maintainer approval. A site validation workflow builds both Astro outputs and tests route/diagram behavior without deploying either one and without Cloudflare credentials.

The GitHub Pages workflow consumes only the engineering output plus the already generated Product and Architecture snapshots and approved public E2E summary. It retains the `/arcshape/` base path and source-revision checks. It never uploads the Cloudflare artifact. A failed build leaves the prior deployment intact under the existing host behavior.

### 5. Treat product content as a reviewed projection

Review public claims in English and Spanish against current CLI documentation and active Product Definition citations. Keep canonical product and architecture sources unchanged. The public and engineering sites may link to source files and display rendered explanatory diagrams, but rendered HTML does not become product or architecture authority.

## Risks / Trade-offs

- **Astro migration changes generated HTML details and could cause visual drift** → capture current screenshots and route/theme states, then compare after migration at desktop, tablet, and phone sizes.
- **The public Cloudflare root and engineering `/arcshape/` base can break assets or source links** → build and serve both bases in browser tests and check every local link in the generated artifacts.
- **Archify standalone HTML may be inaccessible, stale, or lose provenance** → validate renderer identity, source/revision links, labels, keyboard behavior, and artifact hashes before publishing.
- **Locale additions can leave untranslated routes** → enforce route and metadata parity in the build and keep translation review visible as a release criterion.
- **Astro or diagram-tool dependencies may expand the supply-chain surface** → pin and audit build-time dependencies; do not ship server or renderer runtimes.
- **Cloudflare dashboard state may differ from repository settings** → verify an actual pull-request preview and dashboard mode; keep production and DNS disabled until explicit approval.

## Migration Plan

1. Capture route, navigation, theme, typography, spacing, responsive, and accessibility baselines for both sites and document the accepted routes and current output paths.
2. Convert the two shells to Astro static builds and compare route maps and browser snapshots before changing content or visual treatment.
3. Wire the existing generated Product/Architecture snapshots and public assets into independent Astro outputs; preserve source revision metadata and GitHub Pages subpath behavior.
4. Keep Mermaid Markdown rendering and add source/renderer metadata. Add Archify standalone HTML diagrams with source files, revision provenance, captions, accessibility checks, and base-aware links.
5. Run local route, locale, theme, keyboard, responsive, diagram, root-path, and subpath verification. Confirm no public and engineering output contamination.
6. Verify a real Cloudflare pull-request preview and document dashboard settings. Leave production and custom-domain activation disabled pending explicit approval.

## Open Questions

None block the plan. Cloudflare project access and fluent Spanish review remain implementation-time dependencies; any unavailable review must be reported before production activation.
