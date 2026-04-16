#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
EXAMPLE_FILE="$ROOT_DIR/.env.example"

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$EXAMPLE_FILE" "$ENV_FILE"
  echo "Created $ENV_FILE from template."
fi

echo "Enter your E2B API key (input hidden):"
read -r -s E2B_KEY
if [[ -z "$E2B_KEY" ]]; then
  echo "E2B API key cannot be empty."
  exit 1
fi

if grep -q '^E2B_API_KEY=' "$ENV_FILE"; then
  sed -i "s|^E2B_API_KEY=.*|E2B_API_KEY=$E2B_KEY|" "$ENV_FILE"
else
  echo "E2B_API_KEY=$E2B_KEY" >> "$ENV_FILE"
fi

echo "API key saved to $ENV_FILE"
echo "Next: run scripts/start_sandbox.sh"
