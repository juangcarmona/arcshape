# 5. Building Block View

**Purpose.** Describe the static decomposition into meaningful software building blocks and dependencies, from a system-level view into selected details.

## Subsections

- **5.1 Whitebox Overall System.** Use it when the project has relevant information; preserve project-specific naming or grouping.
- **5.2 Level 2.** Use it when the project has relevant information; preserve project-specific naming or grouping.
- **5.3 Level 3 and further refinements as needed.** Use it when the project has relevant information; preserve project-specific naming or grouping.

## Evidence to examine

- Source tree, package boundaries, dependencies, public interfaces, and code ownership.
- Build graph, runtime composition, and tests demonstrating responsibilities.
- Existing diagrams and maintainer-confirmed rationale for decomposition.

Use these as investigation leads, not automatic proof. Prefer current implementation, tests, configuration, and maintainer-confirmed decisions appropriate to the claim. Cite concrete repository evidence in resulting documentation. Separate observed behavior, accepted intent, inference, and proposal.

## Gaps and conflicts

- If evidence does not establish useful content, state what is missing and ask the maintainer for context.
- If sources disagree, describe the competing evidence and its source; do not silently choose one. Ask the maintainer to resolve intent or status.
- Do not invent names, responsibilities, boundaries, measures, owners, dates, or rationales to make the section appear complete.
- If the project omits, combines, or adapts this section, follow that choice and link to the content location when known.

## Practical guidance

- Start at level 1; describe important blocks’ responsibility, interfaces, and relationships.
- Refine only blocks whose internals matter, and make each refinement’s parent clear.
- Use black-box descriptions for blocks not being decomposed.
- Map blocks to repository locations when evidence supports it; directory names alone are not architecture.
- Link crosscutting rules to Section 8 rather than duplicating them.

## Sources and examples

- [arc42 Section 5: Building Block View](https://docs.arc42.org/section-5/) — section structure and content guidance.
- [Illustrative example](https://docs.arc42.org/examples/buildingblock-hsc/) — use as a discussion pattern; do not copy example system facts into another architecture.
- Selected practical tips:
  - [Tip 5-2](https://docs.arc42.org/tips/5-2/)
  - [Tip 5-3](https://docs.arc42.org/tips/5-3/)
  - [Tip 5-5](https://docs.arc42.org/tips/5-5/)
  - [Tip 5-13](https://docs.arc42.org/tips/5-13/)

Creator and license: Gernot Starke, CC BY-SA 4.0. See [SOURCES.md](../SOURCES.md) for attribution and licensing scope.
