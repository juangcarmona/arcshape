import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

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

  it("ships matching safety rules in the Codex and Claude templates", async () => {
    const codex = await read(
      "../../templates/assistants/.agents/skills/arcshape-adr/SKILL.md",
    );
    const claude = await read(
      "../../templates/assistants/.claude/skills/arcshape-adr/SKILL.md",
    );
    expect(codex).toBe(claude);
    for (const text of [codex, claude]) {
      expect(text).toContain("If the decision itself is unknown, ask");
      expect(text).toContain(
        "Keep the existing ADR's status until the new decision is accepted; then mark the old record superseded",
      );
      expect(text).toContain(
        "Do not put proposed decisions in the current architecture index",
      );
    }
  });

  it("keeps example paths stable", async () => {
    const topLevel = await readdir(examplesRoot);
    expect(topLevel.sort()).toEqual([
      "README.md",
      "create",
      "supersede",
      "unknown-decision",
    ]);
  });
});

async function read(path) {
  return readFile(join(examplesRoot, path), "utf8");
}
