import { execFile } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const packageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../packages/cli",
);
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
      const jsonStart = packed.stdout.indexOf("[\n");
      expect(jsonStart, packed.stdout).toBeGreaterThanOrEqual(0);
      const packageMetadata = JSON.parse(packed.stdout.slice(jsonStart))[0];
      const packageJson = JSON.parse(
        await readFile(join(packageRoot, "package.json"), "utf8"),
      );
      expect(packageMetadata.name).toBe("@arcshape/cli");
      expect(packageMetadata.name).toBe(packageJson.name);
      expect(packageMetadata.version).toBe(packageJson.version);
      const packageFileList = packageMetadata.files.map(({ path }) => path);
      expect(packageFileList.length).toBeLessThan(300);
      expect(packageMetadata.unpackedSize).toBeLessThan(800_000);
      expect(packageFileList).toContain("assets/capabilities/providers.json");
      expect(packageFileList).toContain("assets/architecture/README.md");
      expect(packageFileList).toContain(
        "assets/capabilities/skills/arc-adr/SKILL.md",
      );
      expect(packageFileList).toContain(
        "assets/capabilities/skills/arc-adr/references/template.md",
      );
      expect(packageFileList).toContain(
        "assets/capabilities/skills/arc-architecture/references/arc42/SOURCES.md",
      );
      expect(packageFileList).toContain(
        "assets/capabilities/skills/arc-architecture/references/arc42/12-glossary/README.md",
      );
      expect(packageFileList).toContain("src/bin/arcshape.mjs");
      expect(packageFileList).toContain("src/arc42-site/generate.mjs");
      expect(
        packageFileList.some((path) =>
          path.startsWith("assets/templates/assistants/"),
        ),
      ).toBe(false);
      expect(
        packageFileList.filter((path) =>
          /references\/arc42\/\d{2}-[^/]+\/tips\/tip-[^/]+\.md$/.test(path),
        ),
      ).toHaveLength(145);
      expect(
        packageFileList.filter((path) =>
          /references\/arc42\/\d{2}-[^/]+\/examples\/example-[^/]+\.md$/.test(
            path,
          ),
        ),
      ).toHaveLength(35);
      expect(
        packageFileList.filter(
          (path) =>
            path.startsWith(
              "assets/capabilities/skills/arc-architecture/references/arc42/",
            ) && /\.(?:png|jpe?g|webp|gif|svg)$/i.test(path),
        ),
      ).toHaveLength(0);
      expect(
        packageFileList.find((path) =>
          path.endsWith(
            "01-introduction-and-goals/examples/example-overview-example-htmlsc-1.md",
          ),
        ),
      ).toBeTruthy();
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

      const version = await runNpm(
        ["exec", "--offline", "--", "arcshape", "--version"],
        { cwd: repository, timeout: 30_000 },
      );
      expect(version.exitCode).toBe(0);
      expect(version.stdout.trim()).toBe(packageJson.version);

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
      expect(
        initialized.exitCode,
        `${initialized.stderr}\n${initialized.stdout}`,
      ).toBe(0);
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
        readFile(
          join(
            repository,
            ".agents/skills/arc-architecture/references/arc42/01-introduction-and-goals/README.md",
          ),
          "utf8",
        ),
      ).resolves.toContain("# 1. Introduction and Goals");
      await expect(
        readFile(
          join(
            repository,
            ".claude/skills/arc-architecture/references/arc42/12-glossary/README.md",
          ),
          "utf8",
        ),
      ).resolves.toContain("# 12. Glossary");
      await expect(
        readFile(
          join(
            repository,
            ".agents/skills/arc-architecture/references/arc42/01-introduction-and-goals/tips/tip-1-1-give-a-compact-summary-of-requirements-and-driving-forces.md",
          ),
          "utf8",
        ),
      ).resolves.toContain("source_revision:");
      await expect(
        readFile(
          join(
            repository,
            ".claude/skills/arc-architecture/references/arc42/01-introduction-and-goals/examples/example-overview-example-htmlsc-1.md",
          ),
          "utf8",
        ),
      ).resolves.toContain("Illustrative example");
      await expect(
        readFile(
          join(
            repository,
            ".claude/skills/arc-architecture/references/arc42/01-introduction-and-goals/examples/example-overview-example-htmlsc-1.md",
          ),
          "utf8",
        ),
      ).resolves.toContain(
        "https://docs.arc42.org/assets/images/examples/htmlsc/1-1-overview.png",
      );
      for (const providerRoot of [".agents", ".claude"]) {
        await expect(
          readFile(
            join(
              repository,
              providerRoot,
              "skills/arc-adr/references/template.md",
            ),
            "utf8",
          ),
        ).resolves.toContain("id: ADR-NNNN");
      }
      await expect(
        readFile(join(repository, ".claude/skills/arc-c4/SKILL.md"), "utf8"),
      ).resolves.toContain("name: arc-c4");

      for (const providerRoot of [".agents", ".claude"]) {
        const installedRoot = join(
          repository,
          providerRoot,
          "skills/arc-architecture/references/arc42",
        );
        const installedFiles = await listFilesRecursively(installedRoot);
        expect(
          installedFiles.filter((path) =>
            /^\d{2}-[^/]+\/tips\/tip-[^/]+\.md$/.test(path),
          ),
          `${providerRoot} installed tip files`,
        ).toHaveLength(145);
        expect(
          installedFiles.filter((path) =>
            /^\d{2}-[^/]+\/examples\/example-[^/]+\.md$/.test(path),
          ),
          `${providerRoot} installed example files`,
        ).toHaveLength(35);
      }

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

async function listFilesRecursively(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory())
        return listFilesRecursively(join(directory, entry.name), relativePath);
      return [relativePath];
    }),
  );
  return nested.flat();
}
