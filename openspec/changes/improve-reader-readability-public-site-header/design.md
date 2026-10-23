# Design

<!-- pdac-scope: cited -->

## Context

The reader HTML is assembled by `packages/cli/src/arc42-site/shell.mjs`; its `.doc` rule currently sets a fixed `max-width`. The engineering portal is an Astro static site whose header already renders the shared `BrandLockup` and points readers to local portal routes. See `proposal.md` for the motivation.

## Goals / Non-Goals

**Goals:**

- Let the generated document content use the available reader width while retaining the existing page padding and responsive behavior.
- Make the portal header's existing brand lockup the single visual entry point to the public site.
- Keep the change dependency-free and compatible with the protected Changesets release flow.

**Non-Goals:**

- Changing the public site's visual system or canonical content.
- Introducing a second brand component or a new navigation abstraction.
- Manually versioning, tagging, publishing, or deploying from the developer checkout.

## Decisions

1. **Delete only the fixed document measure.** Remove `max-width: 78ch` from the generated `.doc` rule and leave `margin: 0 auto` and surrounding layout rules intact. This is the smallest change that addresses the observed readability issue without changing the reader's other geometry.

2. **Use the existing portal brand link.** Change the header anchor's destination to `https://arcshape.dev`, add `target="_blank"` and `rel="noopener noreferrer"`, and retain the existing `BrandLockup`. This keeps the visual identity shared with the public site and avoids a new icon asset or component.

3. **Remove only the redundant header badge.** Delete the portal header's separate badge rather than changing the shared `BrandLockup` component, because the lockup is also used by the footer and the public site.

4. **Treat this as a patch release input.** Add one Changesets patch entry for `@arcshape/cli`; the protected workflow remains responsible for producing 0.1.5, the tag, the GitHub Release, and the SBOM.

The reader-width decision supports the active architecture-view and comprehension intent without changing its product requirement.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:ae4d1900d393961a43dad9de295517ecf6f9c595830cc4cbca72f0369c5d33e7" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## Risks / Trade-offs

- [Risk] Very wide text lines may be less comfortable for some readers. → Use runtime screenshots at desktop and narrow viewports, and verify no horizontal overflow.
- [Risk] An external link can be mistaken for a local portal navigation item. → Keep the existing accessible brand label and use the new-tab target consistently.
- [Risk] A Changesets entry alone does not prove a release. → Verify npm, the immutable package tag, GitHub Release, and SBOM separately after the protected workflow runs.
