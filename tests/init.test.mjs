import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runInit } from "../bin/init.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("arcshape init assistant integration", () => {
  it("keeps installed Codex and Claude assets aligned with their templates", async () => {
    const assistantTemplates = join(packageRoot, "templates", "assistants");
    expect(
      await listFiles(join(assistantTemplates, ".agents", "skills")),
    ).toEqual(
      (await listFiles(join(packageRoot, ".agents", "skills"))).filter((file) =>
        file.path.startsWith("arcshape-"),
      ),
    );
    expect(
      await listFiles(join(assistantTemplates, ".claude", "skills")),
    ).toEqual(
      (await listFiles(join(packageRoot, ".claude", "skills"))).filter((file) =>
        file.path.startsWith("arcshape-"),
      ),
    );
    expect(
      await listFiles(
        join(assistantTemplates, ".claude", "commands", "arcshape"),
      ),
    ).toEqual(
      await listFiles(join(packageRoot, ".claude", "commands", "arcshape")),
    );
    const codexCommands = join(assistantTemplates, ".agents", "commands");
    expect(
      existsSync(codexCommands) ? await listFiles(codexCommands) : [],
    ).toEqual([]);
  });

  it("installs every architecture and assistant template and is repeatable", async () => {
    const target = await makeTarget();
    const expected = [
      ...(await listPaths(join(packageRoot, "templates", "architecture"))).map(
        (path) => `docs/architecture/${path}`,
      ),
      ...(await listPaths(join(packageRoot, "templates", "assistants"))),
    ].sort();

    const first = await runInit(["--target", target], { packageRoot });
    expect(first.exitCode).toBe(0);
    expect(first.written.sort()).toEqual(expected);

    const second = await runInit(["--target", target], { packageRoot });
    expect(second.exitCode).toBe(0);
    expect(second.written).toEqual([]);
    expect(second.unchanged).toHaveLength(expected.length);
    expect(second.conflicts).toEqual([]);
  });

  it("preserves customized files and reports them as conflicts", async () => {
    const target = await makeTarget();
    const customPath = join(target, "docs", "architecture", "README.md");
    await runInit(["--target", target], { packageRoot });
    await writeFile(customPath, "Maintainer-authored architecture notes\n");

    const result = await runInit(["--target", target], { packageRoot });

    expect(result.exitCode).toBe(1);
    expect(result.conflicts).toEqual([
      expect.objectContaining({
        path: "docs/architecture/README.md",
        reason: "file already exists with different content",
      }),
    ]);
    expect(await readFile(customPath, "utf8")).toBe(
      "Maintainer-authored architecture notes\n",
    );
  });
});

async function makeTarget() {
  const directory = await mkdtemp(join(tmpdir(), "arcshape-init-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function listPaths(root, prefix = "") {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const relativePath = prefix ? join(prefix, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listPaths(join(root, entry.name), relativePath)));
    } else if (entry.isFile()) files.push(relativePath);
  }
  return files;
}

async function listFiles(root, prefix = "") {
  const paths = await listPaths(root);
  return Promise.all(
    paths.map(async (path) => ({
      path: prefix ? `${prefix}/${path}` : path,
      content: await readFile(join(root, path), "utf8"),
    })),
  );
}
