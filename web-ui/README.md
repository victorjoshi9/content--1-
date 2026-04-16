# Ollama Web UI - Lovable.dev-like Interface

A beautiful, modern Web UI for interacting with your local Ollama models.

## Features

- Multi-model support
- Beautiful dark theme
- Real-time chat interface
- Quick prompts for common tasks
- Status indicator for Ollama connection
- Code syntax highlighting

## Quick Start

### Prerequisites

1. Make sure Ollama is running:
```bash
ollama serve
```

2. Pull some models:
```bash
ollama pull qwen2.5-coder:latest
ollama pull qwen2.5:latest
ollama pull deepseek-coder-v2:latest
```

### Installation

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Start the server
npm run server
```

Or for development:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project Structure

```
web-ui/
├── src/
│   ├── App.jsx       # Main React component
│   ├── main.jsx      # Entry point
│   └── index.css     # Styles
├── dist/             # Built files (after npm run build)
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
├── server.js         # Node.js server with API proxy
└── package.json      # Dependencies
```

## Available Models

After pulling the models, they will automatically appear in the model selector:

- **qwen2.5-coder:latest** - Best for coding tasks
- **qwen2.5:latest** - General purpose
- **deepseek-coder-v2:latest** - Advanced coding
- **glm4:latest** - Multilingual support
- **nemotron-mini:latest** - NVIDIA optimized
- **codellama:latest** - Meta's code model
- **llama3.2:latest** - Fast general purpose

## API Endpoints

The server proxies these Ollama endpoints:

- `GET /api/tags` - List available models
- `POST /api/chat` - Send chat messages
- `POST /api/generate` - Generate text

## Customization

### Change the port
Edit `server.js` and change `PORT = 3000`

### Add custom quick prompts
Edit the `quickPrompts` array in `src/App.jsx`

### Modify the theme
Edit CSS variables in `src/index.css`

## Troubleshooting

### "Ollama not running" error
Make sure Ollama is running:
```bash
ollama serve
```

### No models showing up
Pull a model:
```bash
ollama pull qwen2.5-coder:latest
```

### Port already in use
Change the PORT in server.js or kill the process using port 3000.
