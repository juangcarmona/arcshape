<!-- pdac-scope: cited -->

# Proposal

## Why

Issue #97 reports that the generated ArcShape reader flattens every supporting Markdown page into one list, even when the authored files are organized into folders. Readers need the folder hierarchy to discover related architecture material and to keep large section navigations understandable.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="JRN-UNDERSTAND-ARCHITECTURE" digest="sha256:51c7e69a4b37e8598dbd5731e321d12f4bc584bb9dcd54c768011542aab5b85e" -->

## What Changes

- Preserve each supporting document's relative path in the generated reader data.
- Build a nested sidebar tree from supporting-document paths, with folder README pages as folder nodes and other Markdown pages as leaves.
- Add accessible folder toggles, current-route ancestor expansion, stable natural sorting, and readable labels for folders without README pages.
- Add breadcrumbs to supporting pages, linking each folder step to its README page when present.
- Preserve the existing flat presentation, routes, search index, overview, and self-contained HTML for sections without nested folders.
- Add unit/browser coverage for the tree, expansion state, accessibility, breadcrumbs, and flat-layout compatibility.
- Add a patch Changeset for `@arcshape/cli`.

## Capabilities

### New Capabilities

- `reader-navigation`: Hierarchical navigation and contextual breadcrumbs for generated architecture reader pages.

### Modified Capabilities

None. The existing OpenSpec capabilities cover agent guidance, not the reader runtime; this change introduces the first durable delivery specification for reader navigation while implementing the existing product behavior.

## Impact

- **Source:** `packages/cli/src/arc42-site/loadDocs.mjs` already computes `relativeFile`; `generate.mjs` must carry it into the shell input; `shell.mjs` owns the generated markup, styles, router state, and breadcrumbs.
- **Tests:** `tests/section-directories.test.mjs` and `tests/reader-accessibility.test.mjs`, with focused fixture data for nested folders and flat sections.
- **Package:** published `@arcshape/cli`, with a pending patch Changeset.
- **Documentation:** the reader runtime description in `docs/architecture/06-runtime-view/README.md` will be checked and updated only if it is missing the new navigation behavior.
- **Product impact:** this improves the active reader view for the architecture reader. It does not change product ownership, canonical Markdown, routes, or the ProductShape model.

### Product definition impact review

The directly relevant active artifacts are `FR-READER-VIEW`, `UC-PUBLISH-ARCHITECTURE-VIEW`, `UC-READ-ARCHITECTURE`, `JRN-UNDERSTAND-ARCHITECTURE`, `QR-READER-COMPREHENSION`, `TERM-ARCHITECTURE-DOCUMENTATION`, `TERM-ARCHITECTURE-VIEW`, `ACT-ARCHITECTURE-READER`, and `BC-ARCHITECTURE-KNOWLEDGE`. The change depends on their existing reader-facing behavior and does not alter their canonical text.
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->
<!-- pdac:cite id="TERM-ARCHITECTURE-DOCUMENTATION" digest="sha256:086bafc90ef2104f0e8b2ebaca54bcdaffb16a7b5ffef374b0ef5e38111bf4ad" -->
<!-- pdac:cite id="TERM-ARCHITECTURE-VIEW" digest="sha256:3e258fedf716972d2e2905974920be0bd4e9e44fb5f074b6fb5fc00925f36b45" -->
<!-- pdac:cite id="ACT-ARCHITECTURE-READER" digest="sha256:12039553bbfa044ec9730dc7f203350186dd4293e059fd2629d7493e63a6d5be" -->
<!-- pdac:cite id="BC-ARCHITECTURE-KNOWLEDGE" digest="sha256:1810dc6b4f2e35c6ed1c34c8c99f31111ef77280c8f15232bf0e3d3d73c17b1a" -->

`FR-ARC42-DOCUMENTATION` and `CON-ARC42-FRAMEWORK` were checked as neighboring artifacts. They remain unchanged because this delivery does not change arc42 authoring or the section-directory contract. `BR-PRODUCT-DEFINITION-AUTHORITY` was also checked and remains unchanged because no product model text is edited. No product-definition drift was found, and no Product Change is required.
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:11948980ab0be21b0a7a61b2bc2d428ec4adeb5b73d808aa3d7df1b6b8329e79" -->

The implementation must keep the reader self-contained and preserve existing stable routes. It must expose the new controls through keyboard-accessible buttons with `aria-expanded` state and visible focus treatment, and the runtime evidence must inspect the generated hierarchy, direct nested route, breadcrumbs, and toggle behavior.
