# 📦 Installation Guide

> **Step-by-step installation guide for beginners**

## 🎉 **Version 1.1.1 - Fully Validated** ✅

**All installation methods have been tested and validated as 100% functional.**  
✅ ESLint + Prettier operational with modern flat config  
✅ All npm scripts tested and working  
✅ Version synchronization validated

## 🎯 Prerequisites

### Pre-installation checks

```bash
# Check Git
git --version

# Check Node.js (for universal quality tools)
node --version
npm --version
```

**Recommended versions:**

- Git: 2.30+
- Node.js: 18.18.0+ (see `.nvmrc`) - **Universal ESLint/Prettier tools**
- npm: 9.0+

### ❓ Why Node.js for a universal base?

**Node.js provides universal quality tools** (ESLint + Prettier) that format **all modern languages**: JavaScript, Python, Go, Rust, YAML, JSON, Markdown... It's like having Git installed - a universal development tool, not a project dependency.

## 🚀 Quick Installation

### Option 1: Automatic installation (recommended)

```bash
# Clone the project
git clone <your-repo-url>
cd cursor-rules

# Automatic installation
./scripts/setup.sh
```

### Option 2: Manual installation

```bash
# 1. Clone the project
git clone <your-repo-url>
cd cursor-rules

# 2. Install dependencies
npm install

# 3. Verify configuration
npm run quality
```

## 🔧 Configuration

### 1. Environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit your variables
nano .env
```

### 2. Git configuration (first time)

```bash
# Configure your identity
git config user.name "Your Name"
git config user.email "your@email.com"

# Enable commit template
git config commit.template .gitmessage
```

### 3. Editor configuration

The `.editorconfig` file automatically configures:

- ✅ Indentation (2 spaces)
- ✅ Unix line endings (LF)
- ✅ UTF-8 encoding
- ✅ Trimming trailing spaces

## ✅ Installation verification

### Basic tests

```bash
# Check code quality
npm run quality

# Check formatting
npm run format

# Check linting
npm run lint
```

### Advanced tests

```bash
# Test versioning system
npm run version:check

# Test build (if applicable)
npm run build

# Test scripts
./scripts/clean.sh
```

## 🔨 Installed tools

### Code quality

- **ESLint** - Automatic error detection
- **Prettier** - Automatic code formatting
- **EditorConfig** - Universal editor configuration

### Automatic versioning

- **Standard-version** - Semantic versioning
- **Release-it** - Automatic GitHub releases
- **Conventional Commits** - Standardized messages

### Available scripts

```bash
npm run setup        # Complete installation
npm run quality      # Quality check
npm run quality:fix  # Automatic fix
npm run lint         # ESLint only
npm run format       # Prettier only
```

## 🐛 Troubleshooting

### Common errors

#### Error: "ESLint not found"

```bash
# Reinstall dependencies
npm install --force
```

#### Error: "Permission denied" on scripts

```bash
# Grant execution permissions
chmod +x scripts/*.sh
```

#### Error: Node.js version

```bash
# Use the recommended version
nvm use  # or nvm install 18.18.0
```

### Support

- 📖 Documentation: `docs/usage.md`
- 🔍 Examples: `examples/`
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Installation complete!** 🎉  
➡️ **Next**: Check `docs/usage.md` to start using the project.
