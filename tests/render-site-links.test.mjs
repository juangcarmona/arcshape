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

  it("labels Mermaid SVGs and exposes source and exact revision provenance", async () => {
    const revision = "a".repeat(40);
    const result = await renderMarkdown(
      "```mermaid\naccTitle: Deployment boundary\nflowchart TD\n  A --> B\n```",
      {
        fileToRoute: new Map(),
        svgs: ['<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>'],
        sourceContext: {
          root: process.cwd(),
          repositoryUrl: "https://github.com/example/arcshape",
          ref: "release/2026",
        },
        sourceFile: "docs/architecture/04-solution-strategy.md",
        sourceRevision: revision,
      },
    );

    expect(result.html).toContain("Renderer: Mermaid");
    expect(result.html).toContain("Deployment boundary");
    expect(result.html).toContain(
      "https://github.com/example/arcshape/blob/release%2F2026/docs/architecture/04-solution-strategy.md",
    );
    expect(result.html).toContain(
      `https://github.com/example/arcshape/commit/${revision}`,
    );
    expect(result.html).toContain('<title id="mermaid-title-');
    expect(result.html).toContain('<desc id="mermaid-description-');
    expect(result.html).toContain('aria-labelledby="mermaid-title-');
    expect(result.html).toContain('aria-describedby="mermaid-description-');
  });
});
