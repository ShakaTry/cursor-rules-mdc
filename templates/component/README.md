# 🧩 Template Composant

> **Template pour créer des composants/modules réutilisables avec qualité garantie**

## 🎯 À propos

Ce template vous aide à créer des composants bien structurés, testés et documentés, prêts pour la réutilisation et la collaboration.

## 📁 Structure recommandée

### Pour un composant JavaScript/Node.js

```
ComponentName/
├── index.js              # Point d'entrée principal
├── ComponentName.js      # Implémentation principale
├── ComponentName.test.js # Tests automatisés
├── README.md            # Documentation
├── package.json         # Configuration (si module séparé)
└── examples/            # Exemples d'utilisation
    └── basic.js
```

### Pour un composant React

```
ComponentName/
├── index.js              # Export principal
├── ComponentName.jsx     # Composant React
├── ComponentName.test.jsx # Tests Jest/RTL
├── ComponentName.stories.js # Storybook
├── ComponentName.module.css # Styles CSS modules
├── types.js             # Types PropTypes/TypeScript
└── README.md            # Documentation
```

## 🚀 Utilisation rapide

### 1. Créer un nouveau composant

```bash
# Copier le template
cp -r templates/component/ src/components/MonComposant

# Renommer les fichiers
cd src/components/MonComposant
mv ComponentName.js MonComposant.js
mv ComponentName.test.js MonComposant.test.js
```

### 2. Personnaliser le composant

```javascript
// MonComposant.js - Exemple composant utilitaire
class MonComposant {
  constructor(options = {}) {
    this.options = {
      name: 'defaultName',
      version: '1.0.0',
      ...options,
    };
  }

  // Méthode principale
  execute() {
    return `${this.options.name} v${this.options.version} is running!`;
  }

  // Méthode de validation
  validate() {
    if (!this.options.name || typeof this.options.name !== 'string') {
      throw new Error('Name must be a non-empty string');
    }
    return true;
  }

  // Méthode de configuration
  configure(newOptions) {
    this.options = { ...this.options, ...newOptions };
    return this;
  }
}

module.exports = MonComposant;
```

### 3. Ajouter les tests

```javascript
// MonComposant.test.js
const MonComposant = require('./MonComposant');

describe('MonComposant', () => {
  let component;

  beforeEach(() => {
    component = new MonComposant({ name: 'TestComponent' });
  });

  test('should create instance with default options', () => {
    const defaultComponent = new MonComposant();
    expect(defaultComponent.options.name).toBe('defaultName');
    expect(defaultComponent.options.version).toBe('1.0.0');
  });

  test('should execute with correct output', () => {
    const result = component.execute();
    expect(result).toBe('TestComponent v1.0.0 is running!');
  });

  test('should validate options correctly', () => {
    expect(() => component.validate()).not.toThrow();

    const invalidComponent = new MonComposant({ name: '' });
    expect(() => invalidComponent.validate()).toThrow();
  });

  test('should configure options', () => {
    component.configure({ version: '2.0.0' });
    expect(component.options.version).toBe('2.0.0');
    expect(component.options.name).toBe('TestComponent');
  });
});
```

### 4. Documenter le composant

```markdown
# MonComposant

Description courte du composant et de son utilité.

## Installation

\`\`\`bash
npm install mon-composant
\`\`\`

## Utilisation

\`\`\`javascript
const MonComposant = require('./MonComposant');

const component = new MonComposant({
name: 'MyApp',
version: '1.0.0'
});

console.log(component.execute());
\`\`\`

## API

### Constructor

- `options` (Object): Configuration options
  - `name` (string): Component name
  - `version` (string): Component version

### Methods

- `execute()`: Execute main functionality
- `validate()`: Validate configuration
- `configure(options)`: Update configuration
```

## 🎨 Templates par type

### Composant Utilitaire

```javascript
// Exemple: DateHelper
class DateHelper {
  static format(date, format = 'YYYY-MM-DD') {
    // Implementation
  }

  static parse(dateString) {
    // Implementation
  }

  static isValid(date) {
    // Implementation
  }
}
```

### Composant Service

```javascript
// Exemple: APIService
class APIService {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.options = options;
  }

  async get(endpoint) {
    // Implementation
  }

  async post(endpoint, data) {
    // Implementation
  }
}
```

### Composant React

```jsx
// Exemple: Button
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', size = 'medium', disabled = false, onClick }) => {
  const classes = `btn btn-${variant} btn-${size}`;

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
```

## ✅ Checklist qualité

### Code

- [ ] Implémentation complète et fonctionnelle
- [ ] Gestion d'erreurs appropriée
- [ ] Validation des paramètres
- [ ] Code commenté et lisible
- [ ] Respect des conventions

### Tests

- [ ] Tests unitaires complets (>80% couverture)
- [ ] Tests d'intégration si nécessaire
- [ ] Tests de cas limites et d'erreurs
- [ ] Tests de performance si applicable

### Documentation

- [ ] README.md complet
- [ ] Exemples d'utilisation
- [ ] Documentation API
- [ ] Commentaires dans le code

### Qualité

- [ ] ESLint: 0 erreur, 0 warning
- [ ] Prettier: Code formaté
- [ ] TypeScript: Types corrects (si applicable)
- [ ] Audit sécurité: Aucune vulnérabilité

## 🔄 Workflow de développement

### 1. Développement

```bash
# Créer le composant
npm run create:component MonComposant

# Développer avec qualité continue
npm run quality:fix

# Tester en continu
npm run test:watch
```

### 2. Validation

```bash
# Tests complets
npm run test

# Couverture de tests
npm run test:coverage

# Qualité du code
npm run quality
```

### 3. Integration

```bash
# Committer le composant
git add .
git commit -m "feat(components): add MonComposant with full test coverage"

# Intégrer dans le projet principal
# Import dans src/index.js ou autres modules
```

## 📚 Exemples concrets

### Exemple 1: Logger

```javascript
// Logger.js
class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = ['debug', 'info', 'warn', 'error'];
  }

  log(level, message, meta = {}) {
    if (this.shouldLog(level)) {
      console.log(`[${level.toUpperCase()}] ${message}`, meta);
    }
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }
  info(message, meta) {
    this.log('info', message, meta);
  }
  warn(message, meta) {
    this.log('warn', message, meta);
  }
  error(message, meta) {
    this.log('error', message, meta);
  }

  shouldLog(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.level);
  }
}
```

### Exemple 2: Validator

```javascript
// Validator.js
class Validator {
  static email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static password(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
  }

  static required(value) {
    return value !== null && value !== undefined && value !== '';
  }
}
```

## 🎯 Bonnes pratiques

### Design

1. **Single Responsibility**: Un composant = une responsabilité
2. **Interface claire**: API simple et intuitive
3. **Configuration flexible**: Options par défaut sensées
4. **Gestion d'erreurs**: Messages d'erreur clairs

### Code

1. **Naming**: Noms descriptifs et cohérents
2. **Documentation**: Code auto-documenté + commentaires
3. **Tests**: Coverage >80% avec cas limites
4. **Performance**: Optimisation quand nécessaire

### Réutilisation

1. **Générique**: Pas de dépendances spécifiques au projet
2. **Configurable**: Adaptable à différents contextes
3. **Stable**: API versionée et backward compatible
4. **Portable**: Fonctionne dans différents environnements

---

**🧩 Composants prêts pour la réutilisation et la collaboration!**

➡️ **Suivant**: Consultez `../config/` pour les templates de configuration.
