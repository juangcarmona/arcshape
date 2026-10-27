<!-- pdac-scope: cited -->

# Proposal

## Why

ArcShape needs the structural and visual relationship to ProductShape that motivated #78, while preserving the site's established appearance and behavior. The rendering technology should support both public and engineering shells, bilingual route maintenance, and richer static diagrams without redesigning the sites or merging their publication boundaries.

## What Changes

- Replace the public and engineering site-shell build engines with Astro static builds. Keep Cloudflare Pages rooted at `src/public-site`, using `npm run build` to produce `dist`; keep the engineering output independent for GitHub Pages.
- Preserve the established appearance, URLs, themes, responsive behavior, typography, spacing, and navigation during migration. Keep English and Spanish route parity, with locale data structured for future language additions.
- Continue Mermaid rendering in Markdown and support Archify as an enhanced static HTML diagram renderer. Both diagram outputs retain renderer identity, source links, source-revision provenance, accessible labels, and root/subpath-safe links.
- Keep product and architecture sources canonical, generated diagrams static, ProductShape packages and assets out of runtime output, and each host's publication workflow independent.
- Retain reviewable Cloudflare pull-request previews while production deployment and domain activation remain gated for explicit maintainer approval.

## Capabilities

### New Capabilities

- `public-product-site`: bilingual public product routes, preserved presentation, and an independently built Astro static publication. The capability also defines its static integration with the engineering publication.
- `engineering-site-shell`: an Astro static portal shell that preserves existing routes and presentation while carrying revision-stamped Product/Architecture snapshots and traceable Mermaid/Archify diagrams to GitHub Pages.

### Modified Capabilities

None. The active `openspec/specs/` inventory has no existing public-site or engineering-shell capability. This change adds both capability specs and defines the expanded delivery scope in one place.

## Impact

- `src/public-site/`: Astro public shell and build, locale mapping, static diagram references, verification, and Cloudflare output.
- `src/engineering-portal/`, `scripts/build-engineering-portal.mjs`, and `.github/workflows/pages.yml`: Astro engineering shell integration while retaining generated snapshots, source revision, and GitHub Pages base path.
- `packages/cli/src/arc42-site/`: preserve Mermaid support and expose renderer/source/provenance metadata for rendered architecture pages.
- Site and diagram sources: add reviewed Archify static HTML artifacts and their source/revision metadata; do not add an Archify runtime dependency.
- `docs/pages-deployment.md` and site READMEs: document both Astro outputs, diagram authoring/publication, root and subpath builds, and independent host workflows.
- Cloudflare Pages: keep Git integration and PR previews; verify the real preview, with production and `arcshape.dev` activation held for explicit approval.

## Product Definition Impact

This changes static site generation and rendered presentation, not ArcShape's product capabilities or canonical Product Definition. Mermaid is already supported by the architecture renderer. Archify diagrams are published as explanatory static artifacts, not as a new hosted capability or canonical product model. These active artifacts bound any copy and reader claims; none is modified:

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

Impact analysis widened from these capability and boundary anchors to their related terms, use cases, actors, and `BC-ARCHITECTURE-KNOWLEDGE`; those neighbors inform the wording but are not changed. `QR-READER-COMPREHENSION` remains outside this change because the existing architecture-reader content model and interaction are not being redesigned. No product-definition drift or Product Change is required for static publication and renderer integration.

The revised scope for #78 includes both site shells and diagram publication. ProductShape is a visual and structural reference, not a runtime dependency. Cloudflare follows the selected Git integration pattern documented in Raccord ADR-0025.
