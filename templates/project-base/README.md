# 📦 Template Projet Base

> **Template universel réutilisable pour démarrer n'importe quel projet avec qualité professionnelle**

## 🎯 À propos

Ce template fournit une **base solide et universelle** pour créer rapidement des projets de qualité professionnelle, quel que soit le langage ou framework choisi.

## ✨ Fonctionnalités incluses

### 🔧 Qualité automatique

- ✅ **ESLint** - Détection d'erreurs automatique
- ✅ **Prettier** - Formatage de code cohérent
- ✅ **EditorConfig** - Configuration éditeur universelle
- ✅ **Git hooks** - Vérification avant commit

### 📋 Standards professionnels

- ✅ **Conventional Commits** - Messages standardisés
- ✅ **Semantic Versioning** - Versioning automatique
- ✅ **CHANGELOG** - Historique automatique
- ✅ **MIT License** - Libre d'utilisation

### 🚀 Automatisation

- ✅ **Scripts** - Installation, build, déploiement
- ✅ **GitHub Actions** - CI/CD intégré
- ✅ **Release automatique** - Plus de gestion manuelle
- ✅ **Documentation** - Guides complets

## 🚀 Utilisation rapide

### 1. Créer un nouveau projet

```bash
# Option 1: Cloner ce template
git clone https://github.com/your-repo/cursor-rules nouveau-projet
cd nouveau-projet
rm -rf .git  # Supprimer l'historique Git

# Option 2: Utiliser GitHub Template
# Cliquer sur "Use this template" sur GitHub

# Option 3: Télécharger et extraire
# Télécharger ZIP depuis GitHub
```

### 2. Personnaliser le projet

```bash
# Modifier les informations du projet
nano package.json  # Changer name, description, author, repository

# Exemple de personnalisation
{
  "name": "mon-super-projet",
  "description": "Description de mon projet",
  "author": "Votre Nom <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/votre-username/mon-super-projet"
  }
}
```

### 3. Installation automatique

```bash
# Installation complète en une commande
./scripts/setup.sh

# Ou étape par étape
npm install
git init
git add .
git commit -m "feat: initial project setup"
```

### 4. Démarrer le développement

```bash
# Vérifier que tout fonctionne
npm run quality

# Commencer à coder dans src/
echo 'console.log("Hello World!");' > src/index.js

# Formater automatiquement
npm run quality:fix

# Premier commit
git add .
git commit -m "feat: add hello world example"
```

## 📁 Structure du template

```
template-project-base/
├── 📋 Configuration
│   ├── .editorconfig          # Configuration éditeur universel
│   ├── .eslintrc.js          # Règles qualité JavaScript/TypeScript
│   ├── .prettierrc           # Formatage automatique
│   ├── .gitignore            # Exclusions Git
│   ├── .gitattributes        # Configuration Git avancée
│   ├── .gitmessage           # Template messages commit
│   └── .nvmrc                # Version Node.js recommandée
│
├── 📚 Documentation
│   ├── README.md             # Ce fichier
│   ├── CONTRIBUTING.md       # Guide contribution
│   ├── CODE_OF_CONDUCT.md    # Code de conduite
│   ├── LICENSE               # Licence MIT
│   └── CHANGELOG.md          # Historique versions
│
├── 🔨 Développement
│   ├── src/                  # Code source (vide initialement)
│   ├── docs/                 # Documentation détaillée
│   ├── scripts/              # Scripts automatisation
│   ├── examples/             # Exemples d'utilisation
│   └── templates/            # Templates réutilisables
│
├── ⚙️ Configuration
│   ├── package.json          # Dependencies et scripts
│   ├── .releaserc.js         # Configuration semantic-release
│   ├── release-it.json       # Configuration release-it
│   └── VERSION               # Version actuelle
│
└── 🤖 Automatisation
    ├── .github/              # GitHub Actions workflows
    ├── .cursor/              # Configuration Cursor/Claude
    └── memory-bank/          # Contexte persistant
```

## 🎨 Personnalisation par langage

### JavaScript/Node.js (par défaut)

```bash
# Configuration déjà incluse
npm install
npm run quality
```

### TypeScript

```bash
# Ajouter TypeScript
npm install -D typescript @types/node ts-node

# Ajouter dans package.json
"scripts": {
  "dev": "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}

# Créer tsconfig.json
npx tsc --init
```

### Python

```bash
# Adapter pour Python
rm package.json .eslintrc.js .prettierrc

# Créer requirements.txt
cat > requirements.txt << EOF
black
flake8
pytest
EOF

# Créer pyproject.toml
cat > pyproject.toml << EOF
[tool.black]
line-length = 88
target-version = ['py38']
EOF
```

### React

```bash
# Ajouter React
npm install react react-dom
npm install -D @vitejs/plugin-react vite

# Configurer Vite
cat > vite.config.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF
```

## 🛠️ Scripts disponibles

### Qualité de code

```bash
npm run quality      # Vérification complète (ESLint + Prettier)
npm run quality:fix  # Correction automatique
npm run lint         # ESLint seulement
npm run format       # Prettier seulement
```

### Versioning et release

```bash
npm run release         # Release complète automatique
npm run version:patch   # 1.0.0 → 1.0.1
npm run version:minor   # 1.0.0 → 1.1.0
npm run version:major   # 1.0.0 → 2.0.0
```

### Build et déploiement

```bash
./scripts/setup.sh      # Installation complète
./scripts/build.sh      # Construction du projet
./scripts/deploy.sh     # Déploiement
./scripts/clean.sh      # Nettoyage
```

## 🎯 Cas d'usage

### Pour débutants

1. **Cloner** le template
2. **Personnaliser** package.json
3. **Installer** avec `./scripts/setup.sh`
4. **Développer** dans src/
5. **Committer** avec les conventions

### Pour équipes

1. **Forker** le template sur GitHub
2. **Personnaliser** les règles ESLint
3. **Ajouter** des scripts spécifiques
4. **Partager** avec l'équipe
5. **Standardiser** tous les projets

### Pour organisations

1. **Adapter** le template aux standards
2. **Créer** des variantes spécialisées
3. **Publier** sur registry interne
4. **Former** les développeurs
5. **Gouverner** la qualité

## ✅ Validation

### Vérifications automatiques

- ✅ ESLint: 0 erreur, 0 warning
- ✅ Prettier: Code formaté parfaitement
- ✅ Git hooks: Fonctionnels
- ✅ Build: Réussi en <30s
- ✅ Documentation: Synchronisée

### Métriques qualité

```bash
# Commande de vérification complète
npm run quality && echo "✅ Template validé!"

# Métriques attendues
# - Setup time: <5 minutes
# - First commit: <10 minutes
# - Quality score: 100%
# - Documentation: Complete
```

## 🔄 Mise à jour du template

### Récupérer les améliorations

```bash
# Ajouter le template comme remote
git remote add template https://github.com/your-repo/cursor-rules

# Récupérer les mises à jour
git fetch template
git merge template/main --allow-unrelated-histories

# Résoudre les conflits si nécessaire
```

### Synchronisation automatique

```bash
# Script de mise à jour automatique
./scripts/update-template.sh
```

## 🤝 Contribution

### Améliorer le template

1. **Fork** le repository
2. **Créer** une branche feature
3. **Améliorer** le template
4. **Tester** avec plusieurs projets
5. **Soumettre** une Pull Request

### Standards de contribution

- Suivre les conventions du template
- Ajouter de la documentation
- Tester sur plusieurs environnements
- Maintenir la compatibilité

## 📚 Ressources

### Documentation

- [Guide d'utilisation](../../docs/usage.md)
- [Exemples pratiques](../../docs/examples.md)
- [Architecture technique](../../docs/architecture.md)

### Standards

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🆘 Support

### Problèmes courants

1. **"ESLint not found"** → `npm install`
2. **"Permission denied"** → `chmod +x scripts/*.sh`
3. **"Git hooks failed"** → `npm run quality:fix`

### Aide

- 📖 [Documentation complète](../../docs/)
- 🐛 [Issues GitHub](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

## 🎉 Résultat

Avec ce template, vous obtenez en quelques minutes :

- ✅ **Projet professionnel** configuré
- ✅ **Qualité automatique** garantie
- ✅ **Standards appliqués** automatiquement
- ✅ **Documentation complète** synchronisée
- ✅ **Prêt pour l'équipe** et la production

**🚀 Template universel pour tous vos projets futurs!**
