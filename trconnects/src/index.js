#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');
const OllamaService = require('./services/ollama');
const ClaudeService = require('./services/claude');
const CodeGenCommand = require('./commands/codegen');
const ChatCommand = require('./commands/chat');
const ListCommand = require('./commands/list');
const SetupCommand = require('./commands/setup');
const config = require('./config');

const ollama = new OllamaService(config.ollama);
const claude = new ClaudeService(config.claude);

program
  .name('trconnects')
  .description(chalk.cyan('🚀 Unified AI CLI - Ollama + Claude + Qwen + LLM Integration'))
  .version(version, '-v, --version')
  .usage('<command> [options]');

// Chat command
program
  .command('chat')
  .description('Start interactive chat with selected model')
  .option('-m, --model <model>', 'Model to use (ollama, claude)', 'ollama')
  .option('-n, --name <name>', 'Specific model name (e.g., qwen2.5-coder, gpt-4)')
  .action(async (options) => {
    const chatCmd = new ChatCommand(ollama, claude, config);
    await chatCmd.execute(options);
  });

// Code generation command
program
  .command('generate')
  .alias('gen')
  .description('Generate code using AI')
  .option('-m, --model <model>', 'Model to use (ollama, claude)', 'ollama')
  .option('-n, --name <name>', 'Specific model name')
  .option('-t, --type <type>', 'Code type (react, api, mobile, db, etc)')
  .option('-o, --output <file>', 'Output file path')
  .argument('<description>', 'What code to generate')
  .action(async (description, options) => {
    const codegenCmd = new CodeGenCommand(ollama, claude, config);
    await codegenCmd.execute(description, options);
  });

// List available models
program
  .command('list')
  .alias('ls')
  .description('List all available models')
  .option('-s, --source <source>', 'Source to list (ollama, claude, all)', 'all')
  .action(async (options) => {
    const listCmd = new ListCommand(ollama, claude, config);
    await listCmd.execute(options);
  });

// Setup command
program
  .command('setup')
  .description('Setup and configure trconnects')
  .option('-m, --models', 'Install recommended models')
  .option('-a, --all', 'Install all available models')
  .action(async (options) => {
    const setupCmd = new SetupCommand(ollama, config);
    await setupCmd.execute(options);
  });

// Status command
program
  .command('status')
  .description('Check connection status to all services')
  .action(async () => {
    const spinner = require('ora')();
    
    spinner.start('Checking Ollama...');
    const ollamaStatus = await ollama.checkConnection();
    spinner.succeed(`Ollama: ${ollamaStatus ? chalk.green('✓ Connected') : chalk.red('✗ Offline')}`);

    spinner.start('Checking Claude...');
    const claudeStatus = claude.hasApiKey();
    spinner.succeed(`Claude: ${claudeStatus ? chalk.green('✓ Configured') : chalk.yellow('⚠ Not configured')}`);
    
    spinner.succeed(chalk.cyan('Status check complete!'));
  });

// Pull model command
program
  .command('pull <model>')
  .description('Pull a model from Ollama Hub')
  .action(async (model) => {
    const spinner = require('ora')('Pulling model...');
    try {
      spinner.start();
      await ollama.pullModel(model);
      spinner.succeed(chalk.green(`✓ Model ${model} pulled successfully`));
    } catch (err) {
      spinner.fail(chalk.red(`✗ Failed to pull model: ${err.message}`));
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Manage configuration')
  .option('--set <key=value>', 'Set configuration key')
  .option('--get <key>', 'Get configuration value')
  .option('--list', 'List all settings')
  .action((options) => {
    if (options.list) {
      console.log(chalk.cyan('Current Configuration:'));
      console.log(JSON.stringify(config, null, 2));
    } else if (options.set) {
      const [key, value] = options.set.split('=');
      console.log(chalk.yellow(`Setting ${key} = ${value}`));
      // TODO: Implement config setting
    } else if (options.get) {
      console.log(chalk.blue(`${options.get}: ${config[options.get]}`));
    }
  });

// Help command
program
  .command('help [command]')
  .description('Show help for a command')
  .action((command) => {
    if (command) {
      program.parse(['', '', command, '-h']);
    } else {
      program.help();
    }
  });

// Default action
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
