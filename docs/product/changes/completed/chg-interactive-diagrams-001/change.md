---
id: CHG-INTERACTIVE-DIAGRAMS-001
type: product-change
title: Interactive architecture diagrams with assisted authoring and Mermaid compatibility
status: applied
base-revision: 'c1e38279a6b7276ec4f606177c7e41a99d64c771'
operations:
  add:
    - UC-CREATE-ARCHITECTURE-DIAGRAMS
    - FR-INTERACTIVE-DIAGRAMS
  modify:
    - FR-READER-VIEW
    - FR-C4-DIAGRAM-WORKFLOWS
    - FR-ASSISTED-WORKFLOWS
    - FR-CLI-COMMANDS
    - CON-NO-ARCSHAPE-DATA-COLLECTION
    - BR-PRODUCT-DEFINITION-AUTHORITY
  remove: []
---

## Problem

Architecture readers cannot explore diagram elements and relationships in ArcShape's current static diagrams. Maintainers want the assistant to produce richer diagrams and modernize existing documentation without abandoning Mermaid, duplicating diagram sources, or breaking existing publication workflows.

The current product definition describes C4 authoring and a static reader, but does not define general diagram authoring, embedded interaction, dedicated diagram pages, or mixed-renderer compatibility.

## Intended Product Outcome

Maintainers can ask ArcShape's skills to create and update architecture diagrams from repository evidence. New diagrams use the native interactive experience where it supports the required meaning. Mermaid remains supported for existing content, explicit maintainer preference, and unsupported native features.

Readers can interact with a compact diagram within its arc42 section and follow a single link to its dedicated page. The diagram uses the available width, has a bounded responsive height, and supports navigation when it cannot be read comfortably at an initial fit. There is no added title card, source button, repeated explanation, or nested document scrollbar.

Markdown remains the canonical documentation source, with one editable source for each diagram. Generated interactive and static representations are projections, not additional authored truth. Existing self-contained reader output remains available; interactive folder publication is an explicit additional choice.

Migration is requested and reviewed by the maintainer. Installing or updating ArcShape does not rewrite diagrams. A proposed conversion preserves elements, relationships, ordering, conditions and architectural meaning; unsupported content remains Mermaid.

## Rationale

The maintainer has accepted the compact interactive experience after trying the Brisa proof of concept. Its useful behavior belongs in normal documentation workflows rather than a separate manual publishing process. Compatibility makes adoption incremental and lets a document use the most suitable supported representation for each diagram.

The assistant can reason about meaning and propose changes; deterministic tools must validate and render those proposals without calling an LLM. Human review remains necessary because a visually attractive conversion can still misrepresent the architecture.

## Affected Product Areas

Diagram authoring and maintenance; C4 communication; architecture reader publication and navigation; deterministic generation; portable AI skills; source compatibility and opt-in migration. The new authoring use case inherits the existing product-authority and no-data-collection boundaries.

## Open Questions

None. Detailed source syntax, command flags, renderer packaging, isolation design, and numeric layout limits belong to technical proposal, not product intent.

## Product Acceptance

- A maintainer can request evidence-grounded C4-style context, container and component views, sequence diagrams and activity flows. Native support for additional families and individual features is explicitly documented; universal Mermaid parity or conversion is not promised.
- The reader can select supported elements or relationships in a compact embedded view, navigate a large diagram deliberately, and open the same diagram and selection on a dedicated page.
- Normal page scrolling, keyboard operation, narrow screens, light/dark presentation, and a readable static representation are part of the experience.
- Existing Mermaid content remains supported, including pages that mix engines. Unsupported native requests can be authored as Mermaid. Invalid declared source is diagnosed instead of silently changing engines.
- AI authoring includes validation, rendered inspection and a reviewable proposal. A build does not call an AI service or rewrite authored sources.
- Existing self-contained reader behavior remains available. The interactive site can be hosted by the maintainer with local assets and no ArcShape service or runtime CDN requirement.
- Migration is explicit and reviewable, with one canonical source per diagram and no silent loss of information. External documentation connections remain supported without promising native interactivity on every target.

## Out of Scope

Technical design, implementation state, release numbering, deployment, universal Mermaid translation, a browser diagram editor, ArcShape-hosted services, mandatory migration, and automatic changes to adopter repositories. This change does not grant the assistant authority to approve product or architecture decisions.
