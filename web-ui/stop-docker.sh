#!/bin/bash

echo "Stopping Ollama Web UI container..."
docker stop ollama-web-ui 2>/dev/null && echo "Container stopped" || echo "Container was not running"

echo "Removing container..."
docker rm ollama-web-ui 2>/dev/null && echo "Container removed" || echo "Container did not exist"

echo ""
echo "To start again, run: ./run-docker.sh"
