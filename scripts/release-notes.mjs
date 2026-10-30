import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export function releaseNotes(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const start = lines.indexOf(`## ${version}`);
  if (start < 0) throw new Error(`No changelog entry for ${version}`);
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith("## ")) end++;
  const notes = lines
    .slice(start + 1, end)
    .join("\n")
    .trim();
  if (!notes) throw new Error(`Empty changelog entry for ${version}`);
  return notes + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { version } = JSON.parse(
    await readFile("packages/cli/package.json", "utf8"),
  );
  process.stdout.write(
    releaseNotes(await readFile("packages/cli/CHANGELOG.md", "utf8"), version),
  );
}
