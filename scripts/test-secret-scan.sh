set -euo pipefail

fixture_directory="$(mktemp -d)"
trap 'rm -rf "$fixture_directory"' EXIT
cat > "$fixture_directory/detectors.yml" <<'EOF'
detectors:
  - name: arcshape-synthetic-secret
    keywords:
      - ARCSHAPE_SYNTHETIC_SECRET
    regex:
      arcshape-synthetic-secret: '(?i)ARCSHAPE_SYNTHETIC_SECRET[ \t]*=[ \t]*([a-z0-9]{16,})'
EOF
printf 'ARCSHAPE_SYNTHETIC_SECRET=ArcShapeFixtureValue1234567890\n' > "$fixture_directory/synthetic.txt"

set +e
docker run --rm -v "$fixture_directory:/tmp" -w /tmp ghcr.io/trufflesecurity/trufflehog:3.99.2 \
  filesystem /tmp/synthetic.txt --config /tmp/detectors.yml --fail --no-update --no-verification --github-actions \
  > "$RUNNER_TEMP/trufflehog-synthetic-fixture.log" 2>&1
scanner_status=$?
set -e

if [ "$scanner_status" -ne 183 ]; then
  cat "$RUNNER_TEMP/trufflehog-synthetic-fixture.log"
  printf 'Expected the secret scanner to block the synthetic fixture; got exit code %s.\n' "$scanner_status" >&2
  exit 1
fi

printf 'Secret scanner blocked the harmless synthetic fixture.\n'
