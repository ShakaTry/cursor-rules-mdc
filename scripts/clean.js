#!/usr/bin/env node

/**
 * 🧹 Clean Script - Automatic Cleanup of Temporary Files
 * Cross-platform Node.js version
 * 
 * @fileoverview Comprehensive cleanup script that removes temporary files, build artifacts,
 * caches, and other disposable items to optimize project size and cleanliness.
 */

import { Command } from 'commander';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { glob } from 'glob';

// Import our utilities
import utils from './lib/utils.js';

const program = new Command();

// Track cleaned items
let cleanedItems = 0;

/**
 * Main clean function
 * @param {Object} options - Command line options
 */
async function main(options) {
    utils.log.info('🧹 Starting cleanup process...');
    
    try {
        // Get initial project size
        const projectSizeBefore = await utils.getDirectorySize('.');
        utils.log.status('Analyzing project for cleanup...');
        
        // Run cleanup operations
        await cleanNodeJS();
        await cleanBuildArtifacts();
        await cleanTestArtifacts();
        await cleanLogFiles();
        await cleanEditorArtifacts();
        await cleanTemporaryFiles();
        
        if (!options.skipVcs) {
            await cleanVersionControl();
        }
        
        await cleanLanguageSpecific();
        await cleanDatabaseBackups();
        
        if (!options.skipPackageManagers) {
            await cleanPackageManagers();
        }
        
        if (!options.skipDocker && await utils.commandExists('docker')) {
            await cleanDocker();
        }
        
        await cleanSystemBuffers();
        
        // Generate final summary
        await generateCleanupSummary(projectSizeBefore);
        
        // Verify project integrity
        await verifyProjectIntegrity();
        
    } catch (error) {
        utils.log.error(`Cleanup failed: ${error.message}`);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Clean Node.js artifacts
 */
async function cleanNodeJS() {
    utils.log.status('Cleaning Node.js artifacts...');
    
    await cleanDirectory('node_modules', 'Node.js modules');
    await cleanDirectory('.npm', 'npm cache');
    await cleanFiles('npm-debug.log*', 'npm debug logs');
    await cleanDirectory('.nyc_output', 'NYC coverage files');
}

/**
 * Clean build artifacts
 */
async function cleanBuildArtifacts() {
    utils.log.status('Cleaning build artifacts...');
    
    await cleanDirectory('dist', 'build output');
    await cleanDirectory('build', 'build directory');
    await cleanDirectory('out', 'output directory');
    await cleanDirectory('.next', 'Next.js build cache');
    await cleanDirectory('.nuxt', 'Nuxt.js build cache');
    await cleanFiles('*.tgz', 'package tarballs');
}

/**
 * Clean test and coverage artifacts
 */
async function cleanTestArtifacts() {
    utils.log.status('Cleaning test artifacts...');
    
    await cleanDirectory('coverage', 'test coverage reports');
    await cleanDirectory('.coverage', 'coverage data');
    await cleanFiles('*.lcov', 'LCOV coverage files');
    await cleanDirectory('.jest-cache', 'Jest cache');
}

/**
 * Clean log files
 */
async function cleanLogFiles() {
    utils.log.status('Cleaning log files...');
    
    await cleanFiles('*.log', 'log files');
    await cleanFiles('*.log.*', 'rotated log files');
    await cleanDirectory('logs', 'logs directory');
    await cleanFiles('.pnp.*', 'Yarn PnP files');
}

/**
 * Clean editor and IDE artifacts
 */
async function cleanEditorArtifacts() {
    utils.log.status('Cleaning editor artifacts...');
    
    // Be careful with VS Code settings - only clean non-workspace files
    await cleanFiles('.DS_Store', 'macOS Finder files');
    await cleanFiles('Thumbs.db', 'Windows thumbnail cache');
    await cleanFiles('*.swp', 'Vim swap files');
    await cleanFiles('*.swo', 'Vim swap files');
    await cleanFiles('*~', 'backup files');
}

/**
 * Clean temporary files
 */
async function cleanTemporaryFiles() {
    utils.log.status('Cleaning temporary files...');
    
    await cleanDirectory('tmp', 'temporary directory');
    await cleanDirectory('temp', 'temp directory');
    await cleanFiles('*.tmp', 'temporary files');
    await cleanFiles('*.temp', 'temp files');
    await cleanDirectory('.cache', 'cache directories');
}

/**
 * Clean version control artifacts
 */
async function cleanVersionControl() {
    utils.log.status('Cleaning version control artifacts...');
    
    if (existsSync('.git')) {
        try {
            utils.log.status('Running git cleanup...');
            await utils.exec('git gc --prune=now', { stdio: 'pipe' });
            await utils.exec('git prune', { stdio: 'pipe' });
            utils.log.success('Git repository optimized');
        } catch (error) {
            utils.log.warning('Git cleanup failed');
        }
    }
}

/**
 * Clean language-specific artifacts
 */
async function cleanLanguageSpecific() {
    utils.log.status('Cleaning language-specific artifacts...');
    
    // Python
    await cleanDirectory('__pycache__', 'Python cache');
    await cleanFiles('*.pyc', 'Python bytecode');
    await cleanFiles('*.pyo', 'Python optimized bytecode');
    await cleanDirectory('.pytest_cache', 'Pytest cache');
    
    // Java
    await cleanFiles('*.class', 'Java class files');
    await cleanDirectory('target', 'Maven target');
    
    // C/C++
    await cleanFiles('*.o', 'object files');
    await cleanFiles('*.so', 'shared libraries');
    await cleanFiles('*.dylib', 'dynamic libraries');
}

/**
 * Clean database and backup files (with caution)
 */
async function cleanDatabaseBackups() {
    utils.log.status('Cleaning database and backup files...');
    
    // Be very careful with these - only clean obvious temporary/backup files
    await cleanFiles('*.bak', 'backup files');
    await cleanFiles('*.backup', 'backup files');
    
    // Database files - be extremely careful, only clean if they're clearly temporary
    const tempDbFiles = await glob('*.sqlite.tmp');
    if (tempDbFiles.length > 0) {
        for (const file of tempDbFiles) {
            await utils.removeFiles(file);
        }
        utils.log.success(`Cleaned ${tempDbFiles.length} temporary SQLite files`);
    }
}

/**
 * Clean package manager caches
 */
async function cleanPackageManagers() {
    utils.log.status('Cleaning package manager caches...');
    
    // npm cache
    if (await utils.commandExists('npm')) {
        try {
            await utils.exec('npm cache clean --force', { stdio: 'pipe' });
            utils.log.success('npm cache cleaned');
        } catch (error) {
            utils.log.warning('npm cache clean failed');
        }
    }
    
    // Yarn cache
    if (await utils.commandExists('yarn')) {
        try {
            await utils.exec('yarn cache clean', { stdio: 'pipe' });
            utils.log.success('Yarn cache cleaned');
        } catch (error) {
            utils.log.warning('Yarn cache clean failed');
        }
    }
    
    // pnpm cache
    if (await utils.commandExists('pnpm')) {
        try {
            await utils.exec('pnpm store prune', { stdio: 'pipe' });
            utils.log.success('pnpm store cleaned');
        } catch (error) {
            utils.log.warning('pnpm store prune failed');
        }
    }
}

/**
 * Clean Docker containers and images
 */
async function cleanDocker() {
    utils.log.status('Docker found - cleaning containers and images...');
    
    try {
        // Clean stopped containers
        const { stdout: stoppedContainers } = await utils.exec('docker ps -aq --filter "status=exited"', { stdio: 'pipe' });
        if (stoppedContainers.trim()) {
            const containerIds = stoppedContainers.trim().split('\n');
            await utils.exec(`docker rm ${containerIds.join(' ')}`, { stdio: 'pipe' });
            utils.log.success(`Removed ${containerIds.length} stopped containers`);
        }
        
        // Clean dangling images
        const { stdout: danglingImages } = await utils.exec('docker images -f "dangling=true" -q', { stdio: 'pipe' });
        if (danglingImages.trim()) {
            const imageIds = danglingImages.trim().split('\n');
            await utils.exec(`docker rmi ${imageIds.join(' ')}`, { stdio: 'pipe' });
            utils.log.success(`Removed ${imageIds.length} dangling images`);
        }
        
        // Clean build cache
        await utils.exec('docker builder prune -f', { stdio: 'pipe' });
        utils.log.success('Docker build cache cleaned');
        
    } catch (error) {
        utils.log.warning('Docker cleanup had some issues (this is normal)');
    }
}

/**
 * Clean system buffers and sync
 */
async function cleanSystemBuffers() {
    utils.log.status('Running system cleanup...');
    
    // Sync system buffers (Unix-like systems)
    if (process.platform !== 'win32' && await utils.commandExists('sync')) {
        try {
            await utils.exec('sync', { stdio: 'pipe' });
            utils.log.success('System buffers flushed');
        } catch (error) {
            // Ignore sync errors
        }
    }
}

/**
 * Clean directory and report
 * @param {string} dirPath - Directory path to clean
 * @param {string} description - Description for logging
 */
async function cleanDirectory(dirPath, description) {
    if (existsSync(dirPath)) {
        try {
            const sizeBefore = await utils.getDirectorySizeBytes(dirPath);
            await fs.rm(dirPath, { recursive: true, force: true });
            cleanedItems++;
            totalSizeBefore += sizeBefore;
            utils.log.success(`Cleaned ${description}`);
        } catch (error) {
            utils.log.warning(`Could not clean ${description}: ${error.message}`);
        }
    }
}

/**
 * Clean files matching pattern
 * @param {string} pattern - Glob pattern to match files
 * @param {string} description - Description for logging
 */
async function cleanFiles(pattern, description) {
    try {
        const files = await glob(pattern, { ignore: ['node_modules/**'] });
        if (files.length > 0) {
            for (const file of files) {
                await fs.unlink(file);
            }
            cleanedItems += files.length;
            utils.log.success(`Cleaned ${files.length} ${description}`);
        }
    } catch (error) {
        utils.log.warning(`Could not clean ${description}: ${error.message}`);
    }
}

/**
 * Generate cleanup summary
 */
async function generateCleanupSummary(projectSizeBefore) {
    const projectSizeAfter = await utils.getDirectorySize('.');
    
    console.log('\n🎉 Cleanup completed successfully!\n');
    console.log('📊 Cleanup Summary:');
    console.log(`  🗑️  Items cleaned: ${cleanedItems}`);
    console.log(`  📁 Project size before: ${projectSizeBefore}`);
    console.log(`  📁 Project size after: ${projectSizeAfter}`);
    console.log('');
    
    // List what's left in main directories
    console.log('📋 Remaining project structure:');
    await listDirectoryContents('src', 'src');
    await listDirectoryContents('docs', 'docs');
    console.log('');
    
    // Recommendations
    console.log('💡 Recommendations:');
    console.log('  1. Run \'npm install\' to reinstall dependencies');
    console.log('  2. Run \'npm run quality\' to verify project integrity');
    console.log('  3. Run \'node scripts/build.js\' to rebuild if needed');
    console.log('');
}

/**
 * List directory contents for summary
 */
async function listDirectoryContents(dirPath, displayName) {
    console.log(`${displayName}/:`);
    try {
        if (existsSync(dirPath)) {
            const contents = await fs.readdir(dirPath, { withFileTypes: true });
            const limited = contents.slice(0, 5);
            limited.forEach(dirent => {
                const type = dirent.isDirectory() ? '📁' : '📄';
                console.log(`  ${type} ${dirent.name}`);
            });
            if (contents.length > 5) {
                console.log(`  ... and ${contents.length - 5} more items`);
            }
        } else {
            console.log('  (empty or not found)');
        }
    } catch (error) {
        console.log('  (unable to list)');
    }
}

/**
 * Verify project still works after cleanup
 */
async function verifyProjectIntegrity() {
    if (existsSync('package.json')) {
        utils.log.status('Verifying project integrity...');
        try {
            // Just check if package.json is readable
            JSON.parse(await fs.readFile('package.json', 'utf8'));
            utils.log.success('Project structure intact');
        } catch (error) {
            utils.log.warning('You may need to run \'npm install\' to restore dependencies');
        }
    }
    
    console.log('✨ Project cleaned and optimized!');
    utils.log.success('Cleanup complete! 🎉');
}

// CLI Configuration
program
    .name('clean')
    .description('🧹 Clean Script - Automatic Cleanup of Temporary Files')
    .version('1.0.0')
    .option('--skip-vcs', 'Skip version control cleanup')
    .option('--skip-package-managers', 'Skip package manager cache cleanup')
    .option('--skip-docker', 'Skip Docker cleanup')
    .option('-v, --verbose', 'Verbose output')
    .action(main);

// Handle script execution
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
    program.parse();
}

export { main }; 