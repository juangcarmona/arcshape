import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const arg = process.argv.indexOf("--out");
const out = resolve(arg >= 0 ? process.argv[arg + 1] : "_site");
const sha = process.env.SOURCE_SHA ?? process.env.GITHUB_SHA;
if (!/^[a-f0-9]{40}$/i.test(sha ?? ""))
  throw new Error("SOURCE_SHA must be a full commit SHA");
await mkdir(out, { recursive: true });
await rm(resolve(out, "e2e/latest"), { recursive: true, force: true });
const portal = (
  await readFile("src/engineering-portal/index.html", "utf8")
).replaceAll("__SOURCE_SHA__", sha);
await writeFile(resolve(out, "index.html"), portal);

async function readSafeSummary(
  file,
  expectedRunId,
  expectedSourceCommit,
  expectedCompletedAt,
  publicProjection = false,
) {
  try {
    const raw = JSON.parse(await readFile(file, "utf8"));
    const keys = publicProjection
      ? ["completed_at", "result", "run_id", "source_commit"]
      : ["completed_at", "repository", "result", "run_id", "source_commit"];
    if (Object.keys(raw).sort().join(",") !== keys.sort().join(","))
      throw new Error("Unexpected E2E summary fields");
    if (
      (!publicProjection && raw.repository !== "juangcarmona/arcshape") ||
      !Number.isSafeInteger(raw.run_id) ||
      raw.run_id < 1 ||
      (expectedRunId && raw.run_id !== Number(expectedRunId))
    )
      throw new Error(
        "E2E run identity does not match the selected repository run",
      );
    if (expectedSourceCommit && raw.source_commit !== expectedSourceCommit)
      throw new Error("E2E source commit does not match the selected run");
    const completedAt = expectedCompletedAt || raw.completed_at;
    if (
      !/^[a-f0-9]{40}$/i.test(raw.source_commit) ||
      typeof completedAt !== "string" ||
      !Number.isFinite(Date.parse(completedAt)) ||
      !["success", "failure"].includes(raw.result)
    )
      throw new Error("Malformed E2E summary");
    return { ...raw, completed_at: completedAt };
  } catch (error) {
    if (error.code !== "ENOENT")
      console.warn(`E2E summary rejected (${file}): ${error.message}`);
    return null;
  }
}

const candidates =
  process.env.DISABLE_E2E_SUMMARY === "true"
    ? []
    : await Promise.all([
        readSafeSummary(
          resolve(".e2e-latest/summary.json"),
          process.env.SELECTED_RUN_ID,
          process.env.SELECTED_SOURCE_COMMIT,
          process.env.SELECTED_COMPLETED_AT,
        ),
        readSafeSummary(
          resolve(".e2e-carry-forward/summary.json"),
          undefined,
          undefined,
          undefined,
          true,
        ),
      ]);
const raw = candidates.filter(Boolean).sort((a, b) => b.run_id - a.run_id)[0];
if (raw) {
  const publicSummary = {
    run_id: raw.run_id,
    source_commit: raw.source_commit,
    completed_at: new Date(raw.completed_at).toISOString(),
    result: raw.result,
  };
  await mkdir(resolve(out, "e2e/latest"), { recursive: true });
  await writeFile(
    resolve(out, "e2e/latest/summary.json"),
    `${JSON.stringify(publicSummary, null, 2)}\n`,
  );
  const summary = `<main><h1>Latest end-to-end run</h1><dl><dt>Result</dt><dd>${publicSummary.result}</dd><dt>Source commit</dt><dd><a href="https://github.com/juangcarmona/arcshape/commit/${publicSummary.source_commit}">${publicSummary.source_commit}</a></dd><dt>Completed</dt><dd>${publicSummary.completed_at}</dd><dt>Run</dt><dd><a href="https://github.com/juangcarmona/arcshape/actions/runs/${publicSummary.run_id}">GitHub Actions run ${publicSummary.run_id}</a></dd></dl><p>Only this allowlisted summary is public. Detailed reports and traces remain in Actions.</p><p><a href="../../">Back to engineering portal</a></p></main>`;
  await writeFile(
    resolve(out, "e2e/latest/index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ArcShape E2E summary</title><style>body{font:1rem/1.6 system-ui,sans-serif;max-width:50rem;margin:4rem auto;padding:0 1.5rem;color:#17243a}dt{font-weight:700;margin-top:1rem}a{color:#2854d7}:focus-visible{outline:3px solid #e5a900;outline-offset:3px}</style>${summary}</html>`,
  );
  const updated = portal.replace(
    'id="e2e-card" href="e2e/latest/" hidden',
    'id="e2e-card" href="e2e/latest/"',
  );
  await writeFile(resolve(out, "index.html"), updated);
}

const required = ["index.html", "model/index.html", "architecture/index.html"];
for (const path of required) {
  const content = await readFile(resolve(out, path), "utf8");
  if (!content.trim())
    throw new Error(`Required Pages route is empty: ${path}`);
}
const model = await readFile(resolve(out, "model/index.html"), "utf8");
const architecture = await readFile(
  resolve(out, "architecture/index.html"),
  "utf8",
);
if (!model.includes(sha) || !architecture.includes(sha))
  throw new Error(
    "Snapshot provenance does not match the publication revision",
  );
console.log(`Engineering portal assembled from ${sha} at ${out}`);
