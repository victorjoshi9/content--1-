#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
API_DIR="$ROOT_DIR/api"
API_PID_FILE="$ROOT_DIR/.sandbox-api.pid"

DOCKER_COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
fi

if [[ ! -f .env ]]; then
  echo "Missing .env. Run scripts/init_sandbox.sh first."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed."
  exit 1
fi

if [[ -n "$DOCKER_COMPOSE_CMD" ]]; then
  echo "Starting sandbox services (MinIO + Postgres)..."
  $DOCKER_COMPOSE_CMD up -d
else
  echo "Warning: Docker Compose not found. Starting API-only mode (no MinIO/Postgres)."
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run sandbox API."
  exit 1
fi

if [[ ! -d "$API_DIR" ]]; then
  echo "Missing sandbox API directory at $API_DIR"
  exit 1
fi

if [[ ! -d "$API_DIR/node_modules" ]]; then
  echo "Installing sandbox API dependencies..."
  (cd "$API_DIR" && npm install)
fi

if [[ -f "$API_PID_FILE" ]] && kill -0 "$(cat "$API_PID_FILE")" >/dev/null 2>&1; then
  echo "Sandbox API is already running with PID $(cat "$API_PID_FILE")"
else
  echo "Starting sandbox API on port $(grep '^SANDBOX_API_PORT=' .env | cut -d'=' -f2)..."
  (cd "$API_DIR" && nohup npm start > "$ROOT_DIR/data/sandbox-api.log" 2>&1 & echo $! > "$API_PID_FILE")
fi

echo "Sandbox started."
echo "Sandbox API:   http://localhost:$(grep '^SANDBOX_API_PORT=' .env | cut -d'=' -f2)"
if [[ -n "$DOCKER_COMPOSE_CMD" ]]; then
  echo "MinIO API:     http://localhost:$(grep '^MINIO_API_PORT=' .env | cut -d'=' -f2)"
  echo "MinIO Console: http://localhost:$(grep '^MINIO_CONSOLE_PORT=' .env | cut -d'=' -f2)"
  echo "Postgres Port: $(grep '^POSTGRES_PORT=' .env | cut -d'=' -f2)"
fi
