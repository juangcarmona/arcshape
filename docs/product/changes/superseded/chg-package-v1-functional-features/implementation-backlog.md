# ArcShape package v1 implementation backlog

GitHub issue tree created 2026-10-16. The umbrella is [#25](https://github.com/juangcarmona/arcshape/issues/25); new child issues are #19–#24. Existing issues #6 and #8 were updated.

## Order and priority

Epic priority: **P0**. Priorities are proposed because the engineer asked for prioritization. `P0` blocks a useful first installable release or the requested same-repository dogfood proof. `P1` is part of the first package scope and follows the core path; it is not deferred out of v1.

| Order | Priority | Work item | Tracker action | Depends on |
| --- | --- | --- | --- | --- |
| 1 | P0 | [#6 Choose ArcShape’s initial repository-analysis coverage](https://github.com/juangcarmona/arcshape/issues/6) | Updated to the confirmed language-agnostic scope; remains open until the Product Change is accepted. | Product Change acceptance |
| 2 | P0 | [#7 Let maintainers install and initialize ArcShape in any repository](https://github.com/juangcarmona/arcshape/issues/7) | Reuse as written. | #6, #4 |
| 3 | P0 | [#19 Track resumable, evidence-based repository-analysis sessions](https://github.com/juangcarmona/arcshape/issues/19) | Created. | #7 |
| 4 | P0 | [#10 Provide Codex and Claude workflows for architecture documentation](https://github.com/juangcarmona/arcshape/issues/10) | Reuse; extend through the new skills below. | #7 |
| 5 | P0 | [#8 Generate evidence-grounded arc42 architecture documentation](https://github.com/juangcarmona/arcshape/issues/8) | Updated with language-agnostic scope and analysis-session dependency. | #6, #7, #19, #10 |
| 6 | P0 | [#9 Publish generated architecture documentation as a reader-friendly static site](https://github.com/juangcarmona/arcshape/issues/9) | Reuse; output is generated from canonical Markdown. | #8 |
| 7 | P0 | [#20 Dogfood ArcShape in this repository and attach site screenshots to the PR](https://github.com/juangcarmona/arcshape/issues/20) | Created. | #7–#10, #19 |
| 8 | P1 | [#11 Link architecture documentation to approved ProductShape artifacts](https://github.com/juangcarmona/arcshape/issues/11) | Reuse; keep citations optional when no ProductShape model exists. | #3, #8 |
| 9 | P1 | [#21 Create and maintain Markdown ADRs with an AI workflow](https://github.com/juangcarmona/arcshape/issues/21) | Created. | #7, #10 |
| 10 | P1 | [#22 Create and maintain C4 diagrams with an AI workflow](https://github.com/juangcarmona/arcshape/issues/22) | Created. | #7, #10 |
| 11 | P1 | [#23 Connect Markdown architecture docs to Obsidian](https://github.com/juangcarmona/arcshape/issues/23) | Created. | #7, #8 |
| 12 | P1 | [#24 Connect Markdown architecture docs to Confluence](https://github.com/juangcarmona/arcshape/issues/24) | Created. | #7, #8 |
| 13 | P0 | [#12 Publish ArcShape to npm manually once, then automate trusted GitHub releases](https://github.com/juangcarmona/arcshape/issues/12) | Reuse as the release child; remains last before the first public package release. | #4, #5, #7–#11, analysis sessions, dogfood, ADR, C4, Obsidian, Confluence |

Issue #13 (deploy ArcShape's own site to Pages) is excluded from this epic: generating and reviewing the site is in scope; operating a hosted site is not required to ship the package. Issues #14 and #15 are broader phased assurance work and remain outside this feature epic.

## Review debt

The repo has no post-merge review log. Closed issues #1 and #3 correspond to merged PRs #2 and #16, and their lessons appear in `docs/engineering/process-improvements.md` as PI-001 and PI-002. This is reported debt, not a blocker for shaping this epic.

## Umbrella issue

### Title

[#25 Ship ArcShape v1 as an installable architecture-documentation package and prove it in ArcShape](https://github.com/juangcarmona/arcshape/issues/25)

### Body

## Intent and problem

ArcShape's first package must give maintainers an installable CLI and Codex/Claude workflows for documenting a real software repository. The accepted direction is Markdown-first and language-agnostic: agents inspect available evidence in resumable rounds, help maintainers create and refine arc42 docs, ADRs, and C4 diagrams, and the CLI validates, renders, and connects those Markdown sources to a static reader site and supported documentation systems.

The first release must prove the workflow on ArcShape itself. Its repository currently has no generated arc42 documentation or reader site. The implementation PR must dogfood the tool: create ArcShape's own architecture docs, build the site, and include screenshots so reviewers can inspect the real output.

## Who is affected?

Repository maintainers and architects adopting ArcShape; Codex and Claude users working in those repositories; and technical and non-technical readers of the generated architecture site.

## Scope

**In scope:** The existing and new child issues listed below: npm CLI onboarding and release; deterministic analysis-session tools; Codex and Claude AI commands/skills; evidence-grounded arc42 authoring and refinement; ADR and C4 workflows; static site generation; optional ProductShape citations; Obsidian and Confluence connections; and ArcShape-repository dogfooding with PR screenshot evidence.

The CLI tools and AI workflow surfaces are distinct. CLI commands perform deterministic operations and session bookkeeping. Codex/Claude commands dispatch to skills; skills do evidence analysis, ask questions, and author Markdown, using CLI tools where needed.

**Out of scope:** Support guarantees for specific programming languages; a hosted ArcShape service; hosting the generated site for adopters; non-Markdown canonical architecture documents; providers beyond Codex and Claude; unrelated security-assurance expansion in issues #14–#15.

## Acceptance criteria

- [ ] All linked P0/P1 child issues are complete or explicitly descoped by the maintainer; no child is silently dropped.
- [ ] A clean repository can install the npm package and initialize ArcShape without overwriting user-authored files.
- [ ] Codex and Claude expose separate AI workflow commands and skills; deterministic CLI tools remain a distinct interface.
- [ ] Repository analysis is language-agnostic, resumable, evidence-tracked, and explicit about conflicts, inference, and unanswered questions.
- [ ] The workflows create and maintain Markdown arc42 docs, ADRs, and C4 diagrams with maintainer review before accepting proposed changes.
- [ ] The CLI validates the authored docs, generates a navigable static reader site, and connects Markdown docs to Obsidian and Confluence with reviewable sync/publish behavior.
- [ ] In the implementation PR, ArcShape's own repository contains useful, evidence-grounded arc42 Markdown and a successfully generated reader site. The PR includes representative screenshots of the site (overview/navigation and at least one substantive architecture view) as review evidence.
- [ ] The first package can be installed from npm using the documented release process; generated docs/site remain reproducible from canonical Markdown.

## Dependencies

Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES` must be accepted before implementation claims the proposed ADR, C4, and external-documentation scope as approved product behavior. Existing issues #4 and #5 provide CI/security dependencies for release issue #12. Technical child dependencies and order are listed in the table above.

## Product definition references

Accepted baseline: `FR-ONBOARD-REPOSITORY`, `FR-ARC42-DOCUMENTATION`, `FR-ASSISTED-WORKFLOWS`, `FR-READER-VIEW`, `CON-ARC42-FRAMEWORK`, `CON-NO-ARCSHAPE-DATA-COLLECTION`, and `BR-PRODUCT-DEFINITION-AUTHORITY` under `docs/product/model`.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:653be48aa9a81a105bf346d834281848b548af0a840ddf9878a956716a63b928" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:0dbded0743b9855235b510338ed7b96a23728ee3e2c73a3f0f5ae587c3669927" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:39e44212462fb958f23ed02eb19f0b6a6914d08abbd449b60eb103ce4dc9a395" -->
<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:c03be532b7270f092a7e288416ffcd58793356cf634adf9b770c03f64d54c4dd" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:1e3c22d7a31c58416a8d09e844c6b922571b498453aa074885b9b85f37ee6445" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:c0ad7e6890064e6f53b1245bdf17e3a0702768a1a80883cc90c2dfc5f2dfd689" -->

Proposed scope awaiting acceptance: `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES` under `docs/product/changes/active/`. Do not cite its proposed artifacts as accepted baseline requirements until the Product Change is applied and merged.

## Affected behavior and quality expectations

This introduces the first shipped CLI, AI workflows, architecture-documentation outputs, reader site, and documentation connections. Accuracy, visible uncertainty, non-destructive updates, accessible reader navigation, reproducible generation, review before external publication, and the existing no-ArcShape-service data constraint apply.

## Test impact and risks

Child plans must cover clean and preconfigured repositories; analysis pause/resume, changed evidence, and conflicting sources; Codex/Claude installation and command dispatch; generated Markdown review and safe updates; ADR/C4 outputs; site links, navigation, accessibility, and reproducibility; and dry-run/review paths for both documentation connectors. The dogfood child verifies real output from this repository and includes PR screenshots. Main risks are conflating AI reasoning with CLI tools, claiming language coverage that is not evidence-backed, destructive overwrite/sync behavior, and allowing external publication without maintainer review.

## Ordered work and priority

| Order | Priority | Child issue | Depends on |
| --- | --- | --- | --- |
| 1 | P0 | [#6 Choose ArcShape’s initial repository-analysis coverage](https://github.com/juangcarmona/arcshape/issues/6) | — |
| 2 | P0 | [#7 Let maintainers install and initialize ArcShape in any repository](https://github.com/juangcarmona/arcshape/issues/7) | #6, #4 |
| 3 | P0 | [#19 Track resumable, evidence-based repository-analysis sessions](https://github.com/juangcarmona/arcshape/issues/19) | #7 |
| 4 | P0 | [#10 Provide Codex and Claude workflows for architecture documentation](https://github.com/juangcarmona/arcshape/issues/10) | #7 |
| 5 | P0 | [#8 Generate evidence-grounded arc42 architecture documentation](https://github.com/juangcarmona/arcshape/issues/8) | #6, #7, #19, #10 |
| 6 | P0 | [#9 Publish generated architecture documentation as a reader-friendly static site](https://github.com/juangcarmona/arcshape/issues/9) | #8 |
| 7 | P0 | [#20 Dogfood ArcShape in this repository and attach site screenshots to the PR](https://github.com/juangcarmona/arcshape/issues/20) | #7–#10, #19 |
| 8 | P1 | [#11 Link architecture documentation to approved ProductShape artifacts](https://github.com/juangcarmona/arcshape/issues/11) | #3, #8 |
| 9 | P1 | [#21 Create and maintain Markdown ADRs with an AI workflow](https://github.com/juangcarmona/arcshape/issues/21) | #7, #10 |
| 10 | P1 | [#22 Create and maintain C4 diagrams with an AI workflow](https://github.com/juangcarmona/arcshape/issues/22) | #7, #10 |
| 11 | P1 | [#23 Connect Markdown architecture docs to Obsidian](https://github.com/juangcarmona/arcshape/issues/23) | #7, #8 |
| 12 | P1 | [#24 Connect Markdown architecture docs to Confluence](https://github.com/juangcarmona/arcshape/issues/24) | #7, #8 |
| 13 | P0 | [#12 Publish ArcShape to npm manually once, then automate trusted GitHub releases](https://github.com/juangcarmona/arcshape/issues/12) | #4, #5, #7–#11, #19–#24 |

## Umbrella task list

- [ ] #6 Choose ArcShape’s initial repository-analysis coverage
- [ ] #7 Let maintainers install and initialize ArcShape in any repository
- [ ] #19 Track resumable, evidence-based repository-analysis sessions
- [ ] #10 Provide Codex and Claude workflows for architecture documentation
- [ ] #8 Generate evidence-grounded arc42 architecture documentation
- [ ] #9 Publish generated architecture documentation as a reader-friendly static site
- [ ] #20 Dogfood ArcShape in this repository and attach site screenshots to the PR
- [ ] #11 Link architecture documentation to approved ProductShape artifacts
- [ ] #21 Create and maintain Markdown ADRs with an AI workflow
- [ ] #22 Create and maintain C4 diagrams with an AI workflow
- [ ] #23 Connect Markdown architecture docs to Obsidian
- [ ] #24 Connect Markdown architecture docs to Confluence
- [ ] #12 Publish ArcShape to npm manually once, then automate trusted GitHub releases
## Created child issues

### [#19 Track resumable, evidence-based repository-analysis sessions](https://github.com/juangcarmona/arcshape/issues/19) (P0)

#### Intent and problem

Language-agnostic reverse engineering of a real repository can involve many Markdown sources, implementation evidence, conflicts, and unknowns. A Codex or Claude workflow needs durable, resumable progress so an interruption does not lose what was inspected or mistake an unprocessed source for an empty finding.

#### Who is affected?

Repository maintainers using ArcShape's reverse-engineering workflow and the Codex/Claude skills that guide it.

#### Scope

**In scope:** Deterministic CLI session tools for inventorying an agreed repository scope, dividing evidence into bounded rounds, recording source classifications and findings, tracking leads/questions, reporting coverage, detecting source changes, and resuming a session. The CLI records state; the AI skill interprets evidence and proposes documentation.

**Out of scope:** Language-specific analyzers or a CLI that independently reasons about or authors architecture claims.

#### Acceptance criteria

- [ ] A session can be started from an agreed repository scope and resumed after the CLI or agent exits.
- [ ] The CLI reports bounded next work and accurately distinguishes pending, reviewed, excluded, and changed evidence.
- [ ] The CLI records classifications/findings, leads, questions, and answers without inventing their semantic content.
- [ ] A human or AI workflow can inspect progress, correct a mistaken classification, and produce a report of coverage and unresolved gaps.
- [ ] Tests cover interruption/resume, changing evidence, duplicate/invalid records, and incomplete versus complete coverage.

#### Dependencies

Issue #7 for the installable CLI and the accepted `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES` scope. Issue #10 consumes these tools from assistant skills.

#### Product definition references

Accepted: `FR-ONBOARD-REPOSITORY`, `CON-NO-ARCSHAPE-DATA-COLLECTION`. Proposed until accepted: `FR-REVERSE-ENGINEER-ARCHITECTURE` and `FR-CLI-COMMANDS` in `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:653be48aa9a81a105bf346d834281848b548af0a840ddf9878a956716a63b928" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:1e3c22d7a31c58416a8d09e844c6b922571b498453aa074885b9b85f37ee6445" -->

#### Affected behavior and quality expectations

Adds persisted analysis-session behavior. Progress must be truthful, repository data remains local except for explicit user-directed external integrations, and uncertain interpretations remain with the AI/human workflow rather than the bookkeeping tool.

#### Test impact and risks

Use repository fixtures with multiple evidence types and rounds. Verify resume and drift detection. Risk: encoding ProductShape's exact recovery implementation where ArcShape needs only the same evidence-round principles; keep the feature language-agnostic and architecture-documentation-focused.

### [#21 Create and maintain Markdown ADRs with an AI workflow](https://github.com/juangcarmona/arcshape/issues/21) (P1)

#### Intent and problem

Maintainers need decisions, rationale, alternatives, and consequences recorded in a durable form alongside architecture documentation, and need help drafting or superseding records without treating an inferred decision as accepted.

#### Who is affected?

Repository maintainers and future engineers who need to understand why architecture choices were made.

#### Scope

**In scope:** Codex and Claude skills/commands for proposing and maintaining Markdown ADRs; a repository-local ADR index; conventions informed by the existing Agent Toolkit ADR skill and Raccord/DomusMind ADR examples; review before a decision is accepted.

**Out of scope:** Automatic acceptance of decisions, non-Markdown ADR stores, or a standalone ADR web service.

#### Acceptance criteria

- [ ] A maintainer can ask either assistant to draft an ADR from a supplied decision and relevant evidence.
- [ ] A proposed ADR separates context, decision, considered alternatives, and consequences and is saved as Markdown in the repository's configured ADR location.
- [ ] The workflow distinguishes a decision supplied by a human from facts inferred from repository evidence and asks when the decision itself is unknown.
- [ ] Existing accepted ADRs are not silently rewritten; superseding or updating one is presented for maintainer review.
- [ ] The ADR index links records and makes their state/relationships understandable.
- [ ] Fixtures or examples verify create, update/supersede, index maintenance, and no-decision-known cases.

#### Dependencies

Issues #7 and #10, and accepted Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`.

#### Product definition references

Accepted: `FR-ASSISTED-WORKFLOWS`, `BR-PRODUCT-DEFINITION-AUTHORITY`. Proposed: `UC-CREATE-ADRS` and `FR-ADR-WORKFLOWS` in the active Product Change.

<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:0dbded0743b9855235b510338ed7b96a23728ee3e2c73a3f0f5ae587c3669927" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:c0ad7e6890064e6f53b1245bdf17e3a0702768a1a80883cc90c2dfc5f2dfd689" -->

#### Affected behavior and quality expectations

Adds AI-assisted ADR authoring. Accuracy of decision attribution, preserving accepted records, human review, and Markdown readability are essential.

#### Test impact and risks

Verify generated ADR structure and index links using fixture repositories, including an existing ADR history. Risk: treating code evidence as proof of why a decision was made; the workflow must ask the maintainer.

### [#22 Create and maintain C4 diagrams with an AI workflow](https://github.com/juangcarmona/arcshape/issues/22) (P1)

#### Intent and problem

Maintainers need C4 views that communicate system context and structure. Creating them from repository evidence is laborious, and diagrams become misleading when they are not updated with the explanatory architecture text.

#### Who is affected?

Repository maintainers, software architects, and readers who need visual explanations of system boundaries and building blocks.

#### Scope

**In scope:** Codex and Claude skills/commands that draft and refine C4 views and their explanatory Markdown from repository evidence and maintainer context; diagrams remain source-controlled alongside architecture docs.

**Out of scope:** Treating diagrams as the sole architecture source, importing a hosted modeling service, or supporting diagram formats outside the Markdown-first product contract.

#### Acceptance criteria

- [ ] A maintainer can request an appropriate C4 view and receive a reviewable proposal grounded in identified repository evidence.
- [ ] The workflow makes uncertainty and unsupported relationships visible and asks the maintainer when code cannot establish intent.
- [ ] Diagram sources and explanatory text are maintained in the repository's Markdown architecture documentation.
- [ ] The workflow can update a view from changed evidence without silently replacing unrelated authored content.
- [ ] Representative fixtures verify system-context and container views, diagram-source validity, and clear failure behavior for insufficient evidence.

#### Dependencies

Issues #7 and #10, and accepted Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`.

#### Product definition references

Accepted: `FR-ARC42-DOCUMENTATION`, `FR-ASSISTED-WORKFLOWS`. Proposed: `UC-CREATE-C4-DIAGRAMS` and `FR-C4-DIAGRAM-WORKFLOWS` in the active Product Change.

<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:0dbded0743b9855235b510338ed7b96a23728ee3e2c73a3f0f5ae587c3669927" -->

#### Affected behavior and quality expectations

Adds AI-assisted diagram authoring. Diagram/prose consistency, accessibility, evidence traceability, and safe review are key expectations.

#### Test impact and risks

Verify generated Markdown and diagram sources, rendering in the static site, and updates against fixtures. Risk: plausible-looking but unsupported relationships; every claim must remain reviewable against evidence.

### [#23 Connect Markdown architecture docs to Obsidian](https://github.com/juangcarmona/arcshape/issues/23) (P1)

#### Intent and problem

Teams using Obsidian need ArcShape's Markdown architecture documentation to fit into their vault and link naturally with existing project notes instead of becoming a separate, disconnected copy.

#### Who is affected?

Repository maintainers and architecture readers who organize project knowledge in Obsidian vaults.

#### Scope

**In scope:** Connect repository Markdown architecture docs, ADRs, and C4 documentation with a maintainer-selected Obsidian vault; preserve Markdown as canonical source and support traceable links or an explicitly reviewed sync/publish operation.

**Out of scope:** An ArcShape-hosted note service, automatic unreviewed overwrites, or changing Obsidian's own storage behavior.

#### Acceptance criteria

- [ ] A maintainer can select or configure an Obsidian vault and connect the relevant repository Markdown docs.
- [ ] Links between the repository docs and the vault remain understandable in the supported locations.
- [ ] Any copy/sync operation previews affected files and requires an explicit maintainer action before writing to the vault.
- [ ] Repeated sync does not duplicate documents or silently overwrite vault-authored content; conflicts are reported.
- [ ] Tests cover absent vault, existing matching notes, conflicting content, links, and repeat sync.

#### Dependencies

Issue #7 and accepted `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`. Uses Markdown outputs from issue #8; it does not require the AI authoring workflow to be installed.

#### Product definition references

Accepted: `FR-ARC42-DOCUMENTATION`, `CON-NO-ARCSHAPE-DATA-COLLECTION`. Proposed: `UC-SYNC-ARCHITECTURE-DOCS` and `FR-EXTERNAL-DOCS-INTEGRATIONS` in the active Product Change.

<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:1e3c22d7a31c58416a8d09e844c6b922571b498453aa074885b9b85f37ee6445" -->

#### Affected behavior and quality expectations

Adds local documentation-system integration. Preserve user data, disclose changes, and keep authored Markdown portable.

#### Test impact and risks

Use temporary repository/vault fixtures to verify links and non-destructive sync. Risk: Obsidian-specific links may reduce portability; keep standard Markdown links usable where possible.

### [#24 Connect Markdown architecture docs to Confluence](https://github.com/juangcarmona/arcshape/issues/24) (P1)

#### Intent and problem

Teams using Confluence need ArcShape-generated architecture documentation to be discoverable in their existing documentation system and to avoid stale, hand-copied pages.

#### Who is affected?

Repository maintainers and architecture readers who use Confluence as a project knowledge base.

#### Scope

**In scope:** A maintainer-directed connection between canonical repository Markdown architecture docs and selected Confluence pages/spaces, including a reviewable publication or synchronization flow.

**Out of scope:** An ArcShape-operated hosted service, autonomous publication without approval, or making Confluence the canonical source instead of repository Markdown.

#### Acceptance criteria

- [ ] A maintainer can configure a Confluence destination and relate selected repository Markdown documents to destination pages.
- [ ] The workflow previews proposed page creates/updates and the maintainer explicitly approves publication.
- [ ] Existing Confluence-authored content and unrelated pages are preserved; conflicts are surfaced instead of overwritten silently.
- [ ] Authentication and requested permissions are explained, credentials are not written to tracked files, and repository content is sent only to the user-selected Confluence destination.
- [ ] Tests cover no credentials, insufficient permissions, create/update preview, rejected publication, and API failure without claiming a successful sync.

#### Dependencies

Issue #7 and accepted `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`. Uses Markdown outputs from issue #8; it does not require the AI authoring workflow to be installed.

#### Product definition references

Accepted: `FR-ARC42-DOCUMENTATION`, `CON-NO-ARCSHAPE-DATA-COLLECTION`. Proposed: `UC-SYNC-ARCHITECTURE-DOCS` and `FR-EXTERNAL-DOCS-INTEGRATIONS` in the active Product Change.

<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:1e3c22d7a31c58416a8d09e844c6b922571b498453aa074885b9b85f37ee6445" -->

#### Affected behavior and quality expectations

Adds an external documentation integration. Human-directed publication, least privilege, credential safety, clear sync status, and the no-ArcShape-service data constraint apply.

#### Test impact and risks

Use a mocked API and a documented optional sandbox validation path. Risk: external API behavior and permission models; the tool must report partial or failed synchronization truthfully.

### [#20 Dogfood ArcShape in this repository and attach site screenshots to the PR](https://github.com/juangcarmona/arcshape/issues/20) (P0)

#### Intent and problem

ArcShape's package needs to prove its core workflow on a real repository before release. ArcShape currently has no generated `docs/architecture` arc42 set or reader site, so adopters and reviewers cannot inspect an end-to-end example produced by the package itself.

#### Who is affected?

ArcShape maintainers reviewing the implementation PR, future adopters evaluating the package, and readers of ArcShape's own architecture.

#### Scope

**In scope:** Use the implemented ArcShape CLI and Codex/Claude workflow in this repository to create and maintain evidence-grounded arc42 Markdown; include diagrams where supported; generate the static reader site; and capture representative screenshots as PR evidence. Markdown remains canonical. Generated HTML may be a build artifact if it can be reproduced from the committed Markdown.

**Out of scope:** Deploying or hosting the site, documenting neighboring repositories, or committing screenshot files as product content when PR artifacts provide reviewable evidence.

#### Acceptance criteria

- [ ] `docs/architecture/` contains a navigable README and the twelve arc42 sections, with concise evidence-grounded content about this repository.
- [ ] Product-intent statements cite the accepted ProductShape artifacts; implementation claims link to current repository evidence.
- [ ] Unknowns and conflicts are explicit; no implementation detail is presented as product intent.
- [ ] The package's CLI builds the static reader site from the committed Markdown without manual page edits.
- [ ] The implementation PR includes a successful site build result and representative screenshots showing overview/navigation and a substantive architecture view.
- [ ] A reviewer can follow the screenshots back to canonical Markdown, and generated output contains no placeholders or broken internal links.
- [ ] A later change to an architecture section can regenerate the site and refresh its screenshots using the documented process.

#### Dependencies

Issues #7–#10 and the new analysis-session child. This issue is the end-to-end product proof, not a prerequisite for building the CLI, skills, or site renderer.

#### Product definition references

Accepted: `FR-ARC42-DOCUMENTATION`, `FR-READER-VIEW`, `FR-ASSISTED-WORKFLOWS`, `BR-PRODUCT-DEFINITION-AUTHORITY`, and `CON-NO-ARCSHAPE-DATA-COLLECTION` under `docs/product/model`. Product intent remains in `docs/product/model`; architecture realization belongs under `docs/architecture`.

<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:39e44212462fb958f23ed02eb19f0b6a6914d08abbd449b60eb103ce4dc9a395" -->
<!-- pdac:cite id="FR-ASSISTED-WORKFLOWS" digest="sha256:0dbded0743b9855235b510338ed7b96a23728ee3e2c73a3f0f5ae587c3669927" -->
<!-- pdac:cite id="BR-PRODUCT-DEFINITION-AUTHORITY" digest="sha256:c0ad7e6890064e6f53b1245bdf17e3a0702768a1a80883cc90c2dfc5f2dfd689" -->
<!-- pdac:cite id="CON-NO-ARCSHAPE-DATA-COLLECTION" digest="sha256:1e3c22d7a31c58416a8d09e844c6b922571b498453aa074885b9b85f37ee6445" -->

#### Affected behavior and quality expectations

Exercises the complete onboarding-to-reader path on ArcShape. Accuracy, reader comprehension, accessible navigation, reproducibility, traceability, and screenshot evidence that matches the PR head matter.

#### Test impact and risks

Run the same validation/build path intended for adopters, verify the rendered site and links, and inspect screenshot evidence. Raccord's existing workflow shows a practical pattern: render a self-contained site and capture representative views in CI. Risk: screenshots can become stale or omit broken content; regenerate them from the PR head and keep canonical Markdown authoritative.

## Existing issue #6 updated

### Title

Choose ArcShape’s initial repository-analysis coverage

### Replacement body

## Intent and problem

Implementation planning needs a clear repository-analysis boundary. The product decision is language-agnostic: ArcShape does not maintain a programming-language allowlist. It analyzes whatever repository evidence is available and reports coverage, conflicts, and unsupported conclusions honestly.

## Who is affected?

Repository maintainers, architects, and readers relying on the accuracy and limits of generated architecture documentation.

## Scope

**In scope:** Record the language-agnostic decision through Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES`; define evidence classes and the round-based process; make the behavior for sparse, conflicting, or unavailable evidence explicit.

**Out of scope:** Promising equal extraction depth for every language or implementing language-specific analyzers.

## Acceptance criteria

- [ ] The accepted ProductShape model states that ArcShape accepts repositories regardless of implementation language and derives claims from available evidence.
- [ ] Analysis rounds show which sources were examined, pending, excluded, or changed.
- [ ] Sparse or conflicting evidence produces visible gaps/questions instead of guessed architecture claims.
- [ ] Representative examples cover repositories with differing languages and documentation maturity without creating a language support matrix.

## Dependencies

The Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES` must be approved, applied, validated, and merged before this decision is treated as accepted product scope. The analysis-session CLI and reverse-engineering workflow depend on this issue.

## Product definition references

Accepted: `FR-ONBOARD-REPOSITORY` and `FR-ARC42-DOCUMENTATION` in `docs/product/model`. Proposed: `FR-REVERSE-ENGINEER-ARCHITECTURE` in `docs/product/changes/active/chg-package-v1-functional-features/`.

<!-- pdac:cite id="FR-ONBOARD-REPOSITORY" digest="sha256:653be48aa9a81a105bf346d834281848b548af0a840ddf9878a956716a63b928" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->

## Existing issue #8 updated

Add the analysis-session child as a prerequisite and make the issue's current repository-family wording consistent with the language-agnostic decision. Preserve the other existing sections and acceptance criteria. Proposed complete body:

### Title

Generate evidence-grounded arc42 architecture documentation

### Replacement body

## Intent and problem

Maintainers need ArcShape to produce and maintain useful architecture documentation from repository evidence, while preserving human decisions and making uncertainty visible. Analysis is language-agnostic: the evidence available in a repository determines how much can be established; ArcShape does not promise equal extraction depth for every implementation language.

## Who is affected?

Developers and architects creating documentation, and technical readers relying on its accuracy.

## Scope

**In scope:** Implement the initial arc42 documentation workflow from Markdown and other available repository evidence, including bounded resumable analysis rounds, evidence references, visible uncertainty, reviewable changes, and safe updates.

**Out of scope:** Reader-site rendering, assistant-specific packaging, ProductShape model extension, language allowlists, and promises of equal analysis depth across all repositories.

## Acceptance criteria

- The workflow creates an arc42-structured proposal grounded in identified repository evidence.
- Unverified assumptions and missing evidence are marked explicitly rather than presented as fact.
- Maintainers can review changes before existing architecture documentation is modified.
- Updates preserve unrelated user-authored content and make removed or stale information visible.
- Analysis can be paused and resumed; its report distinguishes reviewed, pending, excluded, and changed evidence and lists unresolved leads/questions.
- Representative repository fixtures verify expected sections, evidence links, update behavior, and handling of missing or contradictory evidence across differing repository languages.
- Documentation states known analysis limits.

## Dependencies

Issues #4, #6, and #7, plus the new “Track resumable, evidence-based repository-analysis sessions” child issue.

## Product definition references

`CON-ARC42-FRAMEWORK` and `FR-ARC42-DOCUMENTATION` in `docs/product/model`. Product Change `CHG-PACKAGE-V1-FUNCTIONAL-FEATURES` proposes the additional reverse-engineering scope and must be accepted before it is treated as canonical.

<!-- pdac:cite id="CON-ARC42-FRAMEWORK" digest="sha256:c03be532b7270f092a7e288416ffcd58793356cf634adf9b770c03f64d54c4dd" -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:1c55b38695e3d341c5c79d0469e497ab4a41b058515d89384504fb54aae54496" -->

## Affected behavior and quality expectations

This is the core product capability. Accuracy, maintainability, traceability to repository evidence, readable language, and non-destructive operation are key qualities.

## Test impact and risks

Test repositories with different implementation languages and documentation maturity, missing/contradictory evidence, pause/resume and changed sources, repeated updates, and preservation of human-edited content. Risk: language-agnostic must not be described as equal extraction depth; every claim remains bounded by available evidence.

## Affected behavior and quality expectations

This resolves the supported-stack question without requiring language-specific promises. Evidence traceability, accuracy, and visible uncertainty are essential.

## Test impact and risks

Review representative repositories with different implementation languages and documentation sources. Risk: “language-agnostic” could be misread as equal extraction depth; docs must say the evidence available in a repository determines coverage.
