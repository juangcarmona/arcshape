---
id: ADR-0001
title: Keep ADRs in architecture section 09
status: Accepted
date: "2026-10-21"
deciders:
  - Repository Maintainer
---

<!-- markdownlint-disable-next-line MD025 -->
# ADR-0001: Keep ADRs in architecture section 09

## Context

ArcShape's canonical architecture documentation is organized as twelve numbered section directories. A separate `docs/adr/` collection would split architecture navigation between two roots and require two overlapping ADR workflows. ArcShape has no downstream adopters yet, so the repository can establish the canonical layout before the first public adoption.

## Decision

Keep every ArcShape Architecture Decision Record under `docs/architecture/09-architecture-decisions/`. The section `README.md` is the arc42 section document and the alphabetical index for every ADR. Records use the existing `ADR-NNNN-kebab-case-title.md` convention by default and may be grouped in stable subdirectories when a project needs it. Do not create a parallel `docs/adr/` collection.

## Alternatives considered

- **Keep `docs/adr/` as a separate collection**: rejected because it duplicates the architecture navigation boundary and keeps two ADR workflows in the repository.
- **Put ADR bodies directly in the section README**: rejected because individual records need stable links, independent history, and optional project grouping.
- **Use a new ADR metadata or resolver format**: rejected because the existing Markdown and frontmatter contract is sufficient.

## Consequences

- **Positive:** Section 09 is the single discoverable entry point for architecture decisions, and the generated reader can render each ADR as supporting material with a stable route.
- **Positive:** ArcShape's packaged `arc-adr` skill and its `.agents` and `.claude` dogfood copies share one unambiguous workflow.
- **Negative:** Repositories with an existing flat ADR collection need a one-time migration into section 09 or an explicit established-convention exception.
- **Neutral:** The ArcShape CLI continues to read legacy flat arc42 section files during migration; the canonical new layout remains directory-based.

## References

- [ArcShape architecture navigation](../README.md)
- [ArcShape ADR skill](../../../packages/cli/assets/capabilities/skills/arc-adr/SKILL.md)
- [Issue #84](https://github.com/juangcarmona/arcshape/issues/84)
