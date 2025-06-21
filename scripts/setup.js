#!/usr/bin/env node

/**
 * 🚀 Setup Script - Complete Automatic Installation
 * Cross-platform Node.js version of setup.sh
 * Universal project setup with enhanced features
 */

import { Command } from 'commander';
import { join } from 'path';
import inquirer from 'inquirer';
import utils from './lib/utils.js';
import { ProjectDetector } from './project-detector.js';

const { log, file, cmd, platform } = utils;

/**
 * Setup Manager
 */
class SetupManager {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      skipInstall: false,
      interactive: true,
      createExample: true,
      setupHooks: true,
      ...options,
    };
    this.detector = new ProjectDetector();
  }

  /**
   * Check prerequisites
   */
  async checkPrerequisites() {
    log.header('Setup - Checking Prerequisites');
    const requirements = [];

    // Git check
    if (await cmd.exists('git')) {
      const gitVersion = await cmd.exec('git --version');
      log.success(`Git found: ${gitVersion.stdout}`);
    } else {
      log.error('Git is not installed. Please install Git first.');
      requirements.push('git');
    }

    // Node.js check (should be present since we're running in Node)
    log.success(`Node.js found: ${process.version}`);

    // npm check
    if (await cmd.exists('npm')) {
      const npmVersion = await cmd.exec('npm --version');
      log.success(`npm found: v${npmVersion.stdout}`);
    } else {
      log.error('npm is not installed. Please install npm first.');
      requirements.push('npm');
    }

    // Check for optional tools
    const optionalTools = ['gh', 'code', 'docker'];
    for (const tool of optionalTools) {
      if (await cmd.exists(tool)) {
        const version = await cmd.exec(`${tool} --version`);
        log.info(`${tool} found: ${version.stdout.split('\n')[0]}`);
      } else {
        log.debug(`${tool} not found (optional)`);
      }
    }

    if (requirements.length > 0) {
      throw new Error(`Missing required tools: ${requirements.join(', ')}`);
    }

    return true;
  }

  /**
   * Install dependencies
   */
  async installDependencies() {
    if (this.options.skipInstall) {
      log.info('Skipping dependency installation');
      return;
    }

    log.step('Installing dependencies...');

    if (!file.exists('package.json')) {
      log.warning('No package.json found, skipping npm install');
      return;
    }

    // Detect project type to choose the right package manager
    await this.detector.detectProjectType();
    const packageManager = this.detector.packageManager || 'npm';

    try {
      let installCommand;
      switch (packageManager) {
        case 'yarn':
          installCommand = 'yarn install';
          break;
        case 'pnpm':
          installCommand = 'pnpm install';
          break;
        default:
          installCommand = 'npm install';
      }

      log.info(`Using ${packageManager} for dependency installation`);
      const result = await cmd.exec(installCommand);

      if (result.success) {
        log.success('Dependencies installed successfully');
      } else {
        throw new Error(`Installation failed: ${result.stderr}`);
      }
    } catch (error) {
      log.error(`Failed to install dependencies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create project structure
   */
  async createProjectStructure() {
    log.step('Creating project structure...');

    const directories = [
      'src',
      'src/components',
      'src/utils',
      'src/config',
      'docs',
      'scripts',
      'examples',
      'examples/basic-usage',
      'examples/advanced-usage',
      'examples/integrations',
      'templates',
      'templates/project-base',
      'templates/component',
      'templates/config',
      '.cursor',
      '.cursor/plans',
      '.cursor/rules',
      '.automation',
    ];

    for (const dir of directories) {
      await file.ensureDir(dir);
    }

    log.success('Project structure created');
  }

  /**
   * Setup Git configuration
   */
  async setupGitConfiguration() {
    log.step('Configuring Git...');

    // Set commit message template if exists
    if (file.exists('.gitmessage')) {
      await cmd.exec('git config commit.template .gitmessage');
      log.success('Git commit template configured');
    }

    // Setup Git hooks if requested
    if (this.options.setupHooks && file.exists('.git')) {
      await this.setupGitHooks();
    }
  }

  /**
   * Setup Git hooks
   */
  async setupGitHooks() {
    log.info('Setting up Git hooks...');

    // Create pre-commit hook
    const preCommitHook = `#!/bin/sh
# Pre-commit hook for quality checks

echo "🔍 Running pre-commit quality checks..."

# Run quality checks
npm run quality
if [ $? -ne 0 ]; then
    echo "❌ Quality checks failed. Commit aborted."
    echo "💡 Run 'npm run quality:fix' to auto-fix issues"
    exit 1
fi

echo "✅ Quality checks passed"
`;

    const hookPath = '.git/hooks/pre-commit';
    await file.write(hookPath, preCommitHook);

    // Make executable on Unix systems
    if (platform_info.isUnix) {
      await cmd.exec(`chmod +x ${hookPath}`);
    }

    log.success('Git pre-commit hook installed');
  }

  /**
   * Verify installation
   */
  async verifyInstallation() {
    log.step('Verifying installation...');

    const checks = [];

    // Check if quality scripts work
    if (file.exists('package.json')) {
      try {
        const packageJson = JSON.parse(await file.read('package.json'));
        if (packageJson.scripts && packageJson.scripts.quality) {
          const qualityResult = await cmd.exec('npm run quality');
          if (qualityResult.success) {
            log.success('Quality checks working');
            checks.push('✅ Quality checks');
          } else {
            log.warning('Quality checks configured but failing');
            checks.push('⚠️ Quality checks (failing)');
          }
        } else {
          log.info('Quality checks not configured');
          checks.push('ℹ️ Quality checks (not configured)');
        }
      } catch (error) {
        log.debug(`Error checking quality scripts: ${error.message}`);
      }
    }

    // Check project detection
    try {
      await this.detector.detectProjectType();
      log.success(`Project type detected: ${this.detector.projectType}`);
      checks.push(`✅ Project type: ${this.detector.projectType}`);
    } catch (error) {
      log.warning('Project detection failed');
      checks.push('⚠️ Project detection');
    }

    return checks;
  }

  /**
   * Create initial content
   */
  async createInitialContent() {
    if (!this.options.createExample) {
      return;
    }

    log.step('Setting up initial content...');

    // Create basic src/index.js if not exists
    if (!file.exists('src/index.js') && !file.exists('src/index.ts')) {
      const indexContent = `/**
 * Main entry point
 * This file was generated by cursor-rules setup
 */

console.log('🚀 Welcome to your new project!');
console.log('📖 Check docs/ for documentation');
console.log('💡 Run npm run quality to check code quality');

// Export main functionality
export const projectInfo = {
  version: process.env.npm_package_version || '1.0.0',
  name: process.env.npm_package_name || 'unknown'
};

export default projectInfo;
`;

      await file.write('src/index.js', indexContent);
      log.success('Created basic src/index.js');
    }

    // Create .env.example if not exists
    if (!file.exists('.env.example')) {
      const envExample = `# Environment Variables Example
# Copy this file to .env and fill in your values

# Application
NODE_ENV=development
PORT=3000

# Database (if applicable)
# DATABASE_URL=mongodb://localhost:27017/myapp

# API Keys (if applicable) 
# API_KEY=your_api_key_here

# Debug
DEBUG=app:*
`;

      await file.write('.env.example', envExample);
      log.success('Created .env.example');
    }

    // Create basic README if not exists
    if (!file.exists('README.md')) {
      const readmeContent = `# ${this.detector.projectType || 'Project'} Project

Welcome to your new project! This project was set up using cursor-rules.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run quality checks:
   \`\`\`bash
   npm run quality
   \`\`\`

3. Start developing in the \`src/\` directory

## Scripts

- \`npm run quality\` - Run code quality checks
- \`npm run quality:fix\` - Auto-fix code quality issues

## Documentation

Check the \`docs/\` directory for detailed documentation.
`;

      await file.write('README.md', readmeContent);
      log.success('Created README.md');
    }
  }

  /**
   * Make scripts executable
   */
  async makeScriptsExecutable() {
    if (platform.isUnix) {
      log.step('Making scripts executable...');

      const scriptFiles = await file.list('scripts');
      const executableFiles = scriptFiles.filter(f => f.endsWith('.js') || f.endsWith('.sh'));

      for (const scriptFile of executableFiles) {
        const scriptPath = join('scripts', scriptFile);
        await cmd.exec(`chmod +x ${scriptPath}`);
      }

      log.success('Scripts made executable');
    }
  }

  /**
   * Interactive setup
   */
  async interactiveSetup() {
    if (!this.options.interactive) {
      return {};
    }

    log.header('Interactive Setup');

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'setupHooks',
        message: 'Setup Git hooks for quality checks?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Create example files and documentation?',
        default: true,
      },
    ]);

    this.options = { ...this.options, ...answers };
    return answers;
  }

  /**
   * Main setup execution
   */
  async run() {
    try {
      log.header('🔧 Starting cursor-rules setup...');
      log.divider();

      // Interactive setup if enabled
      if (this.options.interactive) {
        await this.interactiveSetup();
      }

      // Execute setup steps
      await this.checkPrerequisites();
      await this.installDependencies();
      await this.createProjectStructure();
      await this.setupGitConfiguration();
      await this.createInitialContent();
      await this.makeScriptsExecutable();

      // Verify installation
      const checks = await this.verifyInstallation();

      // Final summary
      log.divider();
      log.header('🎉 Setup completed successfully!');
      log.divider();

      log.info('📋 What was configured:');
      checks.forEach(check => log.info(`  ${check}`));

      log.divider();
      log.info('🚀 Next steps:');
      log.info("  1. Run 'npm run quality' to check everything works");
      log.info('  2. Start coding in the src/ directory');
      log.info('  3. Read docs/usage.md for detailed usage');
      log.divider();
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      throw error;
    }
  }
}

/**
 * CLI Program
 */
const program = new Command();

program
  .name('setup')
  .description('🚀 Complete Automatic Project Setup - Cross-platform Node.js version')
  .version('1.0.0')
  .option('-d, --dry-run', 'Show what would be done without executing', false)
  .option('--skip-install', 'Skip dependency installation', false)
  .option('--no-interactive', 'Run without interactive prompts', false)
  .option('--no-example', 'Skip creating example files', false)
  .option('--no-hooks', 'Skip Git hooks setup', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async options => {
    try {
      const setupManager = new SetupManager({
        dryRun: options.dryRun,
        skipInstall: options.skipInstall,
        interactive: options.interactive,
        createExample: options.example,
        setupHooks: options.hooks,
      });

      await setupManager.run();
      process.exit(0);
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      if (options.verbose) {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Export for use as module
export { SetupManager };

// Run if called directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  program.parse();
}
