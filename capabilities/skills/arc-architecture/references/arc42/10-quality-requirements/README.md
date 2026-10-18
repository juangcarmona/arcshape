# 10. Quality Requirements

**Purpose.** Describe architecture-influencing quality requirements using concrete, assessable scenarios or measures, linking to canonical requirements where available.

## Subsections

- **10.1 Quality Requirements Overview.** Use it when the project has relevant information; preserve project-specific naming or grouping.
- **10.2 Quality Scenarios.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- System requirements and acceptance criteria.
- Load, latency, availability, recovery, security, compatibility, and maintainability evidence.
- Stakeholder priorities, SLOs, incidents, and architecture evaluation results.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Keep the highest-priority goals summarized in Section 1 and the fuller set here.
- Use measurable scenarios where evidence supports them; do not invent thresholds.
- Group large sets by category and link to canonical requirements.
- Distinguish required qualities from aspirations and resolve missing priorities with the maintainer.

## Sources and examples

- [arc42 Section 10: Quality Requirements](https://docs.arc42.org/section-10/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/quality-requirements-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- [Quality scenarios example](https://docs.arc42.org/examples/quality-htmlsc-2/) — compare how quality scenarios are written without carrying HTML Sanity Checker facts into another architecture.
- Selected practical tips:
  - [Tip 10-1](https://docs.arc42.org/tips/10-1/)
  - [Tip 10-5](https://docs.arc42.org/tips/10-5/)
  - [Tip 10-6](https://docs.arc42.org/tips/10-6/)
  - [Tip 10-8](https://docs.arc42.org/tips/10-8/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
