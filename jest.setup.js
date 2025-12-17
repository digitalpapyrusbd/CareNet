import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations);

// Polyfills must be set up BEFORE importing MSW
// TextEncoder/TextDecoder
try {
  const { TextEncoder, TextDecoder } = require('util');
  if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
  if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;
} catch (e) {
  // ignore
}

// Response/Request/Headers must be defined BEFORE MSW server loads
if (typeof global.Response === 'undefined') {
  global.Response = class {
    constructor(body = null, init = {}) {
      this._body = body;
      this.status = init.status || 200;
      this.ok = this.status >= 200 && this.status < 300;
    }
    async json() {
      if (typeof this._body === 'string') return JSON.parse(this._body);
      return this._body;
    }
    async text() {
      if (typeof this._body === 'string') return this._body;
      return JSON.stringify(this._body);
    }
  };
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      this.input = input;
      this.init = init || {};
    }
  };
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers extends Map {
    constructor(init = {}) {
      super(Object.entries(init || {}));
    }
    append(key, value) {
      this.set(key, value);
    }
    get(key) {
      return super.get(key);
    }
  };
}

// NOW import MSW server after all polyfills are in place
const { server: mswServer } = require('./src/__tests__/mocks/server');
global.server = mswServer;

// Polyfills for test environment (jsdom)
try {
  // Fetch polyfill for environments where fetch is not available
  require('whatwg-fetch');
} catch (e) {
  // ignore if not installed; we'll still provide lightweight shims below
}

// Ensure interval timers exist (some environments strip them from global)
if (typeof global.setInterval !== 'function') {
  global.setInterval = (fn, delay = 0, ...args) => global.setTimeout(fn, delay, ...args);
}

if (typeof global.clearInterval !== 'function') {
  global.clearInterval = (id) => global.clearTimeout(id);
}

// Mock global fetch for tests that need it - make it a proper jest.fn() with all methods
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock @upstash/redis to avoid ESM issues
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  })),
  Ratelimit: jest.fn().mockImplementation(() => ({
    limit: jest.fn().mockResolvedValue({ success: true, remaining: 10 }),
  })),
}));

// Mock bcryptjs to avoid module issues
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt'),
}));

// Mock useTheme hook
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));


// Configure React Testing Library
configure({ testIdAttribute: 'data-testid' });

// jsdom/browser polyfills for tests
if (typeof window !== 'undefined') {
  // Touch / TouchEvent polyfill for mobile tests
  if (typeof window.Touch === 'undefined') {
    // Minimal Touch constructor
    // eslint-disable-next-line no-unused-vars
    class Touch {
      constructor(init) {
        Object.assign(this, init || {});
      }
    }
    window.Touch = Touch;
  }

  if (typeof window.TouchEvent === 'undefined') {
    // Minimal TouchEvent implementation
    // eslint-disable-next-line no-unused-vars
    class TouchEvent extends Event {
      constructor(type, init = {}) {
        super(type);
        this.touches = init.touches || [];
        this.changedTouches = init.changedTouches || [];
        this.targetTouches = init.targetTouches || [];
      }
    }
    window.TouchEvent = TouchEvent;
  }

  // performance API shims
  if (typeof window.performance === 'undefined') {
    window.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
    };
  } else {
    if (typeof window.performance.mark !== 'function') window.performance.mark = () => {};
    if (typeof window.performance.measure !== 'function') window.performance.measure = () => {};
  }

  // getComputedStyle shim returning simple values tests expect
  if (typeof window.getComputedStyle !== 'function') {
    window.getComputedStyle = (el) => ({
      color: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      width: '0px',
      height: '0px',
      outline: '',
      boxShadow: '',
      getPropertyValue: (name) => '',
    });
  }

  // Provide reasonable layout sizes for offsetWidth/offsetHeight used in keyboard tests
  if (typeof Element !== 'undefined' && !Object.getOwnPropertyDescriptor(Element.prototype, 'offsetWidth')) {
    Object.defineProperty(Element.prototype, 'offsetWidth', {
      get() {
        return 100;
      },
    });
  }

  if (typeof Element !== 'undefined' && !Object.getOwnPropertyDescriptor(Element.prototype, 'offsetHeight')) {
    Object.defineProperty(Element.prototype, 'offsetHeight', {
      get() {
        return 20;
      },
    });
  }

  // Ensure document has a language attribute for accessibility tests
  if (typeof document !== 'undefined' && !document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const React = require('react');
    return React.createElement('img', props);
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

// Global test utilities
global.testUtils = {
  // Helper to create a mock file
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    const file = new File(['test'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  },
  
  // Helper to create a mock user
  createMockUser: (overrides = {}) => ({
    id: '1',
    role: 'GUARDIAN',
    phone: '+8801712345678',
    email: 'test@example.com',
    name: 'Test User',
    mfaEnabled: false,
    ...overrides,
  }),
  
  // Helper to create a mock API response
  createMockApiResponse: (data, success = true) => ({
    success,
    data,
    error: success ? null : 'Test error',
  }),
};

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  // Start MSW server
  server.listen({ onUnhandledRequest: 'warn' });
  
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

// Reset handlers between tests
afterEach(() => {
  server.resetHandlers();
  // Clear fetch mock calls
  if (global.fetch && typeof global.fetch.mockClear === 'function') {
    global.fetch.mockClear();
  }
  // Ensure each test finishes with real timers to avoid leakage between suites
  if (typeof jest !== 'undefined' && typeof jest.useRealTimers === 'function') {
    jest.useRealTimers();
  }
});

afterAll(() => {
  // Stop MSW server
  server.close();
  console.error = originalError;
});