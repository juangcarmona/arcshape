#!/usr/bin/env bash
set -euo pipefail

output_dir=${1:?Usage: generate-release-sbom.sh <output-directory>}
mkdir -p "$output_dir"
temporary_dir=$(mktemp -d "${TMPDIR:-/tmp}/arcshape-release-sbom.XXXXXX")
trap 'rm -rf "$temporary_dir"' EXIT

test "$(npm --version)" = "10.9.9"
version=$(node -p "JSON.parse(require('node:fs').readFileSync('package.json', 'utf8')).version")
metadata=$(npm pack --json --pack-destination "$temporary_dir")
tarball_name=$(node -e 'const fs=require("node:fs");const input=fs.readFileSync(0,"utf8");process.stdout.write(JSON.parse(input)[0].filename)' <<<"$metadata")
tarball="$temporary_dir/$tarball_name"
consumer_dir="$temporary_dir/consumer"
mkdir -p "$consumer_dir"
(cd "$consumer_dir" && npm init --yes >/dev/null)
npm install --prefix "$consumer_dir" --ignore-scripts --no-audit --no-fund "$tarball"
npm sbom --prefix "$consumer_dir" --sbom-format=cyclonedx --omit=dev > "$output_dir/arcshape-$version-sbom.cdx.json"

node - "$output_dir/arcshape-$version-sbom.cdx.json" "@arcshape/cli" "$version" <<'NODE'
const fs = require("node:fs");
const [file, expectedName, expectedVersion] = process.argv.slice(2);
const bom = JSON.parse(fs.readFileSync(file, "utf8"));
const packageComponent = bom.components?.find(
  (component) =>
    component.name === expectedName && component.version === expectedVersion,
);
if (!packageComponent) {
  throw new Error(`SBOM does not contain packed package ${expectedName}@${expectedVersion}`);
}
const registryTarball = `https://registry.npmjs.org/@arcshape/cli/-/cli-${expectedVersion}.tgz`;
for (const reference of packageComponent.externalReferences ?? []) {
  if (reference.type === "distribution" && reference.url?.startsWith("file:")) {
    reference.url = registryTarball;
  }
}
fs.writeFileSync(file, `${JSON.stringify(bom, null, 2)}\n`);
if (!Array.isArray(bom.components) || bom.components.length < 2) {
  throw new Error("SBOM has no runtime components");
}
console.log(`Generated CycloneDX SBOM containing ${expectedName}@${expectedVersion} and ${bom.components.length - 1} runtime dependencies.`);
NODE
