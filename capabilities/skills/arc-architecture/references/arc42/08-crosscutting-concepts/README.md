# 8. Crosscutting Concepts

**Purpose.** Explain the small set of architecture concepts, patterns, rules, and technical practices that shape multiple blocks or processes.

## Subsections

- **8.x One focused topic per heading; choose only relevant topics.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Shared libraries, middleware, security, logging, error handling, persistence, and communication patterns.
- Representative implementation and tests.
- Domain models and conventions spanning module boundaries.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Choose evidenced topics; do not fill a generic checklist with irrelevant content.
- Explain how each concept works, where it applies, and known exceptions.
- Link concepts to affected blocks, runtime flows, and quality requirements.
- Separate reusable mechanisms from one-time decisions; use Section 9 for decisions.

## Sources and examples

- [arc42 Section 8: Crosscutting Concepts](https://docs.arc42.org/section-8/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/concept-htmlsc-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 8-1](https://docs.arc42.org/tips/8-1/)
  - [Tip 8-3](https://docs.arc42.org/tips/8-3/)
  - [Tip 8-4](https://docs.arc42.org/tips/8-4/)
  - [Tip 8-11](https://docs.arc42.org/tips/8-11/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
