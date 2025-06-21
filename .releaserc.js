/**
 * 🤖 Semantic Release Configuration
 * Automatic versioning and releasing based on conventional commits
 */

module.exports = {
  // Main branch for releases
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: 'beta'
    }
  ],

  // Plugins for the release workflow
  plugins: [
    // 1. Analyze commits to determine version bump
    '@semantic-release/commit-analyzer',
    
    // 2. Generate release notes from commits
    '@semantic-release/release-notes-generator',
    
    // 3. Update CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# 📋 Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n'
      }
    ],
    
    // 4. Update VERSION file
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'echo ${nextRelease.version} > VERSION'
      }
    ],
    
    // 5. Commit the version files
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'VERSION'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    
    // 6. Create GitHub release
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        releasedLabels: false,
        addReleases: 'bottom'
      }
    ]
  ],

  // Commit message patterns for version bumping
  preset: 'angular',
  releaseRules: [
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'docs', release: 'patch' },
    { type: 'style', release: 'patch' },
    { type: 'refactor', release: 'patch' },
    { type: 'perf', release: 'patch' },
    { type: 'test', release: 'patch' },
    { type: 'build', release: 'patch' },
    { type: 'ci', release: 'patch' },
    { type: 'chore', release: 'patch' },
    { type: 'revert', release: 'patch' },
    { breaking: true, release: 'major' }
  ],

  // Custom preset for commit parsing
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
  },

  // Custom writer options for changelog
  writerOpts: {
    commitsSort: ['subject', 'scope']
  }
}; 