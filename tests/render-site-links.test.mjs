import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../packages/cli/src/arc42-site/render.mjs";

describe("reader site source links", () => {
  it("rewrites repository file and directory references to GitHub", async () => {
    const result = await renderMarkdown(
      "[CLI](../../packages/cli/src/bin/arcshape.mjs) [product model](../product/model/)",
      {
        fileToRoute: new Map(),
        sourceContext: {
          root: process.cwd(),
          repositoryUrl: "https://github.com/example/arcshape",
          ref: "codex/feature",
        },
        sourceFile: "docs/architecture/04-solution-strategy.md",
      },
    );

    expect(result.html).toContain(
      "https://github.com/example/arcshape/blob/codex%2Ffeature/packages/cli/src/bin/arcshape.mjs",
    );
    expect(result.html).toContain(
      "https://github.com/example/arcshape/tree/codex%2Ffeature/docs/product/model",
    );
    expect(result.html).not.toContain("xref-dead");
  });

  it("keeps architecture navigation links inside the generated site", async () => {
    const result = await renderMarkdown("[Next](05-building-block-view.md)", {
      fileToRoute: new Map([["05-building-block-view.md", "#/section/05"]]),
      sourceContext: {
        root: process.cwd(),
        repositoryUrl: "https://github.com/example/arcshape",
        ref: "main",
      },
      sourceFile: "docs/architecture/04-solution-strategy.md",
    });
    expect(result.html).toContain('href="#/section/05"');
  });
});
