const axios = require('axios');

class NIMService {
  constructor(config) {
    this.config = config;
    this.apiKey = config.apiKey;
    this.apiHost = (config.apiHost || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '');

    this.client = axios.create({
      baseURL: this.apiHost,
      timeout: 300000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (this.apiKey) {
      this.client.defaults.headers.common.Authorization = `Bearer ${this.apiKey}`;
    }
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  getTaskModels(task) {
    const profiles = this.config.taskProfiles || {};
    const selectedTask = task || this.config.defaultTask;
    const models = profiles[selectedTask] || profiles[this.config.defaultTask] || [];
    return { selectedTask, models };
  }

  async checkConnection() {
    if (!this.hasApiKey()) {
      return false;
    }

    try {
      const response = await this.client.get('/models');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async listModels() {
    const fallbackModels = Array.from(
      new Set(
        Object.values(this.config.taskProfiles || {}).flat()
      )
    ).map((name) => ({ id: name, name }));

    if (!this.hasApiKey()) {
      return fallbackModels;
    }

    try {
      const response = await this.client.get('/models');
      const data = response.data?.data || [];
      if (!Array.isArray(data) || data.length === 0) {
        return fallbackModels;
      }
      return data.map((item) => ({ id: item.id, name: item.id }));
    } catch (error) {
      return fallbackModels;
    }
  }

  async chat(model, messages, options = {}) {
    if (!this.hasApiKey()) {
      throw new Error('NIM API key not configured. Set NIM_API_KEY or NVIDIA_NIM_API_KEY.');
    }

    try {
      const payload = {
        model,
        messages: (messages || []).map((message) => ({
          role: message.role,
          content: Array.isArray(message.content)
            ? message.content
                .filter((part) => part && typeof part.text === 'string')
                .map((part) => part.text)
                .join('\n')
            : String(message.content || '')
        })),
        stream: false,
        ...options
      };

      const response = await this.client.post('/chat/completions', payload);
      const content = response.data?.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        return content;
      }

      if (Array.isArray(content)) {
        return content
          .map((part) => (typeof part?.text === 'string' ? part.text : ''))
          .join('\n');
      }

      return '';
    } catch (error) {
      const detail = error.response?.data?.error?.message || error.message;
      throw new Error(`NIM chat failed for model ${model}: ${detail}`);
    }
  }

  async chatWithTask(task, messages, options = {}) {
    const forcedModel = options.model;

    if (forcedModel) {
      const content = await this.chat(forcedModel, messages, options);
      return { content, model: forcedModel, task: task || this.config.defaultTask };
    }

    const { selectedTask, models } = this.getTaskModels(task);
    if (models.length === 0) {
      throw new Error(`No models configured for task profile: ${selectedTask}`);
    }

    const attempts = [];
    for (const model of models) {
      try {
        const content = await this.chat(model, messages, options);
        return { content, model, task: selectedTask };
      } catch (error) {
        attempts.push(error.message);
      }
    }

    throw new Error(`All models failed for task ${selectedTask}: ${attempts.join(' | ')}`);
  }

  async generateFromTask(task, prompt, systemPrompt, options = {}) {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return this.chatWithTask(task, messages, options);
  }
}

module.exports = NIMService;
