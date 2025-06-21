#!/usr/bin/env node

/**
 * 🤖 COMMIT HELPER - Universal Commit Assistant
 * Validates conventional commits and manages automated workflow
 * Node.js version for cross-platform compatibility
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import * as utils from './lib/utils.js';
import { GitHelper } from './lib/git-helper.js';

const { log, file, cmd } = utils.default;
const git = new GitHelper();

// Configuration
const COMMIT_TYPES = [
  { value: 'feat', name: 'feat: ✨ A new feature' },
  { value: 'fix', name: 'fix: 🐛 A bug fix' },
  { value: 'docs', name: 'docs: 📚 Documentation only changes' },
  { value: 'style', name: 'style: 💎 Changes that do not affect the meaning of the code' },
  { value: 'refactor', name: 'refactor: 📦 A code change that neither fixes a bug nor adds a feature' },
  { value: 'perf', name: 'perf: 🚀 A code change that improves performance' },
  { value: 'test', name: 'test: 🚨 Adding missing tests or correcting existing tests' },
  { value: 'build', name: 'build: 🛠️ Changes that affect the build system or external dependencies' },
  { value: 'ci', name: 'ci: ⚙️ Changes to our CI configuration files and scripts' },
  { value: 'chore', name: 'chore: 🗃️ Other changes that don\'t modify src or test files' },
  { value: 'revert', name: 'revert: ⏪ Reverts a previous commit' }
];

const BREAKING_CHANGE_INDICATOR = '!';

class CommitHelper {
  constructor() {
    this.projectConfig = null;
  }

  /**
   * Load project configuration
   */
  async loadProjectConfig() {
    try {
      if (file.exists('.automation/project.env')) {
        // Load existing config
        const configContent = await file.read('.automation/project.env');
        if (configContent) {
          this.projectConfig = this.parseEnvConfig(configContent);
          return;
        }
      }
      
      log.warning('Running project detection first...');
      await cmd.exec('node scripts/project-detector.js');
      
      if (file.exists('.automation/project.env')) {
        const configContent = await file.read('.automation/project.env');
        this.projectConfig = this.parseEnvConfig(configContent);
      }
    } catch (error) {
      log.error(`Failed to load project config: ${error.message}`);
      this.projectConfig = { PROJECT_TYPE: 'generic' };
    }
  }

  /**
   * Parse environment configuration
   */
  parseEnvConfig(content) {
    const config = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          config[key] = valueParts.join('=').replace(/['"]/g, '');
        }
      }
    }
    
    return config;
  }

  /**
   * Validate conventional commit format
   */
  validateCommitFormat(commitMsg) {
    // Check basic format: type(scope): description
    const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?:\s.+/;
    
    if (!conventionalCommitRegex.test(commitMsg)) {
      log.error('Invalid commit format!');
      log.warning('Expected format: type(scope): description');
      log.warning('Example: feat(auth): add login functionality');
      log.warning(`Valid types: ${COMMIT_TYPES.map(t => t.value).join(', ')}`);
      return false;
    }
    
    // Check description length (min 10 chars)
    const description = commitMsg.replace(/^[^:]*:\s*/, '');
    if (description.length < 10) {
      log.error('Description too short! Minimum 10 characters.');
      return false;
    }
    
    // Check total length (max 72 chars for first line)
    if (commitMsg.length > 72) {
      log.warning(`Commit message is long (${commitMsg.length} chars). Consider shortening.`);
    }
    
    log.success('Commit format is valid');
    return true;
  }

  /**
   * Determine version bump type from commit message
   */
  getVersionBumpType(commitMsg) {
    // Breaking change (major)
    if (commitMsg.includes(BREAKING_CHANGE_INDICATOR)) {
      return 'major';
    }
    
    // Feature (minor)
    if (commitMsg.startsWith('feat')) {
      return 'minor';
    }
    
    // Fix (patch)
    if (commitMsg.startsWith('fix')) {
      return 'patch';
    }
    
    // Other types (patch)
    return 'patch';
  }

  /**
   * Run pre-commit checks based on project type
   */
  async runPreCommitChecks() {
    log.step('Running pre-commit checks...');
    
    // Check if there are staged files
    const status = await git.getStatus();
    if (status.staged.length === 0) {
      log.error('No staged files found!');
      log.warning('Use: git add <files> before committing');
      return false;
    }
    
    // Run linting based on project type
    const projectType = this.projectConfig?.PROJECT_TYPE || 'generic';
    
    switch (projectType) {
      case 'javascript':
        if (file.exists('package.json')) {
          const packageJson = JSON.parse(await file.read('package.json'));
          if (packageJson.scripts?.lint) {
            log.step('Running ESLint...');
            const result = await cmd.exec('npm run lint');
            if (!result.success) {
              log.warning('Linting issues found. Fix them or use --no-verify to skip');
              return false;
            }
          }
        }
        break;
        
      case 'python':
        if (await cmd.exists('flake8')) {
          log.step('Running flake8...');
          const result = await cmd.exec('flake8 .');
          if (!result.success) {
            log.warning('Python linting issues found');
            return false;
          }
        }
        break;
        
      case 'go':
        log.step('Running go fmt...');
        let result = await cmd.exec('go fmt ./...');
        if (!result.success) {return false;}
        
        log.step('Running go vet...');
        result = await cmd.exec('go vet ./...');
        if (!result.success) {return false;}
        break;
        
      case 'rust':
        log.step('Running cargo fmt...');
        result = await cmd.exec('cargo fmt --check');
        if (!result.success) {
          log.warning('Code formatting issues found. Run: cargo fmt');
          return false;
        }
        
        log.step('Running cargo clippy...');
        result = await cmd.exec('cargo clippy -- -D warnings');
        if (!result.success) {return false;}
        break;
    }
    
    log.success('Pre-commit checks passed');
    return true;
  }

  /**
   * Execute commit with automatic workflow
   */
  async executeCommit(commitMsg, skipChecks = false) {
    log.step('Executing automated commit workflow...');
    
    // Run pre-commit checks unless skipped
    if (!skipChecks) {
      const checksPass = await runPreCommitChecks();
      if (!checksPass) {return false;}
    }
    
    // Commit the changes
    const commitResult = await git.commit(commitMsg, { noVerify: skipChecks });
    if (!commitResult.success) {
      log.error(`Commit failed: ${commitResult.stderr}`);
      return false;
    }
    
    // Get version bump type
    const bumpType = this.getVersionBumpType(commitMsg);
    log.step(`Version bump type: ${bumpType}`);
    
    // Version bump based on project type
    const projectType = this.projectConfig?.PROJECT_TYPE || 'generic';
    
    switch (projectType) {
      case 'javascript':
        if (file.exists('package.json')) {
          const result = await cmd.exec(`npm version ${bumpType} --no-git-tag-version`);
          if (result.success) {
            log.success('package.json version updated');
          }
        }
        break;
        
      case 'python':
        if (file.exists('pyproject.toml')) {
          log.warning('Manual version update needed in pyproject.toml');
        }
        break;
        
      case 'generic':
        if (file.exists('VERSION')) {
          const currentVersion = await file.read('VERSION');
          log.step(`Current version: ${currentVersion?.trim()}`);
          log.warning('Manual version update needed in VERSION file');
        }
        break;
    }
    
    log.success('Commit completed successfully!');
    return true;
  }

  /**
   * Interactive commit creation
   */
  async interactiveCommit() {
    log.header('Interactive Commit Helper');
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change:',
        choices: COMMIT_TYPES
      },
      {
        type: 'input',
        name: 'scope',
        message: 'Enter the scope (optional):',
        validate: (input) => !input || /^[a-z-]+$/.test(input) || 'Scope should be lowercase with hyphens'
      },
      {
        type: 'confirm',
        name: 'breaking',
        message: 'Is this a breaking change?',
        default: false
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter the commit description:',
        validate: (input) => input.length >= 10 || 'Description must be at least 10 characters'
      },
      {
        type: 'input',
        name: 'body',
        message: 'Enter the commit body (optional):'
      }
    ]);

    // Build commit message
    let commitMsg = answers.type;
    if (answers.scope) {
      commitMsg += `(${answers.scope})`;
    }
    if (answers.breaking) {
      commitMsg += '!';
    }
    commitMsg += `: ${answers.description}`;
    
    if (answers.body) {
      commitMsg += `\n\n${answers.body}`;
    }

    log.step(`Commit message: ${commitMsg}`);
    
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with this commit?',
      default: true
    }]);

    if (confirm) {
      return await this.executeCommit(commitMsg);
    }
    
    log.warning('Commit cancelled');
    return false;
  }

  /**
   * Show usage information
   */
  showUsage() {
    log.header('Universal Commit Helper');
    log.divider();
    console.log('Usage: node scripts/commit-helper.js [options] [message]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/commit-helper.js "feat(auth): add login functionality"');
    console.log('  node scripts/commit-helper.js "fix: resolve memory leak issue"');
    console.log('  node scripts/commit-helper.js "docs: update installation guide"');
    console.log('  node scripts/commit-helper.js "feat!: breaking change in API" --no-verify');
    console.log('');
    console.log(`Valid commit types: ${COMMIT_TYPES.map(t => t.value).join(', ')}`);
    console.log('Use ! after type for breaking changes');
  }
}

// CLI setup
const program = new Command();
const commitHelper = new CommitHelper();

program
  .name('commit-helper')
  .description('🤖 Universal Commit Assistant - Validates conventional commits')
  .version('1.0.0')
  .argument('[message]', 'Commit message')
  .option('-i, --interactive', 'Interactive commit creation')
  .option('--no-verify', 'Skip pre-commit hooks and checks')
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('-v, --verbose', 'Verbose output')
  .action(async (message, options) => {
    try {
      await commitHelper.loadProjectConfig();
      
      if (options.interactive || !message) {
        await commitHelper.interactiveCommit();
      } else {
        if (options.dryRun) {
          log.step(`DRY RUN - Would commit: "${message}"`);
          const isValid = commitHelper.validateCommitFormat(message);
          const bumpType = commitHelper.getVersionBumpType(message);
          log.step(`Would apply version bump: ${bumpType}`);
          return;
        }
        
        if (!commitHelper.validateCommitFormat(message)) {
          process.exit(1);
        }
        
        const success = await commitHelper.executeCommit(message, !options.verify);
        process.exit(success ? 0 : 1);
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('help')
  .description('Show detailed usage information')
  .action(() => {
    commitHelper.showUsage();
  });

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export default CommitHelper; 