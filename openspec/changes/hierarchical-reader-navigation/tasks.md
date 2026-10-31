<!-- pdac-scope: cited -->

# Tasks

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ff3d03ebe93668cb0392a672fe63b9925404fab9dc2fb7891931f1f5d2ea799d" -->
<!-- pdac:cite id="UC-READ-ARCHITECTURE" digest="sha256:43f7ea1726a9e26689b8741f153ad919563655653584b9cc13bca10885e8b985" -->
<!-- pdac:cite id="JRN-UNDERSTAND-ARCHITECTURE" digest="sha256:51c7e69a4b37e8598dbd5731e321d12f4bc584bb9dcd54c768011542aab5b85e" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## 1. Preserve document hierarchy metadata

- [x] 1.1 Carry each supporting document's existing `relativeFile` into the generated section data and verify the generated JSON retains nested paths without changing stable routes.
- [x] 1.2 Extend `tests/section-directories.test.mjs` with a nested fixture and verify recursive loading exposes the expected relative paths, titles, and routes.

## 2. Build deterministic navigation data and markup

- [x] 2.1 Add a pure navigation-tree builder and acronym-aware folder-label helper in the reader shell; verify leaves precede folders and natural sorting handles nested README and README-less folders.
- [x] 2.2 Render nested folder containers, accessible toggles, child lists, and folder links while preserving the existing flat markup branch; verify generated HTML contains the expected hierarchy and no unescaped path data.
- [x] 2.3 Update the reader runtime to synchronize current links, ancestor expansion, `aria-expanded`, and hidden child lists on route changes and toggle activation; verify the generated script remains valid ES5 and the existing search index still sees every supporting page.

## 3. Add contextual reader evidence

- [x] 3.1 Render breadcrumbs from the same relative-path metadata, linking only folders with README pages; verify README-less folders remain contextual text and existing section owner links remain valid.
- [x] 3.2 Extend `tests/reader-accessibility.test.mjs` with a nested reader fixture and verify direct nested navigation opens ancestors, toggles work with keyboard input, current-page state is exposed, breadcrumbs are correct, and flat sections remain compatible.
- [x] 3.3 Run the focused Puppeteer reader tests and inspect the generated reader artifact for hierarchy, focus behavior, mobile layout, and absence of horizontal overflow.

## 4. Release and documentation readiness

- [x] 4.1 Update `docs/architecture/06-runtime-view/README.md` if needed to describe recursive supporting-document navigation and generated-reader breadcrumbs; verify the documentation matches the implemented behavior.
- [x] 4.2 Add a patch Changeset for `@arcshape/cli` describing hierarchical supporting-document navigation; verify `npm exec -- changeset status` reports the package bump.
- [x] 4.3 Run OpenSpec validation, ProductShape citation verification, formatting, lint, typecheck, tests, build, security audit, package smoke, and `git diff --check`; verify every required deterministic check has an observed exit code.

## Workflow follow-up

- Commit the plan artifact on an issue-linked branch and raise the draft proposal PR for #97.
- After plan review, implement the tracked tasks on the same branch and mark the PR ready only after the Done gate evidence is complete.
- Rebase and revalidate before merge; merge only after required checks and human review pass.
- After the feature PR merges, let the protected Changesets workflow create `Version Packages`; review and merge that release PR, then verify npm, the package tag, GitHub Release, and SBOM.
