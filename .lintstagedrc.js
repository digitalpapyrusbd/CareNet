module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'npm run type-check',
    'git add'
  ],
  '*.{js,jsx,ts,tsx,json,md}': [
    'prettier --write',
    'git add'
  ]
};