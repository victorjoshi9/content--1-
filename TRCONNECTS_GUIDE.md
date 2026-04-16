# trconnects Integration Guide

## Full Project Setup

You now have a complete **trconnects** CLI system that integrates:

### ✅ Core Components Installed

1. **Ollama Integration** ✓
   - Local model management
   - Chat, code generation, text completion
   - Currently: qwen3.5:latest (6.14 GB)

2. **Claude API Support** ✓
   - Ready for configuration
   - Set `CLAUDE_API_KEY` in `.env` to enable

3. **LLM CLI Compatible** ✓
   - Architecture ready for llm integration
   - Can be extended with LLM commands

4. **Qwen Models** ✓
   - Ready to install and use
   - Optimized for code generation

### 📦 Quick Reference

**View Available Commands**
```bash
trconnects --help
```

**List Models**
```bash
trconnects list
```

**Check Status**
```bash
trconnects status
```

**Pull New Model** (Recommended for faster responses)
```bash
trconnects pull neural-chat:latest
```

### 💬 Start Interactive Chat
```bash
# With current model
trconnects chat

# With specific model
trconnects chat --model ollama --name qwen3.5:latest
```

### 🎯 Generate Code

```bash
# React component
trconnects gen "counter component with hooks" --type react

# Python function
trconnects gen "fibonacci sequence generator" --type python --output fib.py

# API endpoint
trconnects gen "REST API for user management" --type api

# Mobile app
trconnects gen "login screen" --type mobile --output LoginScreen.jsx

# Database schema
trconnects gen "social media app schema" --type db
```

### 🔧 Configuration

**Environment Variables** (`.env` file):
```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3.5:latest
CLAUDE_API_KEY=sk-ant-...your-key...
AI_PROVIDER=ollama
OUTPUT_FORMAT=text
```

**Config Commands**:
```bash
# List all settings
trconnects config --list

# Get specific setting
trconnects config --get ollama.host

# Set configuration
trconnects config --set ollama.defaultModel=neural-chat:latest
```

### 🚀 Recommended Next Steps

**1. Install Fast Models**
```bash
# These are smaller and faster for testing
trconnects pull neural-chat:latest   # 4.1 GB
trconnects pull qwen2.5:latest        # 1.5 GB
```

**2. Configure Claude (Optional)**
- Get API key from https://console.anthropic.com
- Add to `.env`: `CLAUDE_API_KEY=sk-ant-...`

**3. Create Alias** (to use 'trconnects' globally)
```bash
# Edit your shell config file:
nano ~/.bashrc  # or ~/.zshrc

# Add this line:
alias trconnects='node /home/madhusudan/Downloads/content\ \(1\)/trconnects/bin/trconnects'

# Reload shell:
source ~/.bashrc  # or ~/.zshrc
```

### 📋 Project Structure

```
trconnects/
├── bin/
│   └── trconnects          # Main executable
├── src/
│   ├── index.js            # CLI entry point
│   ├── config/             # Configuration
│   ├── services/           # Ollama & Claude services
│   ├── commands/           # CLI commands
│   ├── utils/              # Helper utilities
├── scripts/
│   ├── setup.js            # Interactive setup
│   └── install-global.js   # Global installation
├── package.json            # Dependencies
├── README.md              # Full documentation
├── QUICK_START.md         # Quick start guide
└── .env.example           # Environment template
```

### 🎮 Advanced Usage

**Using in Node.js Projects**
```javascript
const OllamaService = require('./src/services/ollama');
const config = require('./src/config');

const ollama = new OllamaService(config.ollama);

// Generate code
const result = await ollama.generate('qwen3.5:latest', 
  'create a hello world in javascript');
console.log(result);
```

**Batch Operations**
```bash
#!/bin/bash
# create-components.sh

trconnects gen "Header with logo" --type react --output Header.jsx
trconnects gen "Navigation menu" --type react --output Nav.jsx  
trconnects gen "Footer with links" --type react --output Footer.jsx
```

### 🔐 Security Notes

- Keep `CLAUDE_API_KEY` encrypted in CI/CD
- `.env` file is not committed to git
- All Ollama models run locally (no data sent externally)

### 📞 Support

**Commands Help**
```bash
trconnects help [command]
```

**Examples**
```bash
trconnects help chat
trconnects help generate
trconnects help setup
```

---

## Summary

You now have a powerful, unified CLI that:
- ✅ Connects to local Ollama models
- ✅ Supports Claude API (when configured)
- ✅ Generates code for React, API, Mobile, Databases, Python
- ✅ Interactive chat with any model
- ✅ Model management (pull, list, delete)
- ✅ Full configuration management
- ✅ Beautiful CLI with colors and tables

**Ready to build amazing things! 🚀**
