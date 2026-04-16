# Ollama Claude Launcher

This repository now includes a helper for `ollama launch claude` that also pulls a small model set automatically.

## Script

Use:

```bash
bash launch_claude.sh
```

## Default model pack

The launcher pulls these models by default:

- `qwen2.5-coder:1.5b`
- `qwen2.5:1.5b`
- `llama3.2:1b`
- `tinyllama:latest`

## Default Claude model

The launcher starts Claude with:

- `qwen2.5-coder:1.5b`

Override it like this:

```bash
CLAUDE_MODEL=llama3.2:1b bash launch_claude.sh
```

## Custom model list

You can override the pulled models with `MODELS`:

```bash
MODELS="qwen2.5-coder:1.5b,llama3.2:1b" bash launch_claude.sh
```

## Notes

- The script starts `ollama serve` if it is not already running.
- It waits for the API to come up before pulling models.
- It is designed for low-RAM systems and Railway-safe model sizes.
