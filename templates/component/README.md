# 🧩 Template Composant

> **Template for creating reusable components/modules with guaranteed quality**

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

## ✅ Quality Checklist

### Code

- [ ] Complete and functional implementation
- [ ] Appropriate error handling
- [ ] Parameter validation
- [ ] Commented and readable code
- [ ] Convention compliance

### Tests

- [ ] Complete unit tests (>80% coverage)
- [ ] Integration tests if necessary
- [ ] Edge case and error tests
- [ ] Performance tests if applicable

### Documentation

- [ ] Complete README.md
- [ ] Usage examples
- [ ] API documentation
- [ ] Code comments

### Quality

- [ ] ESLint: 0 errors, 0 warnings
- [ ] Prettier: Formatted code
- [ ] TypeScript: Correct types (if applicable)
- [ ] Security audit: No vulnerabilities

## 🔄 Development Workflow

### 1. Development

```bash
# Create the component
npm run create:component MyComponent

# Develop with continuous quality
npm run quality:fix

# Test continuously
npm run test:watch
```

### 2. Validation

```bash
# Complete tests
npm run test

# Test coverage
npm run test:coverage

# Code quality
npm run quality
```

### 3. Integration

```bash
# Commit the component
git add .
git commit -m "feat(components): add MyComponent with full test coverage"

# Integrate into main project
# Import in src/index.js or other modules
```

## 📚 Concrete Examples

### Example 1: Logger

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

### Example 2: Validator

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

## 🎯 Best Practices

### Design

1. **Single Responsibility**: One component = one responsibility
2. **Clear Interface**: Simple and intuitive API
3. **Flexible Configuration**: Sensible default options
4. **Error Handling**: Clear error messages

### Code

1. **Naming**: Descriptive and consistent names
2. **Documentation**: Self-documented code + comments
3. **Tests**: >80% coverage with edge cases
4. **Performance**: Optimization when necessary

### Reusability

1. **Generic**: No project-specific dependencies
2. **Configurable**: Adaptable to different contexts
3. **Stable**: Versioned and backward compatible API
4. **Portable**: Works in different environments

---

**🧩 Composants prêts pour la réutilisation et la collaboration!**

➡️ **Suivant**: Consultez `../config/` pour les templates de configuration.
