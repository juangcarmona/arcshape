# Single-section guidance selection

## Request

“Document the constraints that limit how we can deploy this service.”

## References selected

- [`02-constraints/README.md`](../../../capabilities/skills/arc-architecture/references/arc42/02-constraints/README.md)
- [`tip-2-2-clarify-the-consequences-of-constraints.md`](../../../capabilities/skills/arc-architecture/references/arc42/02-constraints/tips/tip-2-2-clarify-the-consequences-of-constraints.md) for reasoning about the impact of a constraint.
- [`example-constraints-1.md`](../../../capabilities/skills/arc-architecture/references/arc42/02-constraints/examples/example-constraints-1.md) as an illustrative pattern, not evidence about this service.

The assistant reads the index to locate Section 2, then reads this section reference and only the tip/example that addresses the request. It does not read the other eleven section references or the rest of the catalog. If evidence shows the request also concerns deployment placement or technical channels, it can add the Section 7 or Section 3 reference after identifying that need.

## Evidence and review

Inspect deployment configuration, build/runtime policy, platform constraints, and maintainer-confirmed requirements. Describe what each constraint changes and cite its repository source. If a platform choice appears only in a configuration file and its status is unclear, distinguish the observed configuration from a binding decision and ask the maintainer whether it is negotiable.
