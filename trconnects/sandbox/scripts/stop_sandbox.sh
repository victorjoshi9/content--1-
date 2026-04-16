#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
API_PID_FILE="$ROOT_DIR/.sandbox-api.pid"

DOCKER_COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
	DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
	DOCKER_COMPOSE_CMD="docker-compose"
fi

if [[ -f "$API_PID_FILE" ]]; then
	API_PID=$(cat "$API_PID_FILE")
	if kill -0 "$API_PID" >/dev/null 2>&1; then
		echo "Stopping sandbox API (PID $API_PID)..."
		kill "$API_PID"
	fi
	rm -f "$API_PID_FILE"
fi

echo "Stopping sandbox services..."
if [[ -n "$DOCKER_COMPOSE_CMD" ]]; then
	$DOCKER_COMPOSE_CMD down
else
	echo "Docker Compose not found. Skipping container shutdown."
fi

echo "Sandbox stopped."
