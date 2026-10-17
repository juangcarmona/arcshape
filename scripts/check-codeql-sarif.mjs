#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function normalizePath(uri) {
  if (typeof uri !== "string" || !uri) return "(unknown path)";
  const filePath = uri.startsWith("file:")
    ? fileURLToPath(uri)
    : decodeURIComponent(uri);
  return relative(
    process.cwd(),
    isAbsolute(filePath) ? filePath : resolve(filePath),
  );
}

function isValidException(exception, today) {
  const parsed = new Date(`${exception.expires}T23:59:59Z`);
  return (
    typeof exception.owner === "string" &&
    exception.owner.length > 0 &&
    typeof exception.reason === "string" &&
    exception.reason.length > 0 &&
    typeof exception.expires === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(exception.expires) &&
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().startsWith(exception.expires) &&
    exception.expires >= today
  );
}

export function highSecurityFindings(
  document,
  threshold = 7,
  exceptionDocument = { exceptions: [] },
  today = new Date().toISOString().slice(0, 10),
) {
  const findings = [];
  const errors = [];
  const usedExceptions = new Set();
  const exceptions = new Map();
  for (const exception of exceptionDocument.exceptions ?? []) {
    const key = `${exception.ruleId}\0${exception.path}`;
    if (exceptions.has(key)) {
      errors.push(
        `Duplicate CodeQL exception for ${exception.ruleId} at ${exception.path}`,
      );
    }
    exceptions.set(key, exception);
    if (
      !exception.ruleId ||
      !exception.path ||
      !isValidException(exception, today)
    ) {
      errors.push(
        `CodeQL exception for ${exception.ruleId ?? "(missing rule)"} must name a path, owner, reason, and future expiry date`,
      );
    }
  }

  for (const run of document.runs ?? []) {
    const rules = new Map(
      (run.tool?.driver?.rules ?? []).map((rule) => [rule.id, rule]),
    );
    for (const result of run.results ?? []) {
      const rule = rules.get(result.ruleId);
      const rawSeverity =
        result.properties?.["security-severity"] ??
        rule?.properties?.["security-severity"];
      if (rawSeverity === undefined) continue;
      const severity = Number(rawSeverity);
      if (!Number.isFinite(severity)) {
        errors.push(
          `Invalid security-severity for CodeQL rule ${result.ruleId}`,
        );
        continue;
      }
      if (severity < threshold) continue;

      const path = normalizePath(
        result.locations?.[0]?.physicalLocation?.artifactLocation?.uri,
      );
      const exceptionKey = `${result.ruleId}\0${path}`;
      const exception = exceptions.get(exceptionKey);
      if (exception && isValidException(exception, today)) {
        usedExceptions.add(exceptionKey);
      } else {
        findings.push({
          ruleId: result.ruleId,
          path,
          severity,
          message: result.message?.text ?? "",
        });
      }
    }
  }

  for (const key of exceptions.keys()) {
    if (!usedExceptions.has(key)) {
      errors.push(`Stale CodeQL exception: ${key.replace("\0", " at ")}`);
    }
  }
  return { findings, errors, usedExceptions: [...usedExceptions] };
}

async function findSarifFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const current = join(path, entry.name);
    if (entry.isDirectory()) files.push(...(await findSarifFiles(current)));
    else if (entry.isFile() && entry.name.endsWith(".sarif")) {
      files.push(current);
    }
  }
  return files;
}

async function main() {
  const sarifPath = process.argv[2];
  if (!sarifPath) {
    throw new Error(
      "Usage: node scripts/check-codeql-sarif.mjs <SARIF-file-or-directory>",
    );
  }
  let files = [sarifPath];
  try {
    await readdir(sarifPath);
    files = await findSarifFiles(sarifPath);
  } catch (error) {
    if (error.code !== "ENOTDIR") throw error;
  }
  if (files.length === 0) {
    throw new Error(`No CodeQL SARIF files found at ${sarifPath}`);
  }

  const exceptionDocument = JSON.parse(
    await readFile("security/codeql-exceptions.json", "utf8"),
  );
  const findings = [];
  const errors = [];
  const usedExceptions = new Set();
  for (const file of files) {
    const document = JSON.parse(await readFile(file, "utf8"));
    const result = highSecurityFindings(document, 7, exceptionDocument);
    findings.push(...result.findings.map((finding) => ({ file, ...finding })));
    errors.push(...result.errors);
    result.usedExceptions.forEach((exception) => usedExceptions.add(exception));
  }
  for (const exception of exceptionDocument.exceptions ?? []) {
    const key = `${exception.ruleId}\0${exception.path}`;
    if (!usedExceptions.has(key)) {
      errors.push(`Stale CodeQL exception: ${key.replace("\0", " at ")}`);
    }
  }
  if (findings.length > 0 || errors.length > 0) {
    for (const error of new Set(errors)) console.error(`SAST policy: ${error}`);
    for (const finding of findings) {
      console.error(
        `SAST threshold exceeded: ${finding.ruleId} security-severity=${finding.severity} path=${finding.path} (${finding.file})`,
      );
    }
    process.exitCode = 1;
    return;
  }
  for (const key of usedExceptions) {
    const [ruleId, path] = key.split("\0");
    const exception = (exceptionDocument.exceptions ?? []).find(
      (candidate) => candidate.ruleId === ruleId && candidate.path === path,
    );
    console.log(
      `SAST exception applied: ${ruleId} at ${path} through ${exception.expires}: ${exception.reason}`,
    );
  }
  console.log(
    `SAST threshold passed across ${files.length} CodeQL SARIF file(s); blocking threshold is High (7.0). ${usedExceptions.size} active exception(s).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
