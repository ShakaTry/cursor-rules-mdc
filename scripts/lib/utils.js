#!/usr/bin/env node

/**
 * 🛠️ Cross-Platform Utilities Library
 * Universal utilities for Node.js scripts across Windows/Mac/Linux
 */

import path, { sep, dirname } from 'path';
import { existsSync } from 'fs';
import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { homedir, platform as osPlatform, EOL } from 'os';

// Check if chalk is available
let chalk;
try {
  const chalkModule = await import('chalk');
  chalk = chalkModule.default;
} catch (error) {
  // Fallback without colors
  chalk = {
    blue: str => str,
    green: str => str,
    yellow: str => str,
    red: str => str,
    gray: str => str,
    cyan: str => str,
    magenta: str => str,
  };
}

const execAsync = promisify(exec);

/**
 * Platform Detection
 */
const platform_info = {
  isWindows: osPlatform() === 'win32',
  isMacOS: osPlatform() === 'darwin',
  isLinux: osPlatform() === 'linux',
  isUnix: osPlatform() !== 'win32',
  platform: osPlatform(),
  pathSeparator: sep,
  lineEnding: EOL,
  homeDir: homedir(),
};

/**
 * 🎨 Colored Console Output
 */
const log = {
  status: message => console.log(chalk.blue(`[INFO]`) + ` ${message}`),
  info: message => console.log(chalk.blue(`[INFO]`) + ` ${message}`),
  success: message => console.log(chalk.green(`[SUCCESS]`) + ` ${message}`),
  warning: message => console.log(chalk.yellow(`[WARNING]`) + ` ${message}`),
  error: message => console.log(chalk.red(`[ERROR]`) + ` ${message}`),
  debug: message => console.log(chalk.gray(`[DEBUG]`) + ` ${message}`),
  step: message => console.log(chalk.cyan(`🔧 ${message}`)),
  header: message => console.log(chalk.magenta(`\n🤖 ${message}`)),
  divider: () => console.log(chalk.gray('─'.repeat(50))),
};

/**
 * 📁 Cross-Platform File Operations
 */
const file = {
  /**
   * Check if file exists
   */
  exists: filePath => existsSync(filePath),

  /**
   * Ensure directory exists
   */
  ensureDir: async dirPath => {
    try {
      await mkdir(dirPath, { recursive: true });
      return true;
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
      return true;
    }
  },

  /**
   * Read file with error handling
   */
  read: async (filePath, encoding = 'utf8') => {
    try {
      return await readFile(filePath, encoding);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  },

  /**
   * Write file with directory creation
   */
  write: async (filePath, content, encoding = 'utf8') => {
    await file.ensureDir(dirname(filePath));
    await writeFile(filePath, content, encoding);
  },

  /**
   * Get file stats
   */
  stats: async filePath => {
    try {
      return await stat(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  },

  /**
   * List directory contents
   */
  list: async dirPath => {
    try {
      return await readdir(dirPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  },

  /**
   * Cross-platform path resolution
   */
  path: {
    join: (...paths) => path.join(...paths),
    resolve: (...paths) => path.resolve(...paths),
    relative: (from, to) => path.relative(from, to),
    dirname: filePath => path.dirname(filePath),
    basename: filePath => path.basename(filePath),
  },
};

/**
 * ⚡ Cross-Platform Command Execution
 */
const cmd = {
  /**
   * Execute command with cross-platform support
   */
  exec: async (command, options = {}) => {
    const defaultOptions = {
      encoding: 'utf8',
      shell: true, // Let Node.js choose the appropriate shell
      ...options,
    };

    try {
      const { stdout, stderr } = await execAsync(command, defaultOptions);
      return { stdout: stdout.trim(), stderr: stderr.trim(), success: true };
    } catch (error) {
      return {
        stdout: error.stdout?.trim() || '',
        stderr: error.stderr?.trim() || error.message,
        success: false,
        error,
      };
    }
  },

  /**
   * Spawn process with cross-platform support
   */
  spawn: (command, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
      // Handle Windows executable extensions
      if (platform_info.isWindows && !command.includes('.')) {
        const extensions = ['.exe', '.cmd', '.bat'];
        for (const ext of extensions) {
          if (existsSync(command + ext)) {
            command = command + ext;
            break;
          }
        }
      }

      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options,
      });

      child.on('close', code => {
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  },

  /**
   * Check if command exists
   */
  exists: async command => {
    const checkCommand = platform_info.isWindows ? `where ${command}` : `which ${command}`;

    const result = await cmd.exec(checkCommand);
    return result.success;
  },
};

/**
 * 🔧 Git Operations Wrapper
 */
const git = {
  /**
   * Git status
   */
  status: async () => {
    const result = await cmd.exec('git status --porcelain');
    return {
      clean: result.success && result.stdout === '',
      files: result.stdout.split('\n').filter(line => line.trim()),
      ...result,
    };
  },

  /**
   * Get current branch
   */
  branch: async () => {
    const result = await cmd.exec('git branch --show-current');
    return result.success ? result.stdout : null;
  },

  /**
   * Get latest commit hash
   */
  commit: async () => {
    const result = await cmd.exec('git rev-parse HEAD');
    return result.success ? result.stdout : null;
  },

  /**
   * Add files to staging
   */
  add: async (files = '.') => {
    return await cmd.exec(`git add ${files}`);
  },

  /**
   * Commit changes
   */
  commitChanges: async message => {
    return await cmd.exec(`git commit -m "${message}"`);
  },

  /**
   * Push changes
   */
  push: async (remote = 'origin', branch = null) => {
    const currentBranch = branch || (await git.branch());
    return await cmd.exec(`git push ${remote} ${currentBranch}`);
  },

  /**
   * Get git tags
   */
  tags: async () => {
    const result = await cmd.exec('git tag --list');
    return result.success ? result.stdout.split('\n').filter(tag => tag.trim()) : [];
  },

  /**
   * Create git tag
   */
  tag: async (tagName, message = null) => {
    const command = message ? `git tag -a ${tagName} -m "${message}"` : `git tag ${tagName}`;
    return await cmd.exec(command);
  },
};

/**
 * 📦 Package Manager Operations
 */
const pkg = {
  /**
   * Detect package manager
   */
  detect: async () => {
    if (file.exists('package-lock.json')) {
      return 'npm';
    }
    if (file.exists('yarn.lock')) {
      return 'yarn';
    }
    if (file.exists('pnpm-lock.yaml')) {
      return 'pnpm';
    }
    if (file.exists('bun.lockb')) {
      return 'bun';
    }
    if (file.exists('package.json')) {
      return 'npm';
    }
    return null;
  },

  /**
   * Run package manager command
   */
  run: async (command, packageManager = null) => {
    const pm = packageManager || (await pkg.detect()) || 'npm';
    return await cmd.exec(`${pm} ${command}`);
  },

  /**
   * Install dependencies
   */
  install: async (packageManager = null) => {
    const pm = packageManager || (await pkg.detect()) || 'npm';
    const installCmd = pm === 'npm' ? 'install' : 'install';
    return await cmd.exec(`${pm} ${installCmd}`);
  },
};

/**
 * 🔍 Project Detection Utilities
 */
const project = {
  /**
   * Detect project type based on files
   */
  detectType: async () => {
    if (file.exists('package.json')) {
      return 'javascript';
    }
    if (file.exists('pyproject.toml') || file.exists('requirements.txt')) {
      return 'python';
    }
    if (file.exists('go.mod')) {
      return 'go';
    }
    if (file.exists('Cargo.toml')) {
      return 'rust';
    }
    if (file.exists('composer.json')) {
      return 'php';
    }
    if (file.exists('pom.xml') || file.exists('build.gradle')) {
      return 'java';
    }
    if (file.exists('package.swift')) {
      return 'swift';
    }
    if (file.exists('Gemfile')) {
      return 'ruby';
    }
    return 'generic';
  },

  /**
   * Get project info from package.json
   */
  getInfo: async () => {
    const packageJson = await file.read('package.json');
    if (!packageJson) {
      return null;
    }

    try {
      return JSON.parse(packageJson);
    } catch (error) {
      log.error('Invalid package.json format');
      return null;
    }
  },

  /**
   * Update package.json
   */
  updateInfo: async updates => {
    const current = await project.getInfo();
    if (!current) {
      throw new Error('No package.json found');
    }

    const updated = { ...current, ...updates };
    await file.write('package.json', JSON.stringify(updated, null, 2));
    return updated;
  },
};

/**
 * 🎯 Common Utilities
 */
const common = {
  /**
   * Sleep/delay function
   */
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Retry function with exponential backoff
   */
  retry: async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        await common.sleep(delay * Math.pow(2, i));
      }
    }
  },

  /**
   * Format bytes to human readable
   */
  formatBytes: bytes => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Generate timestamp
   */
  timestamp: () => new Date().toISOString(),

  /**
   * Validate semantic version
   */
  isValidVersion: version => {
    const semverRegex =
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)))*(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  },
};

// Add new functions needed for Phase 4 scripts
const execCmd = cmd.exec;
const commandExists = cmd.exists;
const ensureDir = file.ensureDir;
const copyFiles = async (src, dest) => {
  await file.ensureDir(dest);
  await cmd.exec(`cp -r "${src}"/* "${dest}"/`);
};
const removeFiles = async pattern => {
  try {
    await cmd.exec(`rm -rf "${pattern}"`);
  } catch (error) {
    // Ignore errors if files don't exist
  }
};
const getDirectorySize = async dir => {
  try {
    const result = await cmd.exec(`du -sh "${dir}"`);
    return result.success ? result.stdout.split('\t')[0] : '0';
  } catch (error) {
    return '0';
  }
};
const getDirectorySizeBytes = async dir => {
  try {
    const result = await cmd.exec(`du -sb "${dir}"`);
    return result.success ? parseInt(result.stdout.split('\t')[0]) : 0;
  } catch (error) {
    return 0;
  }
};
const countFiles = async dir => {
  try {
    const result = await cmd.exec(`find "${dir}" -type f | wc -l`);
    return result.success ? parseInt(result.stdout.trim()) : 0;
  } catch (error) {
    return 0;
  }
};

// ES module exports
export {
  platform_info,
  log,
  file,
  cmd,
  git,
  pkg,
  project,
  common,
  // Aliases for compatibility with new scripts
  execCmd as exec,
  commandExists,
  ensureDir,
  copyFiles,
  removeFiles,
  getDirectorySize,
  getDirectorySizeBytes,
  countFiles,
};

// Default export for backwards compatibility
export default {
  platform: platform_info,
  log,
  file,
  cmd,
  git,
  pkg,
  project,
  common,
  exec: execCmd,
  commandExists,
  ensureDir,
  copyFiles,
  removeFiles,
  getDirectorySize,
  getDirectorySizeBytes,
  countFiles,
};
