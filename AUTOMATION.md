# 🤖 Universal Automation Framework

**Complete automation framework for professional development workflows**

---

## 🎯 **Overview**

This universal automation system provides a **single, consistent workflow** for all your projects, regardless of programming language or framework. It automatically detects your project type and applies the appropriate tools and processes.

### **Supported Languages & Frameworks**
- **JavaScript/Node.js** (npm, yarn, pnpm)
- **Python** (pip, poetry, setuptools)
- **Go** (go modules)
- **Rust** (cargo)
- **PHP** (composer)
- **Java** (maven, gradle)
- **C#** (dotnet)
- **Ruby** (gem, bundler)
- **Generic** (any project with git)

---

## ⚡ **Quick Start**

### **1. One-Command Commit**
```bash
# Replace manual git workflow with intelligent automation
./scripts/commit "feat(auth): add login functionality"

# What it does automatically:
# ✅ Validates conventional commit format
# ✅ Runs appropriate linting/formatting
# ✅ Executes project-specific tests
# ✅ Updates version based on commit type
# ✅ Creates git commit with proper message
# ✅ Suggests next actions
```

### **2. Automated Release**
```bash
# One command for complete release workflow
./scripts/auto-release.sh minor

# What it does automatically:
# ✅ Detects project type and configuration
# ✅ Runs all tests across platforms
# ✅ Builds project with optimal settings
# ✅ Updates version in all relevant files
# ✅ Creates git tag with proper naming
# ✅ Generates release notes from commits
# ✅ Publishes to appropriate package registry
# ✅ Creates GitHub release with artifacts
```

### **3. Project Detection**
```bash
# See what the system detected about your project
./scripts/project-detector.sh

# Output example:
# 🔍 Detecting project type...
# ✅ JavaScript/Node.js project detected
# 📋 Detection Results:
#   Project Type: javascript
#   Package Manager: npm
#   Build Tool: N/A
#   Version File: package.json
```

---

## 🛠️ **Available Scripts**

### **Core Scripts**

#### **`./scripts/commit "message"`**
Intelligent commit helper with validation and automation.

```bash
# Basic usage
./scripts/commit "feat: add new feature"

# With scope
./scripts/commit "fix(auth): resolve login issue"

# Breaking change
./scripts/commit "feat!: breaking API change"

# Skip pre-commit checks (not recommended)
./scripts/commit "chore: quick fix" --no-verify
```

#### **`./scripts/auto-release.sh <type> [options]`**
Complete automated release workflow.

```bash
# Version bump types
./scripts/auto-release.sh patch    # Bug fixes (1.0.0 → 1.0.1)
./scripts/auto-release.sh minor    # New features (1.0.0 → 1.1.0)
./scripts/auto-release.sh major    # Breaking changes (1.0.0 → 2.0.0)

# Options
./scripts/auto-release.sh minor --dry-run      # See what would happen
./scripts/auto-release.sh patch --skip-tests   # Skip running tests
./scripts/auto-release.sh major --force-push   # Force push changes
```

#### **`./scripts/version-manager.sh <command>`**
Version management across different project types.

```bash
# View current version info
./scripts/version-manager.sh info

# Bump version
./scripts/version-manager.sh bump patch
./scripts/version-manager.sh bump minor
./scripts/version-manager.sh bump major

# Set specific version
./scripts/version-manager.sh set 2.1.0

# Create git tag for current version
./scripts/version-manager.sh tag
```

#### **`./scripts/project-detector.sh`**
Detect and configure project type automatically.

```bash
# Run detection
./scripts/project-detector.sh

# Results saved to .automation/project.env
# Used by all other scripts automatically
```

---

## 🔧 **Git Hooks (Automatic)**

The system installs intelligent Git hooks that work automatically:

### **Pre-commit Hook**
Runs before each commit to ensure quality:
- **Universal checks**: merge conflicts, trailing whitespace, TODO comments
- **JavaScript**: ESLint, Prettier, package-lock consistency
- **Python**: flake8, Black, isort
- **Go**: go fmt, go vet, golint
- **Rust**: cargo fmt, cargo clippy

### **Commit-msg Hook**
Validates commit messages:
- **Conventional commits**: Enforces proper format
- **Length validation**: Minimum 10 chars description
- **Type validation**: Only valid commit types
- **Breaking changes**: Proper `!` notation

### **Post-commit Hook**
Provides helpful information after commits:
- **Commit summary**: Hash, type, impact, file count
- **Next steps**: Push suggestions, version bump hints
- **Release conditions**: When to create releases
- **Project-specific tips**: Based on files changed

### **Prepare-commit-msg Hook**
Assists with commit message creation:
- **Smart templates**: Based on changed files
- **Type suggestions**: Analyzes changes to suggest commit type
- **Scope suggestions**: Based on directory structure
- **Project hints**: Language-specific best practices

---

## 🎛️ **Configuration**

### **Global Configuration**
Edit `.automation-config.yml` to customize behavior:

```yaml
# Force specific project type
detection:
  force_type: "javascript"

# Customize commit validation
commits:
  enforce_conventional: true
  min_description_length: 15
  max_first_line_length: 60

# Auto version bumping
versioning:
  auto_bump:
    enabled: true
    rules:
      feat: "minor"
      fix: "patch"

# Enable/disable hooks
hooks:
  pre_commit:
    enabled: true
  post_commit:
    enabled: true
```

### **Project-specific Overrides**
```yaml
overrides:
  javascript:
    versioning:
      default_bump: "minor"
  python:
    hooks:
      pre_commit:
        checks:
          - "mypy"  # Add mypy type checking
```

---

## 🚀 **GitHub Actions Integration**

### **Automatic CI/CD**
The system provides universal GitHub Actions workflows:

#### **`.github/workflows/ci.yml`**
- **Auto-detection**: Identifies project type and configures accordingly
- **Multi-platform**: Tests on Ubuntu, Windows, macOS
- **Language-specific**: Runs appropriate linters, formatters, tests
- **Security scanning**: Vulnerability checks for all languages
- **Build verification**: Ensures project builds correctly

#### **`.github/workflows/release.yml`**
- **Tag-triggered**: Automatically runs on version tags
- **Manual trigger**: Workflow dispatch with version bump options
- **Multi-language publishing**: npm, PyPI, crates.io, etc.
- **Release notes**: Auto-generated from conventional commits
- **Artifact management**: Builds and uploads release assets

### **Setup GitHub Actions**
1. **Secrets**: Add publishing tokens to repository secrets:
   ```
   NPM_TOKEN          # For npm publishing
   PYPI_TOKEN         # For PyPI publishing
   CARGO_TOKEN        # For crates.io publishing
   ```

2. **Permissions**: Ensure GitHub Actions has proper permissions:
   ```yaml
   permissions:
     contents: write    # For creating releases
     packages: write    # For publishing packages
   ```

---

## 📊 **Workflow Examples**

### **Daily Development**
```bash
# 1. Make your changes
git add .

# 2. Commit with automation (replaces git commit)
./scripts/commit "feat(api): add user authentication"

# 3. Push when ready
git push
```

### **Creating a Release**
```bash
# Option 1: Automatic (recommended)
./scripts/auto-release.sh minor

# Option 2: Manual steps
./scripts/version-manager.sh bump minor
git add .
git commit -m "chore: bump version to 1.2.0"
git tag v1.2.0
git push && git push --tags
```

### **Testing Before Release**
```bash
# Dry run to see what would happen
./scripts/auto-release.sh minor --dry-run

# Skip tests if you're confident
./scripts/auto-release.sh patch --skip-tests

# Force push if needed (be careful!)
./scripts/auto-release.sh major --force-push
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Scripts Not Executable**
```bash
# On Unix systems, make scripts executable
chmod +x scripts/*.sh
chmod +x .githooks/*

# On Windows, use Git Bash or WSL
```

#### **Git Hooks Not Working**
```bash
# Install hooks manually
git config core.hooksPath .githooks

# Or copy to .git/hooks/
cp .githooks/* .git/hooks/
```

#### **Project Detection Issues**
```bash
# Force project type in .automation-config.yml
detection:
  force_type: "javascript"

# Or run detection manually
./scripts/project-detector.sh
cat .automation/project.env
```

#### **Version Management Problems**
```bash
# Check current version info
./scripts/version-manager.sh info

# Manually set version if needed
./scripts/version-manager.sh set 1.0.0
```

### **Debug Mode**
Enable debug logging in `.automation-config.yml`:
```yaml
advanced:
  log_level: "debug"
  dry_run: true  # Test without making changes
```

---

## 🎉 **Benefits**

### **For Developers**
- **⚡ 90% faster releases**: One command instead of 10+ manual steps
- **🔒 Zero errors**: Automated validation prevents mistakes
- **🎯 Consistent workflow**: Same commands for all projects
- **📚 Learning**: Built-in best practices and suggestions

### **For Teams**
- **📈 Higher quality**: Enforced standards and automated checks
- **🚀 Faster delivery**: Streamlined release process
- **🔄 Consistency**: Same workflow across all repositories
- **📊 Visibility**: Clear commit history and release notes

### **For Projects**
- **🌍 Universal**: Works with any programming language
- **🔧 Configurable**: Customize to your project's needs
- **📦 Complete**: From commit to release, fully automated
- **🔮 Future-proof**: Easy to extend and modify

---

## 🆘 **Support**

### **Getting Help**
- **Documentation**: This file and inline script help
- **Configuration**: Check `.automation-config.yml` examples
- **Logs**: Review `.automation/automation.log` for details
- **Debug**: Enable debug mode for verbose output

### **Script Help**
```bash
# Get help for any script
./scripts/commit --help
./scripts/auto-release.sh --help
./scripts/version-manager.sh --help
```

### **Configuration Validation**
```bash
# Test your configuration
./scripts/project-detector.sh
./scripts/version-manager.sh info
./scripts/auto-release.sh patch --dry-run
```

---

**🎊 Congratulations! You now have a professional, universal automation system that will transform your development workflow.** 