import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const out = resolve(process.argv[2] ?? "_site");
const sha = process.env.SOURCE_SHA ?? process.env.GITHUB_SHA;
const base = process.env.SITE_BASE ?? "/arcshape/";
if (!/^[a-f0-9]{40}$/i.test(sha ?? ""))
  throw new Error("SOURCE_SHA must be a full commit SHA");
if (!base.startsWith("/") || !base.endsWith("/"))
  throw new Error("SITE_BASE must start and end with a slash");

const portal = await readFile(resolve(out, "index.html"), "utf8");
for (const [label, value] of [
  ["source revision", sha],
  ["Product route", `${base}model/`],
  ["Architecture route", `${base}architecture/`],
]) {
  if (!portal.includes(value)) throw new Error(`Portal is missing ${label}`);
}
if (portal.includes("__SOURCE_SHA__"))
  throw new Error("Portal source revision placeholder was not replaced");
const model = await readFile(resolve(out, "model/index.html"), "utf8");
const architecture = await readFile(resolve(out, "architecture/index.html"), "utf8");
if (!model.includes(sha) || !architecture.includes(sha))
  throw new Error("Snapshot provenance does not match the publication revision");
if (portal.includes("/es/") || (await readdir(out)).includes("es"))
  throw new Error("Public-site output leaked into the engineering artifact");
if ((await readdir(out)).includes("assets"))
  throw new Error("Public-site assets leaked into the engineering artifact");

const summaryPath = resolve(out, "e2e/latest/summary.json");
let summary;
try {
  summary = JSON.parse(await readFile(summaryPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const cardTag = portal.match(/<a\b[^>]*\bid="e2e-card"[^>]*>/)?.[0];
if (!cardTag) throw new Error("Engineering portal lost the E2E summary card");
if (summary) {
  const keys = ["completed_at", "result", "run_id", "source_commit"];
  if (Object.keys(summary).sort().join(",") !== keys.join(","))
    throw new Error("Published E2E summary has fields outside the allowlist");
  if (!/^[a-f0-9]{40}$/i.test(summary.source_commit ?? ""))
    throw new Error("Published E2E source commit is invalid");
  if (cardTag.includes(" hidden"))
    throw new Error("Published E2E summary card is hidden");
  const e2eFiles = await readdir(resolve(out, "e2e/latest"));
  if (e2eFiles.some((file) => file !== "summary.json" && file !== "index.html"))
    throw new Error("Raw E2E report files must not be published");
} else if (!cardTag.includes(" hidden")) {
  throw new Error("E2E summary card is visible without an allowlisted summary");
}
await access(resolve(out, "model/index.html"));
await access(resolve(out, "architecture/index.html"));
console.log(`Engineering output verified at ${base} for ${sha}`);
