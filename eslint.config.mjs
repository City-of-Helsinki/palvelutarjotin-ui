import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { importX } from 'eslint-plugin-import-x';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import noOnlyTestsPlugin from 'eslint-plugin-no-only-tests';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

const files = [
  '**/*.js',
  '**/*.jsx',
  '**/*.ts',
  '**/*.tsx',
  '**/*.cjs',
  '**/*.mjs',
];

export default [
  // Ignores
  {
    ignores: [
      'src/generated/graphql.tsx',
      'src/generated/graphql-cms.tsx',
      'src/generated/graphql-unified-search.tsx',
    ],
  },

  // @eslint-react config (replaces eslint-plugin-react)
  {
    files,
    ...eslintReact.configs['recommended-typescript'],
  },
  {
    files,
    rules: {
      // Disabled because they fire many times across the codebase and
      // migrating each site is out of scope for the ESLint-10 upgrade.
      '@eslint-react/component-hook-factories': 'off',
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/naming-convention-ref-name': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/use-state': 'off',
    },
  },
  // Playwright fixtures use a `use()` consumer that trips @eslint-react/rules-of-hooks.
  {
    files: ['src/playwright/**/*.{ts,tsx}'],
    rules: {
      '@eslint-react/rules-of-hooks': 'off',
    },
  },

  // react-hooks config
  {
    files,
    plugins: { 'react-hooks': reactHooksPlugin },
    rules: reactHooksPlugin.configs.recommended.rules,
  },

  // @next/next config
  {
    files,
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-sync-scripts': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-document-import-in-page': 'off',
    },
  },

  // jsx-a11y config
  {
    files,
    plugins: { 'jsx-a11y': jsxA11yPlugin },
    rules: jsxA11yPlugin.flatConfigs.recommended.rules,
  },

  // import-x config (replaces eslint-plugin-import)
  {
    files,
    ...importX.flatConfigs.recommended,
  },
  {
    files,
    ...importX.flatConfigs.typescript,
  },
  {
    files,
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // Codebase widely uses `React.useX` etc. via the default import;
      // rewriting to named imports is out of scope for this upgrade.
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      // testUtils.tsx intentionally re-exports a customized `render`
      // that shadows @testing-library/react's export.
      'import-x/export': 'off',
    },
  },

  // Stylistic rules
  {
    files,
    plugins: { '@stylistic': stylisticPlugin },
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'array-bracket-spacing': ['warn', 'never'],
      'object-curly-spacing': ['warn', 'always'],
    },
  },

  // No-only-tests plugin
  {
    files,
    plugins: { 'no-only-tests': noOnlyTestsPlugin },
    rules: {
      'no-only-tests/no-only-tests': 'error',
    },
  },

  // prettier config
  {
    files,
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      // Turn off rules that may cause problems, see
      // https://github.com/prettier/eslint-plugin-prettier/issues/65
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  // General rules
  {
    files,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...js.configs.recommended.rules,
      'max-len': ['warn', { code: 120 }],
      'no-console': 'warn',
      'no-plusplus': 'error',
      'no-undef': 'warn',
    },
  },

  // Overrides for typescript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/member-ordering': ['warn'],
      '@typescript-eslint/no-require-imports': ['error'],
    },
  },

  // Overrides for test files
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/*.test.jsx', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',
    },
  },
];
