# ADR workflow examples

These fixtures exercise the `arc-adr` capability's main decisions. Run `npm test -- --run tests/adr-workflow.test.mjs` to check the examples and the provider-neutral packaged skill.

## Create a record from a supplied decision

`create/` contains a maintainer-supplied decision and repository evidence. The expected result is a Proposed ADR with context, decision, alternatives, consequences, references, and an index entry. Implementation facts are cited separately from the supplied decision.

## Supersede an existing record

`supersede/` starts with an accepted ADR and a maintainer-confirmed superseding relationship. The expected proposal preserves the old record, adds a new Proposed ADR with a `Supersedes` link, and updates the index to show the relationship. Acceptance of the new decision remains with the maintainer.

## Decision is unknown

`unknown-decision/` contains a request and evidence that suggests—but does not establish—a choice. The expected response asks the maintainer to confirm the decision and creates no ADR or index change.
