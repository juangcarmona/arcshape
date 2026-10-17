import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("documentation sync assistant workflows", () => {
  it("gives Codex and Claude the same native connector behavior", async () => {
    const codex = await readFile(
      join(
        packageRoot,
        "templates/assistants/.agents/skills/arcshape-docs-sync/SKILL.md",
      ),
      "utf8",
    );
    const claude = await readFile(
      join(
        packageRoot,
        "templates/assistants/.claude/skills/arcshape-docs-sync/SKILL.md",
      ),
      "utf8",
    );
    const command = await readFile(
      join(
        packageRoot,
        "templates/assistants/.claude/commands/arcshape/sync.md",
      ),
      "utf8",
    );

    expect(claude).toBe(codex);
    expect(claude).toContain("--space-id <id> --parent-id <id>");
    expect(claude).toContain("--include <file-or-directory>");
    expect(command).toContain("arcshape-docs-sync");
    expect(command).toContain("native Obsidian and Confluence CLI commands");
    expect(command).not.toContain("only an explicitly connected integration");
  });
});
