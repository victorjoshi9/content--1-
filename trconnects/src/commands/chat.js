const chalk = require('chalk');
const readline = require('readline');
const ora = require('ora');

class ChatCommand {
  constructor(ollama, claude, config) {
    this.ollama = ollama;
    this.claude = claude;
    this.config = config;
  }

  async execute(options) {
    const provider = options.model;
    const modelName = options.name;

    console.log(chalk.cyan('\n🚀 Starting Chat Session'));
    console.log(chalk.gray(`Provider: ${provider}`));
    if (modelName) {
      console.log(chalk.gray(`Model: ${modelName}`));
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
          let response;

          if (provider === 'claude') {
            response = await this.claude.chat(messages, { model: modelName });
          } else {
            const model = modelName || this.config.ollama.defaultModel;
            response = await this.ollama.chat(model, messages);
          }

          messages.push({ role: 'assistant', content: response });
          
          spinner.stop();
          console.log(chalk.green('Assistant: ') + response + '\n');
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
