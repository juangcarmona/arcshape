---
title: Building block view
arc42-section: "05"
description: Static building blocks.
---

# 5. Building block view

The worker records processing and fulfillment through the repository interface ([implementation](../../../repository/src/worker.py)).

## Maintainer-authored note

The monthly settlement process remains outside this workflow.

## Open question

The implementation does not establish how failed updates are retried. Ask the maintainer before documenting retry behavior.
