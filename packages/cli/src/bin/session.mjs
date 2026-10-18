import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  open,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import ignore from "ignore";

const SESSION_SCHEMA = "arcshape/repository-analysis-session/v1";
const DEFAULT_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 50;
const MAX_TEXT_FILE_BYTES = 10 * 1024 * 1024;
const PROTECTED_PARTS = new Set([
  ".aws",
  ".git",
  ".gnupg",
  ".kube",
  ".ssh",
  ".arcshape",
  "node_modules",
  "secrets",
]);
const IGNORED_BUILD_DIRS = new Set(["build", "coverage", "dist", "out"]);
const IGNORED_PATH_PREFIXES = ["docs/architecture-site/"];
const CLASSIFICATIONS = new Set([
  "represented",
  "duplicate",
  "contradiction",
  "question",
  "out-of-scope",
  "no-architecture-evidence",
]);

export async function runSession(args) {
  const [action, ...rest] = args;
  if (!action || action === "--help" || action === "-h") {
    printHelp();
    return { exitCode: 0 };
  }
  const { positionals, options } = parseArgs(rest);
  if (options.help) {
    printHelp();
    return { exitCode: 0 };
  }
  const root = resolve(process.cwd(), options.target ?? ".");

  if (action === "start") return startSession(root, options);
  if (action === "help") {
    printHelp();
    return { exitCode: 0 };
  }
  const session = await loadSession(root, options.session);

  if (["status", "next", "report"].includes(action)) {
    await refreshInventory(root, session.state);
    await saveSession(session.directory, session.state);
  }
  if (action === "status") return showStatus(session.state);
  if (action === "next") return showNext(session.state, options);
  if (action === "report") return showReport(session.state);
  if (action === "mark") {
    await refreshInventory(root, session.state);
    await saveSession(session.directory, session.state);
    return markEvidence(root, session, positionals[0], options);
  }
  if (action === "unmark") {
    await refreshInventory(root, session.state);
    await saveSession(session.directory, session.state);
    return unmarkEvidence(session, positionals[0], options);
  }
  if (action === "lead") return addLead(session, positionals, options);
  if (action === "question")
    return manageQuestion(session, positionals, options);
  throw new Error(
    `unknown session command: ${action}; run arcshape session --help`,
  );
}

function printHelp() {
  process.stdout.write(
    [
      "ArcShape repository-analysis sessions",
      "",
      "Usage: arcshape session <command> [options]",
      "",
      "Commands:",
      "  start [--target <dir>] [--id <name>] [--batch-size <n>]",
      "  status [--target <dir>] [--session <id>]",
      "  next [--target <dir>] [--session <id>] [--limit <n>]",
      "  mark <evidence-id> --as <classification> [--note <text>] [--accept-changed]",
      "  unmark <evidence-id> [--all] [--note <reason>]",
      "  lead add --text <text> [--source <evidence-id-or-path>]",
      "  question add --text <text> [--source <evidence-id-or-path>]",
      "  question answer <question-id> --text <answer>",
      "  report [--target <dir>] [--session <id>]",
      "",
      "State is local under .arcshape/sessions/. Each `next` call returns one bounded round.",
      "The CLI records classifications and notes; it does not interpret repository content.",
      "",
    ].join("\n"),
  );
}

async function startSession(root, options) {
  await requireDirectory(root);
  const batchSize = parsePositiveInteger(
    options["batch-size"] ?? DEFAULT_BATCH_SIZE,
    "--batch-size",
    MAX_BATCH_SIZE,
  );
  const id = validateSessionId(
    options.id ??
      `${slug(basename(root))}-${new Date().toISOString().slice(0, 10)}`,
  );
  const directory = sessionDirectory(root, id);
  try {
    await lstat(directory);
    throw new Error(
      `session '${id}' already exists; resume it with arcshape session status --session ${id}`,
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const now = new Date().toISOString();
  const state = {
    schema: SESSION_SCHEMA,
    id,
    createdAt: now,
    updatedAt: now,
    batchSize,
    evidence: await inventory(root),
    leads: [],
    questions: [],
  };
  await saveSession(directory, state);
  return printResult({
    action: "started",
    session: id,
    evidenceCount: state.evidence.length,
    next: `arcshape session next --session ${id}`,
  });
}

async function loadSession(root, requestedId) {
  const sessionsRoot = join(root, ".arcshape", "sessions");
  let id = requestedId;
  if (id) id = validateSessionId(id);
  else {
    const entries = await readdir(sessionsRoot, { withFileTypes: true }).catch(
      (error) => {
        if (error.code === "ENOENT") return [];
        throw error;
      },
    );
    const ids = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    if (ids.length === 0)
      throw new Error(
        `no session found under .arcshape/sessions; start one with arcshape session start`,
      );
    if (ids.length > 1)
      throw new Error(
        `multiple sessions exist (${ids.join(", ")}); pass --session <id>`,
      );
    id = ids[0];
  }

  const directory = sessionDirectory(root, id);
  let state;
  try {
    state = JSON.parse(await readFile(join(directory, "session.json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT")
      throw new Error(`session '${id}' was not found under .arcshape/sessions`);
    if (error instanceof SyntaxError)
      throw new Error(
        `session '${id}' has invalid JSON state; preserve the file and inspect it manually`,
      );
    throw error;
  }
  if (state.schema !== SESSION_SCHEMA || state.id !== id)
    throw new Error(
      `session '${id}' has an unsupported or mismatched state file`,
    );
  return { id, directory, state };
}

async function refreshInventory(root, state) {
  const current = await inventory(root);
  const byPath = new Map(state.evidence.map((item) => [item.path, item]));
  const currentPaths = new Set();
  let changed = false;
  for (const item of current) {
    currentPaths.add(item.path);
    const previous = byPath.get(item.path);
    if (!previous) {
      state.evidence.push(item);
      changed = true;
      continue;
    }
    if (
      previous.status === "excluded" &&
      previous.exclusionReason === "ignored by repository .gitignore rules"
    ) {
      previous.previousStatus = "excluded";
      previous.status = "changed";
      previous.currentDigest = item.digest;
      previous.currentSize = item.size;
      previous.change = "unignored";
      delete previous.exclusionReason;
      changed = true;
      continue;
    }
    if (previous.digest !== item.digest || previous.size !== item.size) {
      if (previous.status !== "changed")
        previous.previousStatus = previous.status;
      previous.status = "changed";
      previous.currentDigest = item.digest;
      previous.currentSize = item.size;
      changed = true;
    }
  }
  for (const item of state.evidence) {
    if (currentPaths.has(item.path)) continue;
    if (await isIgnoredFile(root, item.path)) {
      if (
        item.status !== "excluded" ||
        item.exclusionReason !== "ignored by repository .gitignore rules"
      ) {
        item.previousStatus = item.status;
        item.status = "excluded";
        item.exclusionReason = "ignored by repository .gitignore rules";
        delete item.currentDigest;
        delete item.currentSize;
        delete item.change;
        changed = true;
      }
      continue;
    }
    if (item.status !== "changed") {
      item.previousStatus = item.status;
      item.status = "changed";
      item.currentDigest = null;
      item.currentSize = null;
      item.change = "removed";
      changed = true;
    }
  }
  state.evidence.sort((left, right) => left.path.localeCompare(right.path));
  state.updatedAt = new Date().toISOString();
  return changed;
}

async function inventory(root) {
  const paths = await walk(root);
  const evidence = [];
  for (const path of paths) {
    const absolute = join(root, ...path.split("/"));
    const fileStat = await stat(absolute);
    const sample = await readSample(absolute);
    const binary = sample.includes(0);
    const oversized = fileStat.size > MAX_TEXT_FILE_BYTES;
    const digest = await hashFile(absolute);
    const reason = binary
      ? "binary file; content not included in analysis rounds"
      : oversized
        ? `larger than ${MAX_TEXT_FILE_BYTES} bytes; content not included in analysis rounds`
        : null;
    evidence.push({
      id: evidenceId(path),
      path,
      tier: evidenceTier(path),
      digest,
      size: fileStat.size,
      status: reason ? "excluded" : "pending",
      exclusionReason: reason,
      findings: [],
    });
  }
  return evidence.sort((left, right) => left.path.localeCompare(right.path));
}

async function walk(root, parent = "", inheritedIgnoreRules = []) {
  const ignoreRules = await loadIgnoreRules(root, parent, inheritedIgnoreRules);
  const entries = await readdir(join(root, parent), { withFileTypes: true });
  const paths = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relativePath = parent ? `${parent}/${entry.name}` : entry.name;
    if (relativePath.split("/").some((part) => PROTECTED_PARTS.has(part)))
      continue;
    if (IGNORED_PATH_PREFIXES.some((prefix) => relativePath.startsWith(prefix)))
      continue;
    if (relativePath.split("/").some(isProtectedFileName)) continue;
    if (entry.isSymbolicLink()) continue;
    if (isIgnoredByRules(relativePath, entry.isDirectory(), ignoreRules))
      continue;
    if (entry.isDirectory()) {
      if (parent === "" && IGNORED_BUILD_DIRS.has(entry.name)) continue;
      paths.push(...(await walk(root, relativePath, ignoreRules)));
    } else if (entry.isFile()) paths.push(relativePath);
  }
  return paths;
}

async function loadIgnoreRules(root, parent, inheritedRules) {
  const ignorePath = parent ? `${parent}/.gitignore` : ".gitignore";
  if (parent && isIgnoredByRules(ignorePath, false, inheritedRules))
    return inheritedRules;

  const absolutePath = join(root, ...ignorePath.split("/"));
  try {
    const metadata = await lstat(absolutePath);
    if (!metadata.isFile()) return inheritedRules;
    const patterns = await readFile(absolutePath, "utf8");
    if (!patterns.trim()) return inheritedRules;
    return [
      ...inheritedRules,
      { base: parent, matcher: ignore().add(patterns) },
    ];
  } catch (error) {
    if (error.code === "ENOENT") return inheritedRules;
    throw error;
  }
}

function isIgnoredByRules(path, isDirectory, rules) {
  let ignored = false;
  for (const rule of rules) {
    const relativePath = rule.base ? path.slice(rule.base.length + 1) : path;
    const candidate = isDirectory ? `${relativePath}/` : relativePath;
    const result = rule.matcher.test(candidate);
    if (result.ignored) ignored = true;
    else if (result.unignored) ignored = false;
  }
  return ignored;
}

async function isIgnoredFile(root, path) {
  try {
    if (!(await lstat(join(root, ...path.split("/")))).isFile()) return false;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  const parts = path.split("/");
  let parent = "";
  let rules = [];
  for (const directory of parts.slice(0, -1)) {
    rules = await loadIgnoreRules(root, parent, rules);
    parent = parent ? `${parent}/${directory}` : directory;
    if (isIgnoredByRules(parent, true, rules)) return true;
  }
  rules = await loadIgnoreRules(root, parent, rules);
  return isIgnoredByRules(path, false, rules);
}

function isProtectedFileName(name) {
  return (
    name === ".env" ||
    name.startsWith(".env.") ||
    [".npmrc", ".netrc", "credentials", "id_rsa", "id_ed25519"].includes(
      name.toLowerCase(),
    ) ||
    /(?:^|[-_.])credentials(?:$|[-_.])/i.test(name) ||
    /\.(?:pem|key|p12|pfx|crt|cer|token)$/i.test(name)
  );
}

async function markEvidence(root, session, id, options) {
  if (!id) throw new Error("mark requires an evidence id from `session next`");
  const item = session.state.evidence.find((entry) => entry.id === id);
  if (!item) throw new Error(`unknown evidence id '${id}'`);
  const classification = options.as;
  if (!CLASSIFICATIONS.has(classification))
    throw new Error(`--as must be one of: ${[...CLASSIFICATIONS].join(", ")}`);
  if (
    ["contradiction", "out-of-scope", "no-architecture-evidence"].includes(
      classification,
    ) &&
    !options.note
  )
    throw new Error(`--as ${classification} requires --note`);

  if (item.status === "changed") {
    if (!options["accept-changed"])
      throw new Error(
        `${item.path} changed since it was inventoried; re-read it, then mark with --accept-changed`,
      );
    const refreshed = await inspectFile(root, item.path);
    if (!refreshed)
      throw new Error(
        `${item.path} no longer exists; refresh status before marking`,
      );
    item.digest = refreshed.digest;
    item.size = refreshed.size;
    item.status = refreshed.exclusionReason ? "excluded" : "pending";
    item.exclusionReason = refreshed.exclusionReason;
    item.change = undefined;
    delete item.currentDigest;
    delete item.currentSize;
    delete item.previousStatus;
  }

  if (item.status === "excluded")
    throw new Error(
      `${item.path} is excluded from readable evidence: ${item.exclusionReason}`,
    );
  item.findings.push({
    classification,
    note: options.note ?? "",
    recordedAt: new Date().toISOString(),
  });
  item.status = classification === "out-of-scope" ? "excluded" : "reviewed";
  item.exclusionReason =
    classification === "out-of-scope" ? options.note : null;
  await saveSession(session.directory, session.state);
  return printResult({ action: "marked", evidence: item });
}

async function inspectFile(root, path) {
  try {
    const absolute = join(root, ...path.split("/"));
    const info = await stat(absolute);
    const binary = (await readSample(absolute)).includes(0);
    const oversized = info.size > MAX_TEXT_FILE_BYTES;
    return {
      digest: await hashFile(absolute),
      size: info.size,
      exclusionReason: binary
        ? "binary file; content not included in analysis rounds"
        : oversized
          ? `larger than ${MAX_TEXT_FILE_BYTES} bytes; content not included in analysis rounds`
          : null,
    };
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function unmarkEvidence(session, id, options) {
  if (!id) throw new Error("unmark requires an evidence id");
  const item = session.state.evidence.find((entry) => entry.id === id);
  if (!item) throw new Error(`unknown evidence id '${id}'`);
  if (!item.findings.length)
    throw new Error(`${item.path} has no finding to retract`);
  const retracted = options.all
    ? item.findings.splice(0)
    : [item.findings.pop()];
  item.history ??= [];
  item.history.push({
    action: "retracted",
    findings: retracted,
    note: options.note ?? "",
    recordedAt: new Date().toISOString(),
  });
  item.status = "pending";
  item.exclusionReason = null;
  await saveSession(session.directory, session.state);
  return printResult({
    action: "unmarked",
    evidence: item.id,
    retracted: retracted.length,
  });
}

async function addLead(session, positionals, options) {
  if (positionals[0] !== "add")
    throw new Error("use `lead add --text <finding>`");
  const text = requiredText(options.text, "--text");
  const lead = {
    id: sequentialId("L", session.state.leads),
    text,
    source: options.source ?? null,
    recordedAt: new Date().toISOString(),
  };
  session.state.leads.push(lead);
  await saveSession(session.directory, session.state);
  return printResult({ action: "lead-added", lead });
}

async function manageQuestion(session, positionals, options) {
  const [subcommand, id] = positionals;
  if (subcommand === "add") {
    const question = {
      id: sequentialId("Q", session.state.questions),
      text: requiredText(options.text, "--text"),
      source: options.source ?? null,
      answer: null,
      status: "open",
      recordedAt: new Date().toISOString(),
    };
    session.state.questions.push(question);
    await saveSession(session.directory, session.state);
    return printResult({ action: "question-added", question });
  }
  if (subcommand === "answer") {
    const question = session.state.questions.find((entry) => entry.id === id);
    if (!question) throw new Error(`unknown question id '${id ?? ""}'`);
    question.answer = requiredText(options.text, "--text");
    question.status = "answered";
    question.answeredAt = new Date().toISOString();
    await saveSession(session.directory, session.state);
    return printResult({ action: "question-answered", question });
  }
  throw new Error(
    "use `question add --text <question>` or `question answer <id> --text <answer>`",
  );
}

function showStatus(state) {
  return printResult({
    action: "status",
    session: state.id,
    total: state.evidence.length,
    coverage: countBy(state.evidence, "status"),
    tiers: countBy(state.evidence, "tier"),
    openQuestions: state.questions.filter(
      (question) => question.status === "open",
    ).length,
    leads: state.leads.length,
    updatedAt: state.updatedAt,
  });
}

function showNext(state, options) {
  const limit = parsePositiveInteger(
    options.limit ?? state.batchSize,
    "--limit",
    MAX_BATCH_SIZE,
  );
  const pending = state.evidence
    .filter((item) => item.status === "pending")
    .sort(
      (left, right) =>
        tierOrder(left.tier) - tierOrder(right.tier) ||
        left.path.localeCompare(right.path),
    );
  const first = pending[0];
  if (!first) {
    const changed = state.evidence.filter(
      (item) => item.status === "changed",
    ).length;
    return printResult({
      action: changed ? "awaiting-changed-evidence" : "coverage-complete",
      session: state.id,
      pending: 0,
      changed,
      coverage: countBy(state.evidence, "status"),
    });
  }
  const round = pending
    .filter((item) => item.tier === first.tier)
    .slice(0, limit);
  return printResult({
    action: "next-round",
    session: state.id,
    round: first.tier,
    limit,
    evidence: round.map(({ id, path, digest, size, tier }) => ({
      id,
      path,
      digest,
      size,
      tier,
    })),
    remainingInRound:
      pending.filter((item) => item.tier === first.tier).length - round.length,
  });
}

function showReport(state) {
  return printResult({
    action: "report",
    session: state.id,
    coverage: countBy(state.evidence, "status"),
    tiers: countBy(state.evidence, "tier"),
    openQuestions: state.questions.filter(
      (question) => question.status === "open",
    ),
    answeredQuestions: state.questions.filter(
      (question) => question.status === "answered",
    ),
    leads: state.leads,
    changedEvidence: state.evidence
      .filter((item) => item.status === "changed")
      .map(({ id, path, change }) => ({
        id,
        path,
        change: change ?? "modified",
      })),
  });
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] ?? 0) + 1;
    return counts;
  }, {});
}

function evidenceTier(path) {
  const lower = path.toLowerCase();
  const name = lower.split("/").at(-1);
  if (
    lower.startsWith("docs/") ||
    lower.startsWith("doc/") ||
    /\.(?:md|mdx|rst|adoc|asciidoc|txt)$/.test(name)
  )
    return "documentation";
  if (
    lower.includes("/config/") ||
    lower.startsWith("config/") ||
    /\.(?:json|ya?ml|toml|xml|ini|conf|properties)$/.test(name) ||
    [
      "dockerfile",
      "makefile",
      "justfile",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
    ].includes(name)
  )
    return "repository-configuration";
  return "implementation-and-tests";
}

function tierOrder(tier) {
  return [
    "documentation",
    "repository-configuration",
    "implementation-and-tests",
  ].indexOf(tier);
}

async function saveSession(directory, state) {
  await mkdir(directory, { recursive: true });
  state.updatedAt = new Date().toISOString();
  const path = join(directory, "session.json");
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
  await rename(temporary, path);
}

async function requireDirectory(path) {
  const info = await stat(path).catch((error) => {
    if (error.code === "ENOENT")
      throw new Error(`target directory does not exist: ${path}`);
    throw error;
  });
  if (!info.isDirectory())
    throw new Error(`target is not a directory: ${path}`);
}

function sessionDirectory(root, id) {
  return join(root, ".arcshape", "sessions", id);
}

function evidenceId(path) {
  return `E-${createHash("sha256").update(path).digest("hex").slice(0, 12)}`;
}

async function hashFile(path) {
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(path)) digest.update(chunk);
  return `sha256:${digest.digest("hex")}`;
}

async function readSample(path) {
  const handle = await open(path, "r");
  try {
    const buffer = Buffer.alloc(8192);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

function sequentialId(prefix, values) {
  return `${prefix}-${String(values.length + 1).padStart(4, "0")}`;
}

function slug(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "repository"
  );
}

function validateSessionId(value) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? ""))
    throw new Error(
      "session id must contain lowercase letters, digits, and hyphens",
    );
  return value;
}

function parsePositiveInteger(value, flag, maximum) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum)
    throw new Error(`${flag} must be an integer from 1 to ${maximum}`);
  return parsed;
}

function requiredText(value, flag) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${flag} requires nonempty text`);
  return value.trim();
}

function parseArgs(args) {
  const positionals = [];
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === "accept-changed" || key === "all" || key === "help") {
      options[key] = true;
      continue;
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`${arg} requires a value`);
    options[key] = value;
    index += 1;
  }
  return { positionals, options };
}

function printResult(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
  return { exitCode: 0 };
}
