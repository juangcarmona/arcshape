import { lstat, readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep, join } from "node:path";

export async function runInit(args, { packageRoot }) {
  const options = parseOptions(args);
  if (options.help) {
    process.stdout.write(
      `Usage: arcshape init [--target <directory>] [--dry-run]\n\n`,
    );
    process.stdout.write(
      `Create the Markdown arc42 structure and install Codex and Claude workflows.\n`,
    );
    process.stdout.write(
      `Files with different existing content are left untouched and reported.\n`,
    );
    return { exitCode: 0 };
  }

  const targetRoot = resolve(process.cwd(), options.target ?? ".");
  const templatesRoot = join(packageRoot, "templates", "architecture");
  const architectureFiles = await collectFiles(templatesRoot);
  const assistantFiles = await collectFiles(
    join(packageRoot, "templates", "assistants"),
  );
  const files = [
    ...architectureFiles.map((file) => ({
      ...file,
      destinationPath: join("docs", "architecture", file.relativePath),
    })),
    ...assistantFiles.map((file) => ({
      ...file,
      destinationPath: file.relativePath,
    })),
  ];
  const written = [];
  const unchanged = [];
  const conflicts = [];

  for (const template of files) {
    const destination = resolve(targetRoot, template.destinationPath);
    if (!isInside(targetRoot, destination)) {
      conflicts.push({
        path: destination,
        reason: "resolved outside the selected target directory",
      });
      continue;
    }
    if (await hasSymlinkInPath(targetRoot, destination)) {
      conflicts.push({
        path: relative(targetRoot, destination),
        reason: "a path component is a symbolic link",
      });
      continue;
    }

    const content = await readFile(template.source, "utf8");
    if (options.dryRun) {
      unchanged.push({
        path: relative(targetRoot, destination),
        reason: "would be created",
      });
      continue;
    }

    try {
      const existing = await readFile(destination, "utf8");
      if (existing === content)
        unchanged.push({
          path: relative(targetRoot, destination),
          reason: "already up to date",
        });
      else
        conflicts.push({
          path: relative(targetRoot, destination),
          reason: "file already exists with different content",
        });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await mkdir(dirname(destination), { recursive: true });
      try {
        await writeFile(destination, content, { encoding: "utf8", flag: "wx" });
        written.push(relative(targetRoot, destination));
      } catch (writeError) {
        if (writeError.code !== "EEXIST") throw writeError;
        conflicts.push({
          path: relative(targetRoot, destination),
          reason: "file appeared during initialization",
        });
      }
    }
  }

  process.stdout.write(
    `${options.dryRun ? "Planned" : "Created"} ${written.length || (options.dryRun ? unchanged.length : 0)} file(s).\n`,
  );
  for (const path of written) process.stdout.write(`  created  ${path}\n`);
  for (const item of unchanged)
    process.stdout.write(`  unchanged ${item.path} (${item.reason})\n`);
  for (const item of conflicts)
    process.stderr.write(
      `  conflict ${item.path}: ${item.reason}; review or move the file, then run arcshape init again.\n`,
    );
  if (conflicts.length)
    process.stderr.write(`No conflicting file was overwritten.\n`);
  return { exitCode: conflicts.length ? 1 : 0, written, unchanged, conflicts };
}

function parseOptions(args) {
  const options = { dryRun: false, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--target" || arg === "-C") {
      const value = args[index + 1];
      if (!value || value.startsWith("-"))
        throw new Error(`${arg} requires a directory path`);
      options.target = value;
      index += 1;
    } else throw new Error(`Unknown init option: ${arg}`);
  }
  return options;
}

async function collectFiles(root, parent = "") {
  const entries = await readdir(join(root, parent), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const child = join(parent, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(root, child)));
    else if (entry.isFile())
      files.push({ source: join(root, child), relativePath: child });
  }
  return files;
}

function isInside(root, path) {
  const rel = relative(root, path);
  return (
    rel === "" ||
    (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
  );
}

async function hasSymlinkInPath(root, destination) {
  const parts = relative(root, destination).split(sep);
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) return true;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  }
  return false;
}
