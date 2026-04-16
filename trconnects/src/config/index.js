require('dotenv').config();

module.exports = {
  nim: {
    apiKey: process.env.NIM_API_KEY || process.env.NVIDIA_NIM_API_KEY || '',
    apiHost: process.env.NIM_API_HOST || 'https://integrate.api.nvidia.com/v1',
    defaultTask: process.env.NIM_DEFAULT_TASK || 'qwen_code_cli',
    modelPool: [
      'qwen/qwen2.5-coder-32b-instruct',
      'qwen/qwen2.5-72b-instruct',
      'meta/llama-3.1-8b-instruct',
      'meta/llama-3.1-70b-instruct',
      'meta/llama-3.1-405b-instruct',
      'nvidia/llama-3.1-nemotron-70b-instruct',
      'mistralai/mixtral-8x7b-instruct-v0.1',
      'mistralai/mistral-large-2-instruct',
      'google/gemma-2-27b-it',
      'deepseek/deepseek-r1-distill-llama-70b'
    ],
    taskProfiles: {
      web: [
        'qwen/qwen2.5-coder-32b-instruct',
        'meta/llama-3.1-70b-instruct',
        'mistralai/mixtral-8x7b-instruct-v0.1'
      ],
      webapp: [
        'qwen/qwen2.5-72b-instruct',
        'meta/llama-3.1-405b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct'
      ],
      android: [
        'qwen/qwen2.5-coder-32b-instruct',
        'deepseek/deepseek-r1-distill-llama-70b',
        'meta/llama-3.1-70b-instruct'
      ],
      chatbot: [
        'meta/llama-3.1-70b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'mistralai/mistral-large-2-instruct'
      ],
      ui_design: [
        'qwen/qwen2.5-72b-instruct',
        'mistralai/mistral-large-2-instruct',
        'google/gemma-2-27b-it'
      ],
      animation_prompt: [
        'meta/llama-3.1-405b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'qwen/qwen2.5-72b-instruct'
      ],
      qwen_code_cli: [
        'qwen/qwen2.5-coder-32b-instruct',
        'meta/llama-3.1-70b-instruct',
        'mistralai/mixtral-8x7b-instruct-v0.1'
      ],
      claude_cli_style: [
        'meta/llama-3.1-405b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'qwen/qwen2.5-coder-32b-instruct'
      ],
      ollama_launch_claude: [
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'meta/llama-3.1-70b-instruct',
        'qwen/qwen2.5-coder-32b-instruct'
      ],
      llm_studio: [
        'meta/llama-3.1-70b-instruct',
        'mistralai/mixtral-8x7b-instruct-v0.1',
        'qwen/qwen2.5-coder-32b-instruct'
      ],
      chat: [
        'meta/llama-3.1-8b-instruct',
        'meta/llama-3.1-70b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct'
      ],
      coding: [
        'qwen/qwen2.5-coder-32b-instruct',
        'meta/llama-3.1-70b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct'
      ],
      reasoning: [
        'meta/llama-3.1-405b-instruct',
        'nvidia/llama-3.1-nemotron-70b-instruct',
        'meta/llama-3.1-70b-instruct'
      ]
    }
  },
  llm: {
    configPath: process.env.LLM_CONFIG_PATH || '~/.llm/config.json'
  },
  general: {
    defaultProvider: 'nim',
    outputFormat: process.env.OUTPUT_FORMAT || 'text', // text, json, markdown
    colors: process.env.DISABLE_COLORS ? false : true
  }
};
