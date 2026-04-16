# cPanel + NIM + GGUF Catalog Setup

This guide deploys your model catalog and unified API endpoint for website usage on cPanel.

## 1) Prepare model files

From trconnects root:

- Download 10 GGUF models:
  - ./model-hub/scripts/download_gguf_catalog.sh

## 2) Upload models to storage

### Option A: S3-compatible storage

Set env vars first:

- STORAGE_BUCKET
- STORAGE_PREFIX (optional)
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_ENDPOINT (if custom object storage)

Then run:

- ./model-hub/scripts/upload_gguf_to_s3.sh

### Option B: E2B-compatible custom storage API

Set env vars:

- E2B_API_KEY
- E2B_STORAGE_API_BASE

Then run:

- ./model-hub/scripts/upload_gguf_to_e2b_storage.sh

## 3) Build public model catalog

Set base URL where GGUF files are reachable:

- MODEL_PUBLIC_BASE_URL=https://your-storage-domain/gguf-models

Generate:

- ./model-hub/scripts/make_public_catalog.sh

This creates:
- model-hub/public-model-catalog.json

## 4) Deploy API to cPanel

Upload folder contents to your cPanel app path:

- cpanel-api/api.php
- cpanel-api/.htaccess
- model-hub/task-routing.json
- model-hub/public-model-catalog.json

Set environment values in cPanel app config:

- NIM_API_KEY
- NIM_API_HOST=https://integrate.api.nvidia.com/v1

## 5) Website usage

### Fetch model catalog

GET /api?action=models

### Chat request with task routing

POST /api?action=chat
Body:

{
  "task": "webapp",
  "messages": [
    { "role": "system", "content": "You are a senior app architect" },
    { "role": "user", "content": "Create production React+Node app structure" }
  ]
}

Optional forced model:

{
  "task": "webapp",
  "model": "qwen/qwen2.5-72b-instruct",
  "messages": [...]
}

## Important note on animation models

GGUF is for LLM text inference. Animation or video generation models are usually diffusion/video models, not GGUF.
Recommended approach:
- Use the animation_prompt task to generate high-quality prompts/storyboards with LLMs
- Send those prompts to your image/video generation backend
