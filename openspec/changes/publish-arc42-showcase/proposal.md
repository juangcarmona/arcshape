<!-- pdac-scope: cited -->

# Proposal

## Why

ArcShape needs a realistic example that demonstrates the actual arc42 reader and diagram capabilities on substantial architecture content. The maintainer supplied the bilingual Death Star example at [juangcarmona/starwars-deathstar-arc42-documentation](https://github.com/juangcarmona/starwars-deathstar-arc42-documentation), cloned locally at `/srv/repos/juangcarmona/starwars-deathstar-arc42-documentation` (source revision `6a5576b`). Adapt it into an ArcShape example instead of inventing a small synthetic document.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## What Changes

- Adapt the source's English and Spanish arc42 content into `examples/starwars-deathstar/`, using ArcShape's reader input contract and keeping the example self-contained for a future static-site build.
- Review and correct inconsistencies found while adapting the source, including runtime diagrams that do not match their scenario headings and incorrect language in image alternative text; preserve the fictional Death Star scope and label it clearly as illustrative.
- Exercise Mermaid rendering from the adapted Markdown and add a focused Archify static HTML diagram that demonstrates a complementary view, with source, renderer identity, provenance, and accessible labeling.
- Add Playwright coverage that builds and opens the example output at root and `/arcshape/` bases, checking both locales, diagram identity, accessibility, provenance, keyboard access, and narrow viewport layout.
- Publish desktop and narrow screenshots in `docs/delivery/issue-80/evidence/`, with a README documenting revision, viewports, observations, linked Actions report/trace, and evidence limits.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This adds an illustrative repository example and regression coverage for existing documentation and static-rendering behavior; it does not change canonical product behavior. This change opts out of spec deltas with `skip_specs: true`.

## Impact

- New bilingual source example and assets under `examples/starwars-deathstar/`.
- ArcShape reader build and Playwright fixture coverage; no engineering-portal route or navigation entry is added.
- Committed review captures under `docs/delivery/issue-80/evidence/` and existing CI report/trace artifacts.
- No product-model edits, new renderer dependency, hosted service, Cloudflare activation, or public-site publication.

### Source and adaptation constraints

The source repository is at revision `6a5576b`, contains English and Spanish README/overview plus arc42 sections 01–12, Mermaid diagrams, and image assets. Its docs use filenames and Markdown without the frontmatter required by ArcShape's current reader. The source is licensed CC BY-NC 4.0 and includes a Star Wars fan-work disclaimer. Preserve the source attribution and license, identify the adaptation, and retain the disclaimer with the example. Any later public-site use is outside this issue and must respect the source license and attribution.

### Product definition assessment

This delivery depends on `FR-ARC42-DOCUMENTATION`, `FR-READER-VIEW`, `QR-READER-COMPREHENSION`, and `CON-ARC42-FRAMEWORK`. `UC-PUBLISH-ARCHITECTURE-VIEW` and `UC-READ-ARCHITECTURE` were checked as neighboring user goals; this issue adds a local example and does not change either workflow. `BR-PRODUCT-DEFINITION-AUTHORITY` and `CON-NO-ARCSHAPE-DATA-COLLECTION` remain satisfied: the example changes no canonical ArcShape facts and introduces no data collection or service call.
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->
<!-- pdac:cite id="UC-PUBLISH-ARCHITECTURE-VIEW" digest="sha256:9ce6cd65b911aeec3601b986283f966a0232a1c59a3534f975fff4c3abddea9c" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:0c2a1bb402fcf272e5ecfe15282e8d15dccd7fb57992a344071757f82cf457a7" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:2893462d429a0188eeb937215ceb47a55809d26825d2646d0897cc851d33ce13" -->

### Existing decisions and dependencies

- [Issue #78](https://github.com/juangcarmona/arcshape/issues/78) defines the static Mermaid/Archify publication and provenance boundaries that this example should exercise. Issue #80 does not add a site route or publish the example.
- The [ArcShape architecture documentation](https://github.com/juangcarmona/arcshape/tree/main/docs/architecture) and [reader deployment guide](https://github.com/juangcarmona/arcshape/blob/main/docs/pages-deployment.md) remain canonical references; the Death Star example must not be confused with ArcShape's own architecture facts.
- Raccord issue #363 is the evidence-publishing reference: tracked screenshots are embedded in a README with exact viewport sizes, observed outcomes, and evidence limits. Keep detailed Playwright report/trace artifacts in the linked Actions run.

### Product definition drift

None identified. No Product Change is required because this issue adds a clearly labeled sample and regression coverage without changing defined product behavior.
