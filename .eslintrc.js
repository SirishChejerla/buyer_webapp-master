module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'react-hooks'],
  rules: {
    'react/prop-types': 0,
    'prettier/prettier': ['error'],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-object-spread': 2,
    'no-unused-vars': 'warn',
    'no-negated-condition': 2,
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist/**'],
}
