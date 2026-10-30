# Proposal

<!-- pdac-scope: cited -->

## Why

The generated architecture reader currently constrains prose to `78ch`, which leaves useful viewport space unused and reduces reading comfort. The engineering portal header also repeats a tagline already present in the brand treatment instead of making the public ArcShape site easy to reach.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:8372d5e6f9b51e0e9d468289d65d352a7c930089dea72897a9bffe56f894e053" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## What Changes

- Remove the reader's fixed `max-width: 78ch` document rule while preserving responsive layout and spacing.
- Remove the repeated “AI driven engineering documentation” badge from the engineering portal header.
- Make the portal's existing ArcShape brand lockup link to `https://arcshape.dev` in a new tab with safe external-link attributes.
- Add a patch Changeset for `@arcshape/cli` 0.1.5.

## Capabilities

### New Capabilities

None. This is a presentation and release-metadata adjustment to existing reader and portal behavior.

### Modified Capabilities

None. The change implements the existing reader and comprehension intent; it does not alter a durable product requirement.

The OpenSpec change therefore sets `skip_specs: true` rather than inventing a duplicate capability requirement.

## Impact

- `packages/cli/src/arc42-site/shell.mjs` changes generated reader CSS.
- `src/engineering-portal/src/pages/index.astro` changes the header link and removes the redundant badge.
- Existing portal validation and runtime evidence are updated or extended as needed.
- `.changeset/` records the package patch release input; the protected Changesets workflow remains responsible for versioning and publication.
- No API, dependency, canonical product model, or production deployment changes are introduced.

## Product definition drift

No drift identified. The request supports the active reader-view and comprehension requirements cited above. The related ProductShape neighbours checked were `UC-PUBLISH-ARCHITECTURE-VIEW`, `UC-READ-ARCHITECTURE`, `JRN-UNDERSTAND-ARCHITECTURE`, `ACT-ARCHITECTURE-READER`, `ACT-REPOSITORY-MAINTAINER`, `BC-ARCHITECTURE-KNOWLEDGE`, `TERM-ARCHITECTURE-DOCUMENTATION`, and `TERM-ARCHITECTURE-VIEW`; none requires a new Product Change for this presentation adjustment.
