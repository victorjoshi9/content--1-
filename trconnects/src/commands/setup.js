const chalk = require('chalk');
const ora = require('ora');

class SetupCommand {
  constructor(nim, config) {
    this.nim = nim;
    this.config = config;
  }

  async execute(options) {
    console.log(chalk.cyan('\n🚀 trconnects Setup'));
    console.log(chalk.gray('Mode: NVIDIA NIM API only'));

    const keySpinner = ora('Checking NIM API key...').start();
    if (!this.nim.hasApiKey()) {
      keySpinner.fail(chalk.red('✗ NIM API key missing'));
      console.log(chalk.yellow('Set NIM_API_KEY (or NVIDIA_NIM_API_KEY) in your environment/.env'));
      process.exit(1);
    }
    keySpinner.succeed(chalk.green('✓ NIM API key configured'));

    const connectionSpinner = ora('Checking NVIDIA NIM connectivity...').start();
    const connected = await this.nim.checkConnection();
    if (!connected) {
      connectionSpinner.fail(chalk.red('✗ Unable to connect to NVIDIA NIM API'));
      console.log(chalk.yellow(`Host: ${this.config.nim.apiHost}`));
      console.log(chalk.yellow('Validate API key scope or NIM endpoint accessibility.'));
      process.exit(1);
    }
    connectionSpinner.succeed(chalk.green('✓ NVIDIA NIM connected'));

    if (options.validate) {
      await this.validateTaskProfiles();
    }

    console.log(chalk.cyan('\n✓ Setup complete (NIM-only mode)'));
  }

  async validateTaskProfiles() {
    console.log(chalk.cyan('\n🔍 Validating task profiles...'));
    const profiles = this.config.nim.taskProfiles;

    for (const [task, models] of Object.entries(profiles)) {
      const spinner = ora(`Checking ${task} (${models[0]})...`).start();
      try {
        await this.nim.chat(models[0], [{ role: 'user', content: 'Reply with: ok' }], { max_tokens: 8 });
        spinner.succeed(chalk.green(`✓ ${task} ready`));
      } catch (error) {
        spinner.warn(chalk.yellow(`⚠ ${task} first model unavailable: ${error.message}`));
      }
    }
  }
}

module.exports = SetupCommand;
