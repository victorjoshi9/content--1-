# Triconnects NIM Web UI

A web UI for your Triconnects platform using NVIDIA NIM API only.

## Features

- NVIDIA NIM API only (no Claude API, no Ollama API, no OpenAI API)
- Task-based 3-model routing profiles
- Real-time chat interface
- Profile switching for qwen_code_cli, claude_cli_style, ollama_launch_claude, llm_studio
- Force-model override when needed

## Quick Start

### Prerequisites

1. Set your NVIDIA NIM API key:

```bash
export NIM_API_KEY=nvapi-...
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

Then open http://localhost:3000 in your browser and connect with your NIM key.

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

## Task Profiles

Each profile routes requests through 3 assigned models in priority order:

- qwen_code_cli
- claude_cli_style
- ollama_launch_claude
- llm_studio
- chat
- coding
- reasoning

## API Endpoints

The server exposes these NIM-only endpoints:

- `POST /api/nim/models` - List available NIM models
- `POST /api/nim/chat` - Send chat with task-based model fallback
- `GET /api/nim/profiles` - Get task-to-model profile map

## Customization

### Change the port
Edit `server.js` and change `PORT = 3000`

### Add custom quick prompts
Edit the `quickPrompts` array in `src/App.jsx`

### Modify the theme
Edit CSS variables in `src/index.css`

## Troubleshooting

### "NIM key missing" error
Set your key:

```bash
export NIM_API_KEY=nvapi-...
```

### Port already in use
Change the PORT in server.js or kill the process using port 3000.
