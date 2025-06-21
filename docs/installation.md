# 📦 Installation Guide

> **Guide d'installation pas-à-pas pour débutants**

## 🎉 **Version 1.1.1 - Fully Validated** ✅

**All installation methods have been tested and validated as 100% functional.**  
✅ ESLint + Prettier operational with modern flat config  
✅ All npm scripts tested and working  
✅ Version synchronization validated

## 🎯 Prérequis

### Vérifications avant installation

```bash
# Vérifier Git
git --version

# Vérifier Node.js (recommandé)
node --version
npm --version
```

**Versions recommandées:**

- Git: 2.30+
- Node.js: 18.18.0+ (voir `.nvmrc`)
- npm: 9.0+

## 🚀 Installation Rapide

### Option 1: Installation automatique (recommandée)

```bash
# Cloner le projet
git clone <your-repo-url>
cd cursor-rules

# Installation automatique
./scripts/setup.sh
```

### Option 2: Installation manuelle

```bash
# 1. Cloner le projet
git clone <your-repo-url>
cd cursor-rules

# 2. Installer les dépendances
npm install

# 3. Vérifier la configuration
npm run quality
```

## 🔧 Configuration

### 1. Variables d'environnement

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer vos variables
nano .env
```

### 2. Configuration Git (première fois)

```bash
# Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre@email.com"

# Activer le template de commit
git config commit.template .gitmessage
```

### 3. Configuration éditeur

Le fichier `.editorconfig` configure automatiquement :

- ✅ Indentation (2 espaces)
- ✅ Fin de ligne Unix (LF)
- ✅ Encodage UTF-8
- ✅ Suppression espaces en fin de ligne

## ✅ Vérification installation

### Tests de base

```bash
# Vérifier la qualité du code
npm run quality

# Vérifier le formatage
npm run format

# Vérifier le linting
npm run lint
```

### Tests avancés

```bash
# Test du système de versioning
npm run version:check

# Test de build (si applicable)
npm run build

# Test des scripts
./scripts/clean.sh
```

## 🔨 Outils installés

### Qualité de code

- **ESLint** - Détection d'erreurs automatique
- **Prettier** - Formatage de code automatique
- **EditorConfig** - Configuration éditeur universelle

### Versioning automatique

- **Standard-version** - Versioning sémantique
- **Release-it** - Releases GitHub automatiques
- **Conventional Commits** - Messages standardisés

### Scripts disponibles

```bash
npm run setup        # Installation complète
npm run quality      # Vérification qualité
npm run quality:fix  # Correction automatique
npm run lint         # ESLint seulement
npm run format       # Prettier seulement
```

## 🐛 Résolution de problèmes

### Erreurs communes

#### Erreur: "ESLint not found"

```bash
# Réinstaller les dépendances
npm install --force
```

#### Erreur: "Permission denied" sur scripts

```bash
# Donner les permissions d'exécution
chmod +x scripts/*.sh
```

#### Erreur: Version Node.js

```bash
# Utiliser la version recommandée
nvm use  # ou nvm install 18.18.0
```

### Support

- 📖 Documentation: `docs/usage.md`
- 🔍 Exemples: `examples/`
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Installation terminée !** 🎉  
➡️ **Suivant**: Consultez `docs/usage.md` pour commencer à utiliser le projet.
