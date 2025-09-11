import importPlugin from 'eslint-plugin-import';
import commentsPlugin from '@eslint-community/eslint-plugin-eslint-comments/configs';
import stylistic from '@stylistic/eslint-plugin';
import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['build/*', 'src/infra/database/migrations/*', 'jest.config.ts', '**/tmp/**', '**/coverage/**', 'eslint.config.mjs'],
  },
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  commentsPlugin.recommended,
  {
    files: ['**/*.ts', '**/*.mts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',

      globals: {
        ...globals.node,
      },

      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.lint.json',
        }
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
    },
    rules: {
      // General rules
      "no-console": "warn",
      "no-duplicate-imports": "off",
      "camelcase": "warn",
      "require-await": "off",
      "arrow-body-style": ["warn", "as-needed"],
      "eqeqeq": "error",
      "object-shorthand": "warn",
      "prefer-const": "warn",
      "consistent-return": "error",
  
      // TypeScript rules
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "req|res|next|err" }],
      "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }],
      "@typescript-eslint/no-floating-promises": "error",
  
      // Import rules
      "import/default": "off",
      "import/no-duplicates": ["error"],
      "import/no-named-as-default-member": "off",
      "import/order": [
        "warn",
        {
          "groups": [
            ["builtin", "external"],
            ["internal", "index", "sibling", "parent", "object"]
          ],
          "newlines-between": "always-and-inside-groups"
        }
      ],
  
      // Comments rules
      "@eslint-community/eslint-comments/no-unused-disable": "error",
      "@eslint-community/eslint-comments/disable-enable-pair": ["error", { "allowWholeFile": true }],
  
      // Stylistic rules
      "@stylistic/array-bracket-spacing": ["warn", "never"],
      "@stylistic/array-element-newline": ["warn", "consistent"],
      "@stylistic/arrow-spacing": "warn",
      "@stylistic/object-curly-newline": ["warn", { "multiline": true, "consistent": true }],
      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/object-property-newline": ["warn", { "allowAllPropertiesOnSameLine": true }],
      "@stylistic/comma-spacing": ["warn", { "before": false, "after": true }],
      "@stylistic/computed-property-spacing": ["warn", "never"],
      "@stylistic/comma-style": ["warn", "last"],
      "@stylistic/function-call-spacing": ["warn", "never"],
      "@stylistic/function-call-argument-newline": ["warn", "consistent"],
      "@stylistic/function-paren-newline": ["warn", "multiline-arguments"],
      "@stylistic/indent": ['warn', 2],
      "@stylistic/indent-binary-ops": ["warn", 2],
      "@stylistic/key-spacing": "warn",
      "@stylistic/keyword-spacing": "warn",
      "@stylistic/member-delimiter-style": ["warn", {
        "multiline": {
            "delimiter": "semi",
            "requireLast": true
        },
        "singleline": {
            "delimiter": "semi",
            "requireLast": false
        }
      }],
      "@stylistic/new-parens": "warn",
      "@stylistic/semi": "warn",
      "@stylistic/no-extra-semi": "warn",
      "@stylistic/no-floating-decimal": "warn",
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/no-multiple-empty-lines": "warn",
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/no-whitespace-before-property": "warn",
      "@stylistic/nonblock-statement-body-position": ["warn", "beside"],
      "@stylistic/quote-props": ["warn", "as-needed"],
      "@stylistic/quotes": ["warn", "single", { "avoidEscape": true }],
      "@stylistic/rest-spread-spacing": "warn",
      "@stylistic/semi-spacing": "warn",
      "@stylistic/space-before-blocks": "warn",
      "@stylistic/space-before-function-paren": ["warn", { "anonymous": "ignore", "named": "never", "asyncArrow": "always" }],
      "@stylistic/space-in-parens": "warn",
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/space-unary-ops": "warn",
      "@stylistic/spaced-comment": "warn",
      "@stylistic/switch-colon-spacing": "warn",
      "@stylistic/template-curly-spacing": "warn",
      "@stylistic/type-annotation-spacing": "warn",
      "@stylistic/type-named-tuple-spacing": "warn",
      "@stylistic/yield-star-spacing": ["error", "after"],
    }
  },
);