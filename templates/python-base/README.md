# 🐍 Template Projet Python

> **Template Python professionnel avec qualité automatique - Équivalent de la base JavaScript**

## 🎯 À propos

Ce template Python fournit les **mêmes standards de qualité** que la base JavaScript, adapté à l'écosystème Python.

## ✨ Fonctionnalités incluses

### 🔧 Qualité automatique Python

- ✅ **Black** - Formatage automatique (équivalent Prettier)
- ✅ **Flake8** - Détection d'erreurs (équivalent ESLint)
- ✅ **isort** - Organisation des imports
- ✅ **Bandit** - Analyse de sécurité

### 📋 Standards professionnels

- ✅ **pytest** - Tests avec couverture >80%
- ✅ **pre-commit** - Hooks Git automatiques
- ✅ **pyproject.toml** - Configuration moderne
- ✅ **Sphinx** - Documentation automatique

### 🚀 Automatisation

- ✅ **Scripts Makefile** - Commandes standards
- ✅ **GitHub Actions** - CI/CD Python
- ✅ **Versioning sémantique** - Compatible Python

## 🚀 Utilisation rapide

### 1. Créer un projet Python

```bash
# Copier le template Python
cp -r templates/python-base/ mon-projet-python
cd mon-projet-python

# Personnaliser pyproject.toml
nano pyproject.toml  # Changer name, description, author
```

### 2. Installation environnement

```bash
# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer dépendances
pip install -e ".[dev]"
```

### 3. Vérification qualité

```bash
# Équivalent "npm run quality"
make quality

# Équivalent "npm run quality:fix" 
make format

# Lancer les tests
make test
```

## 📁 Structure du projet

```
mon-projet-python/
├── 📋 Configuration
│   ├── pyproject.toml        # Configuration principale (= package.json)
│   ├── requirements.txt      # Dépendances de base
│   ├── .pre-commit-config.yaml # Hooks Git
│   └── Makefile             # Scripts (= npm scripts)
│
├── 📚 Documentation
│   ├── README.md            # Ce fichier
│   ├── CHANGELOG.md         # Historique versions
│   └── docs/                # Documentation Sphinx
│
├── 🔨 Code
│   ├── src/                 # Code source principal
│   │   └── mon_projet/
│   ├── tests/               # Tests pytest
│   └── examples/            # Exemples d'usage
│
└── ⚙️ CI/CD
    ├── .github/workflows/   # GitHub Actions
    └── .gitignore           # Exclusions Python
```

## 🛠️ Commandes disponibles

### Développement quotidien

```bash
# Formatage automatique
make format              # black + isort

# Vérification qualité
make lint               # flake8 + bandit
make quality            # lint + format check

# Tests
make test               # pytest avec couverture
make test-cov           # tests + rapport HTML
```

### Versioning et release

```bash
# Bump version
make version-patch      # 1.0.0 → 1.0.1
make version-minor      # 1.0.0 → 1.1.0
make version-major      # 1.0.0 → 2.0.0

# Release
make release            # tag + push + PyPI
```

## 📦 Équivalences avec le template JavaScript

| JavaScript/Node.js | Python | Description |
|-------------------|--------|-------------|
| `package.json` | `pyproject.toml` | Configuration principale |
| `eslint` | `flake8` | Détection d'erreurs |
| `prettier` | `black` | Formatage automatique |
| `jest` | `pytest` | Framework de tests |
| `npm install` | `pip install -e ".[dev]"` | Installation dépendances |
| `npm run quality` | `make quality` | Vérification qualité |
| `npm run quality:fix` | `make format` | Correction automatique |

## 🎨 Personnalisation

### Adapter à votre projet

```bash
# 1. Modifier pyproject.toml
[project]
name = "mon-super-projet"
description = "Description de mon projet"
authors = [{name = "Votre Nom", email = "email@example.com"}]

# 2. Renommer le package
mv src/mon_projet src/mon_super_projet

# 3. Mettre à jour les imports dans les tests
# tests/test_example.py
from mon_super_projet import hello_world
```

### Ajouter des dépendances

```bash
# Framework web
pip install fastapi uvicorn
echo "fastapi>=0.100.0" >> requirements.txt

# Data science
pip install pandas numpy matplotlib
echo "pandas>=2.0.0" >> requirements.txt

# Base de données
pip install sqlalchemy psycopg2-binary
echo "sqlalchemy>=2.0.0" >> requirements.txt
```

## ✅ Validation

### Métriques qualité attendues

```bash
make quality
# ✅ Black: All files formatted
# ✅ Flake8: 0 errors, 0 warnings  
# ✅ isort: All imports organized
# ✅ Bandit: No security issues
# ✅ Tests: >80% coverage
```

---

## 🎉 Résultat

**Template Python professionnel équivalent à la base JavaScript !**

- ✅ **Même qualité** que le template JS/Node.js
- ✅ **Standards Python** modernes appliqués
- ✅ **Workflow familier** pour développeurs JS
- ✅ **Prêt pour production** immédiatement

**🚀 Base universelle maintenant disponible en Python !** 