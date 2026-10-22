import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { loadDocs } from "../packages/cli/src/arc42-site/loadDocs.mjs";
import {
  buildNavigationTree,
  humanizeSegment,
} from "../packages/cli/src/arc42-site/shell.mjs";
import { runValidate } from "../packages/cli/src/bin/validate.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const productShapeCliPath = require.resolve("@prodshape/cli/dist/bin.js");
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("architecture section directories", () => {
  it("loads all twelve canonical sections and supporting documents", async () => {
    const fixture = await makeFixture({ supporting: true });
    const docs = await loadDocs(fixture.docsDir);

    expect(docs.sections).toHaveLength(12);
    expect(docs.sections.map(({ number }) => number)).toEqual(
      Array.from({ length: 12 }, (_, index) =>
        String(index + 1).padStart(2, "0"),
      ),
    );
    expect(docs.sections[0].file).toBe("01-introduction-and-goals/README.md");
    expect(docs.sections[0].supporting).toMatchObject([
      {
        file: "01-introduction-and-goals/supporting-document.md",
        relativeFile: "supporting-document.md",
        route: "#/section/01/supporting-document",
        title: "Supporting architecture material",
      },
    ]);
    expect(docs.sections[8].supporting).toMatchObject([
      {
        file: "09-architecture-decisions/platform/ADR-0001-use-sqlite.md",
        route: "#/section/09/platform/ADR-0001-use-sqlite",
        title: "ADR-0001: Use SQLite for local session state",
      },
    ]);
  });

  it("builds a deterministic hierarchy from supporting-document paths", () => {
    const tree = buildNavigationTree([
      { relativeFile: "api/10-overview.md", title: "Overview" },
      { relativeFile: "api/README.md", title: "API" },
      { relativeFile: "api/sql/2-query.md", title: "Query" },
      { relativeFile: "api/sql/README.md", title: "SQL" },
      { relativeFile: "api/adr/1-decision.md", title: "Decision" },
      { relativeFile: "flat.md", title: "Flat page" },
    ]);

    expect(humanizeSegment("api-reference")).toBe("API Reference");
    expect(
      tree.map((node) =>
        node.kind === "page" ? node.document.title : node.label,
      ),
    ).toEqual(["Flat page", "API"]);
    expect(tree[1]).toMatchObject({
      kind: "folder",
      label: "API",
      page: { title: "API" },
    });
    expect(
      tree[1].children.map((node) =>
        node.kind === "page" ? node.document.title : node.label,
      ),
    ).toEqual(["Overview", "ADR", "SQL"]);
    expect(tree[1].children[2]).toMatchObject({
      kind: "folder",
      label: "SQL",
      page: { title: "SQL" },
      children: [{ kind: "page", document: { title: "Query" } }],
    });
  });

  it("validates canonical links and citations, including supporting Markdown", async () => {
    const fixture = await makeFixture({ supporting: true, model: true });
    const result = await runValidate(
      ["--docs", fixture.docsDir, "--links", "--citations", "--format", "json"],
      { cwd: fixture.root, productShapeCliPath },
    );

    expect(result.exitCode).toBe(0);
    expect(result.result).toMatchObject({
      valid: true,
      sections: 12,
      productCitations: {
        status: "verified",
        summary: { total: 1, current: 1, errors: 0 },
      },
    });
  }, 15_000);

  it.each([
    [
      "missing section",
      async (docsDir) =>
        rm(join(docsDir, "01-introduction-and-goals"), { recursive: true }),
      "required arc42 section 01 is missing",
    ],
    [
      "duplicate section",
      async (docsDir) =>
        cp(
          join(docsDir, "01-introduction-and-goals"),
          join(docsDir, "01-duplicate"),
          { recursive: true },
        ),
      "duplicate section number 01",
    ],
    [
      "invalid section frontmatter",
      async (docsDir) =>
        writeFile(
          join(docsDir, "02-constraints/README.md"),
          '---\ntitle: Constraints\narc42-section: "02"\n---\n# Constraints\n',
        ),
      '02-constraints/README.md: missing required frontmatter key "description"',
    ],
    [
      "supporting section frontmatter",
      async (docsDir) =>
        writeFile(
          join(docsDir, "01-introduction-and-goals/supporting.md"),
          '---\narc42-section: "02"\n---\n# Misplaced section\n',
        ),
      "01-introduction-and-goals/supporting.md: supporting documents cannot carry arc42-section",
    ],
    [
      "invalid section directory",
      async (docsDir) =>
        cp(
          join(docsDir, "01-introduction-and-goals"),
          join(docsDir, "01-Invalid_Name"),
          { recursive: true },
        ),
      "01-Invalid_Name: invalid section directory name",
    ],
    [
      "invalid root Markdown",
      async (docsDir) =>
        writeFile(join(docsDir, "notes.md"), "# Unowned notes\n"),
      "notes.md: unexpected root-level Markdown file",
    ],
  ])("reports %s deterministically", async (_label, mutate, expected) => {
    const fixture = await makeFixture();
    await mutate(fixture.docsDir);
    const result = await runValidate(
      ["--docs", fixture.docsDir, "--format", "json"],
      {
        cwd: fixture.root,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.result.valid).toBe(false);
    expect(result.result.diagnostics.join("\n")).toContain(expected);
  });

  it("rejects arc42-section frontmatter on the navigation README", async () => {
    const fixture = await makeFixture();
    await writeFile(
      join(fixture.docsDir, "README.md"),
      '---\narc42-section: "01"\n---\n# Navigation\n',
    );
    const result = await runValidate(
      ["--docs", fixture.docsDir, "--format", "json"],
      {
        cwd: fixture.root,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.result.diagnostics.join("\n")).toContain(
      "README.md: README must not carry arc42-section",
    );
  });

  it("keeps the legacy flat layout valid during migration", async () => {
    const fixture = await makeFixture({ layout: "legacy" });
    const result = await runValidate(
      ["--docs", fixture.docsDir, "--links", "--citations", "--format", "json"],
      { cwd: fixture.root },
    );

    expect(result.exitCode).toBe(0);
    expect(result.result).toMatchObject({ valid: true, sections: 12 });
  });

  it("builds stable supporting-document routes and source links", async () => {
    const fixture = await makeFixture({ supporting: true });
    const output = join(fixture.root, "reader", "index.html");
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(
      process.execPath,
      [
        join(packageRoot, "packages/cli/src/bin/arcshape.mjs"),
        "site",
        "build",
        "--docs",
        fixture.docsDir,
        "--out",
        output,
        "--source-ref",
        "fixture",
      ],
      { cwd: fixture.root, encoding: "utf8" },
    );

    expect(result.status, result.stderr || result.stdout).toBe(0);
    const html = await readFile(output, "utf8");
    for (const number of Array.from({ length: 12 }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    ))
      expect(html).toContain(`href="#/section/${number}"`);
    expect(html).toContain("#/section/01/supporting-document");
    expect(html).toContain("#/section/09/platform/ADR-0001-use-sqlite");
    expect(html).toContain("ADR-0001: Use SQLite for local session state");
    expect(html).not.toContain("status: Proposed");
    expect(html).toContain("Supporting architecture material");
    expect(html).toContain('data-folder-path="platform"');
    expect(html).toContain(
      'data-relative-file="platform/ADR-0001-use-sqlite.md"',
    );
    expect(html).toContain('"breadcrumbs":[{"label":"Platform"}');
  }, 60_000);
});

async function makeFixture({
  layout = "canonical",
  supporting = false,
  model = false,
} = {}) {
  const root = await mkdtemp(join(tmpdir(), "arcshape-section-directories-"));
  temporaryDirectories.push(root);
  const docsDir = join(root, "docs", "architecture");
  await cp(join(packageRoot, "packages/cli/assets/architecture"), docsDir, {
    recursive: true,
  });
  await mkdir(join(root, "docs", "adr"), { recursive: true });
  await writeFile(join(root, "docs", "adr", "README.md"), "# ADRs\n");

  if (layout === "legacy") {
    for (const entry of await readdir(docsDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^\d{2}-/.test(entry.name)) continue;
      const source = join(docsDir, entry.name, "README.md");
      const content = (await readFile(source, "utf8")).replaceAll(
        "../../adr/README.md",
        "../adr/README.md",
      );
      await writeFile(join(docsDir, `${entry.name}.md`), content);
      await rm(join(docsDir, entry.name), { recursive: true });
    }
    const readme = await readFile(join(docsDir, "README.md"), "utf8");
    await writeFile(
      join(docsDir, "README.md"),
      readme.replaceAll(/(\d{2}-[^)]+)\/README\.md/g, "$1.md"),
    );
  }

  if (supporting) {
    const sectionDir = join(docsDir, "01-introduction-and-goals");
    const support = join(sectionDir, "supporting-document.md");
    const artifact =
      "docs/product/model/requirements/functional/fr-arc42-documentation.md";
    await writeFile(
      support,
      `# Supporting architecture material\n\n[Constraints](../02-constraints/README.md)\n\n<!-- pdac:cite id="FR-ARC42-DOCUMENTATION" digest="sha256:DIGEST" -->\n`,
    );
    const sectionReadme = join(sectionDir, "README.md");
    await writeFile(
      sectionReadme,
      `${await readFile(sectionReadme, "utf8")}\n[Supporting material](supporting-document.md)\n`,
    );
    if (model) {
      await cp(
        join(packageRoot, "docs/product/model"),
        join(root, "docs/product/model"),
        { recursive: true },
      );
      await cp(join(packageRoot, ".product"), join(root, ".product"), {
        recursive: true,
      });
      const digest = createHash("sha256")
        .update(await readFile(join(root, artifact)))
        .digest("hex");
      await writeFile(
        support,
        (await readFile(support, "utf8")).replace("DIGEST", digest),
      );
    }

    const adrDirectory = join(docsDir, "09-architecture-decisions", "platform");
    await mkdir(adrDirectory, { recursive: true });
    await writeFile(
      join(adrDirectory, "ADR-0001-use-sqlite.md"),
      '---\ntitle: "ADR-0001: Use SQLite for local session state"\nstatus: Proposed\n---\n# ADR-0001: Use SQLite for local session state\n',
    );
    const decisionsReadme = join(
      docsDir,
      "09-architecture-decisions",
      "README.md",
    );
    await writeFile(
      decisionsReadme,
      `${await readFile(decisionsReadme, "utf8")}\n[ADR-0001](platform/ADR-0001-use-sqlite.md)\n`,
    );
  }
  return { root, docsDir };
}
