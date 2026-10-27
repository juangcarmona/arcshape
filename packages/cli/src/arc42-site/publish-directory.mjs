import { createHash } from "node:crypto";
import {
  lstat,
  readdir,
  readFile,
  mkdir,
  writeFile,
  mkdtemp,
  rename,
  rm,
} from "node:fs/promises";
import { dirname, join, resolve, relative, sep } from "node:path";

const marker = ".arcshape-output.json";
const digest = (value) => createHash("sha256").update(value).digest("hex");
const inside = (parent, child) =>
  child === parent || child.startsWith(parent + sep);

async function inspectOutput(output) {
  for (let current = output; ; current = dirname(current)) {
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Output traverses a symlink: ${current}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (dirname(current) === current) break;
  }
  const files = {};
  async function scan(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error(`Output contains a symlink: ${path}`);
      if (entry.isDirectory()) await scan(path);
      else if (entry.isFile())
        files[relative(output, path).split(sep).join("/")] = digest(
          await readFile(path),
        );
      else throw new Error(`Output contains a non-regular file: ${path}`);
    }
  }
  try {
    await scan(output);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
  if (!Object.keys(files).length) return {};
  let manifest;
  try {
    manifest = JSON.parse(await readFile(join(output, marker), "utf8"));
  } catch {
    throw new Error("Refusing to replace a directory not owned by ArcShape");
  }
  delete files[marker];
  if (
    manifest.generator !== "ArcShape" ||
    manifest.version !== 1 ||
    JSON.stringify(Object.entries(files).sort()) !==
      JSON.stringify(Object.entries(manifest.files ?? {}).sort())
  )
    throw new Error(
      "Generated output was modified or contains unrelated files; choose a new output directory",
    );
  return files;
}

export async function checkPublicationTarget(output, docsDir) {
  output = resolve(output);
  docsDir = resolve(docsDir);
  if (inside(output, docsDir) || inside(docsDir, output))
    throw new Error(
      "Interactive output must not overlap authored documentation",
    );
  return inspectOutput(output);
}

export async function publishDirectory(output, docsDir, files) {
  output = resolve(output);
  const before = await checkPublicationTarget(output, docsDir);
  for (const path of files.keys())
    if (
      !/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+$/.test(path) ||
      path.split("/").some((p) => p === "." || p === "..")
    )
      throw new Error("Invalid generated output path");
  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(join(dirname(output), ".arcshape-publish-"));
  const candidate = join(staging, "candidate"),
    previous = join(staging, "previous");
  let moved = false;
  let preserveRecovery = false;
  try {
    await mkdir(candidate);
    const inventory = {};
    for (const [path, content] of files) {
      await mkdir(dirname(join(candidate, path)), { recursive: true });
      await writeFile(join(candidate, path), content);
      inventory[path] = digest(content);
    }
    await writeFile(
      join(candidate, marker),
      JSON.stringify(
        { generator: "ArcShape", version: 1, files: inventory },
        null,
        2,
      ) + "\n",
    );
    if (JSON.stringify(before) !== JSON.stringify(await inspectOutput(output)))
      throw new Error("Output changed during publication");
    if (before !== null) {
      await rename(output, previous);
      moved = true;
    }
    try {
      await rename(candidate, output);
    } catch (error) {
      if (moved) {
        preserveRecovery = true;
        await rename(previous, output);
        preserveRecovery = false;
        moved = false;
      }
      throw error;
    }
  } finally {
    // This freshly allocated staging directory contains only our candidate/validated prior output.
    if (!preserveRecovery) await rm(staging, { recursive: true, force: true });
  }
}
