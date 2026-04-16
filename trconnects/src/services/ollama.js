const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

class OllamaService {
  constructor(config) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.host,
      timeout: 300000, // 5 minutes for long-running model pulls
    });
  }

  async checkConnection() {
    try {
      const response = await this.client.get('/api/tags');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async listModels() {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }

  async chat(model, messages, options = {}) {
    try {
      const payload = {
        model,
        messages,
        stream: false,
        ...options
      };

      const response = await this.client.post('/api/chat', payload);
      return response.data.message?.content || '';
    } catch (error) {
      throw new Error(`Chat failed: ${error.message}`);
    }
  }

  async generate(model, prompt, options = {}) {
    try {
      const payload = {
        model,
        prompt,
        stream: false,
        ...options
      };

      const response = await this.client.post('/api/generate', payload);
      return response.data.response || '';
    } catch (error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
  }

  async pullModel(modelName) {
    try {
      const spinner = ora(`Pulling ${modelName}...`).start();
      
      const response = await this.client.post('/api/pull', {
        name: modelName,
        stream: false
      });

      spinner.succeed(chalk.green(`✓ Model ${modelName} pulled successfully`));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteModel(modelName) {
    try {
      await this.client.delete(`/api/delete`, {
        data: { name: modelName }
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }

  async showModelInfo(modelName) {
    try {
      const response = await this.client.post('/api/show', {
        name: modelName
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }
}

module.exports = OllamaService;
