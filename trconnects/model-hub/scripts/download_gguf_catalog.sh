#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CATALOG="$ROOT_DIR/gguf-model-catalog.json"
OUT_DIR="${1:-$ROOT_DIR/downloads}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq first."
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "Downloading GGUF models to: $OUT_DIR"

jq -c '.models[]' "$CATALOG" | while read -r row; do
  repo=$(echo "$row" | jq -r '.hfRepo')
  file=$(echo "$row" | jq -r '.fileName')
  id=$(echo "$row" | jq -r '.id')

  url="https://huggingface.co/$repo/resolve/main/$file"
  target="$OUT_DIR/$file"

  echo "[$id] $file"
  if [[ -f "$target" ]]; then
    echo "  already exists, skipping"
    continue
  fi

  curl -L --fail --retry 3 --output "$target" "$url"
done

echo "Done."
