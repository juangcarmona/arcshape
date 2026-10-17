import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { runSync } from "../bin/sync.mjs";

const originalCwd = process.cwd();
let root;
let vault;
let writeSpy;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "arcshape-obsidian-"));
  vault = join(root, "vault");
  await mkdir(join(root, "docs/architecture"), { recursive: true });
  await mkdir(join(root, "docs/adr"), { recursive: true });
  await mkdir(vault);
  await writeFile(
    join(root, "docs/architecture/README.md"),
    "# Architecture\n\n[ADR](../adr/ADR-0001.md)\n",
  );
  await writeFile(
    join(root, "docs/adr/ADR-0001.md"),
    "# ADR 0001\n\nStatus: Proposed\n",
  );
  process.chdir(root);
  writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
});

afterEach(async () => {
  process.chdir(originalCwd);
  writeSpy?.mockRestore();
  await rm(root, { recursive: true, force: true });
});

describe("Obsidian sync", () => {
  it("previews and synchronizes nested Markdown with portable links", async () => {
    const preview = await runSync([
      "obsidian",
      "--vault",
      vault,
      "--include",
      "docs/adr",
      "--dry-run",
    ]);
    expect(preview.exitCode).toBe(0);
    expect(preview.result.created).toContain("adr/ADR-0001.md");

    const target = join(vault, "Architecture", basename(root));
    await expect(
      readFile(join(target, "architecture/README.md"), "utf8"),
    ).rejects.toMatchObject({ code: "ENOENT" });

    const synced = await runSync([
      "obsidian",
      "--vault",
      vault,
      "--include",
      "docs/adr",
    ]);
    expect(synced.exitCode).toBe(0);
    expect(
      await readFile(join(target, "architecture/README.md"), "utf8"),
    ).toContain("[ADR](../adr/ADR-0001.md)");
    expect(await readFile(join(target, "adr/ADR-0001.md"), "utf8")).toContain(
      "Status: Proposed",
    );

    const repeated = await runSync([
      "obsidian",
      "--vault",
      vault,
      "--include",
      "docs/adr",
    ]);
    expect(repeated.exitCode).toBe(0);
    expect(repeated.result.unchanged).toHaveLength(2);
  });

  it("updates only managed copies and reports vault edits as conflicts", async () => {
    const target = join(vault, "Architecture", basename(root));
    await runSync(["obsidian", "--vault", vault, "--include", "docs/adr"]);
    await writeFile(
      join(root, "docs/adr/ADR-0001.md"),
      "# ADR 0001\n\nStatus: Accepted\n",
    );
    const updated = await runSync([
      "obsidian",
      "--vault",
      vault,
      "--include",
      "docs/adr",
    ]);
    expect(updated.exitCode).toBe(0);
    expect(updated.result.updated).toContain("adr/ADR-0001.md");

    await writeFile(join(target, "adr/ADR-0001.md"), "Vault authored\n");
    await writeFile(
      join(root, "docs/adr/ADR-0001.md"),
      "# ADR 0001\n\nStatus: Superseded\n",
    );
    const conflict = await runSync([
      "obsidian",
      "--vault",
      vault,
      "--include",
      "docs/adr",
    ]);
    expect(conflict.exitCode).toBe(1);
    expect(conflict.result.conflicts).toContainEqual(
      expect.objectContaining({ path: "adr/ADR-0001.md" }),
    );
    expect(await readFile(join(target, "adr/ADR-0001.md"), "utf8")).toBe(
      "Vault authored\n",
    );
  });

  it("requires an existing selected vault", async () => {
    await expect(
      runSync(["obsidian", "--vault", join(root, "missing")]),
    ).rejects.toThrow("Obsidian vault directory does not exist");
  });
});
