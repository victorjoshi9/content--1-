# Ollama + Web UI - Complete Docker Setup

A complete Docker setup that bundles Ollama server + Web UI with models, ready for cloud deployment.

## Quick Start (Local)

```bash
# Build and run locally
docker build -f docker-ollama/Dockerfile -t ollama-complete .
docker run -d -p 3000:3000 -p 11434:11434 -e MODELS="qwen2.5-coder:latest,qwen2.5:latest" ollama-complete
```

Open http://localhost:3000

## Free Cloud Deployment Options

### 1. Railway (Recommended for beginners)

**Free Tier:** $5/month credit, ~500 hours free

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your repository
4. Add `railway.json` configuration
5. Set environment variables:
   - `MODELS`: `qwen2.5-coder:latest,qwen2.5:latest`
6. Deploy!

**Recommended Railway model:** `qwen2.5-coder:1.5b`

Railway free/shared instances have limited RAM. Avoid larger models like `qwen3.5` or `7b` class models.
If you need a general-purpose model instead of a coding-focused one, use `llama3.2:1b`.

### 2. Render

**Free Tier:** Limited hours, auto-sleep

1. Go to https://render.com
2. Create new "Web Service"
3. Connect your repository
4. Use `render.yaml` configuration
5. Deploy

**Note:** Free instances sleep after 15 min inactivity

### 3. Fly.io

**Free Tier:** 3 shared VMs (256MB each) + $5 credit

```bash
# Install fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Create app
fly launch --no-deploy

# Create volume for models
fly volumes create ollama_data --size 10

# Deploy
fly deploy
```

### 4. Hugging Face Spaces (GPU)

**Free Tier:** CPU only (upgrade for GPU)

1. Go to https://huggingface.co/spaces
2. Create new Space → Docker runtime
3. Push this code to your Space
4. Request GPU upgrade (free for some projects)

### 5. Google Colab (Free GPU!)

See `ollama-colab.ipynb` for notebook setup.

### 6. E2B Sandbox

E2B is for code execution sandboxes, not model hosting. Use their SDK to call your deployed Ollama:

```python
from e2b import Sandbox

sandbox = Sandbox()
# Call your deployed Ollama endpoint
response = sandbox.commands.run("curl http://your-ollama-url:11434/api/generate -d ...")
```

## Model Size Guide

| Model | Size | Min RAM | Recommended For |
|-------|------|---------|-----------------|
| qwen2.5-coder:1.5b | 986MB | 2GB | Best Railway coding model |
| llama3.2:1b | 1GB | 2GB | Best Railway general-purpose model |
| qwen2.5-coder:3b | 2GB | 4GB | Coding |
| qwen2.5:3b | 2GB | 4GB | General |
| qwen2.5-coder:7b | 4GB | 8GB | Production coding |
| llama3.2:3b | 2GB | 4GB | Fast responses |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MODELS` | `qwen2.5-coder:latest` | Comma-separated list of models to pull |
| `OLLAMA_HOST` | `localhost:11434` | Ollama server address |
| `PORT` | `3000` | Web UI port |

## Custom Models

Edit `start.sh` or set `MODELS` env var:

```bash
# Multiple models
MODELS="qwen2.5-coder:latest,deepseek-coder-v2:latest,llama3.2:latest"

# Specific quantization (smaller)
MODELS="qwen2.5-coder:1.5b,llama3.2:1b"
```

## Claude Launcher Helper

If you want to use `ollama launch claude`, use the repo helper:

```bash
bash launch_claude.sh
```

Default launcher model pack:

- `qwen2.5-coder:1.5b`
- `qwen2.5:1.5b`
- `llama3.2:1b`
- `tinyllama:latest`

Override the Claude model or model pack if needed:

```bash
CLAUDE_MODEL=llama3.2:1b bash launch_claude.sh
MODELS="qwen2.5-coder:1.5b,llama3.2:1b" bash launch_claude.sh
```

## Troubleshooting

### Container crashes on startup
- Increase memory limit (models need RAM to load)
- Use smaller quantized models (Q4_K_M, Q3_K_M)

### Models take forever to pull
- Add volume persistence to avoid re-pulling
- Use smaller models

### "Out of memory" error
- Reduce model size
- Increase container memory limit
- Use quantized models

## Cost Optimization

1. **Use quantized models** - Q4_K_M or Q3_K_M versions are 50-70% smaller
2. **Auto-sleep** - Configure auto-stop on cloud platforms
3. **Volume persistence** - Store models to avoid re-downloading
4. **Start small** - Test with 1B models before scaling up
