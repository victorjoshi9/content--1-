const axios = require('axios');
const chalk = require('chalk');

class ClaudeService {
  constructor(config) {
    this.config = config;
    this.apiKey = config.apiKey;
    this.apiHost = config.apiHost;
    this.defaultModel = config.defaultModel;

    if (this.apiKey) {
      this.client = axios.create({
        baseURL: this.apiHost,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 300000
      });
    }
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  async checkConnection() {
    if (!this.hasApiKey()) {
      return false;
    }
    try {
      // Simple check - list available models
      const response = await this.client.get('/models');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async chat(messages, options = {}) {
    if (!this.hasApiKey()) {
      throw new Error('Claude API key not configured. Set CLAUDE_API_KEY environment variable.');
    }

    try {
      const payload = {
        model: options.model || this.defaultModel,
        max_tokens: options.maxTokens || 2048,
        messages,
        ...options
      };

      const response = await this.client.post('/messages', payload);
      
      if (response.data.content && response.data.content.length > 0) {
        return response.data.content[0].text;
      }
      return '';
    } catch (error) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async generateCode(description, codeType = 'general', options = {}) {
    const systemPrompt = `You are an expert code generator. Generate high-quality, production-ready code.
Code type: ${codeType}
Return only the code, no explanations.`;

    const messages = [
      {
        role: 'user',
        content: `Generate ${codeType} code for: ${description}`
      }
    ];

    return this.chat(messages, {
      ...options,
      system: systemPrompt
    });
  }
}

module.exports = ClaudeService;
