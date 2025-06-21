// ESLint Configuration - Flat Config (moderne)
// Compatible avec type: "module" et ESM

// Configuration ESLint simplifiée pour éviter les imports complexes
// Utilise la configuration de base sans imports externes

export default [
  // Configuration de base simplifiée
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      // Erreurs critiques
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': [
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
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },

  // Configuration spécifique pour les fichiers de config
  {
    files: ['*.config.*', 'eslint.config.*'],
    rules: {
      'no-console': 'off',
    },
  },

  // Configuration pour les exemples et scripts
  {
    files: ['examples/**/*', 'docs/**/*', 'scripts/**/*', 'src/**/*'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },

  // Ignorer certains dossiers
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.nyc_output/**',
      '*.min.js',
    ],
  },
];
