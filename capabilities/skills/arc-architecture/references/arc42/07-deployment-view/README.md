# 7. Deployment View

**Purpose.** Show technical execution infrastructure and how software building blocks map to it, including environments that matter to architecture or operations.

## Subsections

- **7.1 Infrastructure Level 1.** Use it when the project has relevant information; preserve project-specific naming or grouping.
- **7.2 Infrastructure Level 2 and deeper when useful.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Containers, orchestration, infrastructure-as-code, networking, and cloud configuration.
- Deployment pipelines, environment settings, and operations runbooks.
- Telemetry or deployment evidence for actual nodes, channels, replicas, and regions.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Capture only infrastructure detail needed to explain placement, communication, or quality.
- Map software blocks to nodes, containers, processes, or managed services.
- Cover environment differences when they affect architecture or operations.
- Explain operationally significant nodes; leave undocumented hardware decisions open.
- Keep domain context in Section 3.

## Sources and examples

- [arc42 Section 7: Deployment View](https://docs.arc42.org/section-7/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/deployment-htmlsc-1/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 7-3](https://docs.arc42.org/tips/7-3/)
  - [Tip 7-4](https://docs.arc42.org/tips/7-4/)
  - [Tip 7-5](https://docs.arc42.org/tips/7-5/)
  - [Tip 7-9](https://docs.arc42.org/tips/7-9/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
