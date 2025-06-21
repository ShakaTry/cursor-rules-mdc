#!/usr/bin/env node

/**
 * 🤖 VERSION MANAGER - Universal Version Management
 * Manages versions across different project types
 * Cross-platform Node.js version of version-manager.sh
 */

import { Command } from 'commander';
import semver from 'semver';
import inquirer from 'inquirer';
import utils from './lib/utils.js';
import { ProjectDetector } from './project-detector.js';

const { log, file, cmd } = utils;

/**
 * Version Manager
 */
class VersionManager {
  constructor() {
    this.detector = new ProjectDetector();
    this.projectConfig = null;
  }

  /**
   * Load project configuration
   */
  async loadProjectConfig() {
    if (this.projectConfig) {
      return this.projectConfig;
    }

    // Try to load existing config
    if (file.exists('.automation/project.json')) {
      try {
        const config = await file.read('.automation/project.json');
        this.projectConfig = JSON.parse(config);
        return this.projectConfig;
      } catch (error) {
        log.debug('Could not load project config, detecting...');
      }
    }

    // Detect project type
    log.info('Running project detection...');
    await this.detector.detectProjectType();
    this.projectConfig = await this.detector.getEnhancedInfo();
    await this.detector.saveToConfig();
    
    return this.projectConfig;
  }

  /**
   * Get current version based on project type
   */
  async getCurrentVersion() {
    const config = await this.loadProjectConfig();
    
    try {
      switch (config.projectType) {
        case 'javascript':
          if (file.exists('package.json')) {
            const pkg = JSON.parse(await file.read('package.json'));
            return pkg.version || '0.0.0';
          }
          break;
          
        case 'python':
          if (file.exists('pyproject.toml')) {
            const content = await file.read('pyproject.toml');
            const versionMatch = content.match(/^version\s*=\s*"([^"]+)"/m);
            return versionMatch ? versionMatch[1] : '0.0.0';
          } else if (file.exists('setup.py')) {
            const content = await file.read('setup.py');
            const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
            return versionMatch ? versionMatch[1] : '0.0.0';
          }
          break;
          
        case 'rust':
          if (file.exists('Cargo.toml')) {
            const content = await file.read('Cargo.toml');
            const versionMatch = content.match(/^version\s*=\s*"([^"]+)"/m);
            return versionMatch ? versionMatch[1] : '0.0.0';
          }
          break;
          
        case 'go':
          // Go modules don't have version in go.mod, check git tags
          try {
            const result = await cmd.exec('git describe --tags --abbrev=0');
            return result.success ? result.stdout.replace(/^v/, '') : '0.0.0';
          } catch (error) {
            return '0.0.0';
          }
          
        case 'php':
          if (file.exists('composer.json')) {
            const pkg = JSON.parse(await file.read('composer.json'));
            return pkg.version || '0.0.0';
          }
          break;
          
        case 'java':
          if (file.exists('pom.xml')) {
            const content = await file.read('pom.xml');
            const versionMatch = content.match(/<version>([^<]+)<\/version>/);
            return versionMatch ? versionMatch[1] : '0.0.0';
          }
          break;
          
        case 'generic':
          if (file.exists('VERSION')) {
            const version = await file.read('VERSION');
            return version.trim();
          }
          break;
      }
    } catch (error) {
      log.debug(`Error getting current version: ${error.message}`);
    }
    
    return '0.0.0';
  }

  /**
   * Validate version format
   */
  validateVersion(version) {
    const cleanVersion = version.replace(/^v/, '');
    return semver.valid(cleanVersion) !== null;
  }

  /**
   * Increment version based on bump type
   */
  incrementVersion(currentVersion, bumpType) {
    const cleanVersion = currentVersion.replace(/^v/, '');
    
    if (!this.validateVersion(cleanVersion)) {
      throw new Error(`Invalid current version format: ${currentVersion}`);
    }

    switch (bumpType) {
      case 'major':
        return semver.inc(cleanVersion, 'major');
      case 'minor':
        return semver.inc(cleanVersion, 'minor');
      case 'patch':
        return semver.inc(cleanVersion, 'patch');
      case 'prerelease':
        return semver.inc(cleanVersion, 'prerelease');
      default:
        throw new Error(`Invalid bump type: ${bumpType}`);
    }
  }

  /**
   * Update version in project files
   */
  async updateVersion(newVersion) {
    const config = await this.loadProjectConfig();
    
    log.step(`Updating version to: ${newVersion}`);
    
    try {
      switch (config.projectType) {
        case 'javascript':
          if (file.exists('package.json')) {
            // Use npm version command (safer than manual edit)
            const result = await cmd.exec(`npm version ${newVersion} --no-git-tag-version`);
            if (result.success) {
              log.success('Updated package.json');
            } else {
              throw new Error(`npm version failed: ${result.stderr}`);
            }
          }
          break;
          
        case 'python':
          if (file.exists('pyproject.toml')) {
            const content = await file.read('pyproject.toml');
            const updated = content.replace(
              /^version\s*=\s*"[^"]+"/m,
              `version = "${newVersion}"`
            );
            await file.write('pyproject.toml', updated);
            log.success('Updated pyproject.toml');
          } else if (file.exists('setup.py')) {
            const content = await file.read('setup.py');
            const updated = content.replace(
              /version\s*=\s*["'][^"']+["']/,
              `version="${newVersion}"`
            );
            await file.write('setup.py', updated);
            log.success('Updated setup.py');
          }
          break;
          
        case 'rust':
          if (file.exists('Cargo.toml')) {
            const content = await file.read('Cargo.toml');
            const updated = content.replace(
              /^version\s*=\s*"[^"]+"/m,
              `version = "${newVersion}"`
            );
            await file.write('Cargo.toml', updated);
            log.success('Updated Cargo.toml');
          }
          break;
          
        case 'php':
          if (file.exists('composer.json')) {
            const pkg = JSON.parse(await file.read('composer.json'));
            pkg.version = newVersion;
            await file.write('composer.json', JSON.stringify(pkg, null, 2));
            log.success('Updated composer.json');
          }
          break;
          
        case 'java':
          if (file.exists('pom.xml')) {
            const content = await file.read('pom.xml');
            const updated = content.replace(
              /<version>[^<]+<\/version>/,
              `<version>${newVersion}</version>`
            );
            await file.write('pom.xml', updated);
            log.success('Updated pom.xml');
          }
          break;
          
        case 'generic':
          await file.write('VERSION', newVersion);
          log.success('Updated VERSION file');
          break;
      }
      
      // Also update VERSION file if it exists (for consistency)
      if (file.exists('VERSION') && config.projectType !== 'generic') {
        await file.write('VERSION', newVersion);
        log.success('Updated VERSION file');
      }
      
      return true;
    } catch (error) {
      log.error(`Failed to update version: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create git tag
   */
  async createGitTag(version, message = null) {
    const tagName = `v${version}`;
    
    log.step(`Creating git tag: ${tagName}`);
    
    try {
      // Check if tag already exists
      const existingResult = await cmd.exec('git tag --list');
      if (existingResult.success) {
        const existingTags = existingResult.stdout.split('\n').filter(tag => tag.trim());
        if (existingTags.includes(tagName)) {
          log.warning(`Tag ${tagName} already exists`);
          return false;
        }
      }
      
      // Create annotated tag
      const tagMessage = message || `Release version ${version}`;
      const result = await cmd.exec(`git tag -a ${tagName} -m "${tagMessage}"`);
      
      if (result.success) {
        log.success(`Created git tag: ${tagName}`);
        return true;
      } else {
        throw new Error(`Failed to create tag: ${result.stderr}`);
      }
    } catch (error) {
      log.error(`Failed to create git tag: ${error.message}`);
      throw error;
    }
  }

  /**
   * Show current version info
   */
  async showVersionInfo() {
    const config = await this.loadProjectConfig();
    const currentVersion = await this.getCurrentVersion();
    
    log.divider();
    log.header('Version Information');
    log.info(`Project Type: ${config.projectType}`);
    log.info(`Current Version: ${currentVersion}`);
    log.info(`Version File: ${config.versionFile}`);
    log.info(`Package Manager: ${config.packageManager}`);
    
    // Show git tag info if available
    try {
      const result = await cmd.exec('git describe --tags --abbrev=0');
      if (result.success) {
        log.info(`Latest Git Tag: ${result.stdout}`);
      }
    } catch (error) {
      log.debug('No git repository or tags found');
    }
    
    log.divider();
    log.info('Available bump types:');
    log.info('  patch - Bug fixes (x.x.X)');
    log.info('  minor - New features (x.X.x)');
    log.info('  major - Breaking changes (X.x.x)');
    log.info('  prerelease - Pre-release version');
    
    return { config, currentVersion };
  }

  /**
   * Interactive version bump
   */
  async interactiveBump() {
    const { currentVersion } = await this.showVersionInfo();
    
    const choices = [
      {
        name: `patch (${this.incrementVersion(currentVersion, 'patch')}) - Bug fixes`,
        value: 'patch'
      },
      {
        name: `minor (${this.incrementVersion(currentVersion, 'minor')}) - New features`,
        value: 'minor'
      },
      {
        name: `major (${this.incrementVersion(currentVersion, 'major')}) - Breaking changes`,
        value: 'major'
      },
      {
        name: `prerelease (${this.incrementVersion(currentVersion, 'prerelease')}) - Pre-release`,
        value: 'prerelease'
      }
    ];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'bumpType',
        message: 'Select version bump type:',
        choices
      },
      {
        type: 'confirm',
        name: 'createTag',
        message: 'Create git tag?',
        default: true
      },
      {
        type: 'input',
        name: 'tagMessage',
        message: 'Tag message (optional):',
        when: (answers) => answers.createTag
      }
    ]);

    return answers;
  }

  /**
   * Bump version
   */
  async bumpVersion(bumpType, options = {}) {
    try {
      const currentVersion = await this.getCurrentVersion();
      const newVersion = this.incrementVersion(currentVersion, bumpType);
      
      log.header('Version Bump');
      log.info(`Current: ${currentVersion}`);
      log.info(`New: ${newVersion}`);
      log.divider();
      
      // Update version in files
      await this.updateVersion(newVersion);
      
      // Create git tag if requested
      if (options.tag) {
        await this.createGitTag(newVersion, options.tagMessage);
      }
      
      log.success(`Version bumped from ${currentVersion} to ${newVersion}`);
      return newVersion;
    } catch (error) {
      log.error(`Version bump failed: ${error.message}`);
      throw error;
    }
  }
}

/**
 * CLI Program
 */
const program = new Command();

program
  .name('version-manager')
  .description('🤖 Universal Version Management - Cross-platform Node.js version')
  .version('1.0.0');

program
  .command('show')
  .description('Show current version information')
  .action(async () => {
    try {
      const manager = new VersionManager();
      await manager.showVersionInfo();
    } catch (error) {
      log.error(`Failed to show version info: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('bump [type]')
  .description('Bump version (patch, minor, major, prerelease)')
  .option('-t, --tag', 'Create git tag', false)
  .option('-m, --message <message>', 'Tag message')
  .option('-i, --interactive', 'Interactive mode', false)
  .action(async (bumpType, options) => {
    try {
      const manager = new VersionManager();
      
      if (options.interactive || !bumpType) {
        const answers = await manager.interactiveBump();
        await manager.bumpVersion(answers.bumpType, {
          tag: answers.createTag,
          tagMessage: answers.tagMessage
        });
      } else {
        await manager.bumpVersion(bumpType, {
          tag: options.tag,
          tagMessage: options.message
        });
      }
    } catch (error) {
      log.error(`Version bump failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('set <version>')
  .description('Set specific version')
  .option('-t, --tag', 'Create git tag', false)
  .option('-m, --message <message>', 'Tag message')
  .action(async (version, options) => {
    try {
      const manager = new VersionManager();
      
      if (!manager.validateVersion(version)) {
        throw new Error(`Invalid version format: ${version}`);
      }
      
      await manager.updateVersion(version);
      
      if (options.tag) {
        await manager.createGitTag(version, options.message);
      }
      
      log.success(`Version set to ${version}`);
    } catch (error) {
      log.error(`Failed to set version: ${error.message}`);
      process.exit(1);
    }
  });

// Export for use as module
export { VersionManager };

// Run if called directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  program.parse();
} 