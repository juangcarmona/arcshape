import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateMarkdownLinks } from "../packages/cli/src/bin/validate-links.mjs";

let root;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("Markdown link validation", () => {
  it("accepts local file and heading links and ignores external URLs", async () => {
    root = await mkdtemp(join(tmpdir(), "arcshape-links-"));
    await mkdir(join(root, "docs"));
    await writeFile(join(root, "docs/guide.md"), "# Getting started\n");
    const diagnostics = await validateMarkdownLinks(
      [
        {
          file: "README.md",
          body: "[Guide](guide.md#getting-started) [web](https://example.com)",
        },
      ],
      root,
      join(root, "docs"),
    );
    expect(diagnostics).toEqual([]);
  });

  it("reports missing local files, fragments, and paths outside the repository", async () => {
    root = await mkdtemp(join(tmpdir(), "arcshape-links-"));
    await mkdir(join(root, "docs"));
    await writeFile(join(root, "docs/guide.md"), "# Getting started\n");
    const diagnostics = await validateMarkdownLinks(
      [
        {
          file: "README.md",
          body: "[missing](absent.md) [heading](guide.md#missing) [escape](../../outside.md)",
        },
      ],
      root,
      join(root, "docs"),
    );
    expect(diagnostics).toHaveLength(3);
    expect(diagnostics.join("\n")).toContain("missing local target absent.md");
    expect(diagnostics.join("\n")).toContain("missing heading #missing");
    expect(diagnostics.join("\n")).toContain("link escapes the repository");
  });
});
