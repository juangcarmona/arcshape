set -euo pipefail

fixture_directory="$(mktemp -d)"
trap 'rm -rf "$fixture_directory"' EXIT
printf 'AWS_ACCESS_KEY_ID=%s%s\n' 'AKIAIOSFODNN7' 'EXAMPLE' > "$fixture_directory/synthetic.txt"

set +e
docker run --rm -v "$fixture_directory:/tmp" -w /tmp ghcr.io/trufflesecurity/trufflehog:3.99.2 \
  filesystem /tmp/synthetic.txt --fail --no-update --no-verification --github-actions \
  > "$RUNNER_TEMP/trufflehog-synthetic-fixture.log" 2>&1
scanner_status=$?
set -e

if [ "$scanner_status" -ne 183 ]; then
  cat "$RUNNER_TEMP/trufflehog-synthetic-fixture.log"
  printf 'Expected the secret scanner to block the synthetic fixture; got exit code %s.\n' "$scanner_status" >&2
  exit 1
fi

printf 'Secret scanner blocked the harmless synthetic fixture.\n'
