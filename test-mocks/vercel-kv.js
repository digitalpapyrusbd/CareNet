// Mock for @vercel/kv used in Jest tests

const mockStore = new Map();

const kv = {
  get: jest.fn(async (key) => mockStore.get(key) || null),
  set: jest.fn(async (key, value) => {
    mockStore.set(key, value);
    return 'OK';
  }),
  setex: jest.fn(async (key, seconds, value) => {
    mockStore.set(key, value);
    return 'OK';
  }),
  del: jest.fn(async (key) => {
    mockStore.delete(key);
    return 1;
  }),
  exists: jest.fn(async (key) => mockStore.has(key) ? 1 : 0),
  expire: jest.fn(async () => 1),
  ttl: jest.fn(async () => -1),
  keys: jest.fn(async (pattern) => {
    if (pattern === '*') {
      return Array.from(mockStore.keys());
    }
    return [];
  }),
  // Helper to clear mock store between tests
  __clearStore: () => mockStore.clear(),
};

module.exports = { kv };
