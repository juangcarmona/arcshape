---
title: Risks and technical debt
arc42-section: "11"
description: Known risks, technical debt, and their planned responses.
---

# 11. Risks and technical debt

## Risks

| Risk                                                                        | Impact                                                          | Response                                                                                                                                                              |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A consumer assumes `init` generated architecture facts                      | The empty scaffold could be mistaken for analyzed documentation | Keep setup and AI analysis as separate commands; state that the scaffold is structure only.                                                                           |
| Repository evidence varies by language and quality                          | Analysis depth varies across repositories                       | Report coverage and uncertainty without an allowlist or equal-depth promise.                                                                                          |
| Documentation sync overwrites authored content                              | Loss of user data                                               | Obsidian and Confluence sync track prior hashes and stop when target content changed.                                                                                 |
| Assistant providers handle data under their own policies                    | Maintainer expectations may be wrong                            | Explain provider responsibility before enabling AI workflows.                                                                                                         |
| The public reader site can lag canonical Markdown after a failed deployment | Readers may see an older architecture snapshot                  | Monitor the Pages workflow and rerun it from `main` after fixing the failure.                                                                                         |
| Browser, mutation, or passive DAST signals may be slow or noisy             | Maintainers may lose confidence or spend excess CI time         | Keep jobs isolated and bounded, retain reports, document reruns, and keep the new contexts outside required branch protection until evidence and policy are reviewed. |

## Technical debt

- The CLI records evidence and validates arc42 structure; assistant workflows still depend on the selected AI provider to interpret evidence.
- ADRs and C4 diagrams are Markdown authoring workflows; the static site and external sync currently publish the arc42 architecture directory.
- The Mermaid renderer adds browser and diagram dependencies that need continued dependency review before public release.
- Release publication depends on external npm and GitHub environment configuration; the versioned workflow and recovery instructions are committed, but those external settings are not architecture-owned state.
