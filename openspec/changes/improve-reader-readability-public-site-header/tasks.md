# Tasks

<!-- pdac-scope: cited -->

## 1. Reader and portal implementation

- [x] 1.1 Remove `max-width: 78ch` from the generated reader `.doc` rule in `packages/cli/src/arc42-site/shell.mjs`, preserving the remaining layout declarations; verify the exact rule is absent from generated output and existing reader tests still pass.
- [x] 1.2 Update `src/engineering-portal/src/pages/index.astro` so the header brand link targets `https://arcshape.dev` with `target="_blank"` and `rel="noopener noreferrer"`, and remove the redundant header badge; compare the rendered lockup with the public-site header treatment, then verify the built portal contains the safe external link and no header badge.
- [x] 1.3 Add a patch Changesets entry for `@arcshape/cli`; verify the entry is valid and describes the reader/portal user-visible improvement.

<!-- pdac:cite id="FR-READER-VIEW" digest="sha256:6e4b3f1fd8bc5fbd90932b62aab255fe5d75aac85a6761c80e3734eed8ec5d26" -->
<!-- pdac:cite id="QR-READER-COMPREHENSION" digest="sha256:dd41b1449b77f87c2d4061b9fd0740a5c42281988045835a304d532911064439" -->

## 2. Focused validation and evidence

- [x] 2.1 Extend the affected focused tests or validation assertions where needed, then run the relevant reader and engineering-portal checks; verify each command exits 0 and covers the changed paths.
- [x] 2.2 Build the engineering portal and generated reader from the current commit, exercise desktop and narrow viewport paths with the existing Playwright harness, verify the brand link's accessible name and keyboard focus visibility, compare the lockup against the public site, and store inspected runtime evidence under `docs/delivery/issue-102/evidence/`.
- [x] 2.3 Run `npm exec -- prodshape citations verify --provider openspec` and refresh any affected citation only if a canonical artifact changed; verify the command reports the current proposal, design, and task citations.

## 3. Lifecycle verification

- [x] 3.1 Run the complete CI-like deterministic checks derived from the repository workflows, including format, lint, typecheck, tests, build, product model, OpenSpec, and security checks; record terminal results in the Fast Forward evidence.
- [x] 3.2 Reconcile the implementation, release metadata, runtime evidence, and Definition of Done before marking the pull request ready; verify the current commit is the one audited and record that required human/forge approval remains a pre-merge gate.

## Workflow follow-up

- Archive the completed OpenSpec change after specification synchronization and before merge.
- Obtain the required human review and forge approval before merge; the independent reviewer does not substitute for this human-only gate.
- After merge, verify the protected 0.1.5 release separately through npm, the package tag, GitHub Release, and the version-matched SBOM; do not claim publication from a successful workflow step alone.
