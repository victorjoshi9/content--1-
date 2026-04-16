# Multi-Model Development Setup

## Available Models

This project is configured to use multiple AI models via Ollama for different development tasks:

### Primary Coding Models
- **Qwen 2.5 Coder** (`ollama://qwen2.5-coder:latest`) - Default model for all coding tasks
- **DeepSeek Coder V2** (`ollama://deepseek-coder-v2:latest`) - Complex algorithms and advanced patterns

### General Purpose Models
- **Qwen 2.5** (`ollama://qwen2.5:latest`) - Architecture planning, documentation
- **Llama 3.2** (`ollama://llama3.2:latest`) - Quick tasks, brainstorming

### Specialized Models
- **GLM-4** (`ollama://glm4:latest`) - Multilingual support, Asian language projects
- **Nemotron Mini** (`ollama://nemotron-mini:latest`) - NVIDIA-optimized code generation
- **Code Llama** (`ollama://codellama:latest`) - Meta's code-specialized model
- **SuperGemma 4** (`hf.co/Jiunsong/supergemma4-26b-uncensored-gguf-v2:Q4_K_M`) - Uncensored Gemma variant

### Reasoning Models (Distilled Claude-style)
- **Qwen3.5-27B-Claude-4.6-Opus-Reasoning-Distilled** - Claude-style reasoning model

## Usage by Project Type

### Web Applications
```bash
# Default: Qwen 2.5 Coder for React, Node.js, Python backends
# For complex features: DeepSeek Coder V2
```

### Mobile Apps
```bash
# React Native/Flutter: Qwen 2.5 Coder
# Native iOS (Swift): Code Llama or Qwen 2.5 Coder
# Native Android (Kotlin): DeepSeek Coder V2
```

### Websites / Landing Pages
```bash
# Static sites: Qwen 2.5 (faster)
# Interactive sites: Qwen 2.5 Coder
```

### AI-Powered Web UI (like lovable.dev)
```bash
# Use the Web UI at http://localhost:3000
# Frontend components: Qwen 2.5 Coder
# AI integration logic: DeepSeek Coder V2
```

## Ollama Web UI

A lovable.dev-like interface is available in the `web-ui/` directory:

```bash
cd web-ui
npm install
npm run build
npm run server
```

Then open http://localhost:3000

## Ollama Commands

```bash
# List all models
ollama list

# Run a specific model
ollama run qwen2.5-coder:latest

# Check model info
ollama show qwen2.5-coder:latest

# Remove a model
ollama rm <model-name>

# Pull from HuggingFace
ollama pull hf.co/<user>/<model>:<tag>
```

## Model Selection Guide

| Task Type | Recommended Model |
|-----------|-------------------|
| Frontend (React/Vue) | Qwen 2.5 Coder |
| Backend (Node/Python) | Qwen 2.5 Coder |
| Mobile (React Native) | Qwen 2.5 Coder |
| Mobile (Swift/Kotlin) | DeepSeek Coder V2 |
| Database/SQL | Qwen 2.5 Coder |
| DevOps/Docker | Qwen 2.5 |
| Documentation | Qwen 2.5 |
| Code Review | DeepSeek Coder V2 |
| Quick fixes | Llama 3.2 |
| Complex reasoning | Qwen3.5-Distilled |

## Note on Claude Models

**Claude Opus 4.6 and Sonnet 4.6** are Anthropic's proprietary models and cannot be run locally via Ollama. They are only available through:
- Anthropic API (https://console.anthropic.com)
- Amazon Bedrock
- Google Cloud Vertex AI

However, distilled versions like `Qwen3.5-27B-Claude-4.6-Opus-Reasoning-Distilled` provide Claude-like reasoning capabilities locally.

## Quick Start

1. Start Ollama:
```bash
ollama serve
```

2. Start the Web UI:
```bash
cd web-ui
npm run server
```

3. Open http://localhost:3000
