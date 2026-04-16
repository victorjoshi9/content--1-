#!/usr/bin/env node

const chalk = require('chalk');

class MockOllamaService {
  constructor(config) {
    this.config = config;
  }

  async checkConnection() {
    return true;
  }

  async listModels() {
    return [{
      name: "qwen3.5:latest",
      model: "qwen3.5:latest",
      size: 6594474711,
      modified_at: "2026-04-14T22:33:03.597760838+05:30"
    }];
  }

  async chat(model, messages, options = {}) {
    // Simulate responses based on model and message
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    const responses = {
      'hello': 'Hello! How can I assist you today?',
      'hi': 'Hi there! What would you like to do?',
      'how are you': 'I\'m doing great! Ready to help you build amazing things.',
      'default': 'I\'m in demo mode with limited system memory. For full functionality, try installing a smaller model like "neural-chat:latest" (4.1 GB) or "phi:latest" (2.6 GB).'
    };

    return responses[lastMessage.toLowerCase()] || responses['default'];
  }

  async generate(model, prompt, options = {}) {
    // Generate mock code responses
    if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('world')) {
      return `function helloWorld() {
  console.log("Hello, World!");
  return "Hello, World!";
}

module.exports = helloWorld;`;
    }
    
    return `// Mock code generation - simulated response
// Full functionality available with adequate system memory
// Install smaller model: trconnects pull phi:latest`;
  }

  async pullModel(modelName) {
    throw new Error('Model pulling requires internet connectivity. System memory constraint: only 831 MB available, but most models require 2+ GB.');
  }

  async deleteModel(modelName) {
    return true;
  }

  async showModelInfo(modelName) {
    return {
      name: modelName,
      model: modelName,
      size: 6594474711,
      memory_required: '7.9 GB'
    };
  }
}

module.exports = MockOllamaService;
