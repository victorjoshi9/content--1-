# trconnects 🚀

**Unified CLI for AI Development** — Seamlessly integrate Ollama, Claude, Qwen, and LLM models into your development workflow.

```
  ████████╗██████╗  ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗ ██████╗████████╗███████╗
  ╚══██╔══╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║╚██╗ ██╔╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
     ██║   ██████╔╝██║     ██║   ██║██╔██╗ ██║ ╚████╔╝ █████╗  ██║        ██║   █████╗  
     ██║   ██╔══██╗██║     ██║   ██║██║╚██╗██║  ╚██╔╝  ██╔══╝  ██║        ██║   ██╔══╝  
     ██║   ██║  ██║╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗╚██████╗   ██║   ███████╗
     ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
```

## Features

✨ **Multi-Model Support**
- Local Ollama models (Qwen, DeepSeek, Llama, etc.)
- Claude API integration (Opus, Sonnet, Haiku)
- LLM CLI integration
- Easy model switching

🎯 **Code Generation**
- React components
- API endpoints (Node.js/Python)
- Mobile apps (React Native)
- Database schemas (SQL)
- Custom code types

💬 **Interactive Chat**
- Real-time conversations with any model
- Context awareness
- Multiple conversation modes

⚙️ **Easy Setup**
- One-command installation
- Interactive setup wizard
- Auto-detect available models
- Configuration management

🔧 **Developer Friendly**
- Simple CLI interface
- JSON/text/markdown outputs
- Config file management
- Model management (pull, delete, info)

## Installation

### Prerequisites
- Node.js 14+ 
- npm
- [Ollama](https://ollama.ai) (optional but recommended)

### Quick Install

```bash
# Clone or download trconnects
cd trconnects

# Install globally
npm run setup

# Or install locally
npm install
npm start
```

### From npm (coming soon)
```bash
npm install -g trconnects
```

## Quick Start

### 1. Initialize Setup
```bash
trconnects setup --models
```

This will:
- Check Ollama connection
- Install recommended models
- Configure settings

### 2. List Available Models
```bash
trconnects list
trconnects ls --source ollama
```

### 3. Start Interactive Chat
```bash
trconnects chat
trconnects chat --model claude --name gpt-4
```

### 4. Generate Code
```bash
trconnects generate "create a React counter component" --type react
trconnects gen "FastAPI endpoint for user management" --type api --output api.py
```

## Commands

### `trconnects chat [options]`
Start interactive chat with selected model.

**Options:**
- `-m, --model <model>` - Provider: `ollama` or `claude` (default: ollama)
- `-n, --name <name>` - Specific model name (e.g., qwen2.5-coder, gpt-4)

**Examples:**
```bash
trconnects chat
trconnects chat --model claude --name claude-3-opus-20240229
trconnects chat --model ollama --name qwen2.5-coder:latest
```

### `trconnects generate <description> [options]`
Generate code based on description.

**Aliases:** `gen`

**Options:**
- `-m, --model <model>` - Provider: `ollama` or `claude` (default: ollama)
- `-n, --name <name>` - Specific model name
- `-t, --type <type>` - Code type: react, api, mobile, db, python, general
- `-o, --output <file>` - Save to file

**Examples:**
```bash
trconnects gen "React todo list app" --type react --output App.jsx
trconnects generate "Python FastAPI CRUD API" --type api --name claude-3-sonnet
trconnects gen "Mobile login screen" --type mobile --output LoginScreen.tsx
```

### `trconnects list [options]`
List all available models.

**Aliases:** `ls`

**Options:**
- `-s, --source <source>` - Source: `ollama`, `claude`, or `all` (default: all)

**Examples:**
```bash
trconnects list
trconnects ls --source ollama
trconnects ls --source claude
```

### `trconnects setup [options]`
Setup and configure trconnects.

**Options:**
- `-m, --models` - Install recommended models
- `-a, --all` - Install all available models

**Examples:**
```bash
trconnects setup
trconnects setup --models
trconnects setup --all
```

### `trconnects pull <model>`
Pull a model from Ollama Hub.

**Examples:**
```bash
trconnects pull qwen2.5-coder:latest
trconnects pull neural-chat:latest
```

### `trconnects status`
Check connection status to all AI services.

```bash
trconnects status
```

### `trconnects config [options]`
Manage configuration.

**Options:**
- `--list` - List all settings
- `--get <key>` - Get specific setting
- `--set <key=value>` - Set configuration

**Examples:**
```bash
trconnects config --list
trconnects config --get ollama.host
trconnects config --set ollama.defaultModel=neural-chat:latest
```

## Configuration

### Environment Variables

Create a `.env` file in the trconnects directory:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:latest

# Claude API Configuration
CLAUDE_API_KEY=sk-ant-...your-key-here...
CLAUDE_API_HOST=https://api.anthropic.com

# General Settings
AI_PROVIDER=ollama  # or claude
OUTPUT_FORMAT=text  # or json, markdown
DISABLE_COLORS=false
```

### Config File Location

Settings are stored in: `~/.trconnects/config.json`

## Model Selection Guide

| Task | Recommended Model | Provider |
|------|-------------------|----------|
| React/Vue Components | qwen2.5-coder | Ollama |
| Backend APIs | qwen2.5-coder | Ollama |
| Mobile Apps | qwen2.5-coder | Ollama |
| Complex Reasoning | claude-3-opus | Claude |
| Fast Responses | qwen2.5 | Ollama |
| Code Review | deepseek-coder-v2 | Ollama |
| Multilingual | glm4 | Ollama |

## Recommended Models

### For Ollama (Local)

**Lightweight & Fast:**
- `neural-chat:latest` - 4.1 GB, very fast
- `qwen2.5:latest` - 1.5 GB, general purpose

**Balanced:**
- `qwen2.5-coder:latest` - Best for coding
- `mistral:latest` - Good general purpose

**Advanced:**
- `deepseek-coder-v2:latest` - Advanced coding
- `codellama:latest` - Code specialization

### For Claude (API)

- `claude-3-opus-20240229` - Most powerful
- `claude-3-sonnet-20240229` - Balanced
- `claude-3-haiku-20240307` - Fast & cheap

## Examples

### Generate a React Component
```bash
trconnects gen "Create a responsive navbar with dark mode toggle" --type react --output Navbar.jsx
```

### Build an API
```bash
trconnects gen "Create a REST API for a blog with posts and comments" --type api --output blog-api.py
```

### Chat Session
```bash
trconnects chat --model ollama --name qwen2.5-coder

You: How do I optimize React performance?
Assistant: [Detailed response from Ollama...]
```

### Check Status
```bash
trconnects status
✓ Ollama: Connected (3 models)
✓ Claude: Configured
```

## Troubleshooting

### Ollama not running
**Error:** "Ollama not running on localhost:11434"

**Solution:**
```bash
# Start Ollama in another terminal
ollama serve

# Or on macOS:
open -a Ollama
```

### No models showing
**Error:** "No models found"

**Solution:**
```bash
# Pull a model
trconnects pull qwen2.5:latest

# Or setup with models
trconnects setup --models
```

### Claude API not working
**Error:** "Claude API key not configured"

**Solution:**
```bash
# Add your API key to .env
echo "CLAUDE_API_KEY=sk-ant-..." >> .env

# Or set via command
trconnects config --set claude.apiKey=sk-ant-...
```

### Port already in use
**Error:** "Port 11434 already in use"

**Solution:** Change Ollama port and update config:
```bash
OLLAMA_HOST=0.0.0.0:9000 ollama serve

# Update trconnects config
trconnects config --set ollama.host=http://localhost:9000
```

## Advanced Usage

### Integration with Your Project

```javascript
// In your Node.js project
const OllamaService = require('trconnects/src/services/ollama');
const config = require('trconnects/src/config');

const ollama = new OllamaService(config.ollama);

// Generate code
const code = await ollama.generate('qwen2.5-coder', 'create a function to validate emails');
console.log(code);
```

### Custom Model Prompts

Edit `src/commands/codegen.js` to add custom system prompts for your specific use cases.

### Batch Code Generation

Create a script to generate multiple components:

```bash
#!/bin/bash
trconnects gen "Header component" --type react --output Header.jsx
trconnects gen "Footer component" --type react --output Footer.jsx
trconnects gen "Sidebar component" --type react --output Sidebar.jsx
```

## Contributing

Contributions welcome! Please feel free to submit PRs or issues.

## License

MIT

## Support

- 📖 Documentation: See commands above
- 🐛 Issues: Report bugs and feature requests
- 💬 Discussions: Ask questions and share ideas

---

**Happy Coding! 🚀**

Made with ❤️ for developers who love local AI.
