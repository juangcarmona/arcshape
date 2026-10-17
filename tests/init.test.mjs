import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable, Writable } from "node:stream";
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

describe("arcshape init", () => {
  it("keeps provider-neutral capabilities in a separate package directory", async () => {
    const capabilities = await listPaths(
      join(packageRoot, "capabilities", "skills"),
    );
    expect(capabilities.sort()).toEqual([
      "arc-adr/SKILL.md",
      "arc-architecture/SKILL.md",
      "arc-c4/SKILL.md",
      "arc-docs-sync/SKILL.md",
    ]);
    expect(await readdir(join(packageRoot, "templates"))).toEqual([
      "architecture",
    ]);
  });

  it("installs architecture files in explicit CLI-only mode and is repeatable", async () => {
    const target = await makeTarget();
    const expected = (
      await listPaths(join(packageRoot, "templates", "architecture"))
    )
      .map((path) => `docs/architecture/${path}`.replaceAll(sep, "/"))
      .sort();

    const first = await runInit(["--target", target, "--no-agents", "--yes"], {
      packageRoot,
    });
    expect(first.exitCode).toBe(0);
    expect(first.written.map(normalizePath).sort()).toEqual(expected);

    const second = await runInit(["--target", target, "--no-agents", "--yes"], {
      packageRoot,
    });
    expect(second.exitCode).toBe(0);
    expect(second.written).toEqual([]);
    expect(
      second.architectureActions.filter((item) => item.action === "unchanged"),
    ).toHaveLength(expected.length);
  });

  it("preserves customized files and reports them as conflicts", async () => {
    const target = await makeTarget();
    const customPath = join(target, "docs", "architecture", "README.md");
    await runInit(["--target", target, "--no-agents", "--yes"], {
      packageRoot,
    });
    await writeFile(customPath, "Maintainer-authored architecture notes\n");

    const result = await runInit(["--target", target, "--no-agents", "--yes"], {
      packageRoot,
    });

    expect(result.exitCode).toBe(1);
    const conflicts = result.architectureActions.filter(
      (item) => item.action === "conflict",
    );
    expect(conflicts).toHaveLength(1);
    expect(normalizePath(conflicts[0].path)).toBe(
      "docs/architecture/README.md",
    );
    expect(conflicts[0].reason).toBe(
      "file already exists with different content",
    );
    expect(await readFile(customPath, "utf8")).toBe(
      "Maintainer-authored architecture notes\n",
    );
  });

  it("requires an explicit provider or CLI-only choice when non-interactive", async () => {
    const target = await makeTarget();
    await expect(
      runInit(["--target", target], { packageRoot }),
    ).rejects.toThrow(
      "Non-interactive init requires --providers <ids> or --no-agents",
    );
    expect(await readdir(target)).toEqual([]);
  });

  it("requires confirmation before non-interactive writes", async () => {
    const target = await makeTarget();
    await expect(
      runInit(["--target", target, "--providers", "codex"], { packageRoot }),
    ).rejects.toThrow("Non-interactive installation requires --yes");
    expect(await readdir(target)).toEqual([]);
  });

  it("shows dry-run plans without writing and preserves targets when declined", async () => {
    const dryRunTarget = await makeTarget();
    const dryRun = await runInit(
      ["--target", dryRunTarget, "--no-agents", "--dry-run"],
      { packageRoot },
    );
    expect(
      dryRun.architectureActions.some(({ action }) => action === "create"),
    ).toBe(true);
    expect(await readdir(dryRunTarget)).toEqual([]);

    const declinedTarget = await makeTarget();
    const input = Readable.from(["n\n"]);
    const output = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });
    input.isTTY = true;
    output.isTTY = true;
    const declined = await runInit(
      ["--target", declinedTarget, "--providers", "codex"],
      { packageRoot, input, output },
    );
    expect(declined.cancelled).toBe(true);
    expect(await readdir(declinedTarget)).toEqual([]);
  });
});

async function makeTarget() {
  const directory = await mkdtemp(join(tmpdir(), "arcshape-init-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

function normalizePath(path) {
  return path.split(sep).join("/");
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
