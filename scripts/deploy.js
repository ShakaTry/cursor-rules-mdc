#!/usr/bin/env node

/**
 * 🚀 Deploy Script - Automatic Deployment
 * Cross-platform Node.js version
 * 
 * @fileoverview Deployment automation script supporting multiple targets:
 * local, remote (SSH), and Docker deployments with backup and health checks.
 */

import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Import our utilities
import utils from './lib/utils.js';
import gitHelper from './lib/git-helper.js';

const program = new Command();

/**
 * Main deploy function
 * @param {Object} options - Command line options
 */
async function main(options) {
    const deployStart = Date.now();
    
    utils.log.info('🚀 Starting deployment process...');
    
    // Configuration from environment or options
    const config = {
        target: options.target || process.env.DEPLOY_TARGET || 'local',
        host: options.host || process.env.DEPLOY_HOST || '',
        path: options.path || process.env.DEPLOY_PATH || '/var/www/html',
        user: options.user || process.env.DEPLOY_USER || '',
        port: options.port || process.env.DEPLOY_PORT || 22
    };
    
    try {
        // Show deployment configuration
        showDeploymentConfig(config);
        
        // 1. Pre-deployment checks
        await runPreDeploymentChecks(config);
        
        // 2. Backup current deployment (if exists)
        if (!options.skipBackup) {
            await createBackup(config);
        }
        
        // 3. Deploy based on target
        await performDeployment(config);
        
        // 4. Post-deployment tasks
        await runPostDeploymentTasks(config);
        
        // 5. Health check
        await runHealthCheck(config);
        
        // 6. Update deployment info
        await updateDeploymentInfo(config);
        
        // 7. Generate final summary
        await generateDeploymentSummary(config, deployStart);
        
    } catch (error) {
        utils.log.error(`Deployment failed: ${error.message}`);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Show deployment configuration
 */
function showDeploymentConfig(config) {
    utils.log.status('Deployment configuration:');
    console.log(`  Target: ${config.target}`);
    console.log(`  Host: ${config.host || 'local'}`);
    console.log(`  Path: ${config.path}`);
    console.log(`  User: ${config.user || 'current'}`);
    if (config.port !== 22) {
        console.log(`  Port: ${config.port}`);
    }
    console.log('');
}

/**
 * Run pre-deployment validation checks
 */
async function runPreDeploymentChecks(config) {
    utils.log.status('Running pre-deployment checks...');
    
    // Check if build exists
    if (!existsSync('dist')) {
        throw new Error('Build not found. Run \'node scripts/build.js\' first');
    }
    utils.log.success('Build directory found');
    
    // Validate deployment target
    switch (config.target) {
        case 'local':
            utils.log.status('Local deployment selected');
            break;
            
        case 'remote':
            utils.log.status('Remote deployment selected');
            if (!config.host || !config.user) {
                throw new Error('Remote deployment requires --host and --user options');
            }
            break;
            
        case 'docker':
            utils.log.status('Docker deployment selected');
            if (!await utils.commandExists('docker')) {
                throw new Error('Docker not found');
            }
            break;
            
        default:
            throw new Error(`Invalid deployment target: ${config.target}. Valid targets: local, remote, docker`);
    }
}

/**
 * Create backup of current deployment
 */
async function createBackup(config) {
    if (config.target === 'local' && existsSync(config.path)) {
        utils.log.status('Creating backup of current deployment...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = `${config.path}.backup.${timestamp}`;
        
        try {
            await utils.copyFiles(config.path, backupDir);
            utils.log.success(`Backup created: ${backupDir}`);
        } catch (error) {
            utils.log.warning('Could not create backup');
        }
    }
}

/**
 * Perform deployment based on target
 */
async function performDeployment(config) {
    switch (config.target) {
        case 'local':
            await deployLocal(config);
            break;
        case 'remote':
            await deployRemote(config);
            break;
        case 'docker':
            await deployDocker(config);
            break;
    }
}

/**
 * Deploy to local filesystem
 */
async function deployLocal(config) {
    utils.log.status(`Deploying locally to ${config.path}...`);
    
    // Create target directory
    await utils.ensureDir(config.path);
    
    // Copy files
    try {
        await utils.copyFiles('dist', config.path);
        utils.log.success(`Files copied to ${config.path}`);
    } catch (error) {
        throw new Error(`Failed to copy files: ${error.message}`);
    }
}

/**
 * Deploy to remote server via SSH
 */
async function deployRemote(config) {
    utils.log.status(`Deploying to remote server ${config.host}...`);
    
    const sshTarget = `${config.user}@${config.host}`;
    const sshOptions = config.port !== 22 ? `-p ${config.port}` : '';
    
    // Test SSH connection
    try {
        await utils.exec(`ssh ${sshOptions} -o ConnectTimeout=10 ${sshTarget} "exit"`, { stdio: 'pipe' });
        utils.log.success('SSH connection successful');
    } catch (error) {
        throw new Error(`Cannot connect to ${config.host}: ${error.message}`);
    }
    
    // Create remote directory
    await utils.exec(`ssh ${sshOptions} ${sshTarget} "mkdir -p ${config.path}"`, { stdio: 'pipe' });
    
    // Sync files using rsync (if available) or scp
    if (await utils.commandExists('rsync')) {
        const rsyncOptions = config.port !== 22 ? `-e "ssh -p ${config.port}"` : '';
        const rsyncCmd = `rsync -avz --delete ${rsyncOptions} dist/ ${sshTarget}:${config.path}/`;
        await utils.exec(rsyncCmd, { stdio: 'inherit' });
        utils.log.success('Files synced to remote server');
    } else {
        // Fallback to scp
        const scpOptions = config.port !== 22 ? `-P ${config.port}` : '';
        await utils.exec(`scp ${scpOptions} -r dist/* ${sshTarget}:${config.path}/`, { stdio: 'inherit' });
        utils.log.success('Files copied to remote server');
    }
}

/**
 * Deploy to Docker container
 */
async function deployDocker(_config) {
    utils.log.status('Building and deploying Docker container...');
    
    // Read package.json for image naming
    const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const imageName = packageData.name.replace(/[^a-z0-9-]/g, '-');
    const imageTag = packageData.version;
    
    // Check if Dockerfile exists, create if not
    if (!existsSync('Dockerfile')) {
        utils.log.status('Creating basic Dockerfile...');
        await createDockerfile();
        utils.log.success('Dockerfile created');
    }
    
    // Build Docker image
    const buildCmd = `docker build -t ${imageName}:${imageTag} -t ${imageName}:latest .`;
    try {
        await utils.exec(buildCmd, { stdio: 'inherit' });
        utils.log.success(`Docker image built: ${imageName}:${imageTag}`);
    } catch (error) {
        throw new Error(`Docker build failed: ${error.message}`);
    }
    
    // Stop existing container
    try {
        await utils.exec(`docker stop ${imageName}`, { stdio: 'pipe' });
        await utils.exec(`docker rm ${imageName}`, { stdio: 'pipe' });
    } catch (error) {
        // Container might not exist, ignore
    }
    
    // Run new container
    const runCmd = `docker run -d --name ${imageName} -p 3000:3000 ${imageName}:latest`;
    try {
        await utils.exec(runCmd, { stdio: 'pipe' });
        utils.log.success('Docker container started');
    } catch (error) {
        throw new Error(`Failed to start Docker container: ${error.message}`);
    }
}

/**
 * Create a basic Dockerfile
 */
async function createDockerfile() {
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY dist/package*.json ./
RUN npm ci --only=production

# Copy application files
COPY dist/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["node", "index.js"]
`;
    
    await fs.writeFile('Dockerfile', dockerfile, 'utf8');
}

/**
 * Run post-deployment tasks
 */
async function runPostDeploymentTasks(config) {
    utils.log.status('Running post-deployment tasks...');
    
    // Install production dependencies if package.json exists in deployment
    if (config.target === 'local' && existsSync(path.join(config.path, 'package.json'))) {
        utils.log.status('Installing production dependencies...');
        try {
            await utils.exec('npm ci --only=production --silent', { 
                cwd: config.path,
                stdio: 'pipe' 
            });
        } catch (error) {
            utils.log.warning('Could not install dependencies');
        }
    }
    
    // Set correct permissions (local deployment, Unix-like systems)
    if (config.target === 'local' && process.platform !== 'win32') {
        utils.log.status('Setting file permissions...');
        try {
            // Set directory permissions to 755
            await utils.exec(`find ${config.path} -type d -exec chmod 755 {} \\;`, { stdio: 'pipe' });
            // Set file permissions to 644
            await utils.exec(`find ${config.path} -type f -exec chmod 644 {} \\;`, { stdio: 'pipe' });
            // Make main script executable
            const mainScript = path.join(config.path, 'index.js');
            if (existsSync(mainScript)) {
                await utils.exec(`chmod +x ${mainScript}`, { stdio: 'pipe' });
            }
        } catch (error) {
            utils.log.warning('Could not set file permissions');
        }
    }
}

/**
 * Run health check
 */
async function runHealthCheck(config) {
    utils.log.status('Running health check...');
    
    switch (config.target) {
        case 'local':
            if (existsSync(path.join(config.path, 'package.json'))) {
                utils.log.success('Deployment validation passed');
            } else {
                throw new Error('Deployment validation failed');
            }
            break;
            
        case 'remote':
            const sshTarget = `${config.user}@${config.host}`;
            const sshOptions = config.port !== 22 ? `-p ${config.port}` : '';
            try {
                await utils.exec(`ssh ${sshOptions} ${sshTarget} "test -f ${config.path}/package.json"`, { stdio: 'pipe' });
                utils.log.success('Remote deployment validation passed');
            } catch (error) {
                throw new Error('Remote deployment validation failed');
            }
            break;
            
        case 'docker':
            // Wait for container to start
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
            const imageName = packageData.name.replace(/[^a-z0-9-]/g, '-');
            
            try {
                const { stdout } = await utils.exec('docker ps', { stdio: 'pipe' });
                if (stdout.includes(imageName)) {
                    utils.log.success('Docker container health check passed');
                } else {
                    throw new Error('Docker container not running');
                }
            } catch (error) {
                throw new Error('Docker container health check failed');
            }
            break;
    }
}

/**
 * Update deployment information
 */
async function updateDeploymentInfo(config) {
    utils.log.status('Updating deployment info...');
    
    const deploymentInfo = {
        deploymentTime: new Date().toISOString(),
        deploymentTarget: config.target,
        deploymentHost: config.host || 'local',
        deploymentPath: config.path,
        gitCommit: await gitHelper.getCurrentCommit(),
        gitBranch: await gitHelper.getCurrentBranch(),
        version: JSON.parse(await fs.readFile('package.json', 'utf8')).version,
        platform: process.platform,
        nodeVersion: process.version
    };
    
    const deploymentInfoFile = 'deployment-info.json';
    await fs.writeFile(deploymentInfoFile, JSON.stringify(deploymentInfo, null, 2), 'utf8');
    
    // Copy deployment info to target
    switch (config.target) {
        case 'local':
            await fs.copyFile(deploymentInfoFile, path.join(config.path, 'deployment-info.json'));
            break;
        case 'remote':
            const sshTarget = `${config.user}@${config.host}`;
            const sshOptions = config.port !== 22 ? `-P ${config.port}` : '';
            await utils.exec(`scp ${sshOptions} ${deploymentInfoFile} ${sshTarget}:${config.path}/`, { stdio: 'pipe' });
            break;
        // Docker deployment info is in the container
    }
}

/**
 * Generate deployment summary
 */
async function generateDeploymentSummary(config, deployStart) {
    const deployEnd = Date.now();
    const deployTime = Math.round((deployEnd - deployStart) / 1000);
    
    const packageData = JSON.parse(await fs.readFile('package.json', 'utf8'));
    
    console.log('\n🎉 Deployment completed successfully!\n');
    console.log('📊 Deployment Summary:');
    console.log(`  ⏱️  Deploy time: ${deployTime}s`);
    console.log(`  🎯 Target: ${config.target}`);
    console.log(`  📁 Location: ${config.host || 'local'}:${config.path}`);
    console.log(`  🔄 Version: ${packageData.version}`);
    console.log('');
    
    // Show access information based on target
    switch (config.target) {
        case 'local':
            console.log('🌐 Local access:');
            console.log(`  File path: ${config.path}`);
            console.log(`  Run: cd ${config.path} && node index.js`);
            break;
            
        case 'remote':
            console.log('🌐 Remote access:');
            console.log(`  SSH: ssh ${config.user}@${config.host}`);
            console.log(`  Path: ${config.path}`);
            break;
            
        case 'docker':
            const imageName = packageData.name.replace(/[^a-z0-9-]/g, '-');
            console.log('🐳 Docker access:');
            console.log(`  Container: ${imageName}`);
            console.log('  URL: http://localhost:3000');
            console.log(`  Logs: docker logs ${imageName}`);
            break;
    }
    
    console.log('\n💡 Useful commands:');
    console.log(`  Rollback: mv ${config.path}.backup.* ${config.path}`);
    console.log('  Monitor: tail -f /var/log/your-app.log');
    console.log('  Status: curl http://your-app/health');
    console.log('');
    
    utils.log.success('Deployment ready! 🎉');
}

// CLI Configuration
program
    .name('deploy')
    .description('🚀 Deploy Script - Automatic Deployment')
    .version('1.0.0')
    .option('-t, --target <target>', 'Deployment target (local|remote|docker)', 'local')
    .option('-h, --host <host>', 'Remote host for deployment')
    .option('-u, --user <user>', 'Remote user for deployment')
    .option('-p, --port <port>', 'SSH port for remote deployment', '22')
    .option('--path <path>', 'Deployment path', '/var/www/html')
    .option('--skip-backup', 'Skip creating backup')
    .option('-v, --verbose', 'Verbose output')
    .action(main);

// Handle script execution
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
    program.parse();
}

export { main }; 