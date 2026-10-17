#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { highSecurityFindings } from "./check-codeql-sarif.mjs";

const highFixture = JSON.parse(
  await readFile("security/codeql-high-severity-fixture.sarif", "utf8"),
);
assert.equal(highSecurityFindings(highFixture).findings.length, 1);
const blockedFixtureRun = spawnSync(
  process.execPath,
  [
    "scripts/check-codeql-sarif.mjs",
    "security/codeql-high-severity-fixture.sarif",
  ],
  { encoding: "utf8" },
);
assert.equal(blockedFixtureRun.status, 1);
assert.match(blockedFixtureRun.stderr, /SAST threshold exceeded/);

const lowFixture = {
  runs: [
    {
      tool: {
        driver: {
          rules: [{ id: "js/low", properties: { "security-severity": "4.2" } }],
        },
      },
      results: [{ ruleId: "js/low" }],
    },
  ],
};
assert.equal(highSecurityFindings(lowFixture).findings.length, 0);
assert.match(
  highSecurityFindings({
    runs: [
      {
        tool: {
          driver: {
            rules: [
              { id: "js/bad", properties: { "security-severity": "high" } },
            ],
          },
        },
        results: [{ ruleId: "js/bad" }],
      },
    ],
  }).errors.join("\n"),
  /Invalid security-severity/,
);

const findingWithPath = {
  runs: [
    {
      tool: {
        driver: {
          rules: [
            { id: "js/high", properties: { "security-severity": "8.1" } },
          ],
        },
      },
      results: [
        {
          ruleId: "js/high",
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: "src/accepted-risk.js" },
              },
            },
          ],
        },
      ],
    },
  ],
};
const exceptionDocument = {
  exceptions: [
    {
      ruleId: "js/high",
      path: "src/accepted-risk.js",
      owner: "ArcShape maintainers",
      reason: "Synthetic narrow exception fixture",
      expires: "2027-10-17",
    },
  ],
};
assert.deepEqual(
  highSecurityFindings(findingWithPath, 7, exceptionDocument, "2026-10-17")
    .findings,
  [],
);
assert.notEqual(
  highSecurityFindings(findingWithPath, 7, exceptionDocument, "2027-10-18")
    .errors.length,
  0,
);

console.log(
  "CodeQL SARIF threshold fixtures passed (High fails; Medium passes).",
);
