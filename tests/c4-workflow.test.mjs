import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  extractMermaidSources,
  normalizeMermaidSvg,
  renderMermaid,
} from "../packages/cli/src/arc42-site/render.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(packageRoot, "examples", "c4-workflow");

describe("C4 workflow examples", () => {
  it("renders context and container views grounded in their evidence", async () => {
    const contextMarkdown = await readExample("context.md");
    const containersMarkdown = await readExample("containers.md");
    const changedEvidence = await readExample("update-evidence.md");
    const updatedContext = await readExample("updated-context.md");
    const [context] = extractMermaidSources(contextMarkdown);
    const [containers] = extractMermaidSources(containersMarkdown);
    const [updated] = extractMermaidSources(updatedContext);

    expect(contextMarkdown).toContain("package.json");
    expect(contextMarkdown).toContain("README.md");
    expect(context).toContain("Person(maintainer");
    expect(context).toContain("System(arcshape");
    expect(context).toContain("System_Ext(repository");

    expect(containersMarkdown).toContain("packages/cli/src/bin/arcshape.mjs");
    expect(containersMarkdown).toContain(
      "`packages/cli/assets/capabilities/skills/`",
    );
    expect(containers).toContain("System_Boundary(repository");
    expect(containers).toContain('Container(cli, "ArcShape CLI"');
    expect(containers).toContain('Container(skills, "ArcShape skills"');

    expect(changedEvidence).toContain("packages/cli/src/bin/confluence.mjs");
    expect(changedEvidence).toContain("Preserve the unrelated");
    expect(updatedContext).toContain(
      "Publication is always explicit and uses a maintainer-selected destination.",
    );
    expect(updated).toContain("System_Ext(confluence");
    expect(updated).toContain("explicit request");

    const [contextSvg, containerSvg, updatedSvg] = await renderMermaid([
      context,
      containers,
      updated,
    ]);
    expect(contextSvg).toContain("<svg");
    expect(containerSvg).toContain("<svg");
    expect(updatedSvg).toContain("<svg");
  }, 60_000);

  it("asks for missing boundaries instead of inventing a context", async () => {
    const unknown = await readExample("unknown-evidence.md");
    expect(unknown).toContain("must ask which system and external actors");
    expect(unknown).toContain("must not infer");
    expect(unknown).not.toContain("```mermaid");
  });

  it("keeps Mermaid labels inside the normalized viewport", () => {
    const normalized = normalizeMermaidSvg(
      '<svg viewBox="4 4 10 20"><text x="-10">label</text></svg>',
      0,
    );
    expect(normalized).toContain('viewBox="-156 -156 330 340"');
  });

  it("ships the portable C4 capability with evidence and rendering rules", async () => {
    const skill = await readFile(
      join(
        packageRoot,
        "packages/cli/assets/capabilities/skills/arc-c4/SKILL.md",
      ),
      "utf8",
    );
    for (const rule of [
      "Ask the maintainer about external actors or intended boundaries that evidence cannot establish.",
      "Ground nodes and relationships in evidence.",
      "leave unrelated authored content unchanged",
      "Run `arcshape site build` and inspect the rendered diagram.",
    ])
      expect(skill).toContain(rule);
  });
});

async function readExample(name) {
  return readFile(join(examplesRoot, name), "utf8");
}
