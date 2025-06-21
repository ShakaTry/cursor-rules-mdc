# 📦 Project Base Template

> **Universal reusable template to start any project with professional quality**

## 🎯 About

This template provides a **solid and universal base** to quickly create professional quality projects, regardless of the chosen language or framework.

## ✨ Included Features

### 🔧 Automatic Quality

- ✅ **ESLint** - Automatic error detection
- ✅ **Prettier** - Consistent code formatting
- ✅ **EditorConfig** - Universal editor configuration
- ✅ **Git hooks** - Pre-commit checks

### 📋 Professional Standards

- ✅ **Conventional Commits** - Standardized messages
- ✅ **Semantic Versioning** - Automatic versioning
- ✅ **CHANGELOG** - Automatic history
- ✅ **MIT License** - Free to use

### 🚀 Automation

- ✅ **Scripts** - Installation, build, deployment
- ✅ **GitHub Actions** - Integrated CI/CD
- ✅ **Automatic Release** - No manual management
- ✅ **Documentation** - Complete guides

## 🚀 Quick Usage

### 1. Create a New Project

```bash
# Option 1: Clone this template
git clone https://github.com/your-repo/cursor-rules new-project
cd new-project
rm -rf .git  # Remove Git history

# Option 2: Use GitHub Template
# Click on "Use this template" on GitHub

# Option 3: Download and extract
# Download ZIP from GitHub
```

### 2. Customize the Project

```bash
# Modify project information
nano package.json  # Change name, description, author, repository

# Example customization
{
  "name": "my-awesome-project",
  "description": "Description of my project",
  "author": "Your Name <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-awesome-project"
  }
}
```

### 3. Automatic Installation

```bash
# Complete installation in one command
./scripts/setup.sh

# Or step by step
npm install
git init
git add .
git commit -m "feat: initial project setup"
```

### 4. Start Development

```bash
# Check everything is working
npm run quality

# Start coding in src/
echo 'console.log("Hello World!");' > src/index.js

# Automatically format
npm run quality:fix

# First commit
git add .
git commit -m "feat: add hello world example"
```

## 📁 Template Structure

```
template-project-base/
├── 📋 Configuration
│   ├── .editorconfig          # Universal editor configuration
│   ├── .eslintrc.js          # JavaScript/TypeScript quality rules
│   ├── .prettierrc           # Automatic formatting
│   ├── .gitignore            # Git exclusions
│   ├── .gitattributes        # Advanced Git configuration
│   ├── .gitmessage           # Commit message template
│   └── .nvmrc                # Recommended Node.js version
│
├── 📚 Documentation
│   ├── README.md             # This file
│   ├── CONTRIBUTING.md       # Contribution guide
│   ├── CODE_OF_CONDUCT.md    # Code of conduct
│   ├── LICENSE               # MIT License
│   └── CHANGELOG.md          # Version history
│
├── 🔨 Development
│   ├── src/                  # Source code (initially empty)
│   ├── docs/                 # Detailed documentation
│   ├── scripts/              # Automation scripts
│   ├── examples/             # Usage examples
│   └── templates/            # Reusable templates
│
├── ⚙️ Configuration
│   ├── package.json          # Dependencies and scripts
│   ├── .releaserc.js         # Semantic-release configuration
│   ├── release-it.json       # Release-it configuration
│   └── VERSION               # Current version
│
└── 🤖 Automation
    ├── .github/              # GitHub Actions workflows
    ├── .cursor/              # Cursor/Claude configuration
    └── memory-bank/          # Persistent context
```

## 🎨 Language Customization

### JavaScript/Node.js (default)

```bash
# Configuration already included
npm install
npm run quality
```

### TypeScript

```bash
# Add TypeScript
npm install -D typescript @types/node ts-node

# Add to package.json
"scripts": {
  "dev": "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}

# Create tsconfig.json
npx tsc --init
```

### Python

```bash
# Adapt for Python
rm package.json .eslintrc.js .prettierrc

# Create requirements.txt
cat > requirements.txt << EOF
black
flake8
pytest
EOF

# Create pyproject.toml
cat > pyproject.toml << EOF
[tool.black]
line-length = 88
target-version = ['py38']
EOF
```

### React

```bash
# Add React
npm install react react-dom
npm install -D @vitejs/plugin-react vite

# Configure Vite
cat > vite.config.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF
```

## 🛠️ Available Scripts

### Code Quality

```bash
npm run quality      # Complete check (ESLint + Prettier)
npm run quality:fix  # Automatic correction
npm run lint         # ESLint only
npm run format       # Prettier only
```

### Versioning and Release

```bash
npm run release         # Complete automatic release
npm run version:patch   # 1.0.0 → 1.0.1
npm run version:minor   # 1.0.0 → 1.1.0
npm run version:major   # 1.0.0 → 2.0.0
```

### Build and Deployment

```bash
./scripts/setup.sh      # Complete installation
./scripts/build.sh      # Project construction
./scripts/deploy.sh     # Deployment
./scripts/clean.sh      # Cleaning
```

## 🎯 Usage Cases

### For Beginners

1. **Clone** the template
2. **Customize** package.json
3. **Install** with `./scripts/setup.sh`
4. **Develop** in src/
5. **Commit** with conventions

### For Teams

1. **Fork** the template on GitHub
2. **Customize** ESLint rules
3. **Add** specific scripts
4. **Share** with the team
5. **Standardize** all projects

### For Organizations

1. **Adapt** the template to standards
2. **Create** specialized variants
3. **Publish** on internal registry
4. **Train** developers
5. **Govern** quality

## ✅ Validation

### Automatic Checks

- ✅ ESLint: 0 errors, 0 warnings
- ✅ Prettier: Perfectly formatted code
- ✅ Git hooks: Functional
- ✅ Build: Succeeded in <30s
- ✅ Documentation: Synchronized

### Quality Metrics

```bash
# Complete check command
npm run quality && echo "✅ Template validated!"

# Expected metrics
# - Setup time: <5 minutes
# - First commit: <10 minutes
# - Quality score: 100%
# - Documentation: Complete
```

## 🔄 Template Update

### Retrieve Improvements

```bash
# Add template as remote
git remote add template https://github.com/your-repo/cursor-rules

# Retrieve updates
git fetch template
git merge template/main --allow-unrelated-histories

# Resolve conflicts if necessary
```

### Automatic Synchronization

```bash
# Automatic update script
./scripts/update-template.sh
```

## 🤝 Contribution

### Improve the Template

1. **Fork** the repository
2. **Create** a feature branch
3. **Improve** the template
4. **Test** with multiple projects
5. **Submit** a Pull Request

### Contribution Standards

- Follow template conventions
- Add documentation
- Test on multiple environments
- Maintain compatibility

## 📚 Resources

### Documentation

- [Usage Guide](../../docs/usage.md)
- [Practical Examples](../../docs/examples.md)
- [Technical Architecture](../../docs/architecture.md)

### Standards

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🆘 Support

### Common Issues

1. **"ESLint not found"** → `npm install`
2. **"Permission denied"** → `chmod +x scripts/*.sh`
3. **"Git hooks failed"** → `npm run quality:fix`

### Help

- 📖 [Complete Documentation](../../docs/)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

## 🎉 Result

With this template, you get in a few minutes:

- ✅ **Professional Project** configured
- ✅ **Automatic Quality** guaranteed
- ✅ **Applied Standards** automatically
- ✅ **Complete Documentation** synchronized
- ✅ **Ready for Team** and Production

**🚀 Universal Template for All Future Projects!**
