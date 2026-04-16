#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const path = require('path');

console.log(chalk.cyan('\n🚀 trconnects Setup Wizard\n'));

async function setup() {
  try {
    // Check Ollama
    console.log(chalk.blue('Checking Ollama installation...'));
    try {
      execSync('ollama --version', { stdio: 'ignore' });
      console.log(chalk.green('✓ Ollama detected\n'));
    } catch (e) {
      console.log(chalk.yellow('⚠ Ollama not found. Install from: https://ollama.ai\n'));
    }

    // Install dependencies
    console.log(chalk.blue('Installing npm dependencies...'));
    execSync('npm install', { cwd: __dirname + '/..', stdio: 'inherit' });
    console.log(chalk.green('✓ Dependencies installed\n'));

    // Setup questions
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installModels',
        message: 'Install recommended Ollama models? (this may take time)',
        default: true
      },
      {
        type: 'confirm',
        name: 'setupClaude',
        message: 'Configure Claude API? (optional)',
        default: false
      }
    ]);

    if (answers.setupClaude) {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your Claude API key (from console.anthropic.com):'
        }
      ]);

      const envPath = path.join(__dirname, '..', '.env');
      const envContent = `CLAUDE_API_KEY=${apiKey}\n`;
      require('fs').writeFileSync(envPath, envContent);
      console.log(chalk.green('✓ Claude API key saved\n'));
    }

    if (answers.installModels) {
      console.log(chalk.blue('\nStarting Ollama model installation...'));
      const trconnectsPath = path.join(__dirname, '..');
      execSync(`node ${trconnectsPath}/bin/trconnects setup --models`, {
        stdio: 'inherit'
      });
    }

    console.log(chalk.green('\n✓ Setup complete!'));
    console.log(chalk.cyan('\nGet started with: trconnects --help'));
    
  } catch (error) {
    console.error(chalk.red('\n✗ Setup failed: ' + error.message));
    process.exit(1);
  }
}

setup();
