# 🚀 Exemple d'utilisation basique

> **Cas pratique : Créer un projet JavaScript simple avec qualité automatique**

## 🎯 Objectif

Démarrer un nouveau projet en moins de 5 minutes avec tous les outils de qualité configurés automatiquement.

## 📋 Prérequis

- Node.js 18+ installé
- Git configuré
- Éditeur de code (VS Code recommandé)

## 🚀 Étapes pas-à-pas

### 1. Cloner et personnaliser

```bash
# Cloner ce template
git clone https://github.com/your-username/cursor-rules mon-projet
cd mon-projet

# Personnaliser package.json
nano package.json  # Changer name, description, author
```

### 2. Installation automatique

```bash
# Lancer l'installation complète
./scripts/setup.sh

# Ou manuellement
npm install
```

### 3. Premier code

```bash
# Créer votre premier fichier
cat > src/index.js << 'EOF'
/**
 * Mon premier projet avec cursor-rules
 */

function sayHello(name = 'World') {
  return `Hello, ${name}!`;
}

function main() {
  console.log(sayHello('Développeur'));
  console.log('🎉 Projet configuré avec succès!');

  // Exemple d'utilisation des outils
  const config = {
    name: require('../package.json').name,
    version: require('../package.json').version,
    environment: process.env.NODE_ENV || 'development'
  };

  console.log('📋 Configuration:', config);
}

// Export pour réutilisation
module.exports = { sayHello, main };

// Exécution si appelé directement
if (require.main === module) {
  main();
}
EOF
```

### 4. Vérification qualité

```bash
# Vérifier la qualité du code
npm run quality

# Voir la magie : le code est formaté automatiquement!
cat src/index.js
```

### 5. Premier commit

```bash
# Ajouter les fichiers
git add .

# Commit avec convention (automatiquement formaté)
git commit -m "feat: initial project setup with working example"

# Le hook pre-commit vérifie automatiquement la qualité!
```

### 6. Test et build

```bash
# Tester le code
node src/index.js

# Construire le projet
./scripts/build.sh

# Tester le build
node dist/index.js
```

## 🎨 Personnalisation rapide

### Ajouter une fonction utilitaire

```javascript
// src/utils/helpers.js
const formatDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

module.exports = { formatDate, generateId };
```

### Utiliser dans index.js

```javascript
// Ajouter en haut de src/index.js
const { formatDate, generateId } = require('./utils/helpers');

// Utiliser dans main()
console.log('📅 Date:', formatDate());
console.log('🆔 ID:', generateId());
```

### Ajouter des scripts personnalisés

```json
// Dans package.json, section "scripts"
{
  "dev": "node src/index.js",
  "start": "node dist/index.js",
  "watch": "nodemon src/index.js"
}
```

## ✅ Validation

### Vérifications automatiques

```bash
# Qualité du code (0 erreur attendu)
npm run quality

# Build sans erreur
npm run build

# Tests (si configurés)
npm test
```

### Métriques attendues

- ✅ ESLint: 0 erreur, 0 warning
- ✅ Prettier: Code formaté automatiquement
- ✅ Build: Succès en <30 secondes
- ✅ Git: Hooks fonctionnels

## 🚀 Prochaines étapes

### Développement

1. **Ajouter des fonctionnalités** dans `src/`
2. **Documenter** dans `docs/`
3. **Tester** avec des exemples
4. **Committer** avec les conventions

### Déploiement

```bash
# Créer une release
npm run release

# Déployer
./scripts/deploy.sh
```

### Extensions

- Ajouter TypeScript: `npm install typescript @types/node`
- Ajouter des tests: `npm install jest`
- Ajouter une API: `npm install express`

## 🎯 Résultat attendu

À la fin de cet exemple, vous aurez :

- ✅ **Projet fonctionnel** en 5 minutes
- ✅ **Qualité garantie** automatiquement
- ✅ **Standards professionnels** appliqués
- ✅ **Prêt pour l'équipe** et la production

## 💡 Conseils

### Pour débutants

- Suivez les étapes dans l'ordre
- Lisez les messages d'erreur (ils sont utiles!)
- Utilisez `npm run quality:fix` pour corriger automatiquement

### Pour équipes

- Partagez ce template avec tous
- Personnalisez `.eslintrc.js` selon vos standards
- Ajustez les scripts dans `package.json`

---

**🎉 Félicitations! Vous avez un projet professionnel en quelques minutes!**

➡️ **Suivant**: Consultez `../advanced-usage/` pour des fonctionnalités avancées.
