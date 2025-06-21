#!/usr/bin/env node

/**
 * 🤖 PROJECT DETECTOR - Universal Language Detection
 * Automatically detects project type based on files present
 * Cross-platform Node.js version of project-detector.sh
 */

import { Command } from 'commander';
import utils from './lib/utils.js';

const { log, file, platform } = utils;

/**
 * Project detection results
 */
class ProjectDetector {
  constructor() {
    this.projectType = '';
    this.packageManager = '';
    this.buildTool = '';
    this.versionFile = '';
    this.detected = false;
  }

  /**
   * Detect JavaScript/Node.js project
   */
  async detectJavaScript() {
    if (file.exists('package.json')) {
      this.projectType = 'javascript';
      this.versionFile = 'package.json';

      // Detect package manager
      if (file.exists('yarn.lock')) {
        this.packageManager = 'yarn';
      } else if (file.exists('pnpm-lock.yaml')) {
        this.packageManager = 'pnpm';
      } else {
        this.packageManager = 'npm';
      }

      return true;
    }
    return false;
  }

  /**
   * Detect Python project
   */
  async detectPython() {
    if (file.exists('pyproject.toml')) {
      this.projectType = 'python';
      this.packageManager = 'poetry';
      this.versionFile = 'pyproject.toml';
      return true;
    } else if (file.exists('requirements.txt') || file.exists('setup.py')) {
      this.projectType = 'python';
      this.packageManager = 'pip';
      this.versionFile = file.exists('setup.py') ? 'setup.py' : 'requirements.txt';
      return true;
    }
    return false;
  }

  /**
   * Detect Go project
   */
  async detectGo() {
    if (file.exists('go.mod')) {
      this.projectType = 'go';
      this.packageManager = 'go';
      this.buildTool = 'go';
      this.versionFile = 'go.mod';
      return true;
    }
    return false;
  }

  /**
   * Detect Rust project
   */
  async detectRust() {
    if (file.exists('Cargo.toml')) {
      this.projectType = 'rust';
      this.packageManager = 'cargo';
      this.buildTool = 'cargo';
      this.versionFile = 'Cargo.toml';
      return true;
    }
    return false;
  }

  /**
   * Detect PHP project
   */
  async detectPHP() {
    if (file.exists('composer.json')) {
      this.projectType = 'php';
      this.packageManager = 'composer';
      this.versionFile = 'composer.json';
      return true;
    }
    return false;
  }

  /**
   * Detect Java project
   */
  async detectJava() {
    if (file.exists('pom.xml')) {
      this.projectType = 'java';
      this.packageManager = 'maven';
      this.buildTool = 'mvn';
      this.versionFile = 'pom.xml';
      return true;
    } else if (file.exists('build.gradle') || file.exists('build.gradle.kts')) {
      this.projectType = 'java';
      this.packageManager = 'gradle';
      this.buildTool = 'gradle';
      this.versionFile = file.exists('build.gradle') ? 'build.gradle' : 'build.gradle.kts';
      return true;
    }
    return false;
  }

  /**
   * Detect C# project
   */
  async detectCSharp() {
    const files = await file.list('.');
    const hasCsProj = files.some(f => f.endsWith('.csproj'));
    const hasSolution = files.some(f => f.endsWith('.sln'));

    if (hasCsProj || hasSolution) {
      this.projectType = 'csharp';
      this.packageManager = 'dotnet';
      this.buildTool = 'dotnet';
      this.versionFile = hasCsProj ? '*.csproj' : '*.sln';
      return true;
    }
    return false;
  }

  /**
   * Detect Ruby project
   */
  async detectRuby() {
    if (file.exists('Gemfile')) {
      this.projectType = 'ruby';
      this.packageManager = 'gem';
      this.buildTool = 'bundle';
      this.versionFile = 'Gemfile';
      return true;
    }
    return false;
  }

  /**
   * Main detection logic
   */
  async detectProjectType() {
    log.step('Detecting project type...');

    const detectors = [
      { name: 'JavaScript/Node.js', detect: () => this.detectJavaScript() },
      { name: 'Python', detect: () => this.detectPython() },
      { name: 'Go', detect: () => this.detectGo() },
      { name: 'Rust', detect: () => this.detectRust() },
      { name: 'PHP', detect: () => this.detectPHP() },
      { name: 'Java', detect: () => this.detectJava() },
      { name: 'C#', detect: () => this.detectCSharp() },
      { name: 'Ruby', detect: () => this.detectRuby() },
    ];

    for (const detector of detectors) {
      try {
        if (await detector.detect()) {
          log.success(`${detector.name} project detected`);
          this.detected = true;
          return true;
        }
      } catch (error) {
        log.debug(`Error detecting ${detector.name}: ${error.message}`);
      }
    }

    // Generic fallback
    log.warning('Generic project detected (no specific language files found)');
    this.projectType = 'generic';
    this.packageManager = 'git';
    this.versionFile = 'VERSION';
    this.detected = true;
    return true;
  }

  /**
   * Get enhanced project information
   */
  async getEnhancedInfo() {
    const info = {
      projectType: this.projectType,
      packageManager: this.packageManager,
      buildTool: this.buildTool,
      versionFile: this.versionFile,
      platform: platform.platform,
      detected: this.detected,
    };

    // Add version if available
    try {
      if (this.projectType === 'javascript' && file.exists('package.json')) {
        const pkg = JSON.parse(await file.read('package.json'));
        info.version = pkg.version;
        info.name = pkg.name;
      }
    } catch (error) {
      log.debug(`Could not read version: ${error.message}`);
    }

    return info;
  }

  /**
   * Output detection results
   */
  async outputResults(format = 'console') {
    const info = await this.getEnhancedInfo();

    if (format === 'json') {
      console.log(JSON.stringify(info, null, 2));
      return info;
    }

    // Console output
    log.divider();
    log.header('Detection Results');
    log.info(`Project Type: ${info.projectType}`);
    log.info(`Package Manager: ${info.packageManager}`);
    log.info(`Build Tool: ${info.buildTool || 'N/A'}`);
    log.info(`Version File: ${info.versionFile}`);
    log.info(`Platform: ${info.platform}`);

    if (info.version) {
      log.info(`Version: ${info.version}`);
    }
    if (info.name) {
      log.info(`Name: ${info.name}`);
    }

    return info;
  }

  /**
   * Save results to automation config
   */
  async saveToConfig() {
    const info = await this.getEnhancedInfo();

    // Ensure .automation directory exists
    await file.ensureDir('.automation');

    // Save as environment format (compatible with bash)
    const envContent = [
      `PROJECT_TYPE=${info.projectType}`,
      `PACKAGE_MANAGER=${info.packageManager}`,
      `BUILD_TOOL=${info.buildTool || ''}`,
      `VERSION_FILE=${info.versionFile}`,
      `PLATFORM=${info.platform}`,
      `DETECTED=${info.detected}`,
      ...(info.version ? [`VERSION=${info.version}`] : []),
      ...(info.name ? [`NAME=${info.name}`] : []),
    ].join('\n');

    await file.write('.automation/project.env', envContent);

    // Also save as JSON for Node.js scripts
    await file.write('.automation/project.json', JSON.stringify(info, null, 2));

    log.success('Detection results saved to .automation/');
    return info;
  }
}

/**
 * CLI Program
 */
const program = new Command();

program
  .name('project-detector')
  .description('🤖 Universal Project Type Detection - Cross-platform Node.js version')
  .version('1.0.0')
  .option('-f, --format <type>', 'Output format (console, json)', 'console')
  .option('-s, --save', 'Save results to .automation/ directory', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async options => {
    try {
      if (options.verbose) {
        log.debug(`Running on ${platform.platform}`);
        log.debug(`Node.js version: ${process.version}`);
      }

      const detector = new ProjectDetector();
      await detector.detectProjectType();

      await detector.outputResults(options.format);

      if (options.save) {
        await detector.saveToConfig();
      }

      process.exit(0);
    } catch (error) {
      log.error(`Detection failed: ${error.message}`);
      if (options.verbose) {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Export for use as module
export { ProjectDetector };

// Run if called directly
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  program.parse();
}
