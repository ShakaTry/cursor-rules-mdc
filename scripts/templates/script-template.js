#!/usr/bin/env node

/**
 * 🤖 [SCRIPT_NAME] - [SCRIPT_DESCRIPTION]
 * Cross-platform Node.js script for universal automation
 */

import { Command } from 'commander';
import utils from './lib/utils.js';

const { log, platform } = utils;

// Script configuration
const SCRIPT_VERSION = '1.0.0';
const SCRIPT_NAME = '[SCRIPT_NAME]';

/**
 * Main script execution
 * @param {Object} options - Command line options
 */
async function main(options) {
  try {
    log.header(`${SCRIPT_NAME} - Cross-Platform Script`);
    log.info(`Platform: ${platform.platform} (${platform.isWindows ? 'Windows' : platform.isMacOS ? 'macOS' : 'Linux'})`);
    
    if (options.dryRun) {
      log.warning('DRY RUN MODE - No changes will be made');
    }
    
    if (options.verbose) {
      log.debug('Verbose mode enabled');
    }
    
    // ===============================
    // SCRIPT IMPLEMENTATION GOES HERE
    // ===============================
    
    // Example: Basic project detection
    log.step('Detecting project type...');
    const projectType = await utils.project.detectType();
    log.success(`Project type detected: ${projectType}`);
    
    // Example: Git status check
    if (options.checkGit) {
      log.step('Checking Git status...');
      const gitStatus = await utils.git.status();
      if (gitStatus.clean) {
        log.success('Git working tree is clean');
      } else {
        log.warning(`${gitStatus.files.length} files have changes`);
      }
    }
    
    // Example: File operations
    if (options.createFile) {
      log.step('Creating example file...');
      await utils.file.write('example-output.txt', `Script executed at: ${utils.utils.timestamp()}`);
      log.success('File created successfully');
    }
    
    log.divider();
    log.success(`${SCRIPT_NAME} completed successfully! 🎉`);
    
  } catch (error) {
    log.error(`Script failed: ${error.message}`);
    
    if (options.verbose) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

/**
 * Setup CLI interface
 */
function setupCLI() {
  const program = new Command();
  
  program
    .name(SCRIPT_NAME.toLowerCase().replace(/\s+/g, '-'))
    .description('[SCRIPT_DESCRIPTION]')
    .version(SCRIPT_VERSION);
  
  // Standard options for all scripts
  program
    .option('-d, --dry-run', 'Show what would be done without executing', false)
    .option('-v, --verbose', 'Enable verbose output', false)
    .option('--check-git', 'Check Git status', false)
    .option('--create-file', 'Create example file', false);
  
  // Script-specific options
  program
    .option('-f, --force', 'Force execution without prompts', false)
    .option('-c, --config <path>', 'Custom configuration file path')
    .option('-o, --output <path>', 'Output directory path');
  
  return program;
}

/**
 * Error handling and process management
 */
function setupErrorHandling() {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    log.error(`Uncaught Exception: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log.warning('Script interrupted by user (Ctrl+C)');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log.warning('Script terminated');
    process.exit(0);
  });
}

/**
 * Entry point
 */
async function run() {
  // Setup error handling
  setupErrorHandling();
  
  // Setup CLI
  const program = setupCLI();
  
  // Parse arguments and run
  program.action(async (options) => {
    await main(options);
  });
  
  // Parse command line arguments
  program.parse();
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((error) => {
    log.error(`Failed to start script: ${error.message}`);
    process.exit(1);
  });
}

// Export for testing or importing
export { main, setupCLI };
export default { main };

/* 
USAGE EXAMPLES:

# Basic execution
node script-name.js

# Dry run mode
node script-name.js --dry-run

# Verbose output
node script-name.js --verbose

# Force execution
node script-name.js --force

# Custom configuration
node script-name.js --config /path/to/config.json

# Multiple options
node script-name.js --dry-run --verbose --check-git

*/ 