#!/usr/bin/env node

/**
 * 🚀 AUTO RELEASE - Universal Automated Release
 * Orchestrates complete release workflow for any project type
 * Node.js version for cross-platform compatibility
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import semver from 'semver';
import * as utils from './lib/utils.js';
import { GitHelper } from './lib/git-helper.js';

const { log, file, cmd } = utils.default;
const git = new GitHelper();

class AutoRelease {
  constructor(options = {}) {
    this.options = {
      dryRun: false,
      skipTests: false,
      skipBuild: false,
      ...options
    };
    this.projectConfig = null;
  }

  /**
   * Load project configuration
   */
  async loadProjectConfig() {
    try {
      if (file.exists('.automation/project.env')) {
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
   * Check prerequisites before release
   */
  async checkPrerequisites() {
    log.step('Checking prerequisites...');
    
    const isRepo = await git.initialize();
    if (!isRepo) {
      throw new Error('Not in a git repository');
    }
    
    const isClean = await git.isClean();
    if (!isClean) {
      throw new Error('Working directory is not clean');
    }
    
    log.success('Prerequisites check passed');
  }

  /**
   * Get current version from project
   */
  async getCurrentVersion() {
    const projectType = this.projectConfig?.PROJECT_TYPE || 'generic';
    
    switch (projectType) {
      case 'javascript':
        if (file.exists('package.json')) {
          const packageJson = JSON.parse(await file.read('package.json'));
          return packageJson.version;
        }
        break;
        
      case 'generic':
        if (file.exists('VERSION')) {
          const version = await file.read('VERSION');
          return version?.trim();
        }
        break;
    }
    
    const latestTag = await git.getLatestTag();
    if (latestTag && semver.valid(latestTag.replace(/^v/, ''))) {
      return latestTag.replace(/^v/, '');
    }
    
    return null;
  }

  /**
   * Create release
   */
  async createRelease(version) {
    log.step('Creating release...');
    
    if (this.options.dryRun) {
      log.warning(`DRY RUN - Would create release v${version}`);
      return true;
    }
    
    const versionUpdateResult = await cmd.exec(`node scripts/version-manager.js set ${version}`);
    if (!versionUpdateResult.success) {
      throw new Error('Failed to update version');
    }
    
    await git.add('.');
    const commitResult = await git.commit(`chore: bump version to ${version}`);
    if (!commitResult.success) {
      throw new Error('Failed to commit version update');
    }
    
    const tagResult = await git.createTag(`v${version}`, `Release version ${version}`);
    if (!tagResult.success) {
      throw new Error('Failed to create tag');
    }
    
    const pushResult = await git.push('origin', null, { tags: true });
    if (!pushResult.success) {
      throw new Error('Failed to push release');
    }
    
    log.success(`Release v${version} created and pushed`);
    return true;
  }

  /**
   * Execute release workflow
   */
  async executeRelease(bumpType = 'patch') {
    try {
      log.header('Universal Automated Release');
      
      await this.loadProjectConfig();
      await this.checkPrerequisites();
      
      const currentVersion = await this.getCurrentVersion();
      const nextVersion = currentVersion ? semver.inc(currentVersion, bumpType) : '1.0.0';
      
      log.step(`Current version: ${currentVersion || 'none'}`);
      log.step(`Next version: ${nextVersion} (${bumpType})`);
      
      if (!this.options.dryRun) {
        const { confirm } = await inquirer.prompt([{
          type: 'confirm',
          name: 'confirm',
          message: `Create release v${nextVersion}?`,
          default: true
        }]);
        
        if (!confirm) {
          log.warning('Release cancelled');
          return false;
        }
      }
      
      await this.createRelease(nextVersion);
      
      log.success('Release workflow completed successfully!');
      return true;
      
    } catch (error) {
      log.error(`Release failed: ${error.message}`);
      throw error;
    }
  }
}

// CLI setup
const program = new Command();

program
  .name('auto-release')
  .description('🚀 Universal Automated Release')
  .version('1.0.0')
  .option('-t, --type <type>', 'Version bump type (patch|minor|major)', 'patch')
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('--skip-tests', 'Skip running tests')
  .option('--skip-build', 'Skip build step')
  .action(async (options) => {
    try {
      const releaseOptions = {
        dryRun: options.dryRun,
        skipTests: options.skipTests,
        skipBuild: options.skipBuild
      };
      
      const autoRelease = new AutoRelease(releaseOptions);
      await autoRelease.executeRelease(options.type);
      
    } catch (error) {
      log.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export default AutoRelease; 