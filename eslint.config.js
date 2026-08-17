/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/*.config.js',
      '**/*.config.ts',
      'run-lighthouse.mjs',
      'verify-virtual.mjs',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            'apps/web/tsconfig.json',
            'packages/ui/tsconfig.json',
            'packages/lib/tsconfig.json',
            'packages/features/tsconfig.json',
            'packages/store/tsconfig.json',
          ],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // packages/ui 禁止引用 apps/* 和 packages/features/*
            {
              target: './packages/ui/**',
              from: './apps/**',
              message: '通用 UI 零件不能引用主站 (apps/*)',
            },
            {
              target: './packages/ui/**',
              from: './packages/features/**',
              message: '通用 UI 零件不能引用业务零件 (packages/features/*)',
            },
            // packages/lib 禁止引用 packages/ui、apps、packages/features
            {
              target: './packages/lib/**',
              from: './packages/ui/**',
              message: '工具层不能引用 UI 层 (packages/ui/*)',
            },
            {
              target: './packages/lib/**',
              from: './apps/**',
              message: '工具层不能引用主站 (apps/*)',
            },
            {
              target: './packages/lib/**',
              from: './packages/features/**',
              message: '工具层不能引用业务零件 (packages/features/*)',
            },
            // packages/features 禁止引用 apps/*
            {
              target: './packages/features/**',
              from: './apps/**',
              message: '业务零件不能引用主站 (apps/*)',
            },
          ],
        },
      ],
    },
  },
  require('eslint-config-prettier'),
];