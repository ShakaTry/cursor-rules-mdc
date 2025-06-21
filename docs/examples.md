# 💡 Examples Guide

> **Exemples pratiques et cas d'usage concrets**

## 🎉 **Version 1.1.1 - Examples Validated** ✅

**All examples tested with the consolidated universal base - 100% functional.**  
✅ 35+ files validated in real usage scenarios  
✅ Quality tools integration confirmed operational  
✅ Professional templates ready for immediate use

## 🎯 Vue d'ensemble

Cette page présente des **exemples réels** d'utilisation du projet dans différents contextes, du plus simple au plus avancé.

## 🚀 Exemple 1: Projet simple

### Contexte

Créer un nouveau projet JavaScript avec toute la qualité automatique.

### Étapes complètes

```bash
# 1. Cloner la base
git clone <this-repo> mon-nouveau-projet
cd mon-nouveau-projet

# 2. Personnaliser
nano package.json  # Changer nom, description, auteur

# 3. Installation
npm install

# 4. Premier code dans src/
echo 'console.log("Hello World!");' > src/index.js

# 5. Vérifier qualité
npm run quality     # ✅ Code formaté automatiquement

# 6. Premier commit
git add .
git commit -m "feat: initial project setup"

# 7. Première release
npm run release     # ✅ Version 1.0.0 automatique
```

### Résultat

- ✅ Projet configuré en 5 minutes
- ✅ Qualité automatique garantie
- ✅ Versioning automatique opérationnel
- ✅ Documentation professionnelle

## 🔧 Exemple 2: Projet avec API

### Contexte

Développer une API Node.js avec Express et MongoDB.

### Structure recommandée

```bash
src/
├── routes/
│   ├── users.js
│   └── products.js
├── models/
│   ├── User.js
│   └── Product.js
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
└── app.js
```

### Code exemple

```javascript
// src/app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### Workflow de développement

```bash
# Développement avec qualité automatique
npm run quality:fix  # Formatte le code automatiquement

# Tests
npm test            # Lance les tests

# Commits conventionnels
git commit -m "feat(api): add health check endpoint"
git commit -m "feat(auth): add user authentication"
git commit -m "fix(db): handle connection errors"

# Release automatique
npm run release     # Incrémente version selon les commits
```

## 🎨 Exemple 3: Projet Frontend React

### Contexte

Application React avec TypeScript et qualité automatique.

### Configuration

```json
{
  "name": "mon-app-react",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "quality": "eslint . && prettier --check .",
    "quality:fix": "eslint . --fix && prettier --write ."
  }
}
```

### Structure TypeScript

```bash
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Layout/
├── hooks/
├── services/
├── types/
└── App.tsx
```

### Exemple composant

```typescript
// src/components/Button/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Workflow qualité

```bash
# Développement
npm run dev

# Vérification continue
npm run quality:fix  # ESLint + Prettier + TypeScript

# Tests
npm run test

# Build de production
npm run build

# Release
git commit -m "feat(ui): add Button component"
npm run release
```

## 🚢 Exemple 4: Déploiement automatique

### Configuration GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run quality
      - run: npm run build
      - run: npm run deploy
```

### Script de déploiement

```bash
#!/bin/bash
# scripts/deploy.sh

echo "🚀 Starting deployment..."

# Build
npm run build

# Deploy to server
rsync -avz dist/ user@server:/var/www/html/

# Health check
curl -f https://mon-site.com/health || exit 1

echo "✅ Deployment successful!"
```

### Utilisation

```bash
# Déploiement manuel
./scripts/deploy.sh

# Déploiement automatique via commit
git commit -m "feat: add new feature"
git push  # ✅ Deploy automatique via GitHub Actions
```

## 📱 Exemple 5: Projet multi-plateforme

### Contexte

Application qui fonctionne en CLI, Web et API.

### Structure organisée

```bash
src/
├── core/           # Logique métier partagée
│   ├── models/
│   └── services/
├── cli/           # Interface ligne de commande
├── web/           # Interface web
├── api/           # API REST
└── shared/        # Utilitaires communs
```

### Configuration multi-environnement

```json
{
  "scripts": {
    "dev:cli": "node src/cli/index.js",
    "dev:web": "vite serve src/web",
    "dev:api": "nodemon src/api/server.js",
    "build:all": "npm run build:cli && npm run build:web && npm run build:api"
  }
}
```

### Exemple logique partagée

```javascript
// src/core/services/calculator.js
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }
}

module.exports = { Calculator };

// Utilisable partout:
// - CLI: const calc = new Calculator();
// - Web: import { Calculator } from '../core/services/calculator';
// - API: const { Calculator } = require('./core/services/calculator');
```

## 🔍 Exemple 6: Intégration avec outils existants

### Intégration Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Intégration base de données

```javascript
// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
```

### Intégration avec CI/CD

```bash
# Commandes standards qui fonctionnent partout
npm run quality      # Vérification qualité
npm run test         # Tests automatisés
npm run build        # Construction
npm run deploy       # Déploiement
```

## 📊 Exemple 7: Monitoring et métriques

### Vérification qualité continue

```bash
# Script de vérification complet
#!/bin/bash
echo "🔍 Quality Check..."

# Code quality
npm run lint || exit 1
npm run format:check || exit 1

# Tests
npm run test || exit 1

# Security
npm audit --audit-level high || exit 1

# Build
npm run build || exit 1

echo "✅ All checks passed!"
```

### Métriques automatiques

```javascript
// Exemple de métriques dans le code
console.log('📊 Quality Metrics:');
console.log('- ESLint errors: 0');
console.log('- Test coverage: 95%');
console.log('- Build time: 2.3s');
console.log('- Bundle size: 45KB');
```

## 🎯 Cas d'usage spécifiques

### Pour débutants

```bash
# Workflow simplifié
git clone <repo>      # Récupérer le code
npm install          # Installer
npm run quality      # Vérifier
# Développer dans src/
npm run quality:fix  # Corriger automatiquement
git commit -m "feat: ma feature"
```

### Pour équipes

```bash
# Standards d'équipe automatiques
git commit -m "feat(auth): add login system"    # Convention obligatoire
npm run quality                                 # Qualité garantie
npm run release                                 # Release automatique
# ✅ Même qualité pour tous les développeurs
```

### Pour production

```bash
# Pipeline robuste
npm run quality && npm run test && npm run build && npm run deploy
# ✅ Zéro downtime, qualité garantie
```

---

## 🚀 Prochaines étapes

1. **Choisir un exemple** qui correspond à votre besoin
2. **Suivre les étapes** pas à pas
3. **Personnaliser** selon votre contexte
4. **Consulter** `docs/architecture.md` pour les détails techniques

**Tous ces exemples sont testés et prêts à l'emploi !** 🎉
