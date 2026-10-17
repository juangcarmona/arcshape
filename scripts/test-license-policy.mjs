#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { evaluateLicensePolicy } from "./check-license-policy.mjs";

const policy = { allowedLicenses: ["MIT", "Apache-2.0"] };
const noExceptions = { exceptions: [] };
const component = (purl, license) => ({
  purl,
  licenses: license ? [{ license: { id: license } }] : [],
});

const allowed = evaluateLicensePolicy(
  { components: [component("pkg:npm/example@1.0.0", "MIT")] },
  policy,
  noExceptions,
  "2026-10-17",
);
assert.deepEqual(allowed.errors, []);

const denied = evaluateLicensePolicy(
  JSON.parse(
    await readFile("security/fixtures/license-disallowed.sbom.json", "utf8"),
  ),
  policy,
  noExceptions,
  "2026-10-17",
);
assert.match(denied.errors.join("\n"), /GPL-3\.0-only/);

const unknown = evaluateLicensePolicy(
  { components: [component("pkg:npm/fixture-unknown@1.0.0")] },
  policy,
  noExceptions,
  "2026-10-17",
);
assert.match(unknown.errors.join("\n"), /No usable SPDX license/);

const exception = {
  exceptions: [
    {
      purl: "pkg:npm/fixture-unknown@1.0.0",
      licenseOverride: "MIT",
      owner: "ArcShape maintainers",
      reason: "Synthetic test exception",
      evidence: "fixture",
      expires: "2027-10-17",
    },
  ],
};
const excepted = evaluateLicensePolicy(
  { components: [component("pkg:npm/fixture-unknown@1.0.0")] },
  policy,
  exception,
  "2026-10-17",
);
assert.deepEqual(excepted.errors, []);
assert.equal(excepted.warnings.length, 1);

const expired = evaluateLicensePolicy(
  { components: [component("pkg:npm/fixture-unknown@1.0.0")] },
  policy,
  { exceptions: [{ ...exception.exceptions[0], expires: "2026-10-16" }] },
  "2026-10-17",
);
assert.notEqual(expired.errors.length, 0);

assert.equal(
  evaluateLicensePolicy(
    {
      components: [
        {
          purl: "pkg:npm/fixture-expression@1.0.0",
          licenses: [{ license: { expression: "(MPL-2.0 OR Apache-2.0)" } }],
        },
      ],
    },
    policy,
    noExceptions,
    "2026-10-17",
  ).errors.length,
  0,
);

const staleException = evaluateLicensePolicy(
  { components: [component("pkg:npm/another@1.0.0", "MIT")] },
  policy,
  exception,
  "2026-10-17",
);
assert.match(staleException.errors.join("\n"), /Stale license exception/);

const compound = evaluateLicensePolicy(
  {
    components: [
      {
        purl: "pkg:npm/fixture-compound@1.0.0",
        licenses: [{ expression: "(MIT) AND Apache-2.0" }],
      },
    ],
  },
  policy,
  noExceptions,
  "2026-10-17",
);
assert.deepEqual(compound.errors, []);

assert.notDeepEqual(
  evaluateLicensePolicy({ components: [] }, policy, noExceptions).errors,
  [],
);

console.log("License policy synthetic fixtures passed.");
