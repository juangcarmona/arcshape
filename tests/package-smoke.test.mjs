import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("packed ArcShape package", () => {
  it.skipIf(process.platform === "win32")(
    "installs a packed npm tarball and initializes without overwriting authored files",
    async () => {
      const sandbox = await mkdtemp(join(tmpdir(), "arcshape-package-smoke-"));
      temporaryDirectories.push(sandbox);
      const tarballDirectory = join(sandbox, "tarball");
      const repository = join(sandbox, "consumer-repository");
      await Promise.all([
        mkdir(tarballDirectory, { recursive: true }),
        mkdir(repository, { recursive: true }),
      ]);
      await writeFile(
        join(repository, "package.json"),
        JSON.stringify({ name: "consumer-repository", private: true }),
      );
      await writeFile(join(repository, "README.md"), "# Smoke repository\n");

      const packed = await runNpm(
        [
          "pack",
          "--json",
          "--silent",
          "--ignore-scripts",
          "--pack-destination",
          tarballDirectory,
        ],
        {
          cwd: packageRoot,
          timeout: 120_000,
        },
      );
      expect(packed.exitCode, `${packed.stderr}\n${packed.stdout}`).toBe(0);
      const packageFileList = JSON.parse(packed.stdout)[0].files.map(
        ({ path }) => path,
      );
      expect(packageFileList).toContain("capabilities/providers.json");
      expect(packageFileList).toContain("capabilities/skills/arc-adr/SKILL.md");
      expect(
        packageFileList.some((path) =>
          path.startsWith("templates/assistants/"),
        ),
      ).toBe(false);
      const packageJson = JSON.parse(
        await readFile(join(packageRoot, "package.json"), "utf8"),
      );
      const packageFileName = packageJson.name
        .replace(/^@/, "")
        .replace("/", "-");
      const tarballName = `${packageFileName}-${packageJson.version}.tgz`;
      const tarball = join(tarballDirectory, tarballName);
      const installed = await runNpm(
        ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
        { cwd: repository, timeout: 180_000 },
      );
      expect(
        installed.exitCode,
        `${installed.stderr}\n${installed.stdout}`,
      ).toBe(0);

      const initialized = await runNpm(
        [
          "exec",
          "--offline",
          "--",
          "arcshape",
          "init",
          "--target",
          repository,
          "--no-agents",
          "--yes",
        ],
        { cwd: repository, timeout: 30_000 },
      );
      expect(initialized.exitCode).toBe(0);
      expect(initialized.stdout).toContain("CLI-only setup");

      const installedCapabilities = await runNpm(
        [
          "exec",
          "--offline",
          "--",
          "arcshape",
          "agents",
          "install",
          "--target",
          repository,
          "--providers",
          "codex,claude",
          "--yes",
        ],
        { cwd: repository, timeout: 30_000 },
      );
      expect(installedCapabilities.exitCode).toBe(0);
      await expect(
        readFile(
          join(repository, ".agents/skills/arc-architecture/SKILL.md"),
          "utf8",
        ),
      ).resolves.toContain("ArcShape architecture documentation");
      await expect(
        readFile(join(repository, ".claude/skills/arc-c4/SKILL.md"), "utf8"),
      ).resolves.toContain("name: arc-c4");

      const repeated = await runNpm(
        [
          "exec",
          "--offline",
          "--",
          "arcshape",
          "init",
          "--target",
          repository,
          "--no-agents",
          "--yes",
        ],
        { cwd: repository, timeout: 30_000 },
      );
      expect(repeated.exitCode).toBe(0);
      expect(repeated.stdout).toContain("unchanged");

      const authored = "Maintainer-authored architecture index\n";
      const architectureReadme = join(
        repository,
        "docs/architecture/README.md",
      );
      await writeFile(architectureReadme, authored);
      const conflict = await runNpm(
        [
          "exec",
          "--offline",
          "--",
          "arcshape",
          "init",
          "--target",
          repository,
          "--no-agents",
          "--yes",
        ],
        { cwd: repository, timeout: 30_000 },
      );
      expect(conflict.exitCode).toBe(1);
      expect(conflict.stderr).toContain(
        "file already exists with different content",
      );
      expect(await readFile(architectureReadme, "utf8")).toBe(authored);

      await writeFile(join(repository, ".gitignore"), "services/web/dist/\n");
      await mkdir(join(repository, "services/web/dist"), { recursive: true });
      await writeFile(
        join(repository, "services/web/dist/bundle.js"),
        "generated bundle\n",
      );
      const session = await runNpm(
        [
          "exec",
          "--offline",
          "--",
          "arcshape",
          "session",
          "start",
          "--id",
          "packed-ignore",
          "--target",
          repository,
        ],
        { cwd: repository, timeout: 30_000 },
      );
      expect(session.exitCode).toBe(0);
      const sessionState = JSON.parse(
        await readFile(
          join(repository, ".arcshape/sessions/packed-ignore/session.json"),
          "utf8",
        ),
      );
      const inventoriedPaths = sessionState.evidence.map((item) => item.path);
      expect(inventoriedPaths).toContain(".gitignore");
      expect(inventoriedPaths).toContain("README.md");
      expect(inventoriedPaths).not.toContain("services/web/dist/bundle.js");
    },
    240_000,
  );
});

async function runNpm(args, options) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli)
    throw new Error(
      "npm_execpath is unavailable; run this smoke test with npm test",
    );
  try {
    const result = await execFileAsync(process.execPath, [npmCli, ...args], {
      cwd: options.cwd,
      encoding: "utf8",
      timeout: options.timeout,
      maxBuffer: 16 * 1024 * 1024,
    });
    return { exitCode: 0, ...result };
  } catch (error) {
    if (typeof error.code === "number")
      return {
        exitCode: error.code,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    throw error;
  }
}
