#!/usr/bin/env node

/**
 * 🧠 SMART COMMIT DETECTOR
 * Détecte automatiquement le type de commit basé sur l'analyse des fichiers modifiés
 */

/* eslint-disable no-console */

import utils from './utils.js';

const { log, cmd } = utils;

class SmartCommitDetector {
  constructor() {
    this.patterns = {
      // Patterns pour détecter le type de commit
      feat: {
        patterns: [
          /^src\/.*\.(js|ts|jsx|tsx|py|go|rs|php|java)$/, // Nouveaux fichiers source
          /^.*\/.*\.component\.(js|ts|jsx|tsx)$/, // Nouveaux composants
          /^.*\/.*\.service\.(js|ts|py|go)$/, // Nouveaux services
          /^.*\/.*\.controller\.(js|ts|py|php|java)$/, // Nouveaux controllers
          /^api\/.*\.(js|ts|py|go|php)$/, // Nouvelles API
          /^lib\/.*$/, // Nouvelles librairies
          /^components\/.*$/, // Nouveaux composants
          /^features\/.*$/, // Nouvelles features
        ],
        keywords: [
          'add',
          'new',
          'create',
          'implement',
          'introduce',
          'feature',
          'functionality',
          'capability',
          'support',
        ],
      },

      fix: {
        patterns: [
          // Modifications de fichiers existants avec patterns de fix
        ],
        keywords: [
          'fix',
          'bug',
          'issue',
          'error',
          'crash',
          'problem',
          'resolve',
          'correct',
          'patch',
          'repair',
          'debug',
        ],
      },

      docs: {
        patterns: [
          /^.*\.md$/, // Fichiers Markdown
          /^docs\/.*$/, // Dossier docs
          /^README.*$/, // README files
          /^CHANGELOG.*$/, // Changelog
          /^.*\.txt$/, // Fichiers texte
          /^.*\/.*\.docs?\.(js|ts|py)$/, // Fichiers de documentation code
        ],
        keywords: [
          'document',
          'docs',
          'readme',
          'guide',
          'tutorial',
          'example',
          'comment',
          'explain',
          'clarify',
        ],
      },

      style: {
        patterns: [
          /^.*\.css$/,
          /^.*\.scss$/,
          /^.*\.less$/,
          /^.*\.style\.(js|ts)$/,
          /^styles\/.*$/,
          /^assets\/.*\.(css|scss|less)$/,
        ],
        keywords: [
          'style',
          'css',
          'design',
          'theme',
          'layout',
          'color',
          'font',
          'spacing',
          'format',
          'prettier',
        ],
      },

      refactor: {
        patterns: [
          // Détecté par analyse du contenu plus que les noms
        ],
        keywords: [
          'refactor',
          'restructure',
          'reorganize',
          'cleanup',
          'optimize',
          'improve',
          'simplify',
          'extract',
          'rename',
        ],
      },

      test: {
        patterns: [
          /^.*\.test\.(js|ts|py|go|rs|php|java)$/,
          /^.*\.spec\.(js|ts|py|go|rs|php|java)$/,
          /^tests?\/.*$/,
          /^__tests__\/.*$/,
          /^spec\/.*$/,
          /^.*_test\.(py|go|rs)$/,
        ],
        keywords: [
          'test',
          'spec',
          'coverage',
          'unittest',
          'e2e',
          'integration',
          'mock',
          'stub',
          'assert',
        ],
      },

      build: {
        patterns: [
          /^package\.json$/,
          /^package-lock\.json$/,
          /^yarn\.lock$/,
          /^pnpm-lock\.yaml$/,
          /^Cargo\.toml$/,
          /^Cargo\.lock$/,
          /^go\.mod$/,
          /^go\.sum$/,
          /^requirements\.txt$/,
          /^pyproject\.toml$/,
          /^Dockerfile$/,
          /^docker-compose\.ya?ml$/,
          /^webpack\.config\.(js|ts)$/,
          /^vite\.config\.(js|ts)$/,
          /^rollup\.config\.(js|ts)$/,
          /^babel\.config\.(js|json)$/,
          /^tsconfig\.json$/,
        ],
        keywords: [
          'build',
          'compile',
          'bundle',
          'package',
          'dependency',
          'deps',
          'dependencies',
          'install',
          'setup',
          'config',
        ],
      },

      ci: {
        patterns: [
          /^\.github\/workflows\/.*\.ya?ml$/,
          /^\.gitlab-ci\.ya?ml$/,
          /^\.travis\.ya?ml$/,
          /^appveyor\.ya?ml$/,
          /^circle\.ya?ml$/,
          /^\.circleci\/.*$/,
          /^jenkins.*$/,
          /^\.githooks\/.*$/,
        ],
        keywords: [
          'ci',
          'cd',
          'pipeline',
          'workflow',
          'action',
          'deploy',
          'deployment',
          'github',
          'gitlab',
        ],
      },

      chore: {
        patterns: [
          /^\.gitignore$/,
          /^\.gitattributes$/,
          /^\.editorconfig$/,
          /^\.prettierrc.*$/,
          /^\.eslintrc.*$/,
          /^\.eslint\.config\.(js|ts)$/,
          /^\.stylelintrc.*$/,
          /^LICENSE$/,
          /^\.env.*$/,
          /^.*\.sample$/,
          /^scripts\/.*$/,
          /^tools\/.*$/,
          /^\.vscode\/.*$/,
          /^\.cursor\/.*$/,
        ],
        keywords: [
          'chore',
          'maintenance',
          'housekeeping',
          'cleanup',
          'config',
          'settings',
          'ignore',
          'lint',
          'format',
        ],
      },
    };
  }

  /**
   * Analyser les fichiers modifiés et détecter le type de commit
   */
  async detectCommitType() {
    try {
      log.step('🧠 Analyzing changes for smart commit type detection...');

      // Obtenir les fichiers modifiés
      const stagedFiles = await this.getStagedFiles();
      const modifiedFiles = await this.getModifiedFiles();

      if (stagedFiles.length === 0 && modifiedFiles.length === 0) {
        log.warning('No changes detected');
        return { type: 'chore', confidence: 0.5, reason: 'No changes found' };
      }

      // Analyser les fichiers
      const allFiles = [...new Set([...stagedFiles, ...modifiedFiles])];
      const analysis = await this.analyzeFiles(allFiles);

      // Analyser le contenu des changements
      const contentAnalysis = await this.analyzeChangesContent();

      // Combiner les analyses
      const finalAnalysis = this.combineAnalyses(analysis, contentAnalysis);

      log.success(
        `Detected type: ${finalAnalysis.type} (confidence: ${(finalAnalysis.confidence * 100).toFixed(1)}%)`
      );
      log.info(`Reason: ${finalAnalysis.reason}`);

      return finalAnalysis;
    } catch (error) {
      log.error(`Detection failed: ${error.message}`);
      return { type: 'chore', confidence: 0.3, reason: 'Fallback due to error' };
    }
  }

  /**
   * Obtenir les fichiers staged
   */
  async getStagedFiles() {
    const result = await cmd.exec('git diff --cached --name-only');
    if (!result.success) {
      return [];
    }

    return result.stdout
      .split('\n')
      .filter(file => file.trim())
      .map(file => file.trim());
  }

  /**
   * Obtenir les fichiers modifiés
   */
  async getModifiedFiles() {
    const result = await cmd.exec('git diff --name-only');
    if (!result.success) {
      return [];
    }

    return result.stdout
      .split('\n')
      .filter(file => file.trim())
      .map(file => file.trim());
  }

  /**
   * Analyser les fichiers basé sur les patterns
   */
  async analyzeFiles(files) {
    const scores = {};
    const reasons = {};

    // Initialiser les scores
    Object.keys(this.patterns).forEach(type => {
      scores[type] = 0;
      reasons[type] = [];
    });

    // Analyser chaque fichier
    for (const file of files) {
      const fileAnalysis = this.analyzeFile(file);

      Object.keys(fileAnalysis).forEach(type => {
        scores[type] += fileAnalysis[type].score;
        if (fileAnalysis[type].score > 0) {
          reasons[type].push(fileAnalysis[type].reason);
        }
      });
    }

    // Détecter si des nouveaux fichiers sont ajoutés
    const newFiles = await this.getNewFiles();
    if (newFiles.length > 0) {
      const hasNewSourceFiles = newFiles.some(file =>
        /\.(js|ts|jsx|tsx|py|go|rs|php|java|c|cpp|cs)$/.test(file)
      );

      if (hasNewSourceFiles) {
        scores.feat += 2;
        reasons.feat.push(`${newFiles.length} new source files added`);
      }
    }

    // Trouver le type avec le score le plus élevé
    const maxType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    const confidence = scores[maxType] / Math.max(files.length, 1);

    return {
      type: maxType,
      confidence: Math.min(confidence, 1),
      reason: reasons[maxType].join(', ') || 'Pattern-based detection',
      allScores: scores,
    };
  }

  /**
   * Analyser un fichier individuel
   */
  analyzeFile(filePath) {
    const analysis = {};

    Object.keys(this.patterns).forEach(type => {
      analysis[type] = { score: 0, reason: '' };

      // Vérifier les patterns de fichiers
      const patterns = this.patterns[type].patterns || [];
      for (const pattern of patterns) {
        if (pattern.test(filePath)) {
          analysis[type].score += 1;
          analysis[type].reason = `Matches ${type} pattern: ${filePath}`;
          break;
        }
      }
    });

    return analysis;
  }

  /**
   * Obtenir les nouveaux fichiers
   */
  async getNewFiles() {
    const result = await cmd.exec('git diff --cached --name-status');
    if (!result.success) {
      return [];
    }

    return result.stdout
      .split('\n')
      .filter(line => line.startsWith('A\t'))
      .map(line => line.replace('A\t', '').trim());
  }

  /**
   * Analyser le contenu des changements
   */
  async analyzeChangesContent() {
    try {
      const result = await cmd.exec('git diff --cached');
      if (!result.success) {
        return { type: 'chore', confidence: 0, reason: 'No diff content' };
      }

      const diffContent = result.stdout.toLowerCase();
      const scores = {};

      // Analyser le contenu pour les mots-clés
      Object.keys(this.patterns).forEach(type => {
        scores[type] = 0;
        const keywords = this.patterns[type].keywords || [];

        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = diffContent.match(regex);
          if (matches) {
            scores[type] += matches.length * 0.5;
          }
        });
      });

      // Détection spéciale pour fix
      const errorPatterns = [
        /[-\s](bug|error|issue|crash|fail|exception|throw)/gi,
        /\+[^+]*\b(fix|resolve|correct|patch)\b/gi,
      ];

      errorPatterns.forEach(pattern => {
        const matches = diffContent.match(pattern);
        if (matches) {
          scores.fix += matches.length;
        }
      });

      const maxType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));

      return {
        type: maxType,
        confidence: scores[maxType] / 10, // Normalize
        reason: `Content analysis: ${scores[maxType]} keyword matches`,
        allScores: scores,
      };
    } catch (error) {
      return { type: 'chore', confidence: 0, reason: 'Content analysis failed' };
    }
  }

  /**
   * Combiner les analyses de fichiers et de contenu
   */
  combineAnalyses(fileAnalysis, contentAnalysis) {
    const combinedScores = {};

    // Combiner les scores avec pondération
    Object.keys(this.patterns).forEach(type => {
      const fileScore = fileAnalysis.allScores[type] || 0;
      const contentScore = contentAnalysis.allScores[type] || 0;

      // Pondération: 70% fichiers, 30% contenu
      combinedScores[type] = fileScore * 0.7 + contentScore * 0.3;
    });

    const maxType = Object.keys(combinedScores).reduce((a, b) =>
      combinedScores[a] > combinedScores[b] ? a : b
    );

    const maxScore = combinedScores[maxType];
    const confidence = Math.min(maxScore / 3, 1); // Normalize to 0-1

    // Si la confiance est trop faible, utiliser des heuristiques
    if (confidence < 0.3) {
      return this.applyFallbackHeuristics(fileAnalysis, contentAnalysis);
    }

    return {
      type: maxType,
      confidence,
      reason: `Combined analysis: ${fileAnalysis.reason} + ${contentAnalysis.reason}`,
      fileAnalysis,
      contentAnalysis,
    };
  }

  /**
   * Appliquer des heuristiques de fallback
   */
  applyFallbackHeuristics(fileAnalysis, _contentAnalysis) {
    // Si que des fichiers de documentation
    if (fileAnalysis.type === 'docs' && fileAnalysis.confidence > 0.5) {
      return {
        type: 'docs',
        confidence: 0.8,
        reason: 'Only documentation files modified',
      };
    }

    // Si que des fichiers de configuration
    if (fileAnalysis.type === 'chore' && fileAnalysis.confidence > 0.5) {
      return {
        type: 'chore',
        confidence: 0.7,
        reason: 'Only configuration files modified',
      };
    }

    // Par défaut, supposer que c'est une feature si des fichiers source sont modifiés
    return {
      type: 'feat',
      confidence: 0.4,
      reason: 'Default fallback - assuming feature development',
    };
  }

  /**
   * Générer une description intelligente
   */
  async generateSmartDescription(commitType, files) {
    const fileCount = files.length;
    const fileTypes = this.categorizeFiles(files);

    let description = '';

    switch (commitType) {
      case 'feat':
        description =
          fileTypes.components.length > 0
            ? `add new ${fileTypes.components[0]} component`
            : fileTypes.services.length > 0
              ? `implement ${fileTypes.services[0]} service`
              : 'add new functionality';
        break;

      case 'fix':
        description = 'resolve issue in ' + (fileTypes.main[0] || 'application');
        break;

      case 'docs':
        description =
          fileTypes.docs.length === 1
            ? `update ${fileTypes.docs[0]}`
            : `update documentation (${fileCount} files)`;
        break;

      case 'style':
        description = 'update styling and formatting';
        break;

      case 'refactor':
        description = 'refactor code structure';
        break;

      case 'test':
        description = 'add/update tests';
        break;

      case 'build':
        description = 'update build configuration';
        break;

      case 'ci':
        description = 'update CI/CD configuration';
        break;

      default:
        description = `update ${fileCount} file${fileCount > 1 ? 's' : ''}`;
    }

    return description;
  }

  /**
   * Catégoriser les fichiers
   */
  categorizeFiles(files) {
    return {
      components: files.filter(f => /component|widget|view/i.test(f)),
      services: files.filter(f => /service|api|controller/i.test(f)),
      docs: files.filter(f => /\.(md|txt|rst)$/i.test(f)),
      main: files.filter(f => !/\.(test|spec|md|txt)$/i.test(f)),
    };
  }
}

export default SmartCommitDetector;
