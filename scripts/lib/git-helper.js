#!/usr/bin/env node

/**
 * 🔧 Git Helper - Advanced Git Operations
 * Specialized Git operations with error handling and cross-platform support
 */

import utils from './utils.js';

const { cmd, log } = utils;

/**
 * Enhanced Git operations
 */
export class GitHelper {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize and verify Git repository
   */
  async initialize() {
    try {
      const result = await cmd.exec('git rev-parse --git-dir');
      this.initialized = result.success;
      return this.initialized;
    } catch (error) {
      this.initialized = false;
      return false;
    }
  }

  /**
   * Ensure we're in a Git repository
   */
  async ensureRepo() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.initialized) {
      throw new Error('Not in a Git repository');
    }
  }

  /**
   * Get detailed Git status
   */
  async getStatus() {
    await this.ensureRepo();

    const statusResult = await cmd.exec('git status --porcelain');
    const branchResult = await cmd.exec('git branch --show-current');

    const files = statusResult.success
      ? statusResult.stdout
          .split('\n')
          .filter(line => line.trim())
          .map(line => ({
            status: line.substring(0, 2),
            file: line.substring(3),
            staged: line[0] !== ' ' && line[0] !== '?',
            modified: line[1] !== ' ' && line[1] !== '?',
            untracked: line.startsWith('??'),
          }))
      : [];

    return {
      clean: statusResult.success && statusResult.stdout === '',
      files,
      staged: files.filter(f => f.staged),
      modified: files.filter(f => f.modified),
      untracked: files.filter(f => f.untracked),
      branch: branchResult.success ? branchResult.stdout : null,
    };
  }

  /**
   * Stage files with pattern support
   */
  async add(files = '.') {
    await this.ensureRepo();

    if (Array.isArray(files)) {
      files = files.join(' ');
    }

    return await cmd.exec(`git add ${files}`);
  }

  /**
   * Commit with enhanced validation
   */
  async commit(message, options = {}) {
    await this.ensureRepo();

    const commitOptions = [];
    if (options.amend) {
      commitOptions.push('--amend');
    }
    if (options.noVerify) {
      commitOptions.push('--no-verify');
    }

    const command = `git commit ${commitOptions.join(' ')} -m "${message}"`;
    return await cmd.exec(command);
  }

  /**
   * Create and manage tags
   */
  async createTag(tagName, message = null, options = {}) {
    await this.ensureRepo();

    const tagOptions = [];
    if (message) {
      tagOptions.push(`-a -m "${message}"`);
    }
    if (options.force) {
      tagOptions.push('-f');
    }

    const command = `git tag ${tagOptions.join(' ')} ${tagName}`;
    return await cmd.exec(command);
  }

  /**
   * Get all tags
   */
  async getTags() {
    await this.ensureRepo();

    const result = await cmd.exec('git tag --list');
    return result.success ? result.stdout.split('\n').filter(tag => tag.trim()) : [];
  }

  /**
   * Check if working directory is clean
   */
  async isClean() {
    const status = await this.getStatus();
    return status.clean;
  }

  /**
   * Get ahead/behind commit count
   */
  async getAheadBehind() {
    const result = await cmd.exec('git rev-list --count --left-right @{upstream}...HEAD');
    if (!result.success) {
      return { ahead: 0, behind: 0 };
    }

    const [behind, ahead] = result.stdout.split('\t').map(n => parseInt(n) || 0);
    return { ahead, behind };
  }

  /**
   * Push with tracking and error handling
   */
  async push(remote = 'origin', branch = null, options = {}) {
    await this.ensureRepo();

    const currentBranch = branch || (await this.getStatus()).branch;
    if (!currentBranch) {
      throw new Error('Cannot determine current branch');
    }

    const pushOptions = [];
    if (options.setUpstream) {
      pushOptions.push(`--set-upstream ${remote} ${currentBranch}`);
    }
    if (options.force) {
      pushOptions.push('--force-with-lease');
    }
    if (options.tags) {
      pushOptions.push('--tags');
    }

    const command = options.setUpstream
      ? `git push ${pushOptions.join(' ')}`
      : `git push ${remote} ${currentBranch} ${pushOptions.join(' ')}`;

    return await cmd.exec(command);
  }

  /**
   * Pull with rebase option
   */
  async pull(remote = 'origin', branch = null, options = {}) {
    await this.ensureRepo();

    const currentBranch = branch || (await this.getStatus()).branch;
    const pullOptions = [];

    if (options.rebase) {
      pullOptions.push('--rebase');
    }
    if (options.ff) {
      pullOptions.push('--ff-only');
    }

    const command = `git pull ${remote} ${currentBranch} ${pullOptions.join(' ')}`;
    return await cmd.exec(command);
  }

  /**
   * Get latest tag
   */
  async getLatestTag() {
    await this.ensureRepo();

    const result = await cmd.exec('git describe --tags --abbrev=0');
    return result.success ? result.stdout : null;
  }

  /**
   * Get commit history
   */
  async getCommits(count = 10, format = 'oneline') {
    await this.ensureRepo();

    const formatOptions = {
      oneline: '--oneline',
      full: '--pretty=format:"%H|%an|%ad|%s" --date=short',
      json: '--pretty=format:"{\\"hash\\": \\"%H\\", \\"author\\": \\"%an\\", \\"date\\": \\"%ad\\", \\"message\\": \\"%s\\"}" --date=short',
    };

    const formatOption = formatOptions[format] || formatOptions.oneline;
    const result = await cmd.exec(`git log ${formatOption} -${count}`);

    if (!result.success) {
      return [];
    }

    if (format === 'json') {
      return result.stdout
        .split('\n')
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }

    return result.stdout.split('\n').filter(line => line.trim());
  }

  /**
   * Get remote information
   */
  async getRemotes() {
    await this.ensureRepo();

    const result = await cmd.exec('git remote -v');
    if (!result.success) {
      return {};
    }

    const remotes = {};
    result.stdout.split('\n').forEach(line => {
      const match = line.match(/^(\S+)\s+(\S+)\s+\((\w+)\)$/);
      if (match) {
        const [, name, url, type] = match;
        if (!remotes[name]) {
          remotes[name] = {};
        }
        remotes[name][type] = url;
      }
    });

    return remotes;
  }

  /**
   * Stash operations
   */
  async stash(message = null, options = {}) {
    await this.ensureRepo();

    const stashOptions = [];
    if (message) {
      stashOptions.push(`push -m "${message}"`);
    }
    if (options.includeUntracked) {
      stashOptions.push('-u');
    }
    if (options.keepIndex) {
      stashOptions.push('--keep-index');
    }

    const command = `git stash ${stashOptions.length ? stashOptions.join(' ') : 'push'}`;
    return await cmd.exec(command);
  }

  /**
   * Apply stash
   */
  async stashPop(stashRef = null) {
    await this.ensureRepo();

    const command = stashRef ? `git stash pop ${stashRef}` : 'git stash pop';
    return await cmd.exec(command);
  }

  /**
   * Git cleanup operations
   */
  async cleanup() {
    await this.ensureRepo();

    log.step('Running Git cleanup operations...');

    const operations = [
      { name: 'Garbage collection', command: 'git gc --prune=now' },
      { name: 'Prune remote branches', command: 'git remote prune origin' },
      { name: 'Clean untracked files (dry run)', command: 'git clean -n' },
    ];

    const results = {};

    for (const op of operations) {
      log.info(`Running: ${op.name}`);
      const result = await cmd.exec(op.command);
      results[op.name] = result.success;

      if (result.success) {
        log.success(`${op.name} completed`);
      } else {
        log.warning(`${op.name} failed: ${result.stderr}`);
      }
    }

    return results;
  }

  /**
   * Validate repository health
   */
  async validateHealth() {
    await this.ensureRepo();

    const checks = [];

    // Check if we have commits
    const hasCommits = await cmd.exec('git rev-list --count HEAD');
    checks.push({
      name: 'Has commits',
      passed: hasCommits.success && parseInt(hasCommits.stdout) > 0,
      details: hasCommits.success ? `${hasCommits.stdout} commits` : 'No commits found',
    });

    // Check remote configuration
    const remotes = await this.getRemotes();
    checks.push({
      name: 'Remote configured',
      passed: Object.keys(remotes).length > 0,
      details: Object.keys(remotes).join(', ') || 'No remotes',
    });

    // Check for uncommitted changes
    const status = await this.getStatus();
    checks.push({
      name: 'Working tree clean',
      passed: status.clean,
      details: status.clean ? 'Clean' : `${status.files.length} changed files`,
    });

    return {
      healthy: checks.every(check => check.passed),
      checks,
    };
  }
}

// Create singleton instance
const gitHelper = new GitHelper();

// Export default instance
export default gitHelper;
