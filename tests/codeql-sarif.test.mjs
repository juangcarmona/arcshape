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
});
