# C4 workflow examples

These fixtures test the Codex and Claude C4 workflow against repository evidence. `npm test -- --run tests/c4-workflow.test.mjs` renders each view through the same Mermaid renderer used by the ArcShape site.

## System context

`context.md` identifies the maintainer, ArcShape CLI, and repository boundary. Its embedded C4 view shows only those evidenced actors and relationships.

## Container view

`containers.md` records the package's CLI and installed assistant skills. Its embedded C4 view keeps those building blocks inside the repository and leaves the assistant host outside the package boundary.

`update-evidence.md` and `updated-context.md` show a focused change when new evidence confirms an external destination. The update preserves unrelated maintainer-authored prose.

## Insufficient evidence

`unknown-evidence.md` records an underspecified request. The expected response asks about the system boundary and actors; it does not invent a diagram.
