---
name: arc-architecture
description: Run ArcShape's bounded evidence-session and reader workflows for evidence-grounded arc42 documentation. Use when reverse engineering a repository or validating architecture docs with ArcShape tooling; common documentation policy comes from the shared architecture-docs skill when installed.
---

# ArcShape architecture documentation

Use this skill to understand a repository and propose accurate architecture documentation. The repository language and stack are not prerequisites: follow evidence in Markdown, configuration, source, tests, deployment manifests, and operational files.

## Relationship to the shared workflow

When the shared `architecture-docs` skill is installed, it is the authority for common documentation policy: architecture significance, product-intent ownership and citations, arc42 document contracts, ADR handoff, and legacy migration. Use this ArcShape skill for the bounded evidence session, ArcShape-specific source classification, section-selected arc42 reference material, and ArcShape CLI validation and reader build. Do not repeat or override the shared skill's decisions. When ArcShape is used alone, the operating rules and maintenance workflow below provide the complete standalone method.

## Operating rules

- Treat existing repository evidence as observations, not proof of intent. Distinguish observed behavior, maintainer-supplied intent, and proposals.
- Keep evidence review bounded. Track sources as reviewed, excluded, pending, or changed; do not claim repository-wide coverage while material evidence remains pending.
- Never claim a subsystem or behavior is implemented based only on plans, issue text, or generated docs. Cite concrete paths and relevant sections in the working notes.
- Surface contradictions, gaps, uncertainty, and stale documentation. Ask the maintainer when a decision or intent cannot be inferred safely.
- Preserve the project's existing architecture documentation conventions. ArcShape's canonical new layout is `docs/architecture/README.md` plus twelve `NN-slug/README.md` section documents. Supporting Markdown belongs inside its owning section directory and is rendered as grouped supporting material. The legacy root-level `NN-slug.md` layout remains a supported migration input; do not mix duplicate section numbers.
- Section 09 is also the canonical ADR collection: `docs/architecture/09-architecture-decisions/README.md` is its arc42 section document and alphabetical ADR index. ADRs normally live directly below that directory and may be grouped in stable subdirectories; do not create a parallel `docs/adr/` collection.
- Draft changes for review. Do not declare proposals accepted or silently overwrite a maintainer's authored material.
- Author native JSON/SVG/PNG/Markdown diagram bundles by default. For new diagrams or an explicitly requested migration, read the [diagram guide](references/diagrams/README.md). Run `arcshape site diagrams` and `--check` to derive SVG, PNG and fenced Mermaid Markdown; publish PNG in Markdown and native widgets in interactive output. Keep JSON as source authority and retain explicit/unsupported Mermaid documents. Prefer C4-style context/container/component views and label relationships with concise meaning.

## Section-specific arc42 guidance

Use the [arc42 guidance index](references/arc42/README.md) to select detailed references for the current task. Read only the relevant section `README.md` files, then use their titles and frontmatter tags to choose only the tip/example documents that answer a concrete question. Tip and example files preserve complete licensed source pages; do not load every file or every section by default. A task affecting several sections may read several references. Projects may omit, combine, or adapt sections, so preserve the project's existing structure.

Each section reference provides its purpose, relevant subsections, evidence to inspect, handling for gaps and conflicts, practical guidance, and source links. Treat arc42 guidance as a framework for analysis, not evidence about the target system. Keep observations separate from maintainer intent, inference, and proposals. The [source register](references/arc42/SOURCES.md) records creator attribution and the CC BY-SA 4.0 scope for arc42-derived reference content.

## Reverse engineering workflow

1. Inspect repository guidance, existing architecture docs, ADRs, product definition, and relevant recent changes before analyzing implementation. Identify the question or scope before opening a session.
2. Start or resume a bounded evidence session with `arcshape session start` / `arcshape session status` / `arcshape session next`. Use each returned round to inspect sources; do not attempt to read the entire repository in one pass.
3. For each source, record its classification and what it establishes with `arcshape session mark`. Record newly discovered paths as leads and unresolved intent as questions. Correct mistakes with `unmark`; preserve uncertainty instead of filling gaps.
4. Track coverage and changed evidence. Re-read sources ArcShape reports as changed before relying on earlier notes. Continue until the session report distinguishes reviewed, excluded, pending, and changed evidence.
5. Build a compact evidence map: system boundary, users/external systems, runtime units, interfaces, data stores, deployment, cross-cutting mechanisms, quality goals, risks, and unknowns. Link every material claim to evidence.
6. Compare the evidence map with the 12 arc42 sections. Keep each fact in one owning section, then propose focused Markdown edits with source references; label inferences and unresolved questions for maintainer review.
7. Review internal links and diagram source, run the applicable ArcShape validation, then build the reader site with `arcshape site build` and inspect the generated output. For native diagrams, also inspect `--format interactive` output and capture screenshots before committing visual changes. Treat generated HTML as a review aid; Markdown remains canonical.

## Maintain documentation

When docs already exist, compare each claim against current evidence. Preserve accurate content, correct stale details, remove duplication, and record unresolved discrepancies. Do not rewrite sections merely to fit a template. Apply the shared skill's significance and product-intent rules when it is installed; otherwise, document only architecture supported by evidence and keep product intent, implementation, and proposals distinct. Do not silently overwrite maintainer-authored material or accept proposed changes. Keep source Markdown canonical; the HTML site is generated output.

### Standalone documentation policy

Apply this section only when the shared `architecture-docs` skill is not installed.

- Update architecture docs when a change affects the system boundary, major component responsibilities or interfaces, important runtime paths, persistence or data ownership, security or identity, deployment, cross-cutting mechanisms, quality realization, or a significant architectural risk. Otherwise report that no architecture documentation impact was found and why.
- Keep product intent in its product source, architecture in the arc42 documents, implementation truth in code/configuration/infrastructure, and decision rationale in ADRs. When an architecture claim derives from a ProductShape model, follow its citation instructions and validate citations with the installed ProductShape CLI. Do not invent product requirements or citation machinery.
- Use `arc-adr` for durable decisions that need rationale, alternatives, or consequences. Keep every ADR discoverable from section 09's alphabetical index and record status there; accepted decisions may also be summarized in a separate current-architecture view.
- Treat legacy architecture prose as migration input. Verify touched claims against current evidence, move them only to their canonical owner, and remove stale or duplicate content rather than preserving it by default.
- Do not edit architecture solely to satisfy a template. Preserve a repository's established section layout and update only the affected concerns.

## CLI tools

Use the CLI for repeatable operations: `arcshape init`, `arcshape session ...`, `arcshape validate`, `arcshape sync ...`, and `arcshape site build`. Run `arcshape validate --links --citations` when the repository has a ProductShape model. Citation validation uses the repository's installed `@prodshape/cli`; it reports stale citations as warnings and unresolved citations as errors. Do not rewrite citations automatically. This skill owns repository interpretation, questions, and proposed documentation. Report when a requested deterministic CLI subcommand is unavailable; do not invent one.
