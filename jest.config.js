/**
 * Jest Configuration for Caregiver Platform
 * Optimized for Next.js 16, React 19, and Node.js 22
 */

const nextJest = require("next/jest");

// Create Jest configuration from Next.js preset
const createJestConfig = nextJest({
  // Provide path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Custom Jest configuration
const customJestConfig = {
  // Setup files that run before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Module name mapping for path aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@prisma/client$": "<rootDir>/test-mocks/prisma.js",
    "^@vercel/kv$": "<rootDir>/test-mocks/vercel-kv.js",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  },

  // Transform ignore patterns - IMPORTANT: Ignore MSW from transformation
  // This prevents Jest from trying to transform ES module source code
  transformIgnorePatterns: [
    // Ignore ALL MSW source files (they're ES modules)
    "node_modules/msw",
    "node_modules/msw/(?!.*)",
  ],

  // Test environment
  testEnvironment: "jest-environment-jsdom",

  // Coverage collection
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/app/**/*.{js,jsx,ts,tsx}", // Exclude Next.js app dir (tested via E2E)
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },

  // Test path ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/",
    "<rootDir>/backend/",
    "<rootDir>/src/__tests__/mocks/",
    "<rootDir>/DO_NOT_COMMIT/",
    "cross-browser.test.ts",
    "performance.test.ts",
    "security.test.ts",
    "guardian.test.tsx",
  ],

  // Test match patterns
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx)",
    "**/*.(test|spec).(ts|tsx)",
    "!**/*cross-browser*",
    "!**/*performance.test*",
    "!**/*security.test*",
    "!**/*guardian.test*",
    "!**/*auth.test*",
    "!**/*payments.test*",
  ],
};

// Export merged configuration
module.exports = createJestConfig(customJestConfig);
