import { describe, expect, it } from "vitest";
import { highSecurityFindings } from "../scripts/check-codeql-sarif.mjs";

describe("CodeQL security threshold", () => {
  const rule = {
    id: "js/remote-property-injection",
    properties: { "security-severity": "7.5" },
  };
  const result = {
    ruleId: rule.id,
    message: { text: "Untrusted dictionary key" },
    locations: [
      { physicalLocation: { artifactLocation: { uri: "viewer.html" } } },
    ],
  };
  it.each(["driver", "extension"])(
    "blocks High findings whose rule metadata lives in the %s",
    (component) => {
      const tool =
        component === "driver"
          ? { driver: { rules: [rule] } }
          : {
              driver: {},
              extensions: [
                { name: "codeql/javascript-queries", rules: [rule] },
              ],
            };
      const report = highSecurityFindings({
        runs: [{ tool, results: [result] }],
      });
      expect(report.findings).toEqual([
        expect.objectContaining({ ruleId: rule.id, severity: 7.5 }),
      ]);
      expect(report.errors).toEqual([]);
    },
  );
  it("does not misclassify lower-severity findings as High", () => {
    const lower = { ...rule, properties: { "security-severity": "6.5" } };
    expect(
      highSecurityFindings({
        runs: [
          {
            tool: { driver: {}, extensions: [{ rules: [lower] }] },
            results: [result],
          },
        ],
      }).findings,
    ).toEqual([]);
  });
  it("limits an expiring exception to one rule and path", () => {
    const path =
      "packages/cli/assets/archify/renderers/shared/atomic-output.mjs";
    const race = { ...rule, id: "js/file-system-race" };
    const resultAt = (uri) => ({
      ...result,
      ruleId: race.id,
      locations: [{ physicalLocation: { artifactLocation: { uri } } }],
    });
    const report = {
      runs: [
        {
          tool: { driver: { rules: [race] } },
          results: [resultAt(path), resultAt("other.mjs")],
        },
      ],
    };
    const exceptions = {
      exceptions: [
        {
          ruleId: race.id,
          path,
          owner: "maintainer",
          reason: "Reviewed upstream code",
          expires: "2026-11-26",
        },
      ],
    };
    const active = highSecurityFindings(report, 7, exceptions, "2026-10-27");
    expect(active.usedExceptions).toHaveLength(1);
    expect(active.findings).toEqual([
      expect.objectContaining({ path: "other.mjs" }),
    ]);
    const expired = highSecurityFindings(report, 7, exceptions, "2026-11-27");
    expect(expired.findings).toHaveLength(2);
    expect(expired.errors).toContain(
      `Stale CodeQL exception: ${race.id} at ${path}`,
    );
  });
});
