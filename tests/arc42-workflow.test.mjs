import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(packageRoot, "examples", "arc42-workflow");

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
});

async function read(path) {
  return readFile(join(examplesRoot, path), "utf8");
}

async function expectSourceLink(documentPath, relativePath) {
  const document = join(examplesRoot, documentPath);
  await access(resolve(dirname(document), relativePath));
}
