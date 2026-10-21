# ADR workflow examples

These fixtures exercise the `arc-adr` capability's main decisions. New records use YAML frontmatter for ID, title, status, date, and deciders, follow `ADR-0001-kebab-case-title.md` naming when the repository has no convention, and appear in the canonical `docs/architecture/09-architecture-decisions/README.md` index, sorted alphabetically by title. Run `npm test -- --run tests/adr-workflow.test.mjs` to check the examples and the provider-neutral packaged skill.

## Create a record from a supplied decision

`create/` contains a maintainer-supplied decision and repository evidence. The expected result is a Proposed ADR with context, decision, alternatives, consequences, references, and an index entry. Implementation facts are cited separately from the supplied decision.

## Supersede an existing record

`supersede/` starts with an accepted ADR and a maintainer-confirmed superseding relationship. The expected proposal preserves the old record, adds a new Proposed ADR with a `Supersedes` link, and updates the index to show the relationship. Acceptance of the new decision remains with the maintainer.

## Reuse an established convention

`existing-convention/` demonstrates a repository whose canonical records live under `architecture/decisions/`, use `DEC-NNNN` identifiers, and carry a project-specific metadata shape. The expected proposal continues that convention and updates its existing index instead of creating `docs/adr/` or introducing a parallel `ADR-NNNN` collection.

## Decision is unknown

`unknown-decision/` contains a request and evidence that suggests—but does not establish—a choice. The expected response asks the maintainer to confirm the decision and creates no ADR or index change.
