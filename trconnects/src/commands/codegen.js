const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

class CodeGenCommand {
  constructor(nim, config) {
    this.nim = nim;
    this.config = config;
  }

  async execute(description, options) {
    const task = options.task || options.model || this.config.nim.defaultTask;
    const modelName = options.name;
    const codeType = options.type || 'general';
    const outputFile = options.output;
    const routed = this.nim.getTaskModels(task);

    console.log(chalk.cyan(`\n✨ Generating ${codeType} code`));
    console.log(chalk.gray('Provider: NVIDIA NIM'));
    console.log(chalk.gray(`Task: ${routed.selectedTask}`));
    if (!modelName) {
      console.log(chalk.gray(`Fallback chain: ${routed.models.join(' -> ')}`));
    }
    console.log(chalk.gray(`Description: ${description}\n`));

    const spinner = ora('Generating code...').start();

    try {
      const systemPrompt = this.getSystemPrompt(codeType);
      const userPrompt = `Generate ${codeType} code for: ${description}`;
      const result = await this.nim.generateFromTask(task, userPrompt, systemPrompt, {
        model: modelName,
        temperature: 0.2
      });
      const code = result.content;

      spinner.succeed(chalk.green('✓ Code generated successfully\n'));
      console.log(chalk.gray(`Model used: ${result.model}`));

      if (outputFile) {
        await fs.ensureDir(path.dirname(outputFile));
        await fs.writeFile(outputFile, code);
        console.log(chalk.green(`✓ Code saved to: ${outputFile}\n`));
      }

      console.log(chalk.cyan('Generated Code:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(code);
      console.log(chalk.gray('─'.repeat(50)));
    } catch (error) {
      spinner.fail(chalk.red(`✗ Generation failed: ${error.message}`));
      process.exit(1);
    }
  }

  getSystemPrompt(codeType) {
    const prompts = {
      react: `You are an expert React developer. Generate clean, modern React components with hooks.
        - Use functional components with hooks
        - Include proper TypeScript types
        - Add comments for clarity
        - Return only the code`,
      
      api: `You are an expert backend developer. Generate production-ready API code.
        - Use Node.js/Express or Python/FastAPI
        - Include error handling
        - Add proper logging
        - Return only the code`,
      
      mobile: `You are an expert mobile developer. Generate React Native code.
        - Use functional components with hooks
        - Include proper styling
        - Add navigation patterns
        - Return only the code`,
      
      db: `You are an expert database engineer. Generate SQL schemas.
        - Use best practices
        - Include indexes
        - Add comments
        - Return only the SQL code`,
      
      python: `You are an expert Python developer. Generate clean, Pythonic code.
        - Follow PEP 8 conventions
        - Include type hints
        - Add docstrings
        - Return only the code`,
      
      general: `You are an expert code generator. Generate high-quality, production-ready code.
        - Include comments
        - Follow best practices
        - Use modern patterns
        - Return only the code`
    };

    return prompts[codeType] || prompts.general;
  }
}

module.exports = CodeGenCommand;
