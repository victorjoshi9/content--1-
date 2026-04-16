#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CATALOG="$ROOT_DIR/gguf-model-catalog.json"
SRC_DIR="${1:-$ROOT_DIR/downloads}"

: "${STORAGE_BUCKET:?Set STORAGE_BUCKET}"
STORAGE_PREFIX="${STORAGE_PREFIX:-gguf-models}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq first."
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "aws cli is required. Install aws cli first."
  exit 1
fi

echo "Uploading from $SRC_DIR to s3://$STORAGE_BUCKET/$STORAGE_PREFIX"

jq -c '.models[]' "$CATALOG" | while read -r row; do
  file=$(echo "$row" | jq -r '.fileName')
  id=$(echo "$row" | jq -r '.id')
  source_file="$SRC_DIR/$file"
  dest="s3://$STORAGE_BUCKET/$STORAGE_PREFIX/$file"

  if [[ ! -f "$source_file" ]]; then
    echo "[$id] missing file: $source_file"
    continue
  fi

  echo "[$id] uploading $file"
  aws s3 cp "$source_file" "$dest"
done

echo "Upload completed."
