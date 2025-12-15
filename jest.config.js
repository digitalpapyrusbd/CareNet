const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/test-mocks/prisma.js',
    '^@vercel/kv$': '<rootDir>/test-mocks/vercel-kv.js',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/**/*.{js,jsx,ts,tsx}', // Exclude Next.js app dir (tested via E2E)
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/',
    '<rootDir>/backend/',
    '<rootDir>/src/__tests__/mocks/',
    '<rootDir>/DO_NOT_COMMIT/',
    'cross-browser.test.ts',
    'performance.test.ts',
    'security.test.ts',
    'guardian.test.tsx',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
    '!**/*cross-browser*',
    '!**/*performance.test*',
    '!**/*security.test*',
    '!**/*guardian.test*',
    '!**/*auth.test*',
    '!**/*payments.test*',
  ],
};

module.exports = createJestConfig(customJestConfig);