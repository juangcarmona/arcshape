# ArcShape reader study

This protocol prepares the task-based review proposed in [issue #9](https://github.com/juangcarmona/arcshape/issues/9). It is a facilitator aid, not evidence that a reader study has taken place. The question set and pass threshold remain proposed until the product owner accepts them.

## Study setup

- Review the published reader site: <https://juangcarmona.github.io/arcshape/>.
- Use at least one technical reader and one non-technical reader. Record only the audience group, not names or contact details.
- Ask each reader to complete all four tasks independently. Do not explain the site, point to sections, or answer questions about where information lives.
- Allow up to five minutes per task. Stop the timer when the reader gives an answer and identifies the section or source that supports it.
- Record the reader's answer in their own words, elapsed time, whether they found supporting evidence, and any wrong turns or unclear terms.
- Do not record audio, video, or screen activity. Keep notes local to the study; do not enter participant data into ArcShape or an AI service.
- Record the site URL and the repository commit used for the session so results can be tied to the reviewed content.

## Participant introduction

> We are checking whether this architecture site helps people find and understand information. We are testing the site, not you. Please think aloud as you browse. I will not guide you to an answer. You can stop at any time. I will take notes about answers and navigation, without recording you or collecting your name.

## Tasks

Read each task aloud exactly as written. Do not show the answer key until the session is over.

1. After exploring this site, how would you describe what ArcShape does and who it is for?
2. What happens to repository information when ArcShape's assistant workflows or Confluence sync are used?
3. Name two main ArcShape building blocks and describe how they work together.
4. During an analysis session, a source file changes between rounds. How does ArcShape represent that change, and what must the reviewer do before classifying the file again?

## Facilitator answer key

Give one point when the reader explains the core answer in their own words and identifies supporting site content. Do not require exact terminology.

| Task | Expected answer                                                                                                                                                                                                                                                                                                       | Supporting site content                                                                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | ArcShape is a local npm CLI and Codex/Claude workflow for creating and maintaining Markdown architecture documentation. Its users include repository maintainers and architecture readers.                                                                                                                            | [Introduction and goals](https://juangcarmona.github.io/arcshape/#/section/01)                                                                                   |
| 2    | ArcShape does not send repository data to an ArcShape-operated service. Assistant context may be handled by the selected AI provider under its policies. Confluence receives selected architecture Markdown only when the maintainer explicitly runs a configured sync; credentials are not stored in the repository. | [System scope and context](https://juangcarmona.github.io/arcshape/#/section/03), [Cross-cutting concepts](https://juangcarmona.github.io/arcshape/#/section/08) |
| 3    | Any two building blocks are acceptable when their responsibilities and relationship are described. For example, the assistant workflows interpret repository evidence and propose Markdown changes, while the CLI performs deterministic setup, session, validation, sync, and site operations.                       | [Building block view](https://juangcarmona.github.io/arcshape/#/section/05)                                                                                      |
| 4    | Session refresh marks modified evidence as changed. The reviewer must re-read it, then use `mark --accept-changed` before recording a new classification.                                                                                                                                                             | [Runtime view](https://juangcarmona.github.io/arcshape/#/section/06), [Building block view](https://juangcarmona.github.io/arcshape/#/section/05)                |

## Per-reader scorecard

Use one copy per reader. Score 1 only when the answer is substantively correct and the reader locates supporting site content; otherwise score 0. A skipped task scores 0.

| Task | Score (0/1) | Time (minutes) | Supporting section found? | Answer summary, wrong turns, or unclear wording |
| ---- | ----------- | -------------- | ------------------------- | ----------------------------------------------- |
| 1    |             |                |                           |                                                 |
| 2    |             |                |                           |                                                 |
| 3    |             |                |                           |                                                 |
| 4    |             |                |                           |                                                 |

**Audience group:** technical / non-technical

**Site URL and reviewed commit:**

**Total:** ___ / 4

**Tasks completed within five minutes with supporting content:** ___ / 4

## Proposed pilot decision rule

This rule is copied from the proposal in issue #9 and remains pending product-owner acceptance. The pilot passes when each reader completes at least three of four tasks within five minutes per task and identifies supporting site content for each credited answer. Include at least one reader from each audience group. Report each reader's result separately; do not average away a miss by one group.

After the sessions, summarize the number of readers in each audience group, scores and times by task, common wrong turns, unclear words, and any reader who could not complete a task. Keep the acceptance decision separate from observations. Do not mark the issue's reader-review criterion complete until real sessions have been run and the product owner has accepted the decision rule.
