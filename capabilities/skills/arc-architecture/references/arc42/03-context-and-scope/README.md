# 3. Context and Scope

**Purpose.** Define the system boundary and the people or systems that exchange information with it; connect domain exchanges to technical channels when supported by evidence.

## Subsections

- **3.1 Business context.** Use it when the project has relevant information; preserve project-specific naming or grouping.
- **3.2 Technical context.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Product descriptions, user journeys, API contracts, and integration tests.
- Protocols, network and deployment configuration, and identity boundaries.
- External actors and systems with evidence of their interfaces.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Show the system as a boundary with named parties and meaningful inputs and outputs.
- Keep business meaning distinct from transport, then map the two when known.
- Cluster neighbors only with an explicit grouping rule and keep material interfaces visible.
- Keep this an overview; defer infrastructure detail to Section 7.

## Sources and examples

- [arc42 Section 3: Context and Scope](https://docs.arc42.org/section-3/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/business-context-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 3-1](https://docs.arc42.org/tips/3-1/)
  - [Tip 3-3](https://docs.arc42.org/tips/3-3/)
  - [Tip 3-9](https://docs.arc42.org/tips/3-9/)
  - [Tip 3-10](https://docs.arc42.org/tips/3-10/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
