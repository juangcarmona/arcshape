import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { load as loadYaml } from "js-yaml";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(packageRoot, "examples", "arc42-workflow");
const guidanceRoot = join(
  packageRoot,
  "capabilities",
  "skills",
  "arc-architecture",
  "references",
  "arc42",
);

const sectionGuidance = [
  [1, "introduction-and-goals"],
  [2, "constraints"],
  [3, "context-and-scope"],
  [4, "solution-strategy"],
  [5, "building-block-view"],
  [6, "runtime-view"],
  [7, "deployment-view"],
  [8, "crosscutting-concepts"],
  [9, "architecture-decisions"],
  [10, "quality-requirements"],
  [11, "risks-and-technical-debt"],
  [12, "glossary"],
];

describe("arc42 authoring examples", () => {
  it("grounds a proposal in mixed source evidence and keeps unsupported details open", async () => {
    const proposal = await read(
      "mature-python/expected/04-solution-strategy.md",
    );
    expect(proposal).toContain("../repository/config/runtime.yaml");
    expect(proposal).toContain("../repository/src/worker.py");
    expect(proposal).toContain("confirm those details with the maintainer");
    await expectSourceLink(
      "mature-python/expected/04-solution-strategy.md",
      "../repository/config/runtime.yaml",
    );
    await expectSourceLink(
      "mature-python/expected/04-solution-strategy.md",
      "../repository/src/worker.py",
    );
  });

  it("asks about boundaries for sparse evidence and makes conflicting sources explicit", async () => {
    const sparse = await read("sparse-rust/expected/open-questions.md");
    expect(sparse).toContain(
      "no architecture documentation or deployment configuration",
    );
    expect(sparse).toContain("ask the maintainer");
    await expectSourceLink(
      "sparse-rust/expected/open-questions.md",
      "../repository/src/main.rs",
    );

    const conflict = await read(
      "conflicting-evidence/expected/architecture-question.md",
    );
    expect(conflict).toContain("PostgreSQL");
    expect(conflict).toContain("MySQL");
    expect(conflict).toContain("These sources conflict");
    expect(conflict).toContain("ask the maintainer");
    await expectSourceLink(
      "conflicting-evidence/expected/architecture-question.md",
      "../repository/docs/design.md",
    );
    await expectSourceLink(
      "conflicting-evidence/expected/architecture-question.md",
      "../repository/config/database.yaml",
    );
  });

  it("preserves unrelated authored content during an evidence-based update", async () => {
    const current = await read(
      "update/current/docs/architecture/05-building-block-view.md",
    );
    const updated = await read(
      "update/expected/docs/architecture/05-building-block-view.md",
    );
    const preserved =
      "The monthly settlement process remains outside this workflow.";
    expect(current).toContain(preserved);
    expect(updated).toContain(preserved);
    expect(updated).toContain("Open question");
    await expectSourceLink(
      "update/expected/docs/architecture/05-building-block-view.md",
      "../../../repository/src/worker.py",
    );
  });

  it("keeps the architecture workflow aligned with the examples", async () => {
    const skill = await read(
      "../../capabilities/skills/arc-architecture/SKILL.md",
    );
    const guide = await read("README.md");
    expect(guide).toContain("different implementation languages");
    expect(skill).toContain(
      "Treat existing repository evidence as observations, not proof of intent.",
    );
    expect(skill).toContain(
      "Surface contradictions, gaps, uncertainty, and stale documentation.",
    );
    expect(skill).toContain("Preserve accurate content, correct stale details");
  });

  it("routes to twelve focused references with complete source and evidence guidance", async () => {
    const index = await readGuidance("README.md");
    const sourceRegister = await readGuidance("SOURCES.md");
    const skill = await read(
      "../../capabilities/skills/arc-architecture/SKILL.md",
    );
    const localSkill = await read(
      "../../.agents/skills/arcshape-architecture/SKILL.md",
    );

    expect(index).toContain("Read only the sections relevant");
    expect(sourceRegister).toContain("Gernot Starke");
    expect(sourceRegister).toContain("CC BY-SA 4.0");
    await expectGuidanceLink("README.md", "SOURCES.md");
    await expectSourceLink(
      "../../capabilities/skills/arc-architecture/SKILL.md",
      "references/arc42/README.md",
    );
    await expectSourceLink(
      "../../.agents/skills/arcshape-architecture/SKILL.md",
      "../../../capabilities/skills/arc-architecture/references/arc42/README.md",
    );

    for (const [number, slug] of sectionGuidance) {
      const path = `${String(number).padStart(2, "0")}-${slug}/README.md`;
      const reference = await readGuidance(path);
      expect(index).toContain(path);
      await expectGuidanceLink("README.md", path);
      expect(reference).toContain("## Subsections");
      expect(reference).toContain("## Evidence to examine");
      expect(reference).toContain("## Gaps and conflicts");
      expect(reference).toContain("## Practical guidance");
      expect(reference).toContain("## Sources and examples");
      expect(reference).toContain(`https://docs.arc42.org/section-${number}/`);
      expect(reference).toContain("CC BY-SA 4.0");
      await expectGuidanceLink(path, "../SOURCES.md");
    }
    expect(skill).toContain("references/arc42/README.md");
    expect(localSkill).toContain(
      "../../../capabilities/skills/arc-architecture/references/arc42/README.md",
    );
  });

  it("preserves the pinned source catalog with metadata and complete local routing", async () => {
    const sourceRegister = await readGuidance("SOURCES.md");
    const index = await readGuidance("README.md");
    const license = await readGuidance("ARC42-LICENSE");
    expect(sourceRegister).toContain("145 practical tips");
    expect(sourceRegister).toContain("35 worked examples");
    expect(sourceRegister).toContain("12 section pages");
    expect(sourceRegister).toContain(
      "3cb35782b62d0cd4103aedcc75fc4ba748f043ad",
    );
    expect(license).toContain("Creative Commons Attribution-ShareAlike 4.0");
    expect(parseFrontmatter(index).kind).toBe("index");
    expect(parseFrontmatter(sourceRegister).kind).toBe("source-register");

    let tips = 0;
    let examples = 0;
    for (const [number, slug] of sectionGuidance) {
      const section = String(number).padStart(2, "0");
      const directory = `${section}-${slug}`;
      const sectionReadme = `${directory}/README.md`;
      const metadata = parseFrontmatter(await readGuidance(sectionReadme));
      expect(metadata.kind).toBe("section");
      expect(metadata.section).toBe(section);
      expect(metadata.source_revision).toBe(
        "3cb35782b62d0cd4103aedcc75fc4ba748f043ad",
      );
      expect(sourceRegister).toContain(`./${sectionReadme}`);

      for (const [kind, pattern] of [
        ["tip", /^tip-\d+-\d+-[a-z0-9-]+\.md$/],
        ["example", /^example-[a-z0-9-]+\.md$/],
      ]) {
        const subdirectory = kind === "tip" ? "tips" : "examples";
        const names = await readdir(
          join(guidanceRoot, directory, subdirectory),
        );
        for (const name of names) {
          expect(name).toMatch(pattern);
          const path = `${directory}/${subdirectory}/${name}`;
          const document = await readGuidance(path);
          const reference = parseFrontmatter(document);
          expect(reference.kind).toBe(kind);
          expect(reference.section).toBe(section);
          expect(reference.title).toBeTruthy();
          expect(reference.source_url).toMatch(/^https:\/\/docs\.arc42\.org\//);
          expect(reference.source_author).toBe("Dr. Gernot Starke");
          expect(reference.license).toBe("CC BY-SA 4.0");
          expect(reference.source_revision).toBe(
            "3cb35782b62d0cd4103aedcc75fc4ba748f043ad",
          );
          expect(document).toContain(`> Source: [${reference.title}]`);
          expect(sourceRegister).toContain(`./${path}`);
          await expectGuidanceLocalLinks(path, document);
          if (kind === "example")
            expect(document).toContain("Illustrative example");
          else expect(reference.id).toMatch(/^\d+-\d+$/);
          if (kind === "tip") tips++;
          else examples++;
        }
      }
    }
    expect(tips).toBe(145);
    expect(examples).toBe(35);
  });

  it("selects only task-relevant guidance for single-section and cross-section work", async () => {
    const single = await read("guidance-selection/single-section.md");
    expect(single).toContain("02-constraints/README.md");
    expect(single).toContain(
      "does not read the other eleven section references",
    );
    await expectSourceLink(
      "guidance-selection/single-section.md",
      "../../../capabilities/skills/arc-architecture/references/arc42/02-constraints/README.md",
    );
    for (const reference of [
      "02-constraints/tips/tip-2-2-clarify-the-consequences-of-constraints.md",
      "02-constraints/examples/example-constraints-1.md",
    ]) {
      expect(single).toContain(reference.split("/").at(-1));
      await expectSourceLink(
        "guidance-selection/single-section.md",
        `../../../capabilities/skills/arc-architecture/references/arc42/${reference}`,
      );
    }

    const crossSection = await read("guidance-selection/cross-section.md");
    for (const section of [
      "06-runtime-view",
      "08-crosscutting-concepts",
      "10-quality-requirements",
    ]) {
      expect(crossSection).toContain(`${section}/README.md`);
      await expectSourceLink(
        "guidance-selection/cross-section.md",
        `../../../capabilities/skills/arc-architecture/references/arc42/${section}/README.md`,
      );
    }
    expect(crossSection).toContain("the other nine section references");
    for (const reference of [
      "06-runtime-view/tips/tip-6-2-document-only-a-few-runtime-scenarios.md",
      "06-runtime-view/examples/example-runtime-1.md",
      "08-crosscutting-concepts/examples/example-concept-htmlsc-1.md",
      "10-quality-requirements/tips/tip-10-7-consider-fault-error-failure-quality-scenarios.md",
    ]) {
      expect(crossSection).toContain(reference.split("/").at(-1));
      await expectSourceLink(
        "guidance-selection/cross-section.md",
        `../../../capabilities/skills/arc-architecture/references/arc42/${reference}`,
      );
    }
    expect(crossSection).toContain("ask the maintainer");
  });
});

async function read(path) {
  return readFile(join(examplesRoot, path), "utf8");
}

async function expectSourceLink(documentPath, relativePath) {
  const document = join(examplesRoot, documentPath);
  await access(resolve(dirname(document), relativePath));
}

async function readGuidance(path) {
  return readFile(join(guidanceRoot, path), "utf8");
}

function parseFrontmatter(document) {
  const match = document.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  expect(
    match,
    "Markdown document should start with YAML frontmatter",
  ).not.toBeNull();
  return loadYaml(match[1]);
}

async function expectGuidanceLink(documentPath, relativePath) {
  const document = join(guidanceRoot, documentPath);
  await access(resolve(dirname(document), relativePath));
}

async function expectGuidanceLocalLinks(documentPath, document) {
  const source = join(guidanceRoot, documentPath);
  for (const match of document.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = match[1];
    if (/^(https?:|#|mailto:)/.test(href)) continue;
    await access(resolve(dirname(source), href.split("#")[0]));
  }
}
