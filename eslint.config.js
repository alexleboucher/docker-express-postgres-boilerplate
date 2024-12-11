const globals = require('globals');
const jseslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const commentsPlugin = require('@eslint-community/eslint-plugin-eslint-comments/configs');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = tseslint.config({
  files: ['**/*.ts'],
  ignores: ["build/*", "src/migrations/*", "jest.config.ts"],
  extends: [
    jseslint.configs.recommended,
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    commentsPlugin.recommended,
  ],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.lint.json'],
    },
    ecmaVersion: 2020,
    sourceType: "module",
    globals: {
      ...globals.node,
      ...globals.browser,
    }
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    '@stylistic': stylistic,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.lint.json',
      }
    },
  },
  rules: {
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "no-duplicate-imports": "off",
    "camelcase": "warn",
    "require-await": "off",
    "arrow-body-style": ["warn", "as-needed"],
    "eqeqeq": "error",

    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "req|res|next|err" }],
    "@typescript-eslint/consistent-type-imports": ["warn", { "prefer": "type-imports" }],
    "@typescript-eslint/no-floating-promises": "error",

    "import/default": "off",
    "import/no-duplicates": ["error"],
    "import/no-named-as-default-member": "off",
    "import/order": [
      "error",
      {
        "groups": [
          ["builtin", "external"],
          ["internal", "index", "sibling", "parent", "object"]
        ],
        "newlines-between": "always-and-inside-groups"
      }
    ],

    "@eslint-community/eslint-comments/no-unused-disable": "error",
    "@eslint-community/eslint-comments/disable-enable-pair": ["error", { "allowWholeFile": true }],

    // Stylistic rules
    "@stylistic/array-bracket-spacing": ["warn", "never"],
    "@stylistic/array-element-newline": ["warn", "consistent"],
    "@stylistic/arrow-spacing": "warn",
    "@stylistic/block-spacing": "warn",
    "@stylistic/brace-style": ["warn", "1tbs", { "allowSingleLine": true }],
    "@stylistic/comma-spacing": ["warn", { "before": false, "after": true }],
    "@stylistic/computed-property-spacing": ["warn", "never"],
    "@stylistic/comma-style": ["warn", "last"],
    "@stylistic/function-call-spacing": ["warn", "never"],
    "@stylistic/function-call-argument-newline": ["warn", "consistent"],
    "@stylistic/function-paren-newline": ["warn", "multiline"],
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
    "@stylistic/object-curly-spacing": ["warn", "always"],
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
});