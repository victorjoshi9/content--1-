#!/bin/bash

# Configuration
WEB_UI_PORT=${WEB_UI_PORT:-3001}  # Default to 3001 to avoid conflict
OLLAMA_HOST=${OLLAMA_HOST:-host.docker.internal:11434}

# Build the Docker image
echo "Building Ollama Web UI Docker image..."
docker build -t ollama-web-ui:latest .

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Build successful!"
echo ""

# Stop existing container if running
echo "Stopping existing container (if any)..."
docker stop ollama-web-ui 2>/dev/null || true
docker rm ollama-web-ui 2>/dev/null || true

echo ""
echo "Starting Ollama Web UI container on port ${WEB_UI_PORT}..."
echo ""

# Run the container
docker run -d \
    --name ollama-web-ui \
    -p ${WEB_UI_PORT}:3000 \
    -e OLLAMA_HOST=${OLLAMA_HOST} \
    -e PORT=3000 \
    --add-host=host.docker.internal:host-gateway \
    --restart unless-stopped \
    ollama-web-ui:latest

echo ""
echo "========================================="
echo "Ollama Web UI is now running!"
echo "Open http://localhost:${WEB_UI_PORT} in your browser"
echo ""
echo "To view logs: docker logs -f ollama-web-ui"
echo "To stop: docker stop ollama-web-ui"
echo "To remove: docker rm ollama-web-ui"
echo "========================================="
