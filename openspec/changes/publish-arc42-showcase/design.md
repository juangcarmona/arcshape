<!-- pdac-scope: cited -->

# Design

## Context

See proposal.md for motivation. Issue #78 supplies the Astro shells and static publication routes this change consumes. ArcShape already generates a self-contained reader from canonical Markdown with source and revision provenance; the showcase should compose those existing outputs and avoid a second hand-maintained rendering path.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Goals / Non-Goals

**Goals:** Make one coherent, clearly illustrative architecture story discoverable from the engineering portal; demonstrate Mermaid and Archify outputs with accessible names and provenance; verify the same static route works at root and `/arcshape/`; publish evidence a reviewer can open directly from the PR.

**Non-Goals:** Change canonical product behavior or model facts, build another application shell, add a runtime renderer/service, activate Cloudflare production, or decide subjective visual quality with automated tests.

## Decisions

1. **Keep Markdown as the Arc42 source and build its reader through the existing CLI.** This preserves reviewable source and reader provenance. Hand-authored generated HTML was considered and rejected because it can drift from the Markdown.
2. **Keep the Archify source and generated static HTML distinct but adjacent to the example.** Archify demonstrates an enhanced viewer not supplied by the Mermaid reader. Its authored input, renderer identity, revision/source evidence, and generated output remain linked. Rebuilding the same diagram in a hosted service was rejected because this is a static publication slice.
3. **Compose the output in the Astro/static engineering portal delivered by #78.** Reuse its route, theme, and base-path facilities. A parallel shell or production deployment change was rejected to preserve the existing site structure and keep #78's publication decision separate.
4. **Use Playwright against the built artifact and publish two forms of evidence.** The suite verifies concrete behavior and saves the HTML report/trace as CI artifacts; committed desktop/narrow screenshots and an evidence README make the visual result inspectable after CI retention expires. Recording only a local screenshot was rejected because reviewers on another machine need the images in the PR itself.

## Risks / Trade-offs

- **[Fictional details could be mistaken for ArcShape facts]** → Prominently label the showcase as illustrative in the portal, example landing section, and evidence README; keep it outside canonical architecture and product model paths.
- **[Mermaid and Archify facts could drift]** → Keep the scope to one coherent small story and assert each renderer's source/revision provenance in E2E.
- **[Root and subpath links could diverge]** → Build and test both prefixes; verify internal navigation and source links from both builds.
- **[Screenshots could prove only a narrow viewport or stale revision]** → Record the exact tested commit and viewport dimensions, inspect both captures, and link the current-head Actions report/trace. State that this evidence does not prove Cloudflare production deployment.
- **[Archify output may have viewer-specific accessibility limitations]** → Inspect the generated output and keyboard path, retain accessible source evidence, and report any limitation for the human Done review rather than claiming unsupported accessibility.

## Migration Plan

No data or service migration is required. The change adds static source and build output. Revert by removing the example content, portal entry, E2E coverage, and issue evidence bundle together. Cloudflare production activation remains a separate maintainer action after #78.

## Open Questions

None. The final Astro route names and build seams are to be confirmed against merged #78 when implementation begins; that verification may select exact file paths without changing the agreed scope or approach.
