import { createHash } from "node:crypto";
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
  ["Archify diagram route", `${base}diagrams/publication-boundaries.html`],
]) {
  if (!portal.includes(value)) throw new Error(`Portal is missing ${label}`);
}
if (portal.includes("__SOURCE_SHA__"))
  throw new Error("Portal source revision placeholder was not replaced");
const model = await readFile(resolve(out, "model/index.html"), "utf8");
const architecture = await readFile(
  resolve(out, "architecture/index.html"),
  "utf8",
);
if (!model.includes(sha) || !architecture.includes(sha))
  throw new Error(
    "Snapshot provenance does not match the publication revision",
  );
if (portal.includes("/es/") || (await readdir(out)).includes("es"))
  throw new Error("Public-site output leaked into the engineering artifact");
const assetDirectory = resolve(out, "assets");
const brandingAssets = ["arcshape-lockup.webp"];
const publishedAssets = await readdir(assetDirectory);
if (
  publishedAssets.slice().sort().join(",") !==
  brandingAssets.slice().sort().join(",")
)
  throw new Error(
    "Engineering output must contain only its theme-aware brand assets",
  );
if (
  !portal.includes(`${base}assets/arcshape-lockup.webp`) ||
  !portal.includes("AI driven engineering documentation")
)
  throw new Error("Engineering portal is missing its shared brand identity");

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

const diagramManifest = JSON.parse(
  await readFile(resolve(out, "diagrams/manifest.json"), "utf8"),
);
const candidate = JSON.parse(
  await readFile(
    resolve(
      ".archify/arcshape-publications/arcshape-publication-boundaries.json",
    ),
    "utf8",
  ),
);
const artifactPath = resolve(out, diagramManifest.artifact.path);
const diagram = await readFile(artifactPath, "utf8");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const candidateBytes = await readFile(diagramManifest.candidate.path);
if (sha256(candidateBytes) !== diagramManifest.candidate.sha256)
  throw new Error("Archify candidate hash does not match its manifest");
if (sha256(await readFile(artifactPath)) !== diagramManifest.artifact.sha256)
  throw new Error("Archify HTML hash does not match its manifest");
if (
  diagramManifest.generator.name !== "Archify" ||
  !/^3\.1\.0$/.test(diagramManifest.generator.version) ||
  diagramManifest.generator.repository !==
    "https://github.com/tt-a1i/archify" ||
  !/^[a-f0-9]{40}$/i.test(diagramManifest.generator.commit ?? "") ||
  diagramManifest.candidate.path !==
    ".archify/arcshape-publications/arcshape-publication-boundaries.json" ||
  diagramManifest.artifact.path !== "diagrams/publication-boundaries.html" ||
  candidate.meta.repository.url !== diagramManifest.source.repository ||
  candidate.meta.repository.revision !== diagramManifest.source.revision
)
  throw new Error(
    "Archify generator or source revision does not match its manifest",
  );
if (
  !diagram.includes('<meta name="generator" content="archify 3.1.0">') ||
  !diagram.includes("Archify 3.1.0 · source revision") ||
  !diagram.includes(
    `https://github.com/juangcarmona/arcshape/tree/${diagramManifest.source.revision}`,
  ) ||
  !diagram.includes(
    `https://github.com/juangcarmona/arcshape/blob/${diagramManifest.source.revision}/`,
  )
)
  throw new Error(
    "Archify renderer identity or source revision links are missing",
  );
for (const path of diagramManifest.licenses) await access(resolve(out, path));
if (/\b(?:href|src)="\/(?!\/)/i.test(diagram))
  throw new Error(
    "Archify artifact contains a root-absolute link that breaks at a subpath",
  );
console.log(`Engineering output verified at ${base} for ${sha}`);
