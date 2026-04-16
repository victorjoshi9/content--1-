const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

class SetupCommand {
  constructor(ollama, config) {
    this.ollama = ollama;
    this.config = config;
  }

  async execute(options) {
    console.log(chalk.cyan('\n🚀 trconnects Setup'));

    // Check Ollama connection
    const spinner = ora('Checking Ollama connection...').start();
    const connected = await this.ollama.checkConnection();
    
    if (!connected) {
      spinner.fail(chalk.red('✗ Ollama is not running!'));
      console.log(chalk.yellow('Start Ollama with: ollama serve'));
      process.exit(1);
    }
    
    spinner.succeed(chalk.green('✓ Ollama connected'));

    // Get current models
    const currentModels = await this.ollama.listModels();
    console.log(chalk.gray(`Current models: ${currentModels.length}`));

    if (options.all) {
      await this.installAllModels();
    } else if (options.models) {
      await this.installRecommendedModels();
    } else {
      await this.interactiveSetup();
    }
  }

  async interactiveSetup() {
    const choices = [
      {
        name: 'Install recommended models (fastest setup)',
        value: 'recommended'
      },
      {
        name: 'Install all available models',
        value: 'all'
      },
      {
        name: 'Manually select models',
        value: 'manual'
      },
      {
        name: 'Skip model installation',
        value: 'skip'
      }
    ];

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices
      }
    ]);

    switch (choice) {
      case 'recommended':
        await this.installRecommendedModels();
        break;
      case 'all':
        await this.installAllModels();
        break;
      case 'manual':
        await this.manualModelSelection();
        break;
      case 'skip':
        console.log(chalk.cyan('✓ Setup complete!'));
        break;
    }
  }

  async installRecommendedModels() {
    console.log(chalk.cyan('\n📥 Installing recommended models...'));
    const recommended = [
      'neural-chat:latest',  // Lightest, fastest
      'qwen2.5:latest',
      'qwen2.5-coder:latest'
    ];

    for (const model of recommended) {
      await this.installModel(model);
    }
  }

  async installAllModels() {
    console.log(chalk.cyan('\n📥 Installing all recommended models...'));
    const allModels = this.config.ollama.recommendedModels;

    for (const model of allModels) {
      await this.installModel(model);
    }
  }

  async manualModelSelection() {
    const allModels = this.config.ollama.recommendedModels;
    
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select models to install:',
        choices: allModels
      }
    ]);

    for (const model of selected) {
      await this.installModel(model);
    }
  }

  async installModel(modelName) {
    try {
      // Check if already exists
      const models = await this.ollama.listModels();
      if (models.some(m => m.name === modelName)) {
        console.log(chalk.gray(`⊘ ${modelName} already installed`));
        return;
      }

      console.log(chalk.blue(`⏳ Pulling ${modelName}...`));
      await this.ollama.pullModel(modelName);
      console.log(chalk.green(`✓ ${modelName} installed\n`));
    } catch (error) {
      console.log(chalk.red(`✗ Failed to install ${modelName}: ${error.message}\n`));
    }
  }
}

module.exports = SetupCommand;
