#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CATALOG="$ROOT_DIR/gguf-model-catalog.json"
ROUTING="$ROOT_DIR/task-routing.json"
OUT="${1:-$ROOT_DIR/public-model-catalog.json}"
BASE_URL="${MODEL_PUBLIC_BASE_URL:-}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install jq first."
  exit 1
fi

if [[ -z "$BASE_URL" ]]; then
  echo "Set MODEL_PUBLIC_BASE_URL to generate downloadable URLs"
  exit 1
fi

jq --arg base "$BASE_URL" --slurpfile routing "$ROUTING" '
  . as $root |
  {
    version: $root.version,
    generatedAt: (now | todate),
    models: ($root.models | map(. + {downloadUrl: ($base + "/" + .fileName)})),
    taskRouting: $routing[0]
  }
' "$CATALOG" > "$OUT"

echo "Generated: $OUT"
