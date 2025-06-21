#!/usr/bin/env node

/**
 * 📦 NPM Helper - Advanced Package Management Operations
 * Cross-platform npm/yarn/pnpm operations with enhanced error handling
 */

import utils from './utils.js';

const { cmd, log, file, platform } = utils;

/**
 * Package Manager Helper
 */
export class NpmHelper {
  constructor() {
    this.packageManager = null;
    this.lockFile = null;
  }

  /**
   * Detect package manager based on lock files
   */
  async detectPackageManager() {
    if (this.packageManager) {
      return this.packageManager;
    }

    // Check for lock files in order of priority
    if (file.exists('package-lock.json')) {
      this.packageManager = 'npm';
      this.lockFile = 'package-lock.json';
    } else if (file.exists('yarn.lock')) {
      this.packageManager = 'yarn';
      this.lockFile = 'yarn.lock';
    } else if (file.exists('pnpm-lock.yaml')) {
      this.packageManager = 'pnpm';
      this.lockFile = 'pnpm-lock.yaml';
    } else if (file.exists('bun.lockb')) {
      this.packageManager = 'bun';
      this.lockFile = 'bun.lockb';
    } else if (file.exists('package.json')) {
      // Default to npm if package.json exists
      this.packageManager = 'npm';
      this.lockFile = null;
    } else {
      this.packageManager = null;
      this.lockFile = null;
    }

    return this.packageManager;
  }

  /**
   * Ensure package manager is available
   */
  async ensurePackageManager() {
    const pm = await this.detectPackageManager();

    if (!pm) {
      throw new Error('No package.json found in current directory');
    }

    // Check if package manager is installed
    const available = await cmd.exists(pm);
    if (!available) {
      throw new Error(`Package manager '${pm}' is not installed`);
    }

    return pm;
  }

  /**
   * Install dependencies
   */
  async install(options = {}) {
    const pm = await this.ensurePackageManager();

    log.step(`Installing dependencies with ${pm}...`);

    let command;
    switch (pm) {
      case 'npm':
        command = options.production ? 'npm install --production' : 'npm install';
        break;
      case 'yarn':
        command = options.production ? 'yarn install --production' : 'yarn install';
        break;
      case 'pnpm':
        command = options.production ? 'pnpm install --prod' : 'pnpm install';
        break;
      case 'bun':
        command = options.production ? 'bun install --production' : 'bun install';
        break;
    }

    if (options.frozen) {
      command += pm === 'npm' ? ' --ci' : ' --frozen-lockfile';
    }

    const result = await cmd.exec(command);

    if (result.success) {
      log.success(`Dependencies installed successfully with ${pm}`);
    } else {
      throw new Error(`Installation failed: ${result.stderr}`);
    }

    return result;
  }

  /**
   * Run npm/yarn scripts
   */
  async runScript(script, args = []) {
    const pm = await this.ensurePackageManager();

    // Check if script exists
    const packageJson = await this.getPackageJson();
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      throw new Error(`Script '${script}' not found in package.json`);
    }

    const argsStr = args.length > 0 ? ` -- ${args.join(' ')}` : '';

    let command;
    switch (pm) {
      case 'npm':
        command = `npm run ${script}${argsStr}`;
        break;
      case 'yarn':
        command = `yarn ${script}${argsStr}`;
        break;
      case 'pnpm':
        command = `pnpm run ${script}${argsStr}`;
        break;
      case 'bun':
        command = `bun run ${script}${argsStr}`;
        break;
    }

    log.step(`Running script: ${script}`);
    const result = await cmd.exec(command);

    if (result.success) {
      log.success(`Script '${script}' completed successfully`);
    } else {
      log.error(`Script '${script}' failed: ${result.stderr}`);
    }

    return result;
  }

  /**
   * Get package.json content
   */
  async getPackageJson() {
    if (!file.exists('package.json')) {
      throw new Error('package.json not found');
    }

    const content = await file.read('package.json');
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid package.json format: ${error.message}`);
    }
  }

  /**
   * Update package.json
   */
  async updatePackageJson(updates) {
    const current = await this.getPackageJson();
    const updated = { ...current, ...updates };

    await file.write('package.json', JSON.stringify(updated, null, 2));
    log.success('package.json updated');

    return updated;
  }

  /**
   * Install specific package
   */
  async installPackage(packageName, options = {}) {
    const pm = await this.ensurePackageManager();

    let command;
    const devFlag = options.dev ? (pm === 'npm' ? '--save-dev' : '--dev') : '';
    const globalFlag = options.global ? '--global' : '';

    switch (pm) {
      case 'npm':
        command = `npm install ${packageName} ${devFlag} ${globalFlag}`.trim();
        break;
      case 'yarn':
        command = `yarn add ${packageName} ${devFlag} ${globalFlag}`.trim();
        break;
      case 'pnpm':
        command = `pnpm add ${packageName} ${devFlag} ${globalFlag}`.trim();
        break;
      case 'bun':
        command = `bun add ${packageName} ${devFlag}`.trim(); // bun doesn't have global flag same way
        break;
    }

    log.step(`Installing package: ${packageName}`);
    const result = await cmd.exec(command);

    if (result.success) {
      log.success(`Package '${packageName}' installed successfully`);
    } else {
      throw new Error(`Failed to install ${packageName}: ${result.stderr}`);
    }

    return result;
  }

  /**
   * Remove package
   */
  async removePackage(packageName) {
    const pm = await this.ensurePackageManager();

    let command;
    switch (pm) {
      case 'npm':
        command = `npm uninstall ${packageName}`;
        break;
      case 'yarn':
        command = `yarn remove ${packageName}`;
        break;
      case 'pnpm':
        command = `pnpm remove ${packageName}`;
        break;
      case 'bun':
        command = `bun remove ${packageName}`;
        break;
    }

    log.step(`Removing package: ${packageName}`);
    const result = await cmd.exec(command);

    if (result.success) {
      log.success(`Package '${packageName}' removed successfully`);
    } else {
      throw new Error(`Failed to remove ${packageName}: ${result.stderr}`);
    }

    return result;
  }

  /**
   * List installed packages
   */
  async listPackages(options = {}) {
    const pm = await this.ensurePackageManager();

    let command;
    switch (pm) {
      case 'npm':
        command = options.global ? 'npm list -g --depth=0' : 'npm list --depth=0';
        break;
      case 'yarn':
        command = options.global ? 'yarn global list' : 'yarn list --depth=0';
        break;
      case 'pnpm':
        command = options.global ? 'pnpm list -g --depth=0' : 'pnpm list --depth=0';
        break;
      case 'bun':
        command = 'bun pm ls'; // bun's approach
        break;
    }

    const result = await cmd.exec(command);
    return result;
  }

  /**
   * Update version in package.json
   */
  async updateVersion(version, options = {}) {
    const pm = await this.ensurePackageManager();

    // Use npm version command for safest version update
    if (pm === 'npm') {
      const flags = options.noGitTag ? '--no-git-tag-version' : '';
      const command = `npm version ${version} ${flags}`.trim();

      const result = await cmd.exec(command);

      if (result.success) {
        log.success(`Version updated to ${version}`);
      } else {
        throw new Error(`Failed to update version: ${result.stderr}`);
      }

      return result;
    } else {
      // For other package managers, update manually
      await this.updatePackageJson({ version });
      return { success: true };
    }
  }

  /**
   * Check for outdated packages
   */
  async checkOutdated() {
    const pm = await this.ensurePackageManager();

    let command;
    switch (pm) {
      case 'npm':
        command = 'npm outdated';
        break;
      case 'yarn':
        command = 'yarn outdated';
        break;
      case 'pnpm':
        command = 'pnpm outdated';
        break;
      case 'bun':
        command = 'bun outdated';
        break;
    }

    const result = await cmd.exec(command);
    return result;
  }

  /**
   * Clean cache and node_modules
   */
  async clean() {
    const pm = await this.ensurePackageManager();

    log.step('Cleaning dependencies and cache...');

    // Remove node_modules
    if (file.exists('node_modules')) {
      const result = await cmd.exec(
        platform.isWindows ? 'rmdir /s /q node_modules' : 'rm -rf node_modules'
      );
      if (result.success) {
        log.success('node_modules removed');
      }
    }

    // Remove lock file if requested
    if (this.lockFile && file.exists(this.lockFile)) {
      const result = await cmd.exec(
        platform.isWindows ? `del "${this.lockFile}"` : `rm "${this.lockFile}"`
      );
      if (result.success) {
        log.success(`${this.lockFile} removed`);
      }
    }

    // Clean package manager cache
    let cleanCommand;
    switch (pm) {
      case 'npm':
        cleanCommand = 'npm cache clean --force';
        break;
      case 'yarn':
        cleanCommand = 'yarn cache clean';
        break;
      case 'pnpm':
        cleanCommand = 'pnpm store prune';
        break;
      case 'bun':
        cleanCommand = 'bun pm cache rm';
        break;
    }

    const result = await cmd.exec(cleanCommand);
    if (result.success) {
      log.success(`${pm} cache cleaned`);
    }

    return result;
  }

  /**
   * Get project info
   */
  async getProjectInfo() {
    const packageJson = await this.getPackageJson();
    const pm = await this.detectPackageManager();

    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      packageManager: pm,
      lockFile: this.lockFile,
      hasScripts: !!packageJson.scripts && Object.keys(packageJson.scripts).length > 0,
      scripts: packageJson.scripts || {},
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
    };
  }
}

// Export helper instance
export const npmHelper = new NpmHelper();

// Export class and default instance
export default NpmHelper;
