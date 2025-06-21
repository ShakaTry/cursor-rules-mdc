#!/usr/bin/env node

/**
 * 🐙 GitHub Helper - GitHub CLI Integration
 * Advanced GitHub operations with CLI integration and API support
 */

import utils from './utils.js';

const { cmd, log } = utils.default;

/**
 * GitHub CLI operations
 */
export class GitHubHelper {
  constructor() {
    this.initialized = false;
    this.authenticated = false;
  }

  /**
   * Initialize and check GitHub CLI availability
   */
  async initialize() {
    try {
      const ghExists = await cmd.exists('gh');
      if (!ghExists) {
        log.warning('GitHub CLI (gh) not found. Some features will be limited.');
        this.initialized = false;
        return false;
      }

      // Check authentication status
      const authResult = await cmd.exec('gh auth status');
      this.authenticated = authResult.success;
      this.initialized = true;

      if (!this.authenticated) {
        log.warning('GitHub CLI not authenticated. Run: gh auth login');
      }

      return true;
    } catch (error) {
      this.initialized = false;
      this.authenticated = false;
      return false;
    }
  }

  /**
   * Ensure GitHub CLI is available and authenticated
   */
  async ensureAuth() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.initialized) {
      throw new Error('GitHub CLI not available. Install with: npm install -g @github/cli');
    }

    if (!this.authenticated) {
      throw new Error('GitHub CLI not authenticated. Run: gh auth login');
    }
  }

  /**
   * Create GitHub release
   */
  async createRelease(tagName, options = {}) {
    await this.ensureAuth();

    const releaseOptions = [];
    if (options.title) {
      releaseOptions.push(`--title "${options.title}"`);
    }
    if (options.notes) {
      releaseOptions.push(`--notes "${options.notes}"`);
    }
    if (options.draft) {
      releaseOptions.push('--draft');
    }
    if (options.prerelease) {
      releaseOptions.push('--prerelease');
    }

    const command = `gh release create ${tagName} ${releaseOptions.join(' ')}`;
    return await cmd.exec(command);
  }

  /**
   * Get latest release
   */
  async getLatestRelease() {
    await this.ensureAuth();

    const result = await cmd.exec('gh release list --limit 1 --json tagName,name,publishedAt');
    if (!result.success) {
      return null;
    }

    try {
      const releases = JSON.parse(result.stdout);
      return releases.length > 0 ? releases[0] : null;
    } catch (error) {
      log.error('Failed to parse release data');
      return null;
    }
  }

  /**
   * Create pull request
   */
  async createPullRequest(options = {}) {
    await this.ensureAuth();

    const prOptions = [];
    if (options.title) {
      prOptions.push(`--title "${options.title}"`);
    }
    if (options.body) {
      prOptions.push(`--body "${options.body}"`);
    }
    if (options.base) {
      prOptions.push(`--base ${options.base}`);
    }
    if (options.head) {
      prOptions.push(`--head ${options.head}`);
    }
    if (options.draft) {
      prOptions.push('--draft');
    }

    const command = `gh pr create ${prOptions.join(' ')}`;
    return await cmd.exec(command);
  }

  /**
   * Get repository information
   */
  async getRepoInfo() {
    await this.ensureAuth();

    const result = await cmd.exec('gh repo view --json name,owner,url,description,defaultBranch');
    if (!result.success) {
      return null;
    }

    try {
      return JSON.parse(result.stdout);
    } catch (error) {
      log.error('Failed to parse repository data');
      return null;
    }
  }

  /**
   * Create issue
   */
  async createIssue(title, body = '', options = {}) {
    await this.ensureAuth();

    const issueOptions = [`--title "${title}"`, `--body "${body}"`];
    
    if (options.labels && options.labels.length > 0) {
      issueOptions.push(`--label "${options.labels.join(',')}"`);
    }
    if (options.assignees && options.assignees.length > 0) {
      issueOptions.push(`--assignee "${options.assignees.join(',')}"`);
    }
    if (options.milestone) {
      issueOptions.push(`--milestone "${options.milestone}"`);
    }

    const command = `gh issue create ${issueOptions.join(' ')}`;
    return await cmd.exec(command);
  }

  /**
   * Get workflow runs
   */
  async getWorkflowRuns(limit = 10) {
    await this.ensureAuth();

    const result = await cmd.exec(`gh run list --limit ${limit} --json status,conclusion,workflowName,createdAt`);
    if (!result.success) {
      return [];
    }

    try {
      return JSON.parse(result.stdout);
    } catch (error) {
      log.error('Failed to parse workflow runs data');
      return [];
    }
  }

  /**
   * Check if repository exists
   */
  async repoExists(repo = null) {
    try {
      const command = repo ? `gh repo view ${repo}` : 'gh repo view';
      const result = await cmd.exec(command);
      return result.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fork repository
   */
  async forkRepo(repo, options = {}) {
    await this.ensureAuth();

    const forkOptions = [];
    if (options.clone) {
      forkOptions.push('--clone');
    }
    if (options.remote) {
      forkOptions.push('--remote');
    }

    const command = `gh repo fork ${repo} ${forkOptions.join(' ')}`;
    return await cmd.exec(command);
  }

  /**
   * Clone repository
   */
  async cloneRepo(repo, directory = null) {
    await this.ensureAuth();

    const command = directory 
      ? `gh repo clone ${repo} ${directory}`
      : `gh repo clone ${repo}`;
    
    return await cmd.exec(command);
  }

  /**
   * Set repository secrets
   */
  async setSecret(name, value, options = {}) {
    await this.ensureAuth();

    const secretOptions = [];
    if (options.env) {
      secretOptions.push(`--env ${options.env}`);
    }

    const command = `gh secret set ${name} --body "${value}" ${secretOptions.join(' ')}`;
    return await cmd.exec(command);
  }
}

// Create singleton instance
const githubHelper = new GitHubHelper();

// Export both class and instance
export { GitHubHelper };
export default githubHelper; 