const chalk = require('chalk');
const readline = require('readline');
const ora = require('ora');

class ChatCommand {
  constructor(nim, config) {
    this.nim = nim;
    this.config = config;
  }

  async execute(options) {
    const task = options.task || options.model || this.config.nim.defaultTask;
    const modelName = options.name;
    const routed = this.nim.getTaskModels(task);

    console.log(chalk.cyan('\n🚀 Starting Chat Session'));
    console.log(chalk.gray('Provider: NVIDIA NIM'));
    console.log(chalk.gray(`Task: ${routed.selectedTask}`));
    if (!modelName) {
      console.log(chalk.gray(`Fallback chain: ${routed.models.join(' -> ')}`));
    }
    if (modelName) {
      console.log(chalk.gray(`Forced model: ${modelName}`));
    }
    console.log(chalk.gray('Type "exit" to quit\n'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const messages = [];

    const askQuestion = () => {
      rl.question(chalk.blue('You: '), async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log(chalk.cyan('\nGoodbye!'));
          rl.close();
          return;
        }

        if (!input.trim()) {
          askQuestion();
          return;
        }

        messages.push({ role: 'user', content: input });

        const spinner = ora('Thinking...').start();
        try {
          const result = await this.nim.chatWithTask(task, messages, { model: modelName });
          const response = result.content;

          messages.push({ role: 'assistant', content: response });
          
          spinner.stop();
          console.log(chalk.green(`Assistant (${result.model}): `) + response + '\n');
        } catch (error) {
          spinner.fail(chalk.red(`Error: ${error.message}`));
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

module.exports = ChatCommand;
