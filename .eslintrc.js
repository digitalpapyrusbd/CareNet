module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};