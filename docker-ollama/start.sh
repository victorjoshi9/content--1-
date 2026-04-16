#!/bin/bash
set -e

echo "Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama to be ready..."
sleep 5

# Pull models (customize this list based on your needs)
echo "Pulling models..."

# Railway-safe defaults: keep this tiny for low-RAM containers.
# Best coding model for Railway: qwen2.5-coder:1.5b
MODELS="${MODELS:-qwen2.5-coder:1.5b}"

IFS=',' read -ra MODEL_ARRAY <<< "$MODELS"
for model in "${MODEL_ARRAY[@]}"; do
    echo "Pulling model: $model"
    ollama pull "$model" || echo "Failed to pull $model, continuing..."
done

echo "All models pulled!"

# Start Web UI
echo "Starting Web UI..."
cd /app/web-ui
PORT=3000 node server.js &

# Wait for any process to exit
wait
