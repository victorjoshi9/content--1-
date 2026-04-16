#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env. Run scripts/init_sandbox.sh first."
  exit 1
fi

E2B_API_KEY=$(grep '^E2B_API_KEY=' .env | cut -d'=' -f2-)
SANDBOX_API_PORT=$(grep '^SANDBOX_API_PORT=' .env | cut -d'=' -f2-)

if [[ -z "$E2B_API_KEY" ]]; then
  echo "E2B_API_KEY is empty in .env"
  exit 1
fi

if [[ -z "$SANDBOX_API_PORT" ]]; then
  SANDBOX_API_PORT=8787
fi

echo "Checking local sandbox API health..."
HEALTH_CODE=$(curl -s -o /tmp/sandbox_health.json -w "%{http_code}" \
  "http://localhost:$SANDBOX_API_PORT/health")

if [[ "$HEALTH_CODE" != "200" ]]; then
  echo "Sandbox API health check failed. HTTP $HEALTH_CODE"
  cat /tmp/sandbox_health.json || true
  exit 1
fi

echo "Running sandbox execution check..."
EXEC_CODE=$(curl -s -o /tmp/sandbox_exec.json -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"E2B sandbox OK\")"}' \
  "http://localhost:$SANDBOX_API_PORT/execute")

if [[ "$EXEC_CODE" != "200" ]]; then
  echo "Sandbox execute check failed. HTTP $EXEC_CODE"
  cat /tmp/sandbox_exec.json || true
  exit 1
fi

echo "E2B sandbox API is working (HTTP 200)."
