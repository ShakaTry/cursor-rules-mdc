#!/usr/bin/env node

/**
 * 🏗️ Build Script - Project Construction
 * Cross-platform Node.js version
 * 
 * @fileoverview Build automation script with quality checks, dependency verification,
 * and project building with comprehensive validation and reporting.
 */

import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Import our utilities
import utils from './lib/utils.js';
import gitHelper from './lib/git-helper.js';
import npmHelper from './lib/npm-helper.js';

const program = new Command();

/**
 * Main build function
 * @param {Object} options - Command line options
 */
async function main(options) {
    const buildStart = Date.now();
    
    utils.log.info('🏗️ Starting build process...');
    
    try {
        // 1. Pre-build checks
        await runPreBuildChecks();
        
        // 2. Quality checks
        if (!options.skipQuality) {
            await runQualityChecks();
        }
        
        // 3. Install/verify dependencies
        await verifyDependencies();
        
        // 4. Run tests if available
        if (!options.skipTests) {
            await runTests();
        }
        
        // 5. Security audit
        if (!options.skipAudit) {
            await runSecurityAudit();
        }
        
        // 6. Build the project
        await buildProject();
        
        // 7. Optimize build
        await optimizeBuild();
        
        // 8. Validate build
        await validateBuild();
        
        // 9. Create build info
        await createBuildInfo();
        
        // 10. Generate build summary
        await generateBuildSummary(buildStart);
        
    } catch (error) {
        utils.log.error(`Build failed: ${error.message}`);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Run pre-build validation checks
 */
async function runPreBuildChecks() {
    utils.log.status('Running pre-build checks...');
    
    // Check if package.json exists
    if (!existsSync('package.json')) {
        throw new Error('package.json not found');
    }
    
    // Check Node.js version
    const nodeVersion = process.version;
    utils.log.success(`Node.js version: ${nodeVersion}`);
    
    // Verify we can read package.json
    try {
        const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
        utils.log.success(`Project: ${packageData.name}@${packageData.version}`);
    } catch (error) {
        throw new Error(`Invalid package.json: ${error.message}`);
    }
}

/**
 * Run quality checks (ESLint, etc.)
 */
async function runQualityChecks() {
    utils.log.status('Running quality checks...');
    
    try {
        await utils.exec('npm run quality', { stdio: 'inherit' });
        utils.log.success('Quality checks passed');
    } catch (error) {
        utils.log.error('Quality checks failed');
        utils.log.info('💡 Run \'npm run quality:fix\' to auto-fix issues');
        throw error;
    }
}

/**
 * Verify and install dependencies
 */
async function verifyDependencies() {
    utils.log.status('Verifying dependencies...');
    
    try {
        // Try npm ci first (faster and more reliable for CI)
        await utils.exec('npm ci --quiet');
        utils.log.success('Dependencies verified');
    } catch (error) {
        utils.log.warning('Dependencies installation failed, trying npm install...');
        try {
            await utils.exec('npm install');
            utils.log.success('Dependencies installed');
        } catch (installError) {
            throw new Error(`Dependencies installation failed: ${installError.message}`);
        }
    }
}

/**
 * Run tests if available
 */
async function runTests() {
    try {
        // Check if test script exists
        const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
        if (packageData.scripts && packageData.scripts.test) {
            utils.log.status('Running tests...');
            await utils.exec('npm run test', { stdio: 'inherit' });
            utils.log.success('Tests passed');
        } else {
            utils.log.warning('No tests configured');
        }
    } catch (error) {
        throw new Error(`Tests failed: ${error.message}`);
    }
}

/**
 * Run security audit
 */
async function runSecurityAudit() {
    utils.log.status('Running security audit...');
    
    try {
        await utils.exec('npm audit --audit-level high');
        utils.log.success('Security audit passed');
    } catch (error) {
        utils.log.warning('Security vulnerabilities found - check npm audit output');
        // Don't fail build on audit warnings, just warn
    }
}

/**
 * Build the project
 */
async function buildProject() {
    utils.log.status('Building project...');
    
    // Create build directory
    await utils.ensureDir('dist');
    
    // Copy source files if src directory exists
    if (existsSync('src')) {
        utils.log.status('Copying source files...');
        await utils.copyFiles('src', 'dist');
        utils.log.success('Source files copied');
    }
    
    // Run build script if available
    try {
        const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
        if (packageData.scripts && packageData.scripts.build) {
            utils.log.status('Running build script...');
            await utils.exec('npm run build', { stdio: 'inherit' });
            utils.log.success('Build script completed');
        }
    } catch (error) {
        throw new Error(`Build script failed: ${error.message}`);
    }
    
    // Copy essential files to dist
    utils.log.status('Copying essential files...');
    const essentialFiles = ['package.json', 'README.md', 'LICENSE'];
    
    for (const file of essentialFiles) {
        if (existsSync(file)) {
            await fs.copyFile(file, path.join('dist', file));
        }
    }
}

/**
 * Optimize build output
 */
async function optimizeBuild() {
    utils.log.status('Optimizing build...');
    
    const distPath = 'dist';
    if (!existsSync(distPath)) {return;}
    
    // Remove development files from dist
    const cleanupPatterns = [
        'node_modules/.cache',
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.test.ts',
        '**/*.spec.ts'
    ];
    
    for (const pattern of cleanupPatterns) {
        await utils.removeFiles(path.join(distPath, pattern));
    }
}

/**
 * Validate build output
 */
async function validateBuild() {
    utils.log.status('Validating build...');
    
    const distPath = 'dist';
    if (!existsSync(distPath)) {
        throw new Error('Build validation failed - dist directory not found');
    }
    
    const distContents = await fs.readdir(distPath);
    if (distContents.length === 0) {
        throw new Error('Build validation failed - dist directory empty');
    }
    
    // Get dist size
    const distSize = await utils.getDirectorySize(distPath);
    utils.log.success(`Build directory created (size: ${distSize})`);
}

/**
 * Create build information file
 */
async function createBuildInfo() {
    utils.log.status('Creating build info...');
    
    const buildInfo = {
        buildTime: new Date().toISOString(),
        buildNumber: process.env.BUILD_NUMBER || 'local',
        gitCommit: await gitHelper.getCurrentCommit(),
        gitBranch: await gitHelper.getCurrentBranch(),
        nodeVersion: process.version,
        npmVersion: await npmHelper.getVersion(),
        platform: process.platform,
        arch: process.arch
    };
    
    await fs.writeFile(
        path.join('dist', 'build-info.json'),
        JSON.stringify(buildInfo, null, 2),
        'utf8'
    );
    
    utils.log.success('Build info created');
}

/**
 * Generate final build summary
 */
async function generateBuildSummary(buildStart) {
    const buildEnd = Date.now();
    const buildTime = Math.round((buildEnd - buildStart) / 1000);
    
    const distPath = 'dist';
    const distSize = await utils.getDirectorySize(distPath);
    const fileCount = await utils.countFiles(distPath);
    
    console.log('\n🎉 Build completed successfully!\n');
    console.log('📊 Build Summary:');
    console.log(`  ⏱️  Build time: ${buildTime}s`);
    console.log(`  📁 Output directory: ${distPath}/`);
    console.log(`  📦 Build size: ${distSize}`);
    console.log(`  🔍 Files created: ${fileCount}`);
    console.log('');
    
    // List main files in dist
    console.log('📋 Main files in dist/:');
    try {
        const distContents = await fs.readdir(distPath, { withFileTypes: true });
        distContents.slice(0, 10).forEach(dirent => {
            const type = dirent.isDirectory() ? 'dir' : 'file';
            console.log(`  ${type === 'dir' ? '📁' : '📄'} ${dirent.name}`);
        });
    } catch (error) {
        console.log('  (unable to list files)');
    }
    
    console.log('\n🚀 Next steps:');
    console.log('  1. Test the build: node dist/index.js');
    console.log('  2. Deploy: node scripts/deploy.js');
    console.log('  3. Or run manually from dist/ directory');
    console.log('');
    utils.log.success('Build ready for deployment! 🎉');
}

// CLI Configuration
program
    .name('build')
    .description('🏗️ Build Script - Project Construction')
    .version('1.0.0')
    .option('--skip-quality', 'Skip quality checks')
    .option('--skip-tests', 'Skip running tests')
    .option('--skip-audit', 'Skip security audit')
    .option('-v, --verbose', 'Verbose output')
    .action(main);

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
    program.parse();
}

export { main }; 