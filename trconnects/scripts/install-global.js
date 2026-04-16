#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log(chalk.cyan('\n🚀 trconnects Global Installation'));

try {
  // Check if npm is available
  execSync('npm --version', { stdio: 'ignore' });
  
  const trconnectsDir = __dirname;
  
  console.log(chalk.blue('Installing dependencies...'));
  execSync('npm install', { cwd: trconnectsDir, stdio: 'inherit' });
  
  console.log(chalk.blue('Setting up global command...'));
  execSync('npm link', { cwd: trconnectsDir, stdio: 'inherit' });
  
  console.log(chalk.green('\n✓ Installation complete!'));
  console.log(chalk.cyan('\nYou can now use: trconnects'));
  console.log(chalk.gray('Try: trconnects --help'));
  
} catch (error) {
  console.log(chalk.red('\n✗ Installation failed: ' + error.message));
  process.exit(1);
}
