<!-- pdac-scope: cited -->

# Design

## Context

Issue #109 implements the applied CHG-INTERACTIVE-DIAGRAMS-001. See proposal.md for motivation. Today `runSite` invokes `generate.mjs`; it loads canonical Markdown, pre-renders Mermaid, passes document HTML to `buildSnapshotHtml`, and writes one self-contained HTML file. The PoC used the same shell but injected unsandboxed iframe access from an external directory.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->

The pinned Archify 3.2.0 commit is `208acba8d412335185b2056fedf54b3405df43fb`. Its ten renderers are executable modules, not a uniform library API. They emit HTML with inline viewer code/styles. Browser SVG export resolves the viewer styles into a standalone SVG.

## Goals / Non-Goals

Keep the default output contract unchanged, isolate native active content, and make the installed package reproduce the tested experience. No general diagram editor, remote brand capture, upstream updater, repository-evidence reader, extra product model, or universal Mermaid translation enters this slice.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

## Decisions

### Source and renderer boundary

Use `archify` fenced JSON with the pinned upstream `schema_version`, `diagram_type`, `meta` and family collections. Markdown owns the only editable source. Require a nonempty `meta.title`; default to Blueprint unless a supported preset is explicitly supplied. Keep existing `mermaid` fences unchanged. Reject unsupported schema versions/families, unknown schema fields, invalid relationships and invalid source; never silently reinterpret it.

The ArcShape adapter validates the schema and an additional safe subset before launching the renderer. Reject `meta.output`, repository/source-evidence declarations, brands/URLs/assets, custom translations and executable or resource-bearing payloads. ArcShape owns output paths and the render environment. Bound source bytes, JSON nesting, collection sizes and numeric canvas coordinates; each render/browser phase has a deadline and bounded child output. Supported family schemas are packaged as authoring references. Diagram identity derives from the document path and native-fence ordinal, not mutable labels; a content hash identifies generated content.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->

### Pin a minimal offline vendor subset

Bundle direct renderer entrypoints, their shared closure, template, locales and schema validators under package assets with an upstream revision and per-file integrity manifest. Do not vendor the upstream CLI, updater, finalize, explainer, examples or optional tools. Omit all brand-vector payloads and embedded fonts, use generic symbols and a system monospace stack, and document these deliberate differences. Retain MIT attribution and original notices, with an ArcShape notice identifying excluded assets. Do not broaden the repository's license policy to pass the gate.

Spawn each direct renderer using a controlled argument array and a minimal environment into a newly allocated staging directory. Disable optional remote/evidence paths through input validation; add process filesystem confinement where supported by the pinned Node baseline. Reuse the installed Puppeteer browser to export the SVG with network requests blocked. Build-time browser execution is restricted to validated input and pinned renderer code, never arbitrary Markdown HTML.
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:fe1383af359f8647eb7481f264ac1d29ece9d285ad1ed8f67cf98f5de06a5dc5" -->

Alternatives: a CDN or Git dependency breaks offline installation and pinning; copying the PoC retains absolute paths and excessive privileges; rebuilding all layouts ourselves discards the tested renderer and multiplies scope.

### Explicit output mode and safe publication

Add `arcshape site build --format interactive --out <directory>`; default `--format snapshot` retains the existing HTML-file target and behavior. The interactive directory contains `index.html`, stable `diagrams/<id>/index.html` pages, their generated static images and provenance/ownership metadata. All URLs are relative so a site can live at root or a subpath.

Validate and render everything before changing published output. Reject output paths that overlap authored documents or traverse symlinks. A folder must be absent, empty, or explicitly recognized as a complete ArcShape-owned output; do not overwrite an arbitrary directory. Stage the complete result and replace only owned output, preserving unrelated files or refusing the update. Test interrupted/invalid builds against an existing output. Identical input and revision must yield identical files, without timestamps or random IDs.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="FR-CLI-COMMANDS" digest="sha256:e49c7df3dcaf71ce1cde9d9064de4c53c28d54b6cbe3fb7152153fded4fcd8d6" -->

### Isolated embedded and dedicated viewers

Use an iframe with `sandbox="allow-scripts"`, without same-origin, top-navigation, popup or download permissions, for the embedded runtime. Put compact-mode CSS and its integration bridge inside the generated viewer, not in cross-document DOM access. The parent recognizes messages by the exact registered `contentWindow`, protocol version and a small validated payload. An opaque-origin child must not be authenticated by origin alone. Accept only bounded sizing, selection and wheel/ready messages; no arbitrary URL or DOM instructions.

The parent controls theme and the dedicated-page link. The child reports valid selection changes and bounded wheel deltas, while focus-card scrolling stays local. Plain wheel motion scrolls the outer document; explicit zoom controls and background drag manipulate the diagram. Heights derive from diagram aspect ratio and available width, clamped initially to 260–560px. Narrow or very wide diagrams remain navigable rather than shrinking every label indefinitely.

Generate CSP for each native artifact: no connections, frames, objects, remote images/fonts or forms; only its hashed trusted scripts and inline styles can run. Scripts and styles originate from the pinned runtime/bridge, not arbitrary source fields. The dedicated page loads the same diagram with full controls, selected theme and focus. No JavaScript fallback must expose the pre-rendered static image; loading errors leave a readable static view instead of a blank frame. Keyboard-accessible selection and zoom/reset are tested.
<!-- pdac:cite id="FR-INTERACTIVE-DIAGRAMS" digest="sha256:744316a85793d16f4d84c1930dbee76498085952c190bb31ddf652723869c784" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->

### Static fallback and migration

Capture the renderer's SVG export rather than a bare fragment that loses styles. Sanitize executable content and resource references before embedding it as an isolated image in snapshot output. Provide accessible title/description and local static exports for explicit publication workflows. Do not require an author to maintain an additional Mermaid rendering.

Update existing `arc-c4` and `arc-architecture` packaged skills and add focused native-diagram guidance/examples through the existing capability mechanism. Check configured Obsidian/Confluence usage before conversion: if a readable target representation has not been demonstrated, keep that diagram Mermaid and report the limitation. This release does not claim native interactivity or automatic image-upload support in those tools.
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:a1b8909b36e850b9ac1a2e5639f89749b039875f2fbe9c648167ed174edb8a89" -->
<!-- pdac:cite id="FR-AGENT-CAPABILITY-DISTRIBUTION" digest="sha256:df30499fca2ce723bbccc3a1a8d590a5fc69b2f9532472b01c3accba8327dc04" -->
<!-- pdac:cite id="FR-EXTERNAL-DOCS-INTEGRATIONS" digest="sha256:f929081da500e66834eb9a2e1dd6c4ef16dd6a066168d275b49cee6989c37616" -->
<!-- pdac:cite id="UC-CREATE-ARCHITECTURE-DIAGRAMS" digest="sha256:2721d6d68d994addd06a0b270bef3fad3efc21639c97c63ba3c43005c788070e" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:8d9b3498c0c04f5546618e31fe405629dc9d08183c03d72d4d1af5f50cf182ba" -->

### Architecture and release

Record the renderer/source/isolation trade-off in proposed ADR-0002 and update the affected arc42 views from implementation evidence. Migrate representative own context, building-block and runtime diagrams, retain a Mermaid example, and add a supported-family fixture gallery. Use a minor Changeset; do not hand-edit version or publish. Keep the approved Brisa demo running and serve a separate LAN review build.

## Risks / Trade-offs

- Upstream DOM/API coupling → pin the subset and test export, selection, theme, layout and bridge contracts before updates.
- Vendor code missing from dependency-only SBOM → inventory vendor origin, hashes and licenses explicitly; test inventory integrity and add vendor components to assurance output.
- Small text or overflowing canvas → visual checks at desktop and 390px; preserve deliberate pan/zoom and full-page access.
- Unsafe source or resource exhaustion → reject privileged fields, cap bytes/depth/counts, constrain rendering time and output, and fail before publication.
- Existing citations become stale after approved product application → inspect affected statements and refresh with ProductShape; never erase their history or exemptions.
- A technical plan cannot approve future implementation → retain current-head independent audit and final human Done judgement.

## Migration Plan

Update package and selected skills without touching authored files. Build legacy docs as a regression. Convert selected ArcShape examples with evidence and before/after meaning review; render screenshot evidence before committing visual changes. Publish a review build on Bastion, then verify a clean packed install and all applicable CI/Assurance checks. Rollback is a normal source revert plus a rebuild of owned generated output; external adopter conversion remains explicitly opt-in.
