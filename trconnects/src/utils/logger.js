const chalk = require('chalk');

class Logger {
  static info(message) {
    console.log(chalk.blue('ℹ ') + message);
  }

  static success(message) {
    console.log(chalk.green('✓ ') + message);
  }

  static warn(message) {
    console.log(chalk.yellow('⚠ ') + message);
  }

  static error(message) {
    console.log(chalk.red('✗ ') + message);
  }

  static section(title) {
    console.log('\n' + chalk.cyan('─'.repeat(50)));
    console.log(chalk.cyan(title));
    console.log(chalk.cyan('─'.repeat(50)) + '\n');
  }

  static code(code) {
    console.log(chalk.gray(code));
  }
}

module.exports = Logger;
