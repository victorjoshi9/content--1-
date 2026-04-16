#!/usr/bin/env bash
set -euo pipefail

# Generic uploader for an E2B-compatible storage REST endpoint.
# Requires server-side endpoint that accepts:
#   PUT {E2B_STORAGE_API_BASE}/upload/{filename}
# with header: Authorization: Bearer {E2B_API_KEY}

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CATALOG="$ROOT_DIR/gguf-model-catalog.json"
SRC_DIR="${1:-$ROOT_DIR/downloads}"

: "${E2B_API_KEY:?Set E2B_API_KEY}"
: "${E2B_STORAGE_API_BASE:?Set E2B_STORAGE_API_BASE}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq first."
  exit 1
fi

jq -c '.models[]' "$CATALOG" | while read -r row; do
  file=$(echo "$row" | jq -r '.fileName')
  id=$(echo "$row" | jq -r '.id')
  source_file="$SRC_DIR/$file"

  if [[ ! -f "$source_file" ]]; then
    echo "[$id] missing file: $source_file"
    continue
  fi

  echo "[$id] uploading $file to E2B storage API"
  curl --fail -X PUT \
    -H "Authorization: Bearer $E2B_API_KEY" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@$source_file" \
    "$E2B_STORAGE_API_BASE/upload/$file"
done

echo "E2B upload completed."
