# 2. Constraints

**Purpose.** Make constraints on architecture, implementation, and development visible, including rules that may be negotiable but still need explicit resolution.

## Subsections

- **Constraints on design, implementation, or development process.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Build and repository policies.
- Platform, language, runtime, protocol, deployment, and compatibility requirements.
- Organizational, legal, vendor, and process obligations.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Separate technical, organizational, legal, and convention constraints.
- State each constraint’s source, force, and consequence; distinguish mandates from preferences.
- Ask whether unclear constraints are negotiable; do not treat historical choices as mandatory without evidence.

## Sources and examples

- [arc42 Section 2: Constraints](https://docs.arc42.org/section-2/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/constraints-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 2-2](https://docs.arc42.org/tips/2-2/)
  - [Tip 2-5](https://docs.arc42.org/tips/2-5/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
