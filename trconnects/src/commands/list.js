const chalk = require('chalk');
const Table = require('cli-table3');
const ora = require('ora');

class ListCommand {
  constructor(ollama, claude, config) {
    this.ollama = ollama;
    this.claude = claude;
    this.config = config;
  }

  async execute(options) {
    const source = options.source;

    if (source === 'ollama' || source === 'all') {
      await this.listOllamaModels();
    }

    if (source === 'claude' || source === 'all') {
      await this.listClaudeModels();
    }
  }

  async listOllamaModels() {
    const spinner = ora('Fetching Ollama models...').start();
    
    try {
      const models = await this.ollama.listModels();
      spinner.stop();

      if (models.length === 0) {
        console.log(chalk.yellow('\n⚠ No Ollama models installed'));
        console.log(chalk.gray('Run: trconnects pull <model>'));
        return;
      }

      console.log(chalk.cyan('\n📦 Ollama Models:'));
      
      const table = new Table({
        head: [
          chalk.cyan('Model Name'),
          chalk.cyan('Size'),
          chalk.cyan('Modified'),
          chalk.cyan('Type')
        ],
        style: { head: [] }
      });

      models.forEach(model => {
        const size = this.formatBytes(model.size);
        const type = this.getModelType(model.name);
        table.push([
          chalk.green(model.name),
          chalk.yellow(size),
          chalk.gray(new Date(model.modified_at).toLocaleDateString()),
          chalk.blue(type)
        ]);
      });

      console.log(table.toString());
    } catch (error) {
      spinner.fail(chalk.red(`✗ Failed to fetch models: ${error.message}`));
    }
  }

  async listClaudeModels() {
    if (!this.claude.hasApiKey()) {
      console.log(chalk.yellow('\n⚠ Claude API not configured'));
      return;
    }

    const models = [
      { name: 'claude-3-opus-20240229', description: 'Most powerful, best for complex tasks' },
      { name: 'claude-3-sonnet-20240229', description: 'Balanced, good for most tasks' },
      { name: 'claude-3-haiku-20240307', description: 'Fast, efficient, lower cost' }
    ];

    console.log(chalk.cyan('\n🔵 claude Models:'));
    
    const table = new Table({
      head: [
        chalk.cyan('Model Name'),
        chalk.cyan('Description')
      ],
      style: { head: [] }
    });

    models.forEach(model => {
      table.push([
        chalk.green(model.name),
        chalk.gray(model.description)
      ]);
    });

    console.log(table.toString());
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getModelType(modelName) {
    if (modelName.includes('coder')) return 'Code';
    if (modelName.includes('gpt')) return 'Chat';
    if (modelName.includes('chat')) return 'Chat';
    if (modelName.includes('qwen')) return 'General';
    if (modelName.includes('deepseek')) return 'Code';
    return 'General';
  }
}

module.exports = ListCommand;
