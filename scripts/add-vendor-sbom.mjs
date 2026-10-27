import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

const [bomPath, inventoryPath] = process.argv.slice(2);
if (!bomPath || !inventoryPath)
  throw new Error(
    "Usage: add-vendor-sbom.mjs <bom.json> <installed-inventory.json>",
  );
const inventoryBytes = await readFile(inventoryPath);
const inventory = JSON.parse(inventoryBytes);
for (const [file, record] of Object.entries(inventory.files)) {
  if (file.includes("..") || file.startsWith("/"))
    throw new Error("Invalid vendor inventory path");
  const hash = createHash("sha256")
    .update(await readFile(join(dirname(inventoryPath), file)))
    .digest("hex");
  if (hash !== record.sha256)
    throw new Error(`Vendor integrity mismatch: ${file}`);
}
const bom = JSON.parse(await readFile(bomPath, "utf8"));
const ref = `archify:${inventory.revision}`;
if (bom.components.some((component) => component["bom-ref"] === ref))
  throw new Error("Vendor already inventoried");
bom.components.push({
  type: "library",
  name: "archify-renderer-subset",
  version: inventory.version,
  purl: `pkg:generic/archify-renderer-subset@${inventory.version}?revision=${inventory.revision}`,
  "bom-ref": ref,
  licenses: [{ license: { id: inventory.license } }],
  hashes: [
    {
      alg: "SHA-256",
      content: createHash("sha256").update(inventoryBytes).digest("hex"),
    },
  ],
  externalReferences: [
    { type: "vcs", url: `${inventory.source}/tree/${inventory.revision}` },
  ],
  properties: [{ name: "arcshape:tailoring", value: inventory.tailoring }],
});
const owner = bom.components.find(
  (component) => component.name === "@arcshape/cli",
);
if (!owner) throw new Error("Packed ArcShape component missing");
const dependency = bom.dependencies.find(
  (item) => item.ref === owner["bom-ref"],
);
if (!dependency) throw new Error("Packed ArcShape dependency entry missing");
dependency.dependsOn.push(ref);
bom.dependencies.push({ ref, dependsOn: [] });
await writeFile(bomPath, JSON.stringify(bom, null, 2) + "\n");
console.log("Verified and inventoried pinned Archify renderer subset (MIT)");
