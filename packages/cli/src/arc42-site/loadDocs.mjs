/**
 * loadDocs.mjs — scan an arc42 documentation folder, validate the document contract
 * and parse every section. Mirrors productshape's "honest diagnostics" principle:
 * a broken model fails generation rather than producing a page that silently
 * omits part of the documentation.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, basename, dirname, sep } from "node:path";
import * as yaml from "js-yaml";

const ALLOWED_KEYS = new Set(["title", "arc42-section", "description"]);
const SECTION_FILE = /^(\d{2})-(.+)\.md$/;
const SECTION_DIRECTORY = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SECTION_NUMBERS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

export class Diagnostic extends Error {
  constructor(message) {
    super(message);
    this.name = "Diagnostic";
  }
}

/**
 * Parse the `---\nkey: value\n---` frontmatter block of a Markdown file.
 * Returns { frontmatter, body } or throws a Diagnostic naming the file.
 */
export function parseFrontmatter(raw, fileName) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    throw new Diagnostic(`${fileName}: missing YAML frontmatter block`);
  }
  let frontmatter;
  try {
    frontmatter = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) ?? {};
  } catch (error) {
    throw new Diagnostic(
      `${fileName}: unparseable frontmatter: ${error.message}`,
    );
  }
  if (typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    throw new Diagnostic(`${fileName}: frontmatter must be a mapping`);
  }
  return { frontmatter, body: match[2] };
}

/**
 * Load and validate an arc42 docs folder.
 *
 * Contract:
 *  - README.md exists, optionally has title/description, never `arc42-section`.
 *  - New documentation uses one NN-slug directory per section; its README.md
 *    carries the section frontmatter contract and other Markdown is supporting
 *    material owned by that section.
 *  - The legacy root-level NN-slug.md layout remains supported for migration.
 *  - Each canonical section has exactly the keys: title, arc42-section,
 *    description; arc42-section values are unique and match the number.
 *
 * @param {string} docsDir absolute path to the docs/architecture folder
 * @returns {{ readme: object, sections: object[], stackName: string }}
 */
export async function loadDocs(docsDir) {
  const entries = await readdir(docsDir, { withFileTypes: true });
  const mdFiles = entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const directoryNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const readmeName = mdFiles.find((name) => name.toLowerCase() === "readme.md");
  if (!readmeName) {
    throw new Diagnostic(
      `${docsDir}: no README.md found — the navigation index is required`,
    );
  }

  const problems = mdFiles
    .filter((name) => name !== readmeName && !SECTION_FILE.test(name))
    .map(
      (name) =>
        `${name}: unexpected root-level Markdown file; use a section directory for supporting material`,
    );
  const sectionFiles = mdFiles.filter((name) => SECTION_FILE.test(name));
  const sectionDirectories = directoryNames.filter((name) =>
    SECTION_DIRECTORY.test(name),
  );
  for (const name of directoryNames) {
    if (/^\d{2}-/.test(name) && !SECTION_DIRECTORY.test(name)) {
      problems.push(
        `${name}: invalid section directory name; use NN-slug with lowercase letters, numbers, and hyphens`,
      );
    }
  }

  // --- README: navigation index, never a section itself.
  const readmeRaw = await readFile(join(docsDir, readmeName), "utf8");
  const readmeParsed = /^---\r?\n/.test(readmeRaw)
    ? parseFrontmatter(readmeRaw, readmeName)
    : { frontmatter: {}, body: readmeRaw };
  for (const key of Object.keys(readmeParsed.frontmatter)) {
    if (key === "arc42-section") {
      problems.push(
        `${readmeName}: README must not carry arc42-section (it is navigation, not a section)`,
      );
    } else if (!["title", "description"].includes(key)) {
      problems.push(`${readmeName}: unexpected frontmatter key "${key}"`);
    }
  }
  for (const key of ["title", "description"]) {
    if (
      key in readmeParsed.frontmatter &&
      (typeof readmeParsed.frontmatter[key] !== "string" ||
        !readmeParsed.frontmatter[key].trim())
    ) {
      problems.push(
        `${readmeName}: ${key} must be a nonempty string when present`,
      );
    }
  }

  // --- Canonical section directories and legacy flat section files.
  const candidates = [
    ...sectionDirectories.map((name) => ({
      kind: "directory",
      name,
      number: SECTION_DIRECTORY.exec(name)[1],
    })),
    ...sectionFiles.map((name) => ({
      kind: "file",
      name,
      number: SECTION_FILE.exec(name)[1],
    })),
  ];
  if (candidates.length === 0) {
    problems.push(
      `${docsDir}: no NN-slug section directories or legacy NN-slug.md section files found`,
    );
  }

  const sections = [];
  const seenNumbers = new Map();
  for (const candidate of candidates) {
    const { kind, name, number } = candidate;
    if (!SECTION_NUMBERS.includes(number)) {
      problems.push(`${name}: section number must be between 01 and 12`);
    }
    if (seenNumbers.has(number)) {
      problems.push(
        `${name}: duplicate section number ${number} (also ${seenNumbers.get(number)})`,
      );
      continue;
    }
    seenNumbers.set(number, name);

    const section =
      kind === "directory"
        ? await readSectionDirectory(docsDir, name, number, problems)
        : await readSectionFile(docsDir, name, number, problems);
    if (section) sections.push(section);
  }

  for (const number of SECTION_NUMBERS) {
    if (!seenNumbers.has(number))
      problems.push(`required arc42 section ${number} is missing`);
  }

  if (problems.length > 0) {
    const error = new Diagnostic(
      `arc42 document contract violations:\n  - ${problems.join("\n  - ")}`,
    );
    error.problems = problems;
    throw error;
  }

  sections.sort((left, right) => left.number.localeCompare(right.number));

  // Derive a name from the docsDir's parent (e.g. .../my-project/docs/architecture → "my-project").
  // Falls back to the docsDir folder name itself if there is no meaningful parent.
  const parent = basename(dirname(docsDir));
  const grandparent = basename(dirname(dirname(docsDir)));
  const stackName =
    parent === "docs" ? grandparent : parent || basename(docsDir);

  return {
    readme: {
      file: readmeName,
      title: String(
        readmeParsed.frontmatter.title ?? "Architecture Documentation",
      ),
      description: String(readmeParsed.frontmatter.description ?? ""),
      body: readmeParsed.body,
    },
    sections,
    stackName,
  };
}

async function readSectionDirectory(docsDir, directory, number, problems) {
  const readmePath = join(docsDir, directory, "README.md");
  let raw;
  try {
    raw = await readFile(readmePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      problems.push(
        `${directory}: missing canonical section README.md; supporting documents cannot define an arc42 section`,
      );
      return undefined;
    }
    throw error;
  }

  let parsed;
  try {
    parsed = parseFrontmatter(raw, `${directory}/README.md`);
  } catch (error) {
    problems.push(error.message);
    return undefined;
  }
  const section = validateSectionFrontmatter(
    parsed,
    `${directory}/README.md`,
    number,
    problems,
  );
  const supporting = await collectSupportingDocuments(
    join(docsDir, directory),
    directory,
    number,
    problems,
  );
  return {
    ...section,
    slug: directory.slice(3),
    file: `${directory}/README.md`,
    directory,
    supporting,
  };
}

async function readSectionFile(docsDir, name, number, problems) {
  const raw = await readFile(join(docsDir, name), "utf8");
  let parsed;
  try {
    parsed = parseFrontmatter(raw, name);
  } catch (error) {
    problems.push(error.message);
    return undefined;
  }
  const section = validateSectionFrontmatter(parsed, name, number, problems);
  return {
    ...section,
    slug: SECTION_FILE.exec(name)[2],
    file: name,
    directory: undefined,
    supporting: [],
  };
}

function validateSectionFrontmatter(parsed, name, number, problems) {
  const fm = parsed.frontmatter;
  for (const key of Object.keys(fm)) {
    if (!ALLOWED_KEYS.has(key))
      problems.push(`${name}: unexpected frontmatter key "${key}"`);
  }
  for (const key of ["title", "arc42-section", "description"]) {
    if (!(key in fm)) {
      problems.push(`${name}: missing required frontmatter key "${key}"`);
    } else if (typeof fm[key] !== "string" || !fm[key].trim()) {
      problems.push(`${name}: ${key} must be a nonempty string`);
    }
  }
  if (fm["arc42-section"] !== undefined && fm["arc42-section"] !== number) {
    problems.push(
      `${name}: arc42-section "${fm["arc42-section"]}" does not match section number ${number}`,
    );
  }
  return {
    number,
    title: String(fm.title ?? name),
    description: String(fm.description ?? ""),
    body: parsed.body,
  };
}

async function collectSupportingDocuments(
  sectionRoot,
  directory,
  number,
  problems,
  current = "",
) {
  const entries = await readdir(join(sectionRoot, current), {
    withFileTypes: true,
  });
  const documents = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const relativePath = current ? join(current, entry.name) : entry.name;
    if (entry.isDirectory()) {
      documents.push(
        ...(await collectSupportingDocuments(
          sectionRoot,
          directory,
          number,
          problems,
          relativePath,
        )),
      );
      continue;
    }
    if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue;
    if (relativePath.split(sep).join("/") === "README.md") continue;

    const file = `${directory}/${relativePath}`.split(sep).join("/");
    const raw = await readFile(join(sectionRoot, relativePath), "utf8");
    if (/^---\r?\n[\s\S]*?\r?\n---\r?\n/.test(raw)) {
      try {
        const parsed = parseFrontmatter(raw, file);
        if (Object.hasOwn(parsed.frontmatter, "arc42-section"))
          problems.push(
            `${file}: supporting documents cannot carry arc42-section; only ${directory}/README.md defines section ${number}`,
          );
      } catch (error) {
        problems.push(error.message);
      }
    }
    documents.push({
      file,
      relativeFile: relativePath.split(sep).join("/"),
      route: `#/section/${number}/${relativePath
        .split(sep)
        .join("/")
        .replace(/\.md$/i, "")
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      title: supportingTitle(raw, basename(entry.name, ".md")),
      description: "",
      body: raw,
      section: number,
    });
  }
  return documents;
}

function supportingTitle(raw, fallback) {
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const heading = /^#\s+(.+)$/m.exec(body);
  return heading?.[1]?.trim() || fallback.replace(/[-_]+/g, " ");
}
