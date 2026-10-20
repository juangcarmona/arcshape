<!-- pdac-scope: cited -->

# Design

## Context

See proposal.md for the source and motivation. ArcShape's reader requires a navigation `README.md`, twelve `01`–`12` Markdown files with YAML frontmatter, and links/assets that survive static generation. The supplied example has EN/ES directories with `00` overview files and sections `01`–`12`, no reader frontmatter, Mermaid, and images. Its source's CC BY-NC 4.0 license and fan-work disclaimer must accompany the adaptation.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

## Goals / Non-Goals

**Goals:** Keep the adapted EN/ES example self-contained in `examples/starwars-deathstar/`; exercise the real reader against meaningful content; demonstrate Mermaid and Archify with observable identity/provenance/accessibility; and make the folder suitable as a future static-publication input.

**Non-Goals:** Add an Astro/public/engineering route, link the example from portal navigation, deploy it to Cloudflare, rewrite ArcShape's own architecture, or carry out a broad product change.

## Decisions

1. **Use two locale-specific ArcShape reader inputs under the examples folder.** Map each source `00` overview into the reader's `README.md`, and adapt all twelve numbered sections to ArcShape filenames and metadata. A single merged-language reader was rejected because it obscures the source's bilingual value and complicates future static publication.
2. **Adapt content rather than copying it verbatim.** Preserve the fictional story and useful explanatory diagrams, but check each claim/diagram against its heading and the other sections. Fix issues found in the source, including duplicated/mismatched runtime sequence diagrams and Spanish image alternative text that says English. This makes the sample a credible ArcShape exercise rather than a format-only conversion.
3. **Keep source, assets, license/attribution, disclaimer, and Archify output together.** Reuse Mermaid authored in the Markdown and add a focused Archify view that contributes a different diagram perspective. Retaining source and generated HTML side by side makes renderer identity and provenance inspectable and supports later static builds. Do not relicense the CC BY-NC source material as part of ArcShape's repository license. Follow the Archify static HTML identity/provenance contract from PR #79 at `eb4974b8db8b158fa907ceff15c247d198d07cff`; keep the generated artifact and source in this example so #80 builds and tests do not depend on an unmerged branch at runtime. Revalidate the example against the merged #78 contract before integrating #80.
4. **Test built reader output locally at root and subpath prefixes.** Playwright should build both locales via the real generator and open the outputs without requiring the Astro portal or a deployed site. This validates future-publishing readiness without adding the publication route now.
5. **Publish screenshots in-repository and diagnostics in CI.** Commit inspected desktop/narrow captures with an evidence README; link the Actions report and trace for interactive diagnostics. A CI-only screenshot was rejected because it is less durable and not visible inline in the PR.

## Risks / Trade-offs

- **[The source's fictional detail could be mistaken for ArcShape fact]** → Mark the content as a fictional Star Wars fan-work in each locale and keep it under `examples/`, outside canonical architecture/product paths.
- **[The original license is non-commercial]** → Preserve CC BY-NC 4.0 attribution, modification notice, and disclaimer; keep public-site publication out of scope and flag the license constraint for any later publishing decision.
- **[A format migration could preserve content errors]** → Review diagrams and section claims during adaptation; add assertions for both locale builds and their expected diagrams.
- **[Archify output may have viewer-specific accessibility limits]** → Test keyboard interaction and accessible source/renderer labels in the built output; record any remaining limitation for human review.
- **[Future base paths could break links]** → Build and test at root and `/arcshape/`, and keep assets/links local and relative to the example's future publication root.
- **[Screenshots could be stale or overstated]** → Record the tested commit and exact dimensions, inspect images, link current-head Actions artifacts, and state that evidence is local static-build output rather than production deployment.

## Migration Plan

No existing user data or runtime service is changed. Add the example and its tests as an isolated folder. Revert by removing the example, E2E coverage, and issue evidence bundle. A later public-site integration can consume the self-contained folder in a separate issue and must first assess its CC BY-NC and trademark/disclaimer constraints.

## Open Questions

None. The initial Archify artifact follows the pinned PR #79 contract; revalidate against the merged #78 contract before integrating this change.
# Implementation deviation: vendored Archify CodeQL scope

The checked-in Archify HTML is generated by pinned Archify 3.1.0. The first CodeQL run flagged 13 dynamic-key operations inside that generated vendor page as high-severity remote property injection. The page is therefore excluded by its exact path from CodeQL; ArcShape-authored Markdown, candidate JSON, E2E code, and other application code remain scanned. The E2E suite verifies the manifest's generator and source revision, both SHA-256 values, rendered provenance links, and absence of external runtime requests. Revisit the exclusion if the renderer version or generated artifact changes.

## Implementation deviation: commit message preflight

The pushed commit `f2a6fe433871936c24df208f7d889202bdcaed16` omitted the issue reference required by commitlint, and the PR's Repository conventions check failed with `references-empty`. The implementation workflow now requires validating the exact message with commitlint before committing and using that same message file for the commit. This is a process guard; the feature content was not the cause.

