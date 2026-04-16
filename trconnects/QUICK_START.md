# Quick Start Guide

## 1. Installation (2 minutes)

```bash
cd trconnects
npm install
npm link  # Makes 'trconnects' globally available
```

## 2. Initialize Ollama (if not running)

```bash
# In another terminal
ollama serve
```

## 3. Setup Models (first time only)

```bash
trconnects setup --models
```

Or manually install models:
```bash
ollama pull qwen2.5:latest
ollama pull qwen2.5-coder:latest
ollama pull neural-chat:latest
```

## 4. Start Using

### Chat with AI
```bash
trconnects chat
```

### Generate Code
```bash
trconnects gen "React component for user profile" --type react
```

### List Models
```bash
trconnects list
```

### Check Status
```bash
trconnects status
```

---

## Common Commands

```bash
# Interactive chat
trconnects chat --model ollama --name qwen2.5-coder

# Generate React component (save to file)
trconnects gen "navigation menu" --type react --output Menu.jsx

# Generate API endpoint
trconnects gen "user authentication endpoint" --type api

# Generate Mobile screen
trconnects gen "login screen" --type mobile --output LoginScreen.tsx

# Generate database schema
trconnects gen "e-commerce shop schema" --type db

# With Claude AI
trconnects chat --model claude --name claude-3-opus

# List available models
trconnects ls

# Install more models
trconnects pull mistral:latest
```

---

## Environment Setup

Create `.env` file for custom settings:

```env
OLLAMA_HOST=http://localhost:11434
CLAUDE_API_KEY=your-key-here
AI_PROVIDER=ollama
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Ollama not running" | Run `ollama serve` in another terminal |
| No models available | Run `trconnects setup --models` |
| Module not found | Run `npm install` in trconnects directory |
| Claude not working | Add `CLAUDE_API_KEY` to `.env` |

---

**For full documentation, see README.md**
