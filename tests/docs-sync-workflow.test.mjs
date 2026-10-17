import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("documentation sync capability", () => {
  it("keeps the workflow provider-neutral and documents native CLI commands", async () => {
    const skill = await readFile(
      join(packageRoot, "capabilities/skills/arc-docs-sync/SKILL.md"),
      "utf8",
    );

    expect(skill).toContain("name: arc-docs-sync");
    expect(skill).toContain("--space-id <id> --parent-id <id>");
    expect(skill).toContain("--include <file-or-directory>");
    expect(skill).toContain(
      "ArcShape updates only copies that still match its prior managed version",
    );
  });
});
