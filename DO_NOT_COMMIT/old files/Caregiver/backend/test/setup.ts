// Global test setup
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_c9WQxKsCLU7O@ep-wild-leaf-a1pinkz2-pooler.ap-southeast-1.aws.neon.tech/caregiver_test?sslmode=require';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: console.error, // Keep errors visible
};

// Increase timeout for integration tests
jest.setTimeout(10000);
