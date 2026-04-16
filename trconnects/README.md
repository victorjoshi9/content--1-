# trconnects 🚀

NVIDIA NIM-first CLI for coding and app development with task-based 3-model routing.

## What this build does

- Uses NVIDIA NIM API only (no Claude API, no OpenAI API, no Ollama API)
- Supports task profiles where each task has 3 assigned models (priority fallback)
- Includes a 10-model GGUF catalog and cloud upload pipeline
- Includes cPanel-ready API proxy for website hosting
- Covers your requested workflows:
  - web
  - webapp
  - android
  - chatbot
  - ui_design
  - animation_prompt
  - qwen_code_cli
  - claude_cli_style (behavior profile name only, still NIM models)
  - ollama_launch_claude (behavior profile name only, still NIM models)
  - llm_studio
- Supports interactive chat and code generation with automatic model fallback

## Install

```bash
cd trconnects
npm install
npm start
```

## Configure

Create `.env`:

```env
NIM_API_KEY=nvapi-...
NIM_API_HOST=https://integrate.api.nvidia.com/v1
NIM_DEFAULT_TASK=qwen_code_cli
```

## Commands

### Setup / status

```bash
trconnects setup
trconnects setup --validate
trconnects status
```

### List models and task profiles

```bash
trconnects list
trconnects list --source nim
trconnects list --source profiles
```

### Chat with task routing

```bash
trconnects chat --task qwen_code_cli
trconnects chat --task llm_studio
trconnects chat --task coding --name qwen/qwen2.5-coder-32b-instruct
```

### Generate code

```bash
trconnects generate "Create a React dashboard" --type react --task qwen_code_cli
trconnects gen "Build FastAPI auth endpoints" --type api --task claude_cli_style
trconnects gen "Create SQL schema for ecommerce" --type db --task llm_studio --output schema.sql
```

## Task Profiles (3-model fallback)

- web
- webapp
- android
- chatbot
- ui_design
- animation_prompt
- qwen_code_cli
- claude_cli_style
- ollama_launch_claude
- llm_studio
- chat
- coding
- reasoning

See `src/config/index.js` to customize assigned models.

## GGUF Model Hub

Model catalog and routing files:

- model-hub/gguf-model-catalog.json
- model-hub/task-routing.json

Scripts:

- model-hub/scripts/download_gguf_catalog.sh
- model-hub/scripts/upload_gguf_to_s3.sh
- model-hub/scripts/upload_gguf_to_e2b_storage.sh
- model-hub/scripts/make_public_catalog.sh

Full cPanel deployment guide:

- model-hub/CPANEL_NIM_SETUP.md

## cPanel API

Use cpanel-api/api.php to expose a unified website API.

Endpoints:

- GET /api?action=health
- GET /api?action=models
- POST /api?action=chat

## Notes

- `pull` command is intentionally a no-op because NIM is hosted API-only.
- If the first model fails, trconnects automatically tries model 2, then model 3.
