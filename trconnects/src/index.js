#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');
const NIMService = require('./services/nim');
const CodeGenCommand = require('./commands/codegen');
const ChatCommand = require('./commands/chat');
const ListCommand = require('./commands/list');
const SetupCommand = require('./commands/setup');
const config = require('./config');

const nim = new NIMService(config.nim);

program
  .name('trconnects')
  .description(chalk.cyan('🚀 Unified AI CLI - NVIDIA NIM + Qwen routing + task profiles'))
  .version(version, '-v, --version')
  .usage('<command> [options]');

// Chat command
program
  .command('chat')
  .description('Start interactive chat using NVIDIA NIM task profile')
  .option('-t, --task <task>', 'Task profile (qwen_code_cli, claude_cli_style, ollama_launch_claude, llm_studio, chat, coding, reasoning)', config.nim.defaultTask)
  .option('-n, --name <name>', 'Force a specific NIM model name (overrides task routing)')
  .action(async (options) => {
    const chatCmd = new ChatCommand(nim, config);
    await chatCmd.execute(options);
  });

// Code generation command
program
  .command('generate')
  .alias('gen')
  .description('Generate code using NVIDIA NIM task-based 3-model routing')
  .option('-k, --task <task>', 'Task profile (qwen_code_cli, claude_cli_style, ollama_launch_claude, llm_studio, chat, coding, reasoning)', config.nim.defaultTask)
  .option('-n, --name <name>', 'Force a specific NIM model name (overrides task routing)')
  .option('-t, --type <type>', 'Code type (react, api, mobile, db, python, general)')
  .option('-o, --output <file>', 'Output file path')
  .argument('<description>', 'What code to generate')
  .action(async (description, options) => {
    const codegenCmd = new CodeGenCommand(nim, config);
    await codegenCmd.execute(description, options);
  });

// List available models
program
  .command('list')
  .alias('ls')
  .description('List NVIDIA NIM models and task model profiles')
  .option('-s, --source <source>', 'Source to list (nim, profiles, all)', 'all')
  .action(async (options) => {
    const listCmd = new ListCommand(nim, config);
    await listCmd.execute(options);
  });

// Setup command
program
  .command('setup')
  .description('Setup and validate NVIDIA NIM configuration')
  .option('-v, --validate', 'Validate configured task profiles against NIM API')
  .action(async (options) => {
    const setupCmd = new SetupCommand(nim, config);
    await setupCmd.execute(options);
  });

// Status command
program
  .command('status')
  .description('Check NVIDIA NIM connection status')
  .action(async () => {
    const spinner = require('ora')();

    spinner.start('Checking NVIDIA NIM API key...');
    const keyStatus = nim.hasApiKey();
    spinner.succeed(`NIM API key: ${keyStatus ? chalk.green('✓ Configured') : chalk.red('✗ Missing')}`);

    spinner.start('Checking NVIDIA NIM connectivity...');
    const nimStatus = await nim.checkConnection();
    spinner.succeed(`NIM API: ${nimStatus ? chalk.green('✓ Connected') : chalk.red('✗ Unreachable/Unauthorized')}`);

    spinner.succeed(chalk.cyan('Status check complete!'));
  });

// Pull model command (NIM is API-only)
program
  .command('pull <model>')
  .description('NIM API-only mode notice')
  .action(async (model) => {
    console.log(chalk.yellow(`NIM uses hosted API models, no local pull needed: ${model}`));
    console.log(chalk.gray('Use: trconnects list --source profiles'));
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
