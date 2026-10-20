import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const changesetCli = fileURLToPath(
  new URL("../node_modules/@changesets/cli/bin.js", import.meta.url),
);

describe("Changesets package release contract", () => {
  it("generates the package version and changelog from a pending changeset", async () => {
    const root = await mkdtemp(join(tmpdir(), "arcshape-changesets-"));
    try {
      await writeFile(
        join(root, "package.json"),
        JSON.stringify({ private: true, workspaces: ["packages/*"] }),
      );
      const packageRoot = join(root, "packages", "cli");
      await mkdir(packageRoot, { recursive: true });
      await writeFile(
        join(packageRoot, "package.json"),
        JSON.stringify({
          name: "@arcshape/cli",
          version: "1.2.3",
          license: "Apache-2.0",
        }),
      );
      await mkdir(join(root, ".changeset"), { recursive: true });
      await writeFile(
        join(root, ".changeset", "config.json"),
        JSON.stringify({
          changelog: "@changesets/cli/changelog",
          commit: false,
          access: "public",
          baseBranch: "main",
          updateInternalDependencies: "patch",
          fixed: [],
          linked: [],
          ignore: [],
        }),
      );
      await writeFile(
        join(root, ".changeset", "release.md"),
        `---\n"@arcshape/cli": patch\n---\n\nExercise the release contract.\n`,
      );
      await execFileAsync(process.execPath, [changesetCli, "version"], {
        cwd: root,
      });

      const manifest = JSON.parse(
        await readFile(join(packageRoot, "package.json"), "utf8"),
      );
      const changelog = await readFile(
        join(packageRoot, "CHANGELOG.md"),
        "utf8",
      );
      expect(manifest.version).toBe("1.2.4");
      expect(changelog).toContain("Exercise the release contract.");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("derives immutable evidence tags from the published package identity", async () => {
    const workflow = await readFile(
      new URL("../.github/workflows/publish.yml", import.meta.url),
      "utf8",
    );
    expect(workflow).toContain('tag="@arcshape/cli@${version}"');
    expect(workflow).toContain('github_tag="v${version}"');
    expect(workflow).toContain(
      "npm publish --provenance --access public --workspace packages/cli",
    );
  });
});
