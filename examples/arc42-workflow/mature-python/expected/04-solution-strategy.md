---
title: Solution strategy
arc42-section: "04"
description: Evidence-backed approach to fulfilling orders.
---

# 4. Solution strategy

The worker reads orders from the configured `orders` queue ([runtime configuration](../repository/config/runtime.yaml)) and records processing and fulfilled states through its repository interface ([worker implementation](../repository/src/worker.py)).

The persistence technology is configured as PostgreSQL ([runtime configuration](../repository/config/runtime.yaml)). The repository interface does not establish transaction or retry behavior; confirm those details with the maintainer before documenting them.
