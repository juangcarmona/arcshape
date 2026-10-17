import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("ArcShape CLI help", () => {
  it("shows the setup, citation, and documentation destination workflows", () => {
    const help = execFileSync(
      process.execPath,
      [resolve(packageRoot, "bin/arcshape.mjs"), "--help"],
      { encoding: "utf8" },
    );

    expect(help).toContain("Set up Markdown docs and AI workflows");
    expect(help).toContain("[--citations]");
    expect(help).toContain("sync obsidian|confluence");
  });
});
