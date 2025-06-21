#!/usr/bin/env node

/**
 * 🔧 SETUP AUTOMATION - Universal Setup Script
 * Installs and configures universal automation for any project type
 * Node.js version for cross-platform compatibility
 */

import { Command } from 'commander';
import * as utils from './lib/utils.js';
import { GitHelper } from './lib/git-helper.js';

const { log, file, cmd } = utils.default;
// const git = new GitHelper(); // Unused for now

// Configuration
const AUTOMATION_DIRS = [
  '.automation',
  '.githooks',
  '.github/workflows',
  '.github/ISSUE_TEMPLATE',
  'scripts'
];

class SetupAutomation {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      verbose: false,
      ...options
    };
  }

  /**
   * Create necessary directories
   */
  async setupDirectories() {
    log.step('Creating automation directories...');
    
    for (const dir of AUTOMATION_DIRS) {
      await file.ensureDir(dir);
      log.success(`Created directory: ${dir}`);
    }
  }

  /**
   * Install Git hooks
   */
  async installGitHooks() {
    log.step('Installing Git hooks...');
    
    const hooksDir = '.githooks';
    const gitHooksDir = '.git/hooks';
    
    if (!file.exists(hooksDir)) {
      log.warning(`No git hooks found in ${hooksDir}`);
      return;
    }
    
    if (!file.exists('.git')) {
      log.warning('Not a git repository, skipping git hooks installation');
      return;
    }
    
    const hooks = await file.list(hooksDir);
    
    for (const hook of hooks) {
      const hookPath = file.path.join(hooksDir, hook);
      const gitHookPath = file.path.join(gitHooksDir, hook);
      
      if (file.exists(hookPath)) {
        const hookContent = await file.read(hookPath);
        await file.write(gitHookPath, hookContent);
        
        // Make executable on Unix systems
        if (!utils.platform_info.isWindows) {
          await cmd.exec(`chmod +x "${gitHookPath}"`);
        }
        
        log.success(`Installed hook: ${hook}`);
      }
    }
  }

  /**
   * Setup automation configuration
   */
  async setupAutomationConfig() {
    log.step('Setting up automation configuration...');
    
    if (file.exists('scripts/project-detector.js')) {
      const result = await cmd.exec('node scripts/project-detector.js');
      if (result.success) {
        log.success('Project type detected and configuration saved');
      } else {
        log.warning('Project detection failed');
      }
    } else {
      log.warning('Project detector script not found');
    }
  }

  /**
   * Make scripts executable
   */
  async setupScripts() {
    log.step('Making scripts executable...');
    
    if (!file.exists('scripts')) {
      log.warning('Scripts directory not found');
      return;
    }
    
    const scripts = await file.list('scripts');
    
    for (const script of scripts) {
      if (script.endsWith('.js') || script.endsWith('.sh')) {
        const scriptPath = file.path.join('scripts', script);
        
        // Make executable on Unix systems
        if (!utils.platform_info.isWindows) {
          await cmd.exec(`chmod +x "${scriptPath}"`);
        }
      }
    }
    
    log.success('All scripts are now executable');
  }

  /**
   * Setup commitlint for Node.js projects
   */
  async setupCommitlint() {
    log.step('Setting up commit linting...');
    
    if (!file.exists('package.json')) {
      log.success('Not a Node.js project, commitlint not needed');
      return;
    }
    
    if (!(await cmd.exists('npm'))) {
      log.warning('npm not found, skipping commitlint setup');
      return;
    }
    
    if (this.options.dryRun) {
      log.warning('DRY RUN - Would install commitlint');
      return;
    }
    
    const installResult = await cmd.exec('npm install --save-dev @commitlint/cli @commitlint/config-conventional');
    if (!installResult.success) {
      log.warning('Failed to install commitlint');
      return;
    }
    
    const commitlintConfig = "module.exports = {extends: ['@commitlint/config-conventional']};";
    await file.write('commitlint.config.js', commitlintConfig);
    
    log.success('Commitlint installed and configured');
  }

  /**
   * Setup GitHub configuration
   */
  async setupGitHubConfig() {
    log.step('Setting up GitHub configuration...');
    
    const releaseConfig = `changelog:
  categories:
    - title: '🚀 Features'
      labels:
        - 'feature'
        - 'enhancement'
    - title: '🐛 Bug Fixes'
      labels:
        - 'bug'
        - 'bugfix'
    - title: '📚 Documentation'
      labels:
        - 'documentation'
    - title: '🔧 Maintenance'
      labels:
        - 'maintenance'
        - 'dependencies'
  exclude:
    labels:
      - 'skip-changelog'`;
    
    if (!file.exists('.github/release.yml')) {
      await file.write('.github/release.yml', releaseConfig);
      log.success('GitHub release configuration created');
    }
  }

  /**
   * Setup issue templates
   */
  async setupIssueTemplates() {
    log.step('Setting up issue templates...');
    
    const bugReportTemplate = `name: 🐛 Bug Report
description: Report a bug to help us improve
title: '[BUG] '
labels: ['bug']
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
        
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is
      placeholder: Describe the bug...
    validations:
      required: true
      
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true`;
    
    await file.write('.github/ISSUE_TEMPLATE/bug-report.yml', bugReportTemplate);
    log.success('Bug report template created');
  }

  /**
   * Execute complete setup
   */
  async executeSetup() {
    try {
      log.header('Universal Automation Setup');
      log.divider();
      
      await this.setupDirectories();
      await this.installGitHooks();
      await this.setupAutomationConfig();
      await this.setupScripts();
      await this.setupCommitlint();
      await this.setupGitHubConfig();
      await this.setupIssueTemplates();
      
      log.divider();
      log.success('Automation setup completed successfully!');
      
      log.step('Next steps:');
      console.log('  1. Review generated configurations');
      console.log('  2. Customize templates as needed');
      console.log('  3. Test automation with: npm run scripts:commit-helper');
      
      return true;
      
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      throw error;
    }
  }
}

// CLI setup
const program = new Command();

program
  .name('setup-automation')
  .description('🔧 Universal Automation Setup')
  .version('1.0.0')
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    try {
      const setupOptions = {
        dryRun: options.dryRun,
        verbose: options.verbose
      };
      
      const setupAutomation = new SetupAutomation(setupOptions);
      await setupAutomation.executeSetup();
      
    } catch (error) {
      log.error(`Error: ${error.message}`);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export default SetupAutomation; 