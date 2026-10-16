---
title: Risks and technical debt
arc42-section: "11"
description: Known risks, technical debt, and their planned responses.
---

# 11. Risks and technical debt

## Risks

| Risk                                                     | Impact                                                          | Response                                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| A consumer assumes `init` generated architecture facts   | The empty scaffold could be mistaken for analyzed documentation | Keep setup and AI analysis as separate commands; state that the scaffold is structure only. |
| Repository evidence varies by language and quality       | Analysis depth varies across repositories                       | Report coverage and uncertainty without an allowlist or equal-depth promise.                |
| Documentation sync overwrites authored content            | Loss of user data                                               | Obsidian and Confluence sync track prior hashes and stop when target content changed.       |
| Assistant providers handle data under their own policies | Maintainer expectations may be wrong                            | Explain provider responsibility before enabling AI workflows.                               |

## Technical debt

- The CLI records evidence and validates arc42 structure; assistant workflows still depend on the selected AI provider to interpret evidence.
- Cross-document Markdown link validation and multi-page Confluence publishing are not implemented.
- The Mermaid renderer adds browser and diagram dependencies that need continued dependency review before public release.
- The first public npm release and release automation remain outstanding.
