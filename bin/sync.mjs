import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { runConfluenceSync } from "./confluence.mjs";

const MANIFEST_NAME = ".arcshape-sync.json";

export async function runSync(args) {
  const [provider, ...providerArgs] = args;
  if (provider === "--help" || provider === "-h" || provider === undefined) {
    printHelp();
    return { exitCode: 0 };
  }
  if (provider === "confluence") {
    const options = parseConfluenceOptions(providerArgs);
    if (options.help) {
      printHelp();
      return { exitCode: 0 };
    }
    return runConfluenceSync(options);
  }
  if (provider !== "obsidian")
    throw new Error("supported sync providers: obsidian, confluence");

  const options = parseOptions(providerArgs);
  if (options.help) {
    printHelp();
    return { exitCode: 0 };
  }
  if (!options.vault) throw new Error("sync obsidian requires --vault <path>");

  const repository = resolve(process.cwd());
  const docsRoot = resolve(repository, options.docs ?? "docs/architecture");
  const vaultRoot = resolve(repository, options.vault);
  const relativeTarget = options.path ?? `Architecture/${basename(repository)}`;
  const targetRoot = resolve(vaultRoot, relativeTarget);
  if (!isInside(vaultRoot, targetRoot) || targetRoot === vaultRoot)
    throw new Error("--path must select a child directory inside the vault");
  if (!(await isDirectory(vaultRoot)))
    throw new Error(`Obsidian vault directory does not exist: ${vaultRoot}`);
  if (await hasSymlink(vaultRoot, targetRoot))
    throw new Error("Obsidian target path contains a symbolic link");

  const sourceFiles = await collectMarkdown(docsRoot);
  if (sourceFiles.length === 0)
    throw new Error(`no Markdown files found under ${docsRoot}`);
  const manifestPath = join(targetRoot, MANIFEST_NAME);
  if (await isSymlink(manifestPath))
    throw new Error(
      `refusing to read a symbolic-link manifest: ${manifestPath}`,
    );
  const manifest = await readManifest(manifestPath);
  const nextManifest = { version: 1, files: { ...manifest.files } };
  const created = [];
  const updated = [];
  const unchanged = [];
  const conflicts = [];
  const seenSourcePaths = new Set();

  for (const source of sourceFiles) {
    seenSourcePaths.add(source.path);
    const destination = resolve(targetRoot, source.path);
    if (!isInside(targetRoot, destination)) {
      conflicts.push({ path: source.path, reason: "resolved outside target" });
      continue;
    }
    if (await hasSymlink(targetRoot, destination)) {
      conflicts.push({
        path: source.path,
        reason: "target path is a symbolic link",
      });
      continue;
    }

    const sourceDigest = digest(source.content);
    const previousDigest = manifest.files[source.path];
    let destinationContent;
    try {
      destinationContent = await readFile(destination);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    if (destinationContent === undefined) {
      if (!options.dryRun) {
        await mkdir(dirname(destination), { recursive: true });
        try {
          await writeFile(destination, source.content, { flag: "wx" });
        } catch (error) {
          if (error.code !== "EEXIST") throw error;
          conflicts.push({
            path: source.path,
            reason: "a vault file appeared during synchronization",
          });
          continue;
        }
      }
      created.push(source.path);
      nextManifest.files[source.path] = sourceDigest;
    } else {
      const destinationDigest = digest(destinationContent);
      if (destinationDigest === sourceDigest) {
        unchanged.push(source.path);
        nextManifest.files[source.path] = sourceDigest;
      } else if (
        previousDigest !== undefined &&
        destinationDigest === previousDigest
      ) {
        if (!options.dryRun) await writeFile(destination, source.content);
        updated.push(source.path);
        nextManifest.files[source.path] = sourceDigest;
      } else {
        conflicts.push({
          path: source.path,
          reason: "vault copy has local edits; review or reconcile it manually",
        });
      }
    }
  }

  const orphaned = Object.keys(manifest.files).filter(
    (path) => !seenSourcePaths.has(path),
  );
  if (!options.dryRun && !conflicts.length) {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
  }

  const result = {
    action: options.dryRun ? "dry-run" : "sync",
    provider: "obsidian",
    source: docsRoot,
    target: targetRoot,
    created,
    updated,
    unchanged,
    orphaned,
    conflicts,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return { exitCode: conflicts.length ? 1 : 0, result };
}

function printHelp() {
  process.stdout.write(
    "Usage: arcshape sync obsidian --vault <directory> [--docs <directory>] [--path <vault-subdirectory>] [--dry-run]\n\n",
  );
  process.stdout.write(
    "       arcshape sync confluence --base-url <url> --page-id <id> [--docs <directory>] [--dry-run]\n",
  );
  process.stdout.write(
    "Sync canonical Markdown to Obsidian or a selected Confluence page.\n",
  );
  process.stdout.write(
    "Vault and page edits are preserved and reported as conflicts. Confluence credentials use CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN by default.\n",
  );
}

function parseConfluenceOptions(args) {
  const options = { dryRun: false, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (
      [
        "--base-url",
        "--page-id",
        "--docs",
        "--email-env",
        "--token-env",
      ].includes(arg)
    ) {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} requires a value`);
      if (arg === "--base-url") options.baseUrl = value;
      else if (arg === "--page-id") options.pageId = value;
      else if (arg === "--docs") options.docs = value;
      else if (arg === "--email-env") options.emailEnv = value;
      else options.tokenEnv = value;
      index += 1;
    } else throw new Error(`Unknown Confluence sync option: ${arg}`);
  }
  return options;
}

function parseOptions(args) {
  const options = { dryRun: false, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (["--vault", "--docs", "--path"].includes(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${arg} requires a value`);
      if (arg === "--vault") options.vault = value;
      else if (arg === "--docs") options.docs = value;
      else options.path = value;
      index += 1;
    } else throw new Error(`Unknown sync option: ${arg}`);
  }
  return options;
}

async function collectMarkdown(root, parent = "") {
  const entries = await readdir(join(root, parent), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const path = join(parent, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdown(root, path)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      files.push({ path, content: await readFile(join(root, path)) });
  }
  return files;
}

async function readManifest(path) {
  try {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    if (
      manifest.version !== 1 ||
      manifest.files === null ||
      typeof manifest.files !== "object" ||
      Array.isArray(manifest.files) ||
      Object.values(manifest.files).some(
        (value) =>
          typeof value !== "string" || !/^sha256:[a-f\d]{64}$/.test(value),
      )
    )
      throw new Error("manifest has an unsupported or invalid format");
    return manifest;
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, files: {} };
    throw new Error(`cannot read sync manifest: ${error.message}`);
  }
}

function digest(content) {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

function isInside(root, path) {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  );
}

async function isDirectory(path) {
  try {
    return (await lstat(path)).isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function isSymlink(path) {
  try {
    return (await lstat(path)).isSymbolicLink();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function hasSymlink(root, path) {
  const parts = relative(root, path).split(sep);
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    if (await isSymlink(current)) return true;
  }
  return false;
}

function basename(path) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? "architecture";
}
