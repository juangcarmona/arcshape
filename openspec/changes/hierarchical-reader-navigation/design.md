<!-- pdac-scope: cited -->

# Design

## Context

The reader generator loads supporting Markdown recursively and already assigns stable routes, but `generate.mjs` currently drops `relativeFile` before passing documents to `buildSnapshotHtml`. `shell.mjs` therefore receives a flat array and emits one supporting list for each section. The current generated page has an ES5 hash router, inline styles, inert JSON data, and no external runtime resources.
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="UC-PUBLISH-ARCHITECTURE-VIEW" digest="sha256:9ce6cd65b911aeec3601b986283f966a0232a1c59a3534f975fff4c3abddea9c" -->

The authored section-directory layout and its recursive supporting-document scan remain the source of truth. The change is confined to the generated reader projection and its tests; it does not add a persistence layer, route migration, or external dependency.
<!-- pdac:cite id="TERM-ARCHITECTURE-DOCUMENTATION" digest="sha256:086bafc90ef2104f0e8b2ebaca54bcdaffb16a7b5ffef374b0ef5e38111bf4ad" -->
<!-- pdac:cite id="TERM-ARCHITECTURE-VIEW" digest="sha256:3e258fedf716972d2e2905974920be0bd4e9e44fb5f074b6fb5fc00925f36b45" -->

## Goals / Non-Goals

**Goals:**

- Make authored folder structure visible and useful in the sidebar.
- Keep stable routes, search, section navigation, self-contained output, and flat sections compatible.
- Make folder controls keyboard-operable and observable through standard ARIA state.
- Leave a focused automated and browser-verifiable proof of the behavior.

**Non-Goals:**

- Change how Markdown files are validated, titled, rendered, or routed.
- Add server-side state, URL persistence for open folders, or a new UI dependency.
- Change the ProductShape model or the canonical architecture documents.

## Decisions

### Carry path metadata into the shell

`generate.mjs` will include each document's existing `relativeFile` in the supporting-page data. The shell will derive folder segments from that path, while the loader remains responsible for filesystem traversal, validation, titles, and stable routes.

**Alternative considered:** re-scan the filesystem in the shell. This would duplicate loader behavior, make the generator less portable, and risk mismatched route/data ordering.

### Build a deterministic server-rendered navigation tree

`buildSnapshotHtml` will construct a tree per section from supporting documents. A node represents either a page or a folder; a folder may have its own README page and child nodes. Sibling leaves sort before folders and use natural, case-insensitive labels. Folder labels without a page are derived from the path segment through one named acronym-aware humanizer.

The generated markup will retain the current section link and flat list shape when no nested folder exists. Nested sections will add folder containers, buttons, child lists, and data attributes that identify the folder path and its page route. The inert JSON data will retain the flat supporting array for search and route lookup, with the relative path available for ancestor matching.

**Alternative considered:** generate the entire tree only in browser JavaScript. Keeping the navigation structure in HTML makes the generated document inspectable, preserves useful markup before script execution, and avoids duplicating tree construction in the runtime.

### Keep expansion state in the generated DOM

Folder toggles will update `aria-expanded` and the child list's hidden state. `syncNav` will mark the route's link and expand ancestor folders on every route change. It will not persist expansion choices in the URL or local storage, so routes remain byte-for-byte compatible and generated output stays deterministic.

Click delegation on the sidebar will distinguish folder buttons from links. Keyboard behavior will use native buttons, preserving Enter and Space activation and visible focus styling from the existing shell.

**Alternative considered:** use disclosure elements. Native disclosure semantics are attractive, but the existing ES5 router already owns route-driven navigation state; explicit buttons and `aria-expanded` keep that state synchronized and work consistently with the current generated markup.

### Derive breadcrumbs from the same tree metadata

Supporting documents will carry their relative path into the rendered section data. The runtime will derive a breadcrumb trail from the path and the section's supporting pages, linking a segment only when its corresponding folder README route exists. This prevents breadcrumb links from becoming dead links for README-less folders and keeps route generation centralized.

**Alternative considered:** author breadcrumbs in Markdown. That duplicates filesystem structure and becomes stale when a file moves.

### Verify at both data and browser levels

Unit coverage will assert recursive loading and tree ordering/labels. The existing Puppeteer accessibility suite will use a small nested fixture to assert generated markup, direct nested routing, ancestor expansion, breadcrumb links, toggle state, and flat-section compatibility. The repository's full deterministic suite and built reader will remain the final validation path.
<!-- pdac:cite id="ACT-ARCHITECTURE-READER" digest="sha256:12039553bbfa044ec9730dc7f203350186dd4293e059fd2629d7493e63a6d5be" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## Risks / Trade-offs

- **Path labels can become unclear or excessively long** → centralize the acronym set, use readable fallback labels, and allow tree labels to wrap within their available width.
- **A route can be marked current while its ancestors remain hidden** → derive and apply ancestor paths during every router synchronization, and cover a direct nested route in the browser test.
- **A flat-section change could regress existing visual behavior** → keep the flat markup branch and assert it with the existing reader fixture.
- **A generated HTML document could accidentally expose unescaped path data** → continue using `escapeHtml` for markup and `stableJson` for inert data, and exercise punctuation in test paths.
- **The generated page can become harder to use on mobile** → reuse the current responsive sidebar rules and verify no horizontal overflow in the existing mobile accessibility journey.

## Migration Plan

No authored-file migration is needed. Existing routes remain valid because route construction stays in `loadDocs.mjs`. Reverting the implementation and Changeset restores the current flat projection. The release path is the normal Changesets flow: merge the feature PR with its pending patch Changeset, let the protected workflow create `Version Packages`, and publish only after the maintainer's release approval.

## Open Questions

None. The issue's folder README, sorting, accessibility, breadcrumb, and compatibility rules are sufficient to implement and verify the change.
