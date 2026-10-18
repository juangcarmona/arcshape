# 6. Runtime View

**Purpose.** Explain representative runtime behavior and interaction among building-block instances through architecturally significant scenarios.

## Subsections

- **6.1 Runtime scenarios (repeat for selected scenarios).** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Request handlers, event consumers, workflows, and sequence/activity diagrams.
- Integration tests, logs, traces, queue and job definitions.
- Startup, shutdown, administration, retries, failures, and critical external interactions.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Choose a small set of scenarios that reveal architecture; do not enumerate every use case.
- Show participating blocks, sequence, important data/control flow, and external boundaries.
- Use schematic flows when details are not established and mark inferences.
- Include error or operational scenarios when they change architectural behavior.

## Sources and examples

- [arc42 Section 6: Runtime View](https://docs.arc42.org/section-6/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/runtime-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 6-1](https://docs.arc42.org/tips/6-1/)
  - [Tip 6-2](https://docs.arc42.org/tips/6-2/)
  - [Tip 6-3](https://docs.arc42.org/tips/6-3/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
