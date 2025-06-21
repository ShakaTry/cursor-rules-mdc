# 🚀 Usage Guide

> **Comprehensive usage guide with practical examples**

## 🎉 **Version 1.1.1 - All Tools Operational** ✅

**Complete workflow validation - All commands and tools tested and functional.**  
✅ Quality automation: `npm run quality` & `quality:fix` working perfectly  
✅ Conventional commits + versioning system validated  
✅ Professional base ready for immediate use

## 🎯 Overview

This project provides a **reusable universal base** for all your future projects with:

- ✅ **Universal automatic quality** - ESLint/Prettier for all languages (JS, Python, Go, Rust...)
- ✅ **Automatic versioning** - No more manual management
- ✅ **Professional standards** - Facilitated collaboration across languages
- ✅ **Complete documentation** - Quick start
- ✅ **Specialized templates** - JavaScript, Python, React... ready to use

### 🔧 Included universal tools

**ESLint + Prettier** have become the **universal standards** for code quality, supported by all modern editors for **all languages**. The `package.json` serves as a universal tool manager.

## 🏁 Quick Start

### 1. First use

```bash
# After installation
npm run quality      # Check everything is working
npm run setup        # Initial setup (if not done)
```

### 2. Daily workflow

```bash
# Before starting to code
npm run quality      # Check current state

# During development
npm run quality:fix  # Automatically fix issues

# Before committing
npm run quality      # Final validation
```

## 🛠️ Main Commands

### Code Quality

```bash
npm run quality      # Complete check (ESLint + Prettier)
npm run quality:fix  # Automatically fix issues
npm run lint         # ESLint only
npm run format       # Prettier only
```

### Automatic Versioning

```bash
# Conventional commits (examples)
git commit -m "feat: new feature"    # 1.0.0 → 1.1.0
git commit -m "fix: bug fix"           # 1.1.0 → 1.1.1
git commit -m "docs: update documentation"  # No version change
git commit -m "feat!: breaking change"       # 1.1.1 → 2.0.0

# Generate new version
npm run release      # Version + CHANGELOG + Tag + Push
```

### Automation Scripts

```bash
./scripts/setup.sh   # Complete installation
./scripts/build.sh   # Project build
./scripts/deploy.sh  # Deployment
./scripts/clean.sh   # Clean temporary files
```

## 📝 Conventional Commits

### Mandatory Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Main Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting (no logic change)
- **refactor**: Refactoring (no new feature or fix)
- **test**: Add or modify tests
- **chore**: Maintenance (build, dependencies, etc.)

### Concrete Examples

```bash
# New feature
git commit -m "feat(auth): add user login system"

# Bug fix
git commit -m "fix(api): handle empty response correctly"

# Documentation
git commit -m "docs(readme): add installation instructions"

# Breaking change
git commit -m "feat(api)!: change authentication method"
```

## 🏗️ Project Structure

### File Organization

```
cursor-rules/
├── src/              # Main source code
├── docs/             # Complete documentation
├── scripts/          # Automation scripts
├── examples/         # Practical examples
├── templates/        # Reusable templates
├── .cursor/          # Cursor/Claude configuration
└── package.json      # npm/tools configuration
```

### Main Directories

#### `src/` - Source Code

```bash
# Your main code here
src/
├── components/       # Components/modules
├── utils/           # Utility functions
├── config/          # Configuration
└── index.js         # Main entry point
```

#### `docs/` - Documentation

- `installation.md` - Installation guide
- `usage.md` - This file
- `examples.md` - Detailed examples
- `architecture.md` - Technical overview

#### `examples/` - Practical Examples

- `basic-usage/` - Basic usage
- `advanced-usage/` - Advanced features
- `integrations/` - External integrations

## 🎨 Customization

### 1. Adapt to your project

```bash
# 1. Change information in package.json
nano package.json

# 2. Modify license if necessary
nano LICENSE

# 3. Customize CONTRIBUTING.md
nano CONTRIBUTING.md
```

### 2. Tool Configuration

```bash
# ESLint (code rules)
nano .eslintrc.js

# Prettier (formatting)
nano .prettierrc

# EditorConfig (editor)
nano .editorconfig
```

### 3. Custom Scripts

```bash
# Add your own scripts
nano scripts/custom-script.sh

# Make them executable
chmod +x scripts/custom-script.sh
```

## 🔄 Development Workflow

### 1. Create a new feature

```bash
# 1. Create a branch
git checkout -b feat/ma-nouvelle-feature

# 2. Develop with automatic quality
npm run quality:fix  # During development

# 3. Commit with convention
git add .
git commit -m "feat: add ma nouvelle feature"

# 4. Push and create PR
git push origin feat/ma-nouvelle-feature
```

### 2. Regular maintenance

```bash
# Weekly check
npm run quality           # Check quality
npm audit                # Check security
npm outdated             # Check updates

# Regular cleanup
./scripts/clean.sh       # Clean temporary files
```

## 📊 Monitoring quality

### Automatic Metrics

- **ESLint**: 0 error, 0 warning
- **Prettier**: Consistent formatting
- **Commits**: Convention followed
- **Tests**: Coverage >80% (if applicable)

### Continuous Checks

```bash
# Before each commit
npm run quality

# Before each release
npm run quality && npm run build && npm test
```

## 🚀 Deployment

### Automatic Deployment

```bash
# Complete automatic deployment
npm run release

# Or step-by-step
npm run version:patch    # 1.0.0 → 1.0.1
npm run version:minor    # 1.0.0 → 1.1.0
npm run version:major    # 1.0.0 → 2.0.0
```

### GitHub Actions (automatic)

- ✅ Tests on each push
- ✅ Automatic deployment on `main`
- ✅ CHANGELOG updated automatically
- ✅ GitHub Release created automatically

## 📚 Useful Resources

### Documentation

- 🏗️ [Technical overview](architecture.md)
- 🛠️ [Installation guide](installation.md)

### Standards

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🔧 **Development Workflow**

### **Quality Control**
```bash
# Check code quality
npm run quality

# Auto-fix issues
npm run quality:fix
```

### **Git Workflow (Professional)**

#### **Safe Git Commands (Windows PowerShell)**
```bash
# Use --no-pager to avoid console hanging
git --no-pager log --oneline -10
git --no-pager status --porcelain
git --no-pager diff --name-only

# Or use configured aliases
git lg    # Enhanced log view
git st    # Clean status view
```

#### **Commit Standards (Conventional Commits)**
```bash
# Feature addition
git commit -m "feat(auth): add login functionality"

# Bug fix
git commit -m "fix(ui): resolve button alignment issue"

# Documentation
git commit -m "docs: update installation guide"

# Code formatting
git commit -m "style: fix ESLint warnings"

# Breaking change
git commit -m "feat!: remove deprecated API"
```

#### **Release Workflow**
```bash
# Test release (dry run)
npm run release:dry

# Create actual release
npm run release

# Manual versioning if needed
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0
```

---

**Ready to develop!** 🎉  
➡️ **Next**: Check out `docs/examples.md` for practical concrete cases.
