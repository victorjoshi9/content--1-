# Railway Deployment

This repository is now ready for Railway deployment with a Docker-based Ollama + Web UI setup.

## Recommended model for Railway

Use:

```bash
qwen2.5-coder:1.5b
```

Why:
- Small enough for Railway's limited RAM
- Best fit for coding tasks
- Safer than larger 3B/7B class models

## Deploy steps

1. Push this repository to GitHub.
2. Create a Railway project from the GitHub repo.
3. Railway will read the root [railway.json](railway.json).
4. It will build using [docker-ollama/Dockerfile](docker-ollama/Dockerfile).
5. The container pulls `qwen2.5-coder:1.5b` automatically.
6. Open the public Railway URL.

## Files used

- [railway.json](railway.json)
- [docker-ollama/Dockerfile](docker-ollama/Dockerfile)
- [docker-ollama/start.sh](docker-ollama/start.sh)
- [web-ui](web-ui)

## Notes

- Do not use `qwen3.5` on Railway.
- If you need a general chat model, use `llama3.2:1b` instead.
- If Railway RAM is too tight, reduce the model further via the `MODELS` env var.

## Claude launcher helper

For local use, launch Claude with the same model pack by running:

```bash
bash launch_claude.sh
```

This helper starts Ollama if needed, pulls the Railway-safe model pack, and launches Claude with `qwen2.5-coder:1.5b` by default.
