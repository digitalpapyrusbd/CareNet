import { renderHook, act, waitFor } from '@testing-library/react';
import { useTranslation } from '../useTranslation';

// Mock i18n library
const mockGetLocale = jest.fn();
const mockGetMessages = jest.fn();
const mockFormatDate = jest.fn();
const mockFormatNumber = jest.fn();
const mockFormatCurrency = jest.fn();

jest.mock('@/lib/i18n', () => ({
  getLocale: () => mockGetLocale(),
  getMessages: (locale: string) => mockGetMessages(locale),
  formatDate: (date: Date, locale: string) => mockFormatDate(date, locale),
  formatNumber: (num: number, locale: string) => mockFormatNumber(num, locale),
  formatCurrency: (amount: number, locale: string) => mockFormatCurrency(amount, locale),
  tSync: jest.fn((key: string) => key),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('useTranslation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default mocks
    mockGetLocale.mockReturnValue('en');
    mockGetMessages.mockResolvedValue({
      common: {
        welcome: 'Welcome',
        hello: 'Hello {{name}}',
        count: 'You have {{count}} items'
      },
      auth: {
        login: 'Login',
        logout: 'Logout'
      }
    });
    mockFormatDate.mockImplementation((date) => date.toLocaleDateString());
    mockFormatNumber.mockImplementation((num) => num.toLocaleString());
    mockFormatCurrency.mockImplementation((amount) => `$${amount.toFixed(2)}`);
  });

  describe('Initialization', () => {
    it('should initialize with detected locale', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
    });

    it('should return all required functions', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t).toBeDefined();
        expect(result.current.setLocale).toBeDefined();
        expect(result.current.formatDate).toBeDefined();
        expect(result.current.formatTime).toBeDefined();
        expect(result.current.formatDateTime).toBeDefined();
        expect(result.current.formatNumber).toBeDefined();
        expect(result.current.formatCurrency).toBeDefined();
      });
    });

    it('should load messages on mount', async () => {
      renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(mockGetMessages).toHaveBeenCalledWith('en');
      });
    });

    it('should store locale in localStorage on mount', async () => {
      renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(localStorage.getItem('locale')).toBe('en');
      });
    });
  });

  describe('Translation Function (t)', () => {
    it('should translate simple key', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.welcome')).toBe('Welcome');
      });
    });

    it('should translate nested key', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('auth.login')).toBe('Login');
      });
    });

    it('should return key if translation not found', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('missing.key')).toBe('missing.key');
      });
    });

    it('should replace single parameter', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.hello', { name: 'John' })).toBe('Hello John');
      });
    });

    it('should replace multiple parameters', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.count', { count: 5 })).toBe('You have 5 items');
      });
    });

    it('should handle numeric parameters', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.count', { count: 42 })).toBe('You have 42 items');
      });
    });

    it('should handle missing parameters gracefully', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.hello')).toBe('Hello {{name}}');
      });
    });

    it('should replace same parameter multiple times', async () => {
      mockGetMessages.mockResolvedValue({
        test: 'Hello {{name}}, welcome {{name}}'
      });
      
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('test', { name: 'Alice' })).toBe('Hello Alice, welcome Alice');
      });
    });
  });

  describe('setLocale Function', () => {
    it('should change locale to bn', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(result.current.locale).toBe('bn');
      });
    });

    it('should update localStorage when locale changes', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(localStorage.getItem('locale')).toBe('bn');
      });
    });

    it('should load new messages when locale changes', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(mockGetMessages).toHaveBeenCalledWith('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(mockGetMessages).toHaveBeenCalledWith('bn');
      });
    });

    it('should support changing locale multiple times', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(result.current.locale).toBe('bn');
      });
      
      act(() => {
        result.current.setLocale('en');
      });
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
    });
  });

  describe('formatDate Function', () => {
    it('should format Date object', async () => {
      const date = new Date('2024-01-15');
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatDate(date);
        expect(mockFormatDate).toHaveBeenCalledWith(date, 'en');
      });
    });

    it('should format date string', async () => {
      const dateString = '2024-01-15';
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatDate(dateString);
        expect(mockFormatDate).toHaveBeenCalledWith(expect.any(Date), 'en');
      });
    });

    it('should use current locale for formatting', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        const date = new Date('2024-01-15');
        result.current.formatDate(date);
        expect(mockFormatDate).toHaveBeenCalledWith(date, 'bn');
      });
    });
  });

  describe('formatTime Function', () => {
    it('should format time from Date object', async () => {
      const date = new Date('2024-01-15T14:30:00');
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        const formatted = result.current.formatTime(date);
        expect(typeof formatted).toBe('string');
      });
    });

    it('should format time from date string', async () => {
      const dateString = '2024-01-15T14:30:00';
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        const formatted = result.current.formatTime(dateString);
        expect(typeof formatted).toBe('string');
      });
    });

    it('should use Intl.DateTimeFormat with correct locale', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      const date = new Date('2024-01-15T14:30:00');
      const time = result.current.formatTime(date);
      
      // Should return formatted time string
      expect(typeof time).toBe('string');
    });

    it('should fallback to toLocaleTimeString on error', async () => {
      // Mock Intl.DateTimeFormat to throw error
      const originalIntl = global.Intl;
      global.Intl = {
        ...global.Intl,
        DateTimeFormat: jest.fn(() => {
          throw new Error('Format error');
        }) as any
      };
      
      const { result } = renderHook(() => useTranslation());
      const date = new Date('2024-01-15T14:30:00');
      
      await waitFor(() => {
        const formatted = result.current.formatTime(date);
        expect(typeof formatted).toBe('string');
      });
      
      // Restore
      global.Intl = originalIntl;
    });
  });

  describe('formatDateTime Function', () => {
    it('should combine date and time formatting', async () => {
      const date = new Date('2024-01-15T14:30:00');
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        const formatted = result.current.formatDateTime(date);
        expect(typeof formatted).toBe('string');
        expect(formatted).toContain(' '); // Should have space between date and time
      });
    });

    it('should format from date string', async () => {
      const dateString = '2024-01-15T14:30:00';
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        const formatted = result.current.formatDateTime(dateString);
        expect(typeof formatted).toBe('string');
      });
    });
  });

  describe('formatNumber Function', () => {
    it('should format integer', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatNumber(1000);
        expect(mockFormatNumber).toHaveBeenCalledWith(1000, 'en');
      });
    });

    it('should format decimal', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatNumber(1234.56);
        expect(mockFormatNumber).toHaveBeenCalledWith(1234.56, 'en');
      });
    });

    it('should use current locale', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        result.current.formatNumber(1000);
        expect(mockFormatNumber).toHaveBeenCalledWith(1000, 'bn');
      });
    });
  });

  describe('formatCurrency Function', () => {
    it('should format currency amount', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatCurrency(1000);
        expect(mockFormatCurrency).toHaveBeenCalledWith(1000, 'en');
      });
    });

    it('should format decimal amounts', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        result.current.formatCurrency(1234.56);
        expect(mockFormatCurrency).toHaveBeenCalledWith(1234.56, 'en');
      });
    });

    it('should use current locale for currency', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        result.current.formatCurrency(1000);
        expect(mockFormatCurrency).toHaveBeenCalledWith(1000, 'bn');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty messages object', async () => {
      mockGetMessages.mockResolvedValue({});
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('any.key')).toBe('any.key');
      });
    });

    it('should handle null parameters', async () => {
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('common.welcome', undefined)).toBe('Welcome');
      });
    });

    it('should handle special characters in translation values', async () => {
      mockGetMessages.mockResolvedValue({
        special: {
          'key-with_chars': 'Special translation with @#$%'
        }
      });
      
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('special.key-with_chars')).toBe('Special translation with @#$%');
      });
    });

    it('should handle deeply nested keys', async () => {
      mockGetMessages.mockResolvedValue({
        level1: {
          level2: {
            level3: {
              level4: 'Deep value'
            }
          }
        }
      });
      
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('level1.level2.level3.level4')).toBe('Deep value');
      });
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should support language switcher scenario', async () => {
      mockGetMessages.mockResolvedValue({ greeting: 'Hello' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      // User clicks Bengali language option
      mockGetMessages.mockResolvedValue({ greeting: 'নমস্কার' });
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(result.current.locale).toBe('bn');
        expect(mockGetMessages).toHaveBeenCalledWith('bn');
      });
    });

    it('should support dynamic content with parameters', async () => {
      mockGetMessages.mockResolvedValue({
        notification: 'You have {{count}} new messages from {{user}}'
      });
      
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        const message = result.current.t('notification', { count: 5, user: 'John' });
        expect(message).toBe('You have 5 new messages from John');
      });
    });

    it('should format dates in user interface', async () => {
      const { result } = renderHook(() => useTranslation());
      const today = new Date();
      
      await waitFor(() => {
        result.current.formatDate(today);
        result.current.formatTime(today);
        result.current.formatDateTime(today);
        
        expect(mockFormatDate).toHaveBeenCalled();
      });
    });
  });

  describe('State Persistence', () => {
    it('should maintain locale across re-renders', async () => {
      mockGetMessages.mockResolvedValue({ test: 'test' });
      const { result, rerender } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.locale).toBe('en');
      });
      
      act(() => {
        result.current.setLocale('bn');
      });
      
      rerender();
      
      await waitFor(() => {
        expect(result.current.locale).toBe('bn');
      });
    });

    it('should persist translations after locale change', async () => {
      mockGetMessages.mockResolvedValue({ welcome: 'Welcome' });
      const { result } = renderHook(() => useTranslation());
      
      await waitFor(() => {
        expect(result.current.t('welcome')).toBe('Welcome');
      });
      
      mockGetMessages.mockResolvedValue({ welcome: 'স্বাগতম' });
      act(() => {
        result.current.setLocale('bn');
      });
      
      await waitFor(() => {
        expect(result.current.t('welcome')).toBe('স্বাগতম');
      });
    });
  });
});
