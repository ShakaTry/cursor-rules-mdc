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
import SmartCommitDetector from './lib/smart-commit-detector.js';

const { log, file, cmd } = utils.default;
const git = new GitHelper();

// Configuration
const COMMIT_TYPES = [
  { value: 'feat', name: 'feat: ✨ A new feature' },
  { value: 'fix', name: 'fix: 🐛 A bug fix' },
  { value: 'docs', name: 'docs: 📚 Documentation only changes' },
  { value: 'style', name: 'style: 💎 Changes that do not affect the meaning of the code' },
  {
    value: 'refactor',
    name: 'refactor: 📦 A code change that neither fixes a bug nor adds a feature',
  },
  { value: 'perf', name: 'perf: 🚀 A code change that improves performance' },
  { value: 'test', name: 'test: 🚨 Adding missing tests or correcting existing tests' },
  {
    value: 'build',
    name: 'build: 🛠️ Changes that affect the build system or external dependencies',
  },
  { value: 'ci', name: 'ci: ⚙️ Changes to our CI configuration files and scripts' },
  { value: 'chore', name: "chore: 🗃️ Other changes that don't modify src or test files" },
  { value: 'revert', name: 'revert: ⏪ Reverts a previous commit' },
];

const BREAKING_CHANGE_INDICATOR = '!';

class CommitHelper {
  constructor() {
    this.projectConfig = null;
    this.smartDetector = new SmartCommitDetector();
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
    const conventionalCommitRegex =
      /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?:\s.+/;

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
   * Smart commit detection with AI-like analysis
   */
  async smartCommitDetection() {
    log.step('🧠 Activating smart commit detection...');

    try {
      const detection = await this.smartDetector.detectCommitType();

      if (detection.confidence > 0.7) {
        log.success(
          `High confidence: ${detection.type} (${(detection.confidence * 100).toFixed(1)}%)`
        );
        return {
          type: detection.type,
          confidence: detection.confidence,
          reason: detection.reason,
          autoConfirm: true,
        };
      } else if (detection.confidence > 0.4) {
        log.warning(
          `Medium confidence: ${detection.type} (${(detection.confidence * 100).toFixed(1)}%)`
        );
        return {
          type: detection.type,
          confidence: detection.confidence,
          reason: detection.reason,
          autoConfirm: false,
        };
      } else {
        log.info(`Low confidence: ${detection.type} (${(detection.confidence * 100).toFixed(1)}%)`);
        return {
          type: detection.type,
          confidence: detection.confidence,
          reason: detection.reason,
          autoConfirm: false,
        };
      }
    } catch (error) {
      log.error(`Smart detection failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate smart description based on detected type and files
   */
  async generateSmartDescription(commitType) {
    try {
      // Get files involved
      const stagedFiles = await this.smartDetector.getStagedFiles();
      const modifiedFiles = await this.smartDetector.getModifiedFiles();
      const allFiles = [...new Set([...stagedFiles, ...modifiedFiles])];

      return await this.smartDetector.generateSmartDescription(commitType, allFiles);
    } catch (error) {
      log.warning(`Smart description generation failed: ${error.message}`);
      return 'update code';
    }
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
        if (!result.success) {
          return false;
        }

        log.step('Running go vet...');
        result = await cmd.exec('go vet ./...');
        if (!result.success) {
          return false;
        }
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
        if (!result.success) {
          return false;
        }
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
      const checksPass = await this.runPreCommitChecks();
      if (!checksPass) {
        return false;
      }
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
   * Interactive commit creation with smart detection
   */
  async interactiveCommit() {
    log.header('🧠 Smart Interactive Commit Helper');

    // Try smart detection first
    const smartDetection = await this.smartCommitDetection();

    let answers = {};

    if (smartDetection && smartDetection.autoConfirm) {
      // High confidence - auto-suggest
      log.success(`Smart detection complete! Detected: ${smartDetection.type}`);
      log.info(`Reason: ${smartDetection.reason}`);

      const smartDescription = await this.generateSmartDescription(smartDetection.type);

      const { useSmartSuggestion } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useSmartSuggestion',
          message: `Use smart suggestion: ${smartDetection.type}: ${smartDescription}?`,
          default: true,
        },
      ]);

      if (useSmartSuggestion) {
        answers.type = smartDetection.type;
        answers.description = smartDescription;
        answers.breaking = false;
        answers.scope = '';
        answers.body = '';
      }
    }

    // If no smart suggestion accepted or low confidence, use interactive mode
    if (!answers.type) {
      const defaultType = smartDetection ? smartDetection.type : 'feat';
      const typeChoices = COMMIT_TYPES.map(choice => ({
        ...choice,
        name: choice.value === defaultType ? `${choice.name} (🧠 suggested)` : choice.name,
      }));

      const interactiveAnswers = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: smartDetection
            ? `Smart detection suggests "${smartDetection.type}" (${(smartDetection.confidence * 100).toFixed(1)}% confidence). Select type:`
            : 'Select the type of change:',
          choices: typeChoices,
          default: defaultType,
        },
        {
          type: 'input',
          name: 'scope',
          message: 'Enter the scope (optional):',
          validate: input =>
            !input || /^[a-z-]+$/.test(input) || 'Scope should be lowercase with hyphens',
        },
        {
          type: 'confirm',
          name: 'breaking',
          message: 'Is this a breaking change?',
          default: false,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter the commit description:',
          default: smartDetection ? await this.generateSmartDescription(defaultType) : '',
          validate: input => input.length >= 10 || 'Description must be at least 10 characters',
        },
        {
          type: 'input',
          name: 'body',
          message: 'Enter the commit body (optional):',
        },
      ]);

      answers = { ...answers, ...interactiveAnswers };
    }

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

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with this commit?',
        default: true,
      },
    ]);

    if (confirm) {
      return await this.executeCommit(commitMsg);
    }

    log.warning('Commit cancelled');
    return false;
  }

  /**
   * 🧠 Fully automated smart commit mode
   */
  async smartCommitMode() {
    log.header('🧠 SMART COMMIT MODE - Fully Automated');
    log.divider();

    try {
      // Step 1: Smart detection
      const detection = await this.smartCommitDetection();

      if (!detection) {
        log.error('Smart detection failed, using fallback commit');
        const fallbackMessage = 'chore: update project files';
        return await this.executeCommit(fallbackMessage);
      }

      // Step 2: Generate smart description
      const smartDescription = await this.generateSmartDescription(detection.type);

      // Step 3: Build commit message
      const commitMessage = `${detection.type}: ${smartDescription}`;

      // Step 4: Display analysis
      log.step('📊 Smart Analysis Results:');
      console.log(`   Type: ${detection.type}`);
      console.log(`   Description: ${smartDescription}`);
      console.log(`   Confidence: ${(detection.confidence * 100).toFixed(1)}%`);
      console.log(`   Reason: ${detection.reason}`);
      console.log(`   Full message: "${commitMessage}"`);
      log.divider();

      // Step 5: Auto-commit (simplified for AI usage)
      if (detection.confidence > 0.4) {
        log.success(`🚀 Auto-committing (${(detection.confidence * 100).toFixed(1)}% confidence)!`);
        const success = await this.executeCommit(commitMessage);
        if (success) {
          log.success('✅ Smart commit completed successfully!');
        }
        return success;
      } else {
        log.warning('⚠️ Low confidence - Using detected type anyway');
        const success = await this.executeCommit(commitMessage);
        if (success) {
          log.success('✅ Smart commit completed successfully!');
        }
        return success;
      }
    } catch (error) {
      log.error(`Smart commit mode failed: ${error.message}`);
      log.info('Using fallback commit...');
      const fallbackMessage = 'chore: update project files';
      return await this.executeCommit(fallbackMessage);
    }
  }

  /**
   * Show usage information
   */
  showUsage() {
    log.header('🧠 Smart Universal Commit Helper');
    log.divider();
    console.log('Usage: node scripts/commit-helper.js [options] [message]');
    console.log('');
    console.log('🧠 SMART MODES:');
    console.log(
      '  node scripts/commit-helper.js --smart              # Fully automated AI detection'
    );
    console.log(
      '  node scripts/commit-helper.js --interactive        # Smart-assisted interactive mode'
    );
    console.log('');
    console.log('📝 MANUAL MODES:');
    console.log('  node scripts/commit-helper.js "feat(auth): add login functionality"');
    console.log('  node scripts/commit-helper.js "fix: resolve memory leak issue"');
    console.log('  node scripts/commit-helper.js "docs: update installation guide"');
    console.log('  node scripts/commit-helper.js "feat!: breaking change in API" --no-verify');
    console.log('');
    console.log('🧠 SMART FEATURES:');
    console.log('  • Analyzes file patterns and changes');
    console.log('  • Detects commit type automatically (feat, fix, docs, etc.)');
    console.log('  • Generates intelligent descriptions');
    console.log(
      '  • Confidence-based auto-commit (>80% = auto, >50% = confirm, <50% = interactive)'
    );
    console.log('  • Supports all languages and frameworks');
    console.log('');
    console.log(`Valid commit types: ${COMMIT_TYPES.map(t => t.value).join(', ')}`);
    console.log('Use ! after type for breaking changes');
    console.log('');
    console.log('🎯 SMART DETECTION PATTERNS:');
    console.log('  feat     → New files in src/, components/, features/');
    console.log('  fix      → Bug-related keywords in diff content');
    console.log('  docs     → .md, README, documentation files');
    console.log('  test     → .test.js, .spec.js, test/ files');
    console.log('  build    → package.json, webpack, build configs');
    console.log('  ci       → .github/workflows/, CI configs');
    console.log('  chore    → .gitignore, linting, maintenance files');
  }
}

// CLI setup
const program = new Command();
const commitHelper = new CommitHelper();

program
  .name('commit-helper')
  .description('🧠 Smart Universal Commit Assistant - AI-powered conventional commits')
  .version('2.0.0')
  .argument('[message]', 'Commit message')
  .option('-i, --interactive', 'Interactive commit creation')
  .option('-s, --smart', '🧠 Fully automated smart commit detection')
  .option('--no-verify', 'Skip pre-commit hooks and checks')
  .option('-d, --dry-run', 'Show what would be done without executing')
  .option('-v, --verbose', 'Verbose output')
  .action(async (message, options) => {
    try {
      await commitHelper.loadProjectConfig();

      if (options.smart) {
        // Fully automated smart mode
        await commitHelper.smartCommitMode();
      } else if (options.interactive || !message) {
        await commitHelper.interactiveCommit();
      } else {
        if (options.dryRun) {
          log.step(`DRY RUN - Would commit: "${message}"`);
          const isValid = commitHelper.validateCommitFormat(message);
          const bumpType = commitHelper.getVersionBumpType(message);
          log.step(`Valid format: ${isValid}`);
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

if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  program.parse();
}

export default CommitHelper;
