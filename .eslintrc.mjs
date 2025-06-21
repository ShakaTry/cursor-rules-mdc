// ESLint Configuration - Détection automatique erreurs JS/TS
// https://eslint.org/docs/user-guide/configuring

export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'prettier', // Doit être en dernier pour override les règles conflictuelles
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'import', 'node', 'promise'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      },
    },
  },
  rules: {
    // Erreurs critiques
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // Géré par @typescript-eslint
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Qualité du code
    'prefer-const': 'error',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'no-template-curly-in-string': 'error',
    'array-callback-return': 'error',
    'no-constructor-return': 'error',

    // Style et lisibilité
    camelcase: ['error', { properties: 'never' }],
    'consistent-return': 'error',
    curly: ['error', 'all'],
    eqeqeq: ['error', 'always'],
    'no-else-return': 'error',
    'no-return-assign': 'error',
    'no-unneeded-ternary': 'error',
    'prefer-arrow-callback': 'error',

    // Imports
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',

    // Node.js - Désactivé pour projets universels
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Promises
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-nesting': 'warn',
  },
  overrides: [
    // Configuration JavaScript
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },

    // Fichiers de configuration - Règles relaxées
    {
      files: ['*.config.*', '.eslintrc.*', 'webpack.*', 'rollup.*', 'vite.*'],
      rules: {
        'no-console': 'off',
        'import/no-default-export': 'off',
      },
    },

    // Tests - Règles spécifiques
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/tests/**/*'],
      env: {
        jest: true,
        mocha: true,
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // Exemples et documentation
    {
      files: ['examples/**/*', 'docs/**/*'],
      rules: {
        'no-console': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.nyc_output/',
    '*.min.js',
    'vendor/',
    '.next/',
    '.nuxt/',
    '.output/',
    '.vuepress/dist/',
    '.serverless/',
    '.fusebox/',
    '.dynamodb/',
    '.tern-port',
    '.vscode-test',
    '.yarn/cache',
    '.yarn/unplugged',
    '.yarn/build-state.yml',
    '.yarn/install-state.gz',
    '.pnp.*',
  ],
};
