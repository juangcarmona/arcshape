---
id: FR-EXTERNAL-DOCS-INTEGRATIONS
type: functional-requirement
title: Connect Architecture Documentation to External Documentation Systems
status: active
derived-from:
  - UC-SYNC-ARCHITECTURE-DOCS
verification:
  - scenario: A maintainer can connect repository Markdown architecture documentation with Confluence or Obsidian.
  - scenario: The maintainer can review links or proposed documentation changes before synchronization or publication.
uses-terms:
  - TERM-ARCHITECTURE-DOCUMENTATION
---

## Requirement

ArcShape must let maintainers connect repository Markdown architecture documentation with both Confluence and Obsidian, including the ability to trace, access, and synchronize or publish relevant documentation through those systems. The maintainer can review proposed changes before they are synchronized or published.

## Rationale

Projects often maintain documentation across a repository and systems such as Confluence or Obsidian. Connecting those sources helps architecture documentation fit into existing project practices.
