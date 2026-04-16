#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$SCRIPT_DIR/.env.local" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$SCRIPT_DIR/.env.local"
  set +a
fi

MODEL_LIST="${MODELS:-qwen2.5-coder:1.5b,qwen2.5:1.5b,llama3.2:1b,tinyllama:latest}"
CLAUDE_MODEL="${CLAUDE_MODEL:-qwen2.5-coder:1.5b}"
OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"

wait_for_ollama() {
  local attempts=60
  until curl -sf "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; do
    if [[ $attempts -le 0 ]]; then
      echo "Ollama did not become ready at $OLLAMA_HOST" >&2
      exit 1
    fi
    sleep 2
    attempts=$((attempts - 1))
  done
}

ensure_ollama_running() {
  if curl -sf "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
    return 0
  fi

  echo "Starting Ollama server..."
  ollama serve >/tmp/ollama-claude.log 2>&1 &
  wait_for_ollama
}

pull_models() {
  IFS=',' read -ra MODELS_ARRAY <<< "$MODEL_LIST"
  for model in "${MODELS_ARRAY[@]}"; do
    if [[ -z "$model" ]]; then
      continue
    fi

    echo "Pulling model: $model"
    ollama pull "$model" || echo "Skipping $model (pull failed)"
  done
}

show_models() {
  echo "Available Ollama models:"
  ollama list || true
}

main() {
  if ! command -v ollama >/dev/null 2>&1; then
    echo "ollama command not found" >&2
    exit 1
  fi

  ensure_ollama_running
  pull_models
  show_models

  echo "Launching Claude with model: $CLAUDE_MODEL"
  exec ollama launch claude --model "$CLAUDE_MODEL" "$@"
}

main "$@"
