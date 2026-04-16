require('dotenv').config();

module.exports = {
  ollama: {
    host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    defaultModel: process.env.OLLAMA_MODEL || 'qwen2.5-coder:latest',
    recommendedModels: [
      'qwen2.5-coder:latest',  // Best for coding
      'qwen2.5:latest',         // General purpose
      'deepseek-coder-v2:latest', // Advanced coding
      'neural-chat:latest',     // Fast chat
      'mistral:latest',         // General purpose alternative
      'codellama:latest',       // Code specialization
    ]
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    apiHost: process.env.CLAUDE_API_HOST || 'https://api.anthropic.com',
    defaultModel: 'claude-3-sonnet-20240229'
  },
  llm: {
    configPath: process.env.LLM_CONFIG_PATH || '~/.llm/config.json'
  },
  general: {
    defaultProvider: process.env.AI_PROVIDER || 'ollama', // ollama, claude, llm
    outputFormat: process.env.OUTPUT_FORMAT || 'text', // text, json, markdown
    colors: process.env.DISABLE_COLORS ? false : true
  }
};
