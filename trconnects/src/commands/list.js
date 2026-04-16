const chalk = require('chalk');
const Table = require('cli-table3');
const ora = require('ora');

class ListCommand {
  constructor(nim, config) {
    this.nim = nim;
    this.config = config;
  }

  async execute(options) {
    const source = options.source;

    if (source === 'nim' || source === 'all') {
      await this.listNIMModels();
    }

    if (source === 'profiles' || source === 'all') {
      this.listTaskProfiles();
    }
  }

  async listNIMModels() {
    const spinner = ora('Fetching NVIDIA NIM models...').start();
    
    try {
      const models = await this.nim.listModels();
      spinner.stop();

      if (models.length === 0) {
        console.log(chalk.yellow('\n⚠ No NVIDIA NIM models available'));
        return;
      }

      console.log(chalk.cyan('\n📦 NVIDIA NIM Models:'));
      
      const table = new Table({
        head: [
          chalk.cyan('Model Name'),
          chalk.cyan('Type')
        ],
        style: { head: [] }
      });

      models.forEach(model => {
        const type = this.getModelType(model.id || model.name);
        table.push([
          chalk.green(model.id || model.name),
          chalk.blue(type)
        ]);
      });

      console.log(table.toString());
    } catch (error) {
      spinner.fail(chalk.red(`✗ Failed to fetch models: ${error.message}`));
    }
  }

  listTaskProfiles() {
    const profiles = this.config.nim.taskProfiles;
    console.log(chalk.cyan('\n🧠 Task Profiles (3-model routing):'));
    
    const table = new Table({
      head: [
        chalk.cyan('Task Profile'),
        chalk.cyan('Models (priority order)')
      ],
      style: { head: [] }
    });

    Object.entries(profiles).forEach(([task, models]) => {
      table.push([
        chalk.green(task),
        chalk.gray(models.join(' -> '))
      ]);
    });

    console.log(table.toString());
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
