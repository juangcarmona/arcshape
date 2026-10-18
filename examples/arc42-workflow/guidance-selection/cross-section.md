# Cross-section guidance selection

## Request

“Add a timeout to outbound requests and explain how failures are handled and what reliability target this supports.”

## References selected

- [`06-runtime-view/README.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/06-runtime-view/README.md) for the interaction and failure scenario.
- [`08-crosscutting-concepts/README.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/08-crosscutting-concepts/README.md) for shared timeout, retry, and error-handling behavior.
- [`10-quality-requirements/README.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/10-quality-requirements/README.md) for the reliability target and measurable response.
- [`tip-6-2-document-only-a-few-runtime-scenarios.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/06-runtime-view/tips/tip-6-2-document-only-a-few-runtime-scenarios.md) for keeping runtime scenarios focused.
- [`example-runtime-1.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/06-runtime-view/examples/example-runtime-1.md) as an illustrative runtime sequence.
- [`example-concept-htmlsc-1.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/08-crosscutting-concepts/examples/example-concept-htmlsc-1.md) for a shared concept example.
- [`tip-10-7-consider-fault-error-failure-quality-scenarios.md`](../../../packages/cli/assets/capabilities/skills/arc-architecture/references/arc42/10-quality-requirements/tips/tip-10-7-consider-fault-error-failure-quality-scenarios.md) for failure-related quality scenarios.

The assistant reads only these three section indexes and the selected topic files, not all tips/examples in those sections or the other nine section references. It selects them because the request spans runtime behavior, a cross-cutting mechanism, and a quality requirement.

## Evidence and review

Inspect the outbound client, configuration, tests, telemetry, and accepted reliability objectives. Keep an observed timeout value distinct from a documented target. If implementation and tests disagree, report both sources and ask the maintainer which behavior is intended. Do not invent a reliability threshold; ask the maintainer if none is established.
