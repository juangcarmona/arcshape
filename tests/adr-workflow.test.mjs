import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { load as loadYaml } from "js-yaml";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const examplesRoot = join(packageRoot, "examples", "adr-workflow");

describe("ADR workflow examples", () => {
  it("covers create, supersede, and unknown-decision cases", async () => {
    const guide = await read("README.md");
    expect(guide).toContain("Create a record from a supplied decision");
    expect(guide).toContain("Supersede an existing record");
    expect(guide).toContain("Decision is unknown");

    const created = await read(
      "create/expected/docs/adr/ADR-0001-use-sqlite-for-local-session-state.md",
    );
    const createdIndex = await read("create/expected/docs/adr/README.md");
    for (const section of [
      "## Context",
      "## Decision",
      "## Alternatives considered",
      "## Consequences",
      "## References",
    ])
      expect(created).toContain(section);
    expect(created).toContain("status: Proposed");
    expect(parseFrontmatter(created)).toEqual(
      expect.objectContaining({
        id: "ADR-0001",
        title: "Use SQLite for local session state",
        status: "Proposed",
        date: "2026-10-17",
        deciders: ["Maintainer"],
      }),
    );
    expect(createdIndex).toContain("ADR-0001");

    const superseding = await read(
      "supersede/expected/docs/adr/ADR-0002-use-sqlite-for-session-state.md",
    );
    const supersedingIndex = await read(
      "supersede/expected/docs/adr/README.md",
    );
    const previous = await read(
      "supersede/current/docs/adr/ADR-0001-use-json-for-session-state.md",
    );
    expect(superseding).toContain("status: Proposed");
    expect(parseFrontmatter(superseding)).toEqual(
      expect.objectContaining({
        id: "ADR-0002",
        title: "Use SQLite for session state",
        status: "Proposed",
        date: "2026-10-17",
        deciders: ["Maintainer"],
      }),
    );
    expect(superseding).toContain("## Supersedes");
    expect(superseding).toContain("ADR-0001");
    expect(supersedingIndex).toContain("Proposed to be superseded by");
    expect(previous).toContain("status: Accepted");

    const unknownRequest = await read("unknown-decision/request.md");
    const unknownResponse = await read("unknown-decision/expected-response.md");
    expect(unknownRequest).toContain("has not stated");
    expect(unknownResponse).toContain("is it accepted or still proposed?");
    expect(unknownResponse).toContain("No ADR file or index change");
  });

  it("reuses an established ADR folder, naming scheme, metadata, and index", async () => {
    const currentIndex = await read(
      "existing-convention/current/architecture/decisions/README.md",
    );
    const existingRecord = await read(
      "existing-convention/current/architecture/decisions/DEC-0042-use-json-for-session-state.md",
    );
    const proposedRecord = await read(
      "existing-convention/expected/architecture/decisions/DEC-0043-use-sqlite-for-session-state.md",
    );
    const updatedIndex = await read(
      "existing-convention/expected/architecture/decisions/README.md",
    );

    expect(parseFrontmatter(existingRecord)).toEqual(
      expect.objectContaining({ id: "DEC-0042", status: "Accepted" }),
    );
    expect(parseFrontmatter(proposedRecord)).toEqual(
      expect.objectContaining({
        id: "DEC-0043",
        title: "Use SQLite for session state",
        status: "Proposed",
        deciders: ["Maintainer"],
      }),
    );
    expect(currentIndex).toContain("DEC-0042");
    expect(updatedIndex).toContain("DEC-0043");
    expect(updatedIndex).toContain("DEC-0042");
    expect(proposedRecord).toContain("## Context");
    expect(proposedRecord).toContain("## Decision");
    expect(proposedRecord).not.toContain("ADR-0001");
  });

  it("ships the portable ADR capability with its safety rules", async () => {
    const skill = await read(
      "../../packages/cli/assets/capabilities/skills/arc-adr/SKILL.md",
    );
    const template = await read(
      "../../packages/cli/assets/capabilities/skills/arc-adr/references/template.md",
    );
    const repositorySkill = await readFile(
      join(packageRoot, ".agents/skills/arcshape-adr/SKILL.md"),
      "utf8",
    );
    const claudeSkill = await readFile(
      join(packageRoot, ".claude/skills/arcshape-adr/SKILL.md"),
      "utf8",
    );
    const adrIndex = await readFile(
      join(packageRoot, "docs/adr/README.md"),
      "utf8",
    );
    const sectionNine = await readFile(
      join(packageRoot, "docs/architecture/09-architecture-decisions.md"),
      "utf8",
    );
    expect(skill).toContain("name: arc-adr");
    expect(skill).toContain("`docs/adr/README.md`");
    expect(skill).toContain(
      "copying [`references/template.md`](references/template.md)",
    );
    expect(skill).toContain("`ADR-0001-kebab-case-title.md`");
    expect(skill).toContain(
      "Reuse the repository's canonical folder, naming scheme, metadata, and index",
    );
    expect(skill).toContain(
      "YAML frontmatter with `id`, `title`, `status`, `date`, and `deciders`",
    );
    expect(skill).toContain("Add every new ADR to the canonical ADR index");
    expect(repositorySkill).toContain("`docs/adr/README.md`");
    expect(claudeSkill).toContain(
      "Add every new ADR to the canonical ADR index",
    );
    expect(adrIndex).toContain("No ADR records have been accepted");
    expect(sectionNine).toContain("[`docs/adr/README.md`](../adr/README.md)");
    expect(skill).toContain("If the decision itself is unknown, ask");
    expect(skill).toContain(
      "Keep the existing ADR's status until the new decision is accepted; then mark the old record superseded",
    );
    expect(skill).toContain(
      "Do not put proposed decisions in the current architecture index",
    );
    expect(parseFrontmatter(template)).toEqual(
      expect.objectContaining({
        id: "ADR-NNNN",
        status: "Proposed",
        deciders: [],
      }),
    );
    for (const section of [
      "## Context",
      "## Decision",
      "## Alternatives considered",
      "## Consequences",
      "## References",
    ])
      expect(template).toContain(section);
  });

  it("keeps example paths stable", async () => {
    const topLevel = await readdir(examplesRoot);
    expect(topLevel.sort()).toEqual([
      "README.md",
      "create",
      "existing-convention",
      "supersede",
      "unknown-decision",
    ]);
  });
});

async function read(path) {
  return readFile(join(examplesRoot, path), "utf8");
}

function parseFrontmatter(document) {
  const match = document.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  expect(match, "ADR should start with YAML frontmatter").not.toBeNull();
  return loadYaml(match[1]);
}
