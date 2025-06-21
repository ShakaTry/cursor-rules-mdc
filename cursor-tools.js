#!/usr/bin/env node

/**
 * 🚀 CURSOR TOOLS - Universal Project Setup & Automation
 *
 * Dual Mode:
 * - DEVELOPMENT MODE: Uses individual scripts (scripts/*.js)
 * - COMPILED MODE: Self-contained with embedded scripts
 */

/* eslint-disable no-console */

import { Command } from 'commander';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

const program = new Command();

// Check if we're in development mode (scripts directory exists)
const isDevelopmentMode = existsSync('./scripts');

/**
 * Execute a script in the appropriate mode
 */
async function executeScript(scriptName, args = []) {
  if (isDevelopmentMode) {
    // DEVELOPMENT MODE: Use individual scripts
    console.log(`🔧 [DEV MODE] Running: node scripts/${scriptName}.js ${args.join(' ')}`);
    return new Promise((resolve, reject) => {
      const child = spawn('node', [`scripts/${scriptName}.js`, ...args], {
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script failed with code ${code}`));
        }
      });
    });
  } else {
    // COMPILED MODE: Use embedded scripts
    console.log(`📦 [COMPILED MODE] Running embedded: ${scriptName}`);
    // TODO: Import and execute embedded script functions
    throw new Error('Compiled mode not implemented yet');
  }
}

// CLI Commands
program
  .name('cursor-tools')
  .description('🚀 Universal Project Setup & Automation Tools')
  .version('1.0.0');

// Project Detection
program
  .command('detect')
  .description('Detect project type and configuration')
  .option('-f, --format <type>', 'Output format (console, json)', 'console')
  .option('-s, --save', 'Save results to .automation/')
  .action(async options => {
    const args = [];
    if (options.format) {
      args.push('-f', options.format);
    }
    if (options.save) {
      args.push('-s');
    }
    await executeScript('project-detector', args);
  });

// Setup Commands
program
  .command('setup')
  .description('Complete project setup')
  .option('-d, --dry-run', 'Show what would be done')
  .option('--skip-install', 'Skip dependency installation')
  .action(async options => {
    const args = [];
    if (options.dryRun) {
      args.push('-d');
    }
    if (options.skipInstall) {
      args.push('--skip-install');
    }
    await executeScript('setup', args);
  });

program
  .command('setup-automation')
  .description('Setup automation (Git hooks, etc.)')
  .option('-d, --dry-run', 'Show what would be done')
  .action(async options => {
    const args = [];
    if (options.dryRun) {
      args.push('-d');
    }
    await executeScript('setup-automation', args);
  });

// Build & Deploy
program
  .command('build')
  .description('Build the project')
  .option('--skip-quality', 'Skip quality checks')
  .option('--skip-tests', 'Skip tests')
  .action(async options => {
    const args = [];
    if (options.skipQuality) {
      args.push('--skip-quality');
    }
    if (options.skipTests) {
      args.push('--skip-tests');
    }
    await executeScript('build', args);
  });

program
  .command('clean')
  .description('Clean temporary files and caches')
  .option('--skip-vcs', 'Skip VCS cleanup')
  .option('--skip-docker', 'Skip Docker cleanup')
  .action(async options => {
    const args = [];
    if (options.skipVcs) {
      args.push('--skip-vcs');
    }
    if (options.skipDocker) {
      args.push('--skip-docker');
    }
    await executeScript('clean', args);
  });

program
  .command('deploy')
  .description('Deploy the project')
  .option('-t, --target <target>', 'Deployment target')
  .action(async options => {
    const args = [];
    if (options.target) {
      args.push('-t', options.target);
    }
    await executeScript('deploy', args);
  });

// Version & Release
program
  .command('version')
  .description('Version management')
  .argument('[action]', 'Action: show, bump')
  .argument('[type]', 'Bump type: patch, minor, major')
  .action(async (action = 'show', type) => {
    const args = [action];
    if (type) {
      args.push(type);
    }
    await executeScript('version-manager', args);
  });

program
  .command('release')
  .description('Create automated release')
  .option('-t, --type <type>', 'Release type (patch, minor, major)', 'patch')
  .option('-d, --dry-run', 'Dry run mode')
  .action(async options => {
    const args = [];
    if (options.type) {
      args.push('-t', options.type);
    }
    if (options.dryRun) {
      args.push('-d');
    }
    await executeScript('auto-release', args);
  });

// Git Workflow
program
  .command('commit')
  .description('🧠 Smart commit with AI-powered type detection')
  .argument('[message]', 'Commit message (optional with smart mode)')
  .option('-i, --interactive', 'Smart interactive mode')
  .option('-s, --smart', '🧠 Fully automated smart detection')
  .option('--no-verify', 'Skip pre-commit hooks')
  .action(async (message, options) => {
    const args = [];

    // Smart mode par défaut si pas de message
    if (!message && !options.interactive) {
      console.log('🧠 No message provided - activating smart mode');
      args.push('--smart');
    } else {
      if (message) {
        args.push(message);
      }
      if (options.smart) {
        args.push('-s');
      }
      if (options.interactive) {
        args.push('-i');
      }
    }

    if (options.noVerify) {
      args.push('--no-verify');
    }
    await executeScript('commit-helper', args);
  });

// Development info
program
  .command('info')
  .description('Show cursor-tools information')
  .action(() => {
    console.log('🚀 Cursor Tools Information');
    console.log('──────────────────────────────────');
    console.log(`Mode: ${isDevelopmentMode ? '🔧 DEVELOPMENT' : '📦 COMPILED'}`);
    console.log(`Version: 1.0.0`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Node.js: ${process.version}`);

    if (isDevelopmentMode) {
      console.log('\n📁 Available Scripts:');
      console.log('  • project-detector.js');
      console.log('  • setup.js');
      console.log('  • setup-automation.js');
      console.log('  • build.js');
      console.log('  • clean.js');
      console.log('  • deploy.js');
      console.log('  • version-manager.js');
      console.log('  • auto-release.js');
      console.log('  • commit-helper.js');
      console.log('\n💡 Individual scripts accessible for Claude debugging');
    } else {
      console.log('\n📦 Self-contained compiled version');
      console.log('💡 Use in development mode for Claude access');
    }
  });

// Handle errors
program.exitOverride();

try {
  await program.parseAsync();
} catch (error) {
  if (error.code !== 'commander.help' && error.code !== 'commander.version') {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

export default program;
