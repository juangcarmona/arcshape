import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const acceptedStatuses = new Set(["active", "deprecated", "retired"]);

export async function findUnapprovedArtifacts(
  modelDirectory: string,
): Promise<string[]> {
  const paths = await collectMarkdownFiles(modelDirectory);
  const invalid: string[] = [];

  for (const path of paths) {
    const content = await readFile(path, "utf8");
    const frontmatter = content.match(
      /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
    )?.[1];
    const status = frontmatter?.match(/^status:\s*([\w-]+)\s*$/m)?.[1];
    if (!status || !acceptedStatuses.has(status)) invalid.push(path);
  }

  return invalid.sort();
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectMarkdownFiles(path);
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
    }),
  );
  return nestedPaths.flat();
}

async function main(): Promise<void> {
  const modelDirectory = process.argv[2] ?? "docs/product/model";
  const invalid = await findUnapprovedArtifacts(modelDirectory);
  if (invalid.length === 0) {
    process.stdout.write(
      `Product model statuses accepted: ${modelDirectory}\n`,
    );
    return;
  }

  process.stderr.write(
    `Unapproved or missing ProductShape status in ${invalid.length} artifact(s):\n${invalid.map((path) => `- ${path}`).join("\n")}\n`,
  );
  process.exitCode = 1;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
