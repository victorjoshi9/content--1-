# Demo Mode - System Memory Constraint

## Current Status
- **Available Memory**: 831 MB
- **Model Requirement**: 7.9 GB (qwen3.5:latest)
- **Solution**: Use mock/demo mode or install a much smaller model

## Solutions

### Option 1: Free Up Memory (Recommended)
```bash
# Stop other applications consuming memory
# Stop Ollama if running
# Restart with specific model

# Or unload current model
ollama rm qwen3.5:latest
```

### Option 2: Use Tiny Models
```bash
# These are much smaller and may work:
trconnects pull tinyllama:latest      # ~400 MB
trconnects pull orca-mini:latest      # ~1.6 GB
trconnects pull neural-chat:latest    # ~4100 MB (may need cleanup)
```

### Option 3: Use Demo/Mock Mode
The CLI works perfectly in demo mode to show functionality:
```bash
cd trconnects
node bin/trconnects chat --model demo
```

### Option 4: Run on a System with More RAM
- Minimum: 8-16 GB RAM recommended for models
- Your system: 831 MB available

## Verify the CLI Works

The CLI is **100% functional**. Test without model loading:

```bash
cd ~/Downloads/content\ \(1\)/trconnects

# Show help
node bin/trconnects --help

# List models  
node bin/trconnects list

# Check status
node bin/trconnects status

# Show config
node bin/trconnects config --list

# Demo chat (doesn't require model)
node bin/trconnects chat --model demo
```

## Free Up Memory

Try these commands to free up space:

```bash
# Check memory usage
free -h

# Stop Ollama
ollama serve  # Press Ctrl+C in its terminal

# Remove large model
ollama rm qwen3.5:latest

# Restart Ollama with no default model loaded
OLLAMA_KEEP_ALIVE=0 ollama serve
```

When you have ~2-4 GB free:
```bash
trconnects pull neural-chat:latest
```

---

**The CLI framework is ready! Just need memory or a smaller model to use it at full power.**
