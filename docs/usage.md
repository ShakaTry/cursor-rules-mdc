# 🚀 Usage Guide

> **Guide d'utilisation complet avec exemples pratiques**

## 🎯 Vue d'ensemble

Ce projet fournit une **base universelle réutilisable** pour tous vos futurs projets avec :

- ✅ **Qualité automatique** - Code propre sans effort
- ✅ **Versioning automatique** - Plus de gestion manuelle
- ✅ **Standards professionnels** - Collaboration facilitée
- ✅ **Documentation complète** - Démarrage rapide

## 🏁 Démarrage rapide

### 1. Premier usage

```bash
# Après installation
npm run quality      # Vérifier que tout fonctionne
npm run setup        # Configuration initiale (si pas fait)
```

### 2. Workflow quotidien

```bash
# Avant de commencer à coder
npm run quality      # Vérifier l'état actuel

# Pendant le développement
npm run quality:fix  # Corriger automatiquement les problèmes

# Avant de committer
npm run quality      # Validation finale
```

## 🛠️ Commandes principales

### Qualité de code

```bash
npm run quality      # Vérification complète (ESLint + Prettier)
npm run quality:fix  # Correction automatique des problèmes
npm run lint         # ESLint seulement
npm run format       # Prettier seulement
```

### Versioning automatique

```bash
# Commits conventionnels (exemples)
git commit -m "feat: nouvelle fonctionnalité"    # 1.0.0 → 1.1.0
git commit -m "fix: correction de bug"           # 1.1.0 → 1.1.1
git commit -m "docs: mise à jour documentation"  # Pas de changement version
git commit -m "feat!: changement breaking"       # 1.1.1 → 2.0.0

# Générer nouvelle version
npm run release      # Version + CHANGELOG + Tag + Push
```

### Scripts d'automatisation

```bash
./scripts/setup.sh   # Installation complète
./scripts/build.sh   # Construction du projet
./scripts/deploy.sh  # Déploiement
./scripts/clean.sh   # Nettoyage fichiers temporaires
```

## 📝 Conventional Commits

### Format obligatoire

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types principaux

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation seulement
- **style**: Formatage (sans changer la logique)
- **refactor**: Refactoring (sans nouvelle feature ni fix)
- **test**: Ajout ou modification de tests
- **chore**: Maintenance (build, dépendances, etc.)

### Exemples concrets

```bash
# Nouvelle fonctionnalité
git commit -m "feat(auth): add user login system"

# Correction de bug
git commit -m "fix(api): handle empty response correctly"

# Documentation
git commit -m "docs(readme): add installation instructions"

# Breaking change
git commit -m "feat(api)!: change authentication method"
```

## 🏗️ Structure du projet

### Organisation des fichiers

```
cursor-rules/
├── src/              # Code source principal
├── docs/             # Documentation complète
├── scripts/          # Scripts d'automatisation
├── examples/         # Exemples pratiques
├── templates/        # Templates réutilisables
├── .cursor/          # Configuration Cursor/Claude
└── package.json      # Configuration npm/outils
```

### Dossiers principaux

#### `src/` - Code source

```bash
# Votre code principal ici
src/
├── components/       # Composants/modules
├── utils/           # Fonctions utilitaires
├── config/          # Configuration
└── index.js         # Point d'entrée principal
```

#### `docs/` - Documentation

- `installation.md` - Guide installation
- `usage.md` - Ce fichier
- `examples.md` - Exemples détaillés
- `architecture.md` - Vue technique

#### `examples/` - Exemples pratiques

- `basic-usage/` - Utilisation de base
- `advanced-usage/` - Fonctionnalités avancées
- `integrations/` - Intégrations externes

## 🎨 Personnalisation

### 1. Adapter à votre projet

```bash
# 1. Changer les informations dans package.json
nano package.json

# 2. Modifier la licence si nécessaire
nano LICENSE

# 3. Personnaliser CONTRIBUTING.md
nano CONTRIBUTING.md
```

### 2. Configuration des outils

```bash
# ESLint (règles de code)
nano .eslintrc.js

# Prettier (formatage)
nano .prettierrc

# EditorConfig (éditeur)
nano .editorconfig
```

### 3. Scripts personnalisés

```bash
# Ajouter vos propres scripts
nano scripts/custom-script.sh

# Les rendre exécutables
chmod +x scripts/custom-script.sh
```

## 🔄 Workflow de développement

### 1. Créer une nouvelle fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feat/ma-nouvelle-feature

# 2. Développer avec qualité automatique
npm run quality:fix  # Pendant le développement

# 3. Committer avec convention
git add .
git commit -m "feat: add ma nouvelle feature"

# 4. Pousser et créer PR
git push origin feat/ma-nouvelle-feature
```

### 2. Maintenance régulière

```bash
# Vérification hebdomadaire
npm run quality           # Vérifier qualité
npm audit                # Vérifier sécurité
npm outdated             # Vérifier mises à jour

# Nettoyage régulier
./scripts/clean.sh       # Nettoyer fichiers temporaires
```

## 📊 Monitoring qualité

### Métriques automatiques

- **ESLint**: 0 erreur, 0 warning
- **Prettier**: Formatage cohérent
- **Commits**: Convention respectée
- **Tests**: Couverture >80% (si applicable)

### Vérifications continues

```bash
# Avant chaque commit
npm run quality

# Avant chaque release
npm run quality && npm run build && npm test
```

## 🚀 Déploiement

### Déploiement automatique

```bash
# Release complète automatique
npm run release

# Ou étape par étape
npm run version:patch    # 1.0.0 → 1.0.1
npm run version:minor    # 1.0.0 → 1.1.0
npm run version:major    # 1.0.0 → 2.0.0
```

### GitHub Actions (automatique)

- ✅ Tests à chaque push
- ✅ Release automatique sur `main`
- ✅ CHANGELOG mis à jour automatiquement
- ✅ GitHub Release créée automatiquement

## 📚 Ressources utiles

### Documentation

- 📖 [Examples détaillés](examples.md)
- 🏗️ [Architecture technique](architecture.md)
- 🛠️ [Guide installation](installation.md)

### Standards

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Prêt à développer !** 🎉  
➡️ **Suivant**: Consultez `docs/examples.md` pour des cas pratiques concrets.
