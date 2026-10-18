# 9. Architecture Decisions

**Purpose.** Preserve rationale for significant choices so stakeholders can retrace alternatives, decision criteria, and consequences.

## Subsections

- **Decision records or a compact decision list; use separate records where useful.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- ADRs, proposals, pull requests, issue discussions, and migrations.
- Criteria such as quality goals, constraints, interfaces, and operating needs.
- Current implementation/configuration showing whether a choice remains active.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Document decisions with material structural, quality, dependency, interface, or construction impact.
- Capture context, decision, rationale/criteria, alternatives, consequences, status, and date when known.
- Link existing ADRs instead of duplicating them.
- Distinguish historical decisions from current choices; flag reversals or missing rationale.

## Sources and examples

- [arc42 Section 9: Architecture Decisions](https://docs.arc42.org/section-9/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/decision-htmlsc/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 9-1](https://docs.arc42.org/tips/9-1/)
  - [Tip 9-2](https://docs.arc42.org/tips/9-2/)
  - [Tip 9-3](https://docs.arc42.org/tips/9-3/)
  - [Tip 9-5](https://docs.arc42.org/tips/9-5/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
