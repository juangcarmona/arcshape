<!-- pdac-scope: cited -->

# Tasks

<!-- This plan documents existing Markdown authoring and reader publication behavior. -->
<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:117f2350fcf47272cc487a079adde4f2e245aeab1539cbcd92b608996731ce7a" -->
<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:73f884ab8bce44e3950b5c42b17912546f69e2f2045f3df2106b0ce59d99cfee" -->
<!-- pdac:cite id="FR-C4-DIAGRAM-WORKFLOWS" digest="sha256:b7ab2591c05d0fbd32176878461e9138773da63aa2fe14a2932da341682495b9" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## 1. Deployment documentation example

- [x] 1.1 Reconcile section 07’s package and publication facts against `package.json`, release workflow, and repository release evidence; verify no stale 0.1.0/pending-publication claim remains in that section.
- [x] 1.2 Add an evidence-backed Mermaid deployment view in section 07 with a unique `accTitle`; run the site build and verify it produces an inline SVG in the generated HTML.

## 2. Published-reader regression coverage

- [x] 2.1 Extend the reader browser E2E journey to navigate to section 07 and assert the deployment diagram’s accessible name and inline SVG; run the focused Playwright test.
- [x] 2.2 Verify responsive rendering at the repository’s supported narrow viewport in the same E2E journey; confirm the diagram remains within the reader’s responsive container.

## 3. Integration and documentation review

- [x] 3.1 Run the Pages-equivalent reader build from the final Markdown and verify the generated HTML includes section 07 and its diagram without external diagram assets or runtime requests.
- [x] 3.2 Review the rendered section 07 against the source Markdown and current deployment evidence; record section 11’s stale release statement as a separate follow-up rather than expanding this change.

## Workflow follow-up

- After implementation, run the repository’s required CI verification and review the generated reader artifact.
- Reassess an Archify static-view experiment only when a concrete interactive use case and canonical-source ownership are agreed.
