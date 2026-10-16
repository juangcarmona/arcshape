---
title: Deployment view
arc42-section: "07"
description: Infrastructure and environment mapping for the system.
---

# 7. Deployment view

## Infrastructure overview

ArcShape runs as a local Node.js process in the adopter's repository. The current package can be assembled as an npm tarball; public npm publication and the trusted GitHub release workflow are tracked separately and are not available yet.

Session state is stored locally in `.arcshape/sessions/<session-id>/session.json`. It is not sent to an ArcShape service.

## Deployment mapping

| Environment               | Artifact                              | Current state                                                           |
| ------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Developer checkout        | Node.js source and Markdown templates | Available                                                               |
| Local tarball install     | `arcshape@0.1.0` package              | Packed-package initialization smoke check passed                        |
| Generated reader site     | `docs/architecture-site/index.html`   | Built locally from canonical Markdown                                   |
| npm registry              | Published ArcShape package            | Pending issue [#12](https://github.com/juangcarmona/arcshape/issues/12) |
| ArcShape-operated service | None                                  | Not part of the architecture                                            |
