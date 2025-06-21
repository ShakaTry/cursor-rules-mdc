# 🐍 Python Project Template

> **Professional Python template with automatic quality - Equivalent to the JavaScript base**

## 🎯 About

This Python template provides the **same quality standards** as the JavaScript base, adapted to the Python ecosystem.

## ✨ Included Features

### 🔧 Automatic Python Quality

- ✅ **Black** - Automatic formatting (equivalent to Prettier)
- ✅ **Flake8** - Error detection (equivalent to ESLint)
- ✅ **isort** - Import organization
- ✅ **Bandit** - Security analysis

### 📋 Professional Standards

- ✅ **pytest** - Tests with coverage >80%
- ✅ **pre-commit** - Automatic Git hooks
- ✅ **pyproject.toml** - Modern configuration
- ✅ **Sphinx** - Automatic documentation

### 🚀 Automation

- ✅ **Makefile Scripts** - Standard commands
- ✅ **GitHub Actions** - Python CI/CD
- ✅ **Semantic Versioning** - Python compatible

## 🚀 Quick Usage

### 1. Create a Python Project

```bash
# Copy the Python template
cp -r templates/python-base/ my-python-project
cd my-python-project

# Customize pyproject.toml
nano pyproject.toml  # Change name, description, author
```

### 2. Environment Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -e ".[dev]"
```

### 3. Quality Check

```bash
# Equivalent to "npm run quality"
make quality

# Equivalent to "npm run quality:fix"
make format

# Run tests
make test
```

## 📁 Project Structure

```
my-python-project/
├── 📋 Configuration
│   ├── pyproject.toml        # Main configuration (= package.json)
│   ├── requirements.txt      # Base dependencies
│   ├── .pre-commit-config.yaml # Git hooks
│   └── Makefile             # Scripts (= npm scripts)
│
├── 📚 Documentation
│   ├── README.md            # This file
│   ├── CHANGELOG.md         # Version history
│   └── docs/                # Sphinx documentation
│
├── 🔨 Code
│   ├── src/                 # Main source code
│   │   └── my_project/
│   ├── tests/               # pytest tests
│   └── examples/            # Usage examples
│
└── ⚙️ CI/CD
    ├── .github/workflows/   # GitHub Actions
    └── .gitignore           # Python exclusions
```

## 🛠️ Available Commands

### Daily Development

```bash
# Automatic formatting
make format              # black + isort

# Quality check
make lint               # flake8 + bandit
make quality            # lint + format check

# Tests
make test               # pytest with coverage
make test-cov           # tests + HTML report
```

### Versioning and Release

```bash
# Bump version
make version-patch      # 1.0.0 → 1.0.1
make version-minor      # 1.0.0 → 1.1.0
make version-major      # 1.0.0 → 2.0.0

# Release
make release            # tag + push + PyPI
```

## 📦 Equivalences with the JavaScript Template

| JavaScript/Node.js    | Python                    | Description             |
| --------------------- | ------------------------- | ----------------------- |
| `package.json`        | `pyproject.toml`          | Main configuration      |
| `eslint`              | `flake8`                  | Error detection         |
| `prettier`            | `black`                   | Automatic formatting    |
| `jest`                | `pytest`                  | Testing framework       |
| `npm install`         | `pip install -e ".[dev]"` | Dependency installation |
| `npm run quality`     | `make quality`            | Quality check           |
| `npm run quality:fix` | `make format`             | Automatic correction    |

## 🎨 Customization

### Adapt to Your Project

```bash
# 1. Modify pyproject.toml
[project]
name = "my-awesome-project"
description = "Description of my project"
authors = [{name = "Your Name", email = "email@example.com"}]

# 2. Rename the package
mv src/my_project src/my_awesome_project

# 3. Update imports in tests
# tests/test_example.py
from my_awesome_project import hello_world
```

### Add Dependencies

```bash
# Web framework
pip install fastapi uvicorn
echo "fastapi>=0.100.0" >> requirements.txt

# Data science
pip install pandas numpy matplotlib
echo "pandas>=2.0.0" >> requirements.txt

# Database
pip install sqlalchemy psycopg2-binary
echo "sqlalchemy>=2.0.0" >> requirements.txt
```

## ✅ Validation

### Expected Quality Metrics

```bash
make quality
# ✅ Black: All files formatted
# ✅ Flake8: 0 errors, 0 warnings
# ✅ isort: All imports organized
# ✅ Bandit: No security issues
# ✅ Tests: >80% coverage
```

---

## 🎉 Result

**Professional Python template equivalent to the JavaScript base!**

- ✅ **Same quality** as the JS/Node.js template
- ✅ **Modern Python standards** applied
- ✅ **Familiar workflow** for JS developers
- ✅ **Ready for production** immediately

**🚀 Universal base now available in Python!**
