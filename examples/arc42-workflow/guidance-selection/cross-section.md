# Cross-section guidance selection

## Request

“Add a timeout to outbound requests and explain how failures are handled and what reliability target this supports.”

## References selected

- [`06-runtime-view/README.md`](../../../capabilities/skills/arc-architecture/references/arc42/06-runtime-view/README.md) for the interaction and failure scenario.
- [`08-crosscutting-concepts/README.md`](../../../capabilities/skills/arc-architecture/references/arc42/08-crosscutting-concepts/README.md) for shared timeout, retry, and error-handling behavior.
- [`10-quality-requirements/README.md`](../../../capabilities/skills/arc-architecture/references/arc42/10-quality-requirements/README.md) for the reliability target and measurable response.

The assistant reads only these three references and does not load the other nine section references. It selects them because the request spans runtime behavior, a cross-cutting mechanism, and a quality requirement.

## Evidence and review

Inspect the outbound client, configuration, tests, telemetry, and accepted reliability objectives. Keep an observed timeout value distinct from a documented target. If implementation and tests disagree, report both sources and ask the maintainer which behavior is intended. Do not invent a reliability threshold; ask the maintainer if none is established.
