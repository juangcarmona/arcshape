import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const selfTestOnly = args.length === 1 && args[0] === "--self-test";
const reportPath = selfTestOnly ? undefined : args[0];
const config = JSON.parse(
  await readFile(new URL("../stryker.config.json", import.meta.url), "utf8"),
);

if (selfTestOnly) {
  let rejectedZeroTestsMutant = false;
  try {
    validateReport(syntheticReport(), config.thresholds.break);
  } catch (error) {
    if (error.message.includes("0 tests")) rejectedZeroTestsMutant = true;
    else throw error;
  }
  if (!rejectedZeroTestsMutant)
    throw new Error("synthetic zero-tests mutant unexpectedly passed");
  validateReport(
    syntheticReport({ testsCompleted: 1 }),
    config.thresholds.break,
  );
  let rejectedBelowThreshold = false;
  try {
    validateReport(
      syntheticReport({ testsCompleted: 1, killed: 1, survived: 2 }),
      config.thresholds.break,
    );
  } catch (error) {
    if (error.message.includes("below break threshold"))
      rejectedBelowThreshold = true;
    else throw error;
  }
  if (!rejectedBelowThreshold)
    throw new Error("synthetic below-threshold score unexpectedly passed");
  process.stdout.write(
    "Mutation-report self-test passed (zero-test evidence and below-threshold scores are rejected).\n",
  );
} else if (!reportPath) {
  process.stderr.write(
    "Usage: node scripts/check-mutation-report.mjs <stryker-json-report> [--self-test]\n",
  );
  process.exitCode = 2;
} else {
  try {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    const summary = validateReport(report, config.thresholds.break);
    process.stdout.write(
      `Stryker report verified: ${summary.total} mutants; ${summary.killed} killed, ${summary.timeouts} timed out, ${summary.survived} survived, ${summary.noCoverage} without coverage; ${summary.executedTests} total test executions; mutation score ${summary.score.toFixed(2)}% (break threshold ${config.thresholds.break}%).\n`,
    );
  } catch (error) {
    process.stderr.write(
      `Invalid Stryker mutation evidence: ${error.message}\n`,
    );
    process.exitCode = 1;
  }
}

function validateReport(report, breakThreshold) {
  if (!report || typeof report.files !== "object" || !report.files)
    throw new Error("report has no files object");

  const summary = {
    total: 0,
    killed: 0,
    timeouts: 0,
    survived: 0,
    noCoverage: 0,
    executedTests: 0,
  };
  for (const file of Object.values(report.files)) {
    if (!file || typeof file.mutants !== "object" || !file.mutants)
      throw new Error("file entry has no mutants object");
    for (const mutant of Object.values(file.mutants)) {
      if (!Array.isArray(mutant.coveredBy))
        throw new Error(`missing coverage metadata for mutant ${mutant.id}`);
      if (
        mutant.coveredBy.length > 0 &&
        mutant.status === "Survived" &&
        (!Number.isInteger(mutant.testsCompleted) ||
          mutant.testsCompleted === 0)
      )
        throw new Error(
          `covered mutant ${mutant.id} ran 0 tests; refusing a false mutation score`,
        );
      summary.total += 1;
      summary.executedTests += Number.isInteger(mutant.testsCompleted)
        ? mutant.testsCompleted
        : 0;
      if (mutant.status === "Killed") summary.killed += 1;
      else if (mutant.status === "Timeout") summary.timeouts += 1;
      else if (mutant.status === "Survived") summary.survived += 1;
      else if (mutant.status === "NoCoverage") summary.noCoverage += 1;
    }
  }
  if (summary.total === 0) throw new Error("report contains no mutants");
  if (summary.killed === 0 && summary.timeouts === 0)
    throw new Error(
      "report contains no killed mutants; gate self-check is missing",
    );
  summary.score = ((summary.killed + summary.timeouts) / summary.total) * 100;
  if (summary.score < breakThreshold)
    throw new Error(
      `mutation score ${summary.score.toFixed(2)}% is below break threshold ${breakThreshold}%`,
    );
  return summary;
}

function syntheticReport({
  testsCompleted = 0,
  killed = 1,
  survived = 1,
} = {}) {
  const mutants = {};
  let id = 0;
  for (let index = 0; index < killed; index += 1) {
    id += 1;
    mutants[id] = {
      id: String(id),
      status: "Killed",
      testsCompleted: 1,
      coveredBy: ["test 1"],
    };
  }
  for (let index = 0; index < survived; index += 1) {
    id += 1;
    mutants[id] = {
      id: String(id),
      status: "Survived",
      testsCompleted,
      coveredBy: ["test 1"],
    };
  }
  return {
    files: {
      "fixture.mjs": {
        mutants,
      },
    },
  };
}
