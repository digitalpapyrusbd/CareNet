import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../../components/providers/ThemeProvider';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock theme utilities
jest.mock('@/lib/theme', () => ({
  getTheme: jest.fn(() => 'light'),
  applyTheme: jest.fn(),
  getEffectiveTheme: jest.fn((theme) => theme === 'system' ? 'light' : theme),
  themes: ['light', 'dark', 'system'],
  themeNames: {
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  }
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme Hook (from ThemeProvider)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with light theme from getTheme mock', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('light');
    });

    it('should return all required properties', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBeDefined();
      expect(result.current.effectiveTheme).toBeDefined();
      expect(result.current.setTheme).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
      expect(result.current.themes).toBeDefined();
      expect(result.current.themeNames).toBeDefined();
    });

    it('should have correct types for all properties', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
      expect(Array.isArray(result.current.themes)).toBe(true);
      expect(typeof result.current.themeNames).toBe('object');
    });

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('setTheme Function', () => {
    it('should change theme to dark', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
    });

    it('should change theme to system', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('system');
      });
      
      expect(result.current.theme).toBe('system');
    });

    it('should change theme back to light', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
    });
  });

  describe('toggleTheme Function', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      // Start with light (from mock)
      expect(result.current.theme).toBe('light');
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.toggleTheme(); // light -> dark
      });
      expect(result.current.theme).toBe('dark');
      
      act(() => {
        result.current.toggleTheme(); // dark -> light
      });
      expect(result.current.theme).toBe('light');
      
      act(() => {
        result.current.toggleTheme(); // light -> dark
      });
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('effectiveTheme', () => {
    it('should match theme when not system', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.effectiveTheme).toBe('dark');
    });

    it('should resolve system theme to effective theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('system');
      });
      
      // getEffectiveTheme mock returns 'light' for 'system'
      expect(result.current.effectiveTheme).toBe('light');
    });
  });

  describe('themes and themeNames', () => {
    it('should provide list of available themes', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.themes).toEqual(['light', 'dark', 'system']);
    });

    it('should provide theme names mapping', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.themeNames).toEqual({
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      });
    });
  });

  describe('Custom defaultTheme', () => {
    it('should accept but override defaultTheme with getTheme on mount', () => {
      // Due to useEffect calling getTheme(), defaultTheme is overridden
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });
      // getTheme mock returns 'light', so theme will be 'light' after mount effect
      expect(result.current.theme).toBe('light');
    });

    it('should initialize then get overridden by getTheme with system', () => {
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      );
      
      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });
      // getTheme mock returns 'light'
      expect(result.current.theme).toBe('light');
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should support user toggling theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      // User clicks toggle button multiple times
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');
      
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('light');
    });

    it('should support theme picker with all options', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      
      const allThemes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      
      allThemes.forEach(theme => {
        act(() => {
          result.current.setTheme(theme);
        });
        expect(result.current.theme).toBe(theme);
      });
    });

    it('should maintain theme state across re-renders', () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      rerender();
      
      expect(result.current.theme).toBe('dark');
    });
  });
});
