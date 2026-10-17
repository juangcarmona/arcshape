#!/usr/bin/env node
import { readFile } from "node:fs/promises";

function splitExpression(expression, operator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < expression.length; index += 1) {
    if (expression[index] === "(") depth += 1;
    if (expression[index] === ")") depth -= 1;
    const candidate = ` ${operator} `;
    if (depth === 0 && expression.startsWith(candidate, index)) {
      parts.push(expression.slice(start, index).trim());
      index += candidate.length - 1;
      start = index + 1;
    }
  }
  if (parts.length === 0) return null;
  parts.push(expression.slice(start).trim());
  return parts;
}

function expressionIsAllowed(expression, allowed) {
  let normalized = expression.trim();
  while (normalized.startsWith("(") && normalized.endsWith(")")) {
    let depth = 0;
    let enclosing = true;
    for (let index = 0; index < normalized.length - 1; index += 1) {
      if (normalized[index] === "(") depth += 1;
      if (normalized[index] === ")") depth -= 1;
      if (depth === 0) {
        enclosing = false;
        break;
      }
    }
    if (!enclosing) break;
    normalized = normalized.slice(1, -1).trim();
  }
  const alternatives = splitExpression(normalized, "OR");
  if (alternatives)
    return alternatives.some((part) => expressionIsAllowed(part, allowed));
  const requirements = splitExpression(normalized, "AND");
  if (requirements)
    return requirements.every((part) => expressionIsAllowed(part, allowed));
  return /^[A-Za-z0-9.+-]+$/.test(normalized) && allowed.has(normalized);
}

function exceptionIsCurrent(exception, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(exception.expires ?? "")) return false;
  const parsed = new Date(`${exception.expires}T23:59:59Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().startsWith(exception.expires) &&
    exception.expires >= today
  );
}

function licensesFor(component, exception, today) {
  const entries = component.licenses ?? [];
  const parsed = entries
    .map(
      (entry) =>
        entry.license?.id ?? entry.license?.expression ?? entry.expression,
    )
    .filter((value) => typeof value === "string" && value.trim());
  if (parsed.length > 0) return parsed;
  if (exception?.licenseOverride && exceptionIsCurrent(exception, today)) {
    return [exception.licenseOverride];
  }
  return [];
}

export function evaluateLicensePolicy(
  bom,
  policy,
  exceptionDocument,
  today = new Date().toISOString().slice(0, 10),
) {
  const errors = [];
  const warnings = [];
  const allowed = new Set(policy.allowedLicenses);
  const exceptions = new Map();
  const usedExceptions = new Set();

  if (
    !Array.isArray(policy.allowedLicenses) ||
    !Array.isArray(bom.components) ||
    bom.components.length === 0
  ) {
    errors.push(
      "The license policy must define an allowlist and the CycloneDX SBOM must contain components",
    );
    return { errors, warnings };
  }

  for (const exception of exceptionDocument.exceptions ?? []) {
    if (exceptions.has(exception.purl)) {
      errors.push(`Duplicate exception for ${exception.purl}`);
      continue;
    }
    exceptions.set(exception.purl, exception);
    if (
      !exception.owner ||
      !exception.reason ||
      !exception.evidence ||
      !exceptionIsCurrent(exception, today)
    ) {
      errors.push(
        `Exception for ${exception.purl} must include owner, reason, evidence, and a future expiry date`,
      );
    }
  }

  for (const component of bom.components ?? []) {
    if (!component.purl) {
      errors.push(`Component ${component.name ?? "(unnamed)"} has no purl`);
      continue;
    }
    const exception = exceptions.get(component.purl);
    if (exception) usedExceptions.add(exception.purl);
    const licenses = licensesFor(component, exception, today);
    if (licenses.length === 0) {
      errors.push(`No usable SPDX license for ${component.purl}`);
      continue;
    }
    const componentAllowed = new Set([
      ...allowed,
      ...(exceptionIsCurrent(exception ?? {}, today)
        ? (exception.allowedLicenses ?? [])
        : []),
    ]);
    const rejected = licenses.filter(
      (license) => !expressionIsAllowed(license, componentAllowed),
    );
    if (rejected.length > 0) {
      errors.push(
        `${component.purl} has disallowed license(s): ${rejected.join(", ")}`,
      );
    } else if (exception && exceptionIsCurrent(exception, today)) {
      warnings.push(
        `Applied expiring exception for ${component.purl} through ${exception.expires}: ${exception.reason}`,
      );
    }
  }

  for (const exception of exceptions.values()) {
    if (!usedExceptions.has(exception.purl)) {
      errors.push(`Stale license exception: ${exception.purl}`);
    }
  }

  return { errors, warnings };
}

async function main() {
  const [
    bomPath,
    policyPath = "security/license-policy.json",
    exceptionsPath = "security/license-exceptions.json",
  ] = process.argv.slice(2);
  if (!bomPath) {
    throw new Error(
      "Usage: node scripts/check-license-policy.mjs <cyclonedx-sbom.json> [policy.json] [exceptions.json]",
    );
  }
  const [bom, policy, exceptionDocument] = await Promise.all(
    [bomPath, policyPath, exceptionsPath].map(async (path) =>
      JSON.parse(await readFile(path, "utf8")),
    ),
  );
  const { errors, warnings } = evaluateLicensePolicy(
    bom,
    policy,
    exceptionDocument,
  );
  for (const warning of warnings) console.log(`LICENSE EXCEPTION: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`LICENSE POLICY: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `License policy passed for ${bom.components?.length ?? 0} SBOM components (${warnings.length} active exception(s)).`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
