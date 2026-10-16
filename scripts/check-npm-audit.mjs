import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const acceptedSeverities = new Set(["high", "critical"]);

export function evaluateAuditReport(report, exceptions = [], now = new Date()) {
  if (!report || typeof report !== "object" || !report.vulnerabilities) {
    return {
      errors: [
        "npm audit did not return a vulnerability report; failing closed.",
      ],
      findings: [],
    };
  }

  const errors = validateExceptions(exceptions, now);
  const findings = [];
  const matchedExceptionIndexes = new Set();

  for (const [packageName, vulnerability] of Object.entries(
    report.vulnerabilities,
  )) {
    if (!acceptedSeverities.has(vulnerability.severity)) continue;

    const advisories = findAdvisories(packageName, report.vulnerabilities);
    const unresolvedAdvisories = advisories.filter((advisory) => {
      const exceptionIndex = exceptions.findIndex(
        (exception) =>
          exception.package === packageName &&
          exception.advisory === advisory.url &&
          parseExpiry(exception.expiresOn) >= now,
      );
      if (exceptionIndex < 0) return true;
      matchedExceptionIndexes.add(exceptionIndex);
      return false;
    });

    if (advisories.length === 0 || unresolvedAdvisories.length > 0) {
      findings.push({
        package: packageName,
        severity: vulnerability.severity,
        range: vulnerability.range,
        nodes: vulnerability.nodes,
        fixAvailable: vulnerability.fixAvailable,
        via: vulnerability.via,
        advisories: (unresolvedAdvisories.length > 0
          ? unresolvedAdvisories
          : advisories
        ).map((advisory) => ({ title: advisory.title, url: advisory.url })),
      });
    }
  }

  exceptions.forEach((exception, index) => {
    if (!matchedExceptionIndexes.has(index)) {
      errors.push(
        `Stale or unmatched exception for ${exception.package} (${exception.advisory}); remove it or verify the advisory mapping.`,
      );
    }
  });

  return { errors, findings };
}

function findAdvisories(packageName, vulnerabilities, visited = new Set()) {
  if (visited.has(packageName)) return [];
  visited.add(packageName);

  const advisoryMap = new Map();
  for (const entry of vulnerabilities[packageName]?.via ?? []) {
    if (typeof entry === "object" && entry !== null && entry.url) {
      advisoryMap.set(entry.url, entry);
    } else if (typeof entry === "string") {
      for (const advisory of findAdvisories(entry, vulnerabilities, visited)) {
        advisoryMap.set(advisory.url, advisory);
      }
    }
  }

  return [...advisoryMap.values()];
}

function validateExceptions(exceptions, now) {
  const errors = [];
  const seen = new Set();

  for (const exception of exceptions) {
    const key = `${exception.package}:${exception.advisory}`;
    if (
      !exception.package ||
      !exception.advisory ||
      !exception.reason ||
      !exception.owner ||
      !isValidExpiry(exception.expiresOn)
    ) {
      errors.push(
        "Each exception must specify package, advisory, reason, owner, and ISO expiry date.",
      );
      continue;
    }
    if (seen.has(key)) errors.push(`Duplicate exception for ${key}.`);
    seen.add(key);
    if (parseExpiry(exception.expiresOn) < now) {
      errors.push(
        `Expired exception for ${key}; remove it or renew it through review.`,
      );
    }
  }

  return errors;
}

function isValidExpiry(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const parsed = new Date(`${value}T23:59:59Z`);
  return (
    Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(value)
  );
}

function parseExpiry(value) {
  return new Date(`${value}T23:59:59Z`);
}

async function main() {
  const result = spawnSync("npm", ["audit", "--json"], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });

  if (result.error) {
    process.stderr.write(`Could not run npm audit: ${result.error.message}\n`);
    process.exitCode = 2;
    return;
  }

  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    process.stderr.write(
      "npm audit did not return valid JSON; failing closed.\n",
    );
    if (result.stderr) process.stderr.write(result.stderr);
    process.exitCode = 2;
    return;
  }

  const exceptionFile = JSON.parse(
    await readFile("security/dependency-exceptions.json", "utf8"),
  );
  const evaluation = evaluateAuditReport(
    report,
    exceptionFile.exceptions ?? [],
  );

  for (const error of evaluation.errors)
    process.stderr.write(`ERROR: ${error}\n`);
  for (const finding of evaluation.findings) {
    process.stderr.write(
      `[${finding.severity.toUpperCase()}] ${finding.package} (${finding.range}); fix available: ${JSON.stringify(finding.fixAvailable)}\n`,
    );
    if (finding.nodes?.length) {
      process.stderr.write(`  Lockfile paths: ${finding.nodes.join(", ")}\n`);
    }
    for (const advisory of finding.advisories) {
      process.stderr.write(
        `  ${advisory.title ?? "Advisory"}: ${advisory.url}\n`,
      );
    }
    if (finding.advisories.length === 0) {
      process.stderr.write(
        `  Dependency path: ${(finding.via ?? []).join(", ")}\n`,
      );
    }
  }

  if (evaluation.errors.length > 0 || evaluation.findings.length > 0) {
    process.stderr.write(
      "High and critical dependency findings block this check.\n",
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    "No unexcepted high or critical dependency vulnerabilities found.\n",
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
