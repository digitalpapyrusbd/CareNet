import React from 'react';
import { renderHook, render, act, waitFor, cleanup } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/utils';
import { server } from '@/__tests__/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock storage
jest.mock('@/utils', () => ({
  storage: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  const mockStorage = storage as jest.Mocked<typeof storage>;

  const HookBridge = React.forwardRef<ReturnType<typeof useAuth> | null>((_, ref) => {
    const auth = useAuth();
    React.useImperativeHandle(ref, () => auth, [auth]);
    return null;
  });

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.get.mockReset();
    mockStorage.set.mockReset();
    mockStorage.remove.mockReset();
    mockStorage.get.mockReturnValue(null);
  });

  describe('Initialization', () => {
    it('should load auth state from storage', async () => {
      const mockUser = {
        id: 'user-123',
        phone: '+8801700000000',
        name: 'Test User',
        role: 'GUARDIAN',
      };
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockStorage.get.mockImplementation((key) => {
        if (key === 'auth_user') return mockUser;
        if (key === 'auth_tokens') return mockTokens;
        return null;
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual(mockTokens);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle storage errors gracefully', async () => {
      mockStorage.get.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('+8801700000000', 'password123');
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.user?.phone).toBe('+8801700000000');
      expect(result.current.isAuthenticated).toBe(true);
      expect(mockStorage.set).toHaveBeenCalledWith('auth_user', expect.any(Object));
      expect(mockStorage.set).toHaveBeenCalledWith('auth_tokens', expect.any(Object));
    });

    it('should handle login failure', async () => {
      // Override MSW handler for this test
      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json({
            success: false,
            message: 'Invalid credentials',
          }, { status: 401 });
        })
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await expect(
          result.current.login('+8801700000000', 'wrongpassword')
        ).rejects.toThrow('Login failed');
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Register', () => {
    // Use a bridge component so we can observe hook state even if router.push triggers unmounts
    it('should register successfully', async () => {
      const hookRef = React.createRef<ReturnType<typeof useAuth> | null>();
      render(React.createElement(HookBridge, { ref: hookRef }));

      await waitFor(() => {
        expect(hookRef.current).not.toBeNull();
        expect(hookRef.current?.isLoading).toBe(false);
      }, { timeout: 3000 });

      let registrationComplete = false;
      
      await act(async () => {
        try {
          await hookRef.current?.register({
            role: 'GUARDIAN',
            phone: '+8801700000000',
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          });
          registrationComplete = true;
        } catch (e) {
          // Router push might cause unmount, which is expected behavior
        }
      });

      expect(registrationComplete).toBe(true);
      // Registration should have been called even if router unmounted the component
      expect(mockStorage.set).toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    // Validate we clear storage even though router.push would navigate away in real app
    it('should logout and clear storage', async () => {
      const mockUser = {
        id: 'user-123',
        phone: '+8801700000000',
        name: 'Test User',
        role: 'GUARDIAN',
      };
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockStorage.get.mockImplementation((key) => {
        if (key === 'auth_user') return mockUser;
        if (key === 'auth_tokens') return mockTokens;
        return null;
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
      expect(result.current.tokens).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockStorage.remove).toHaveBeenCalledWith('auth_user');
      expect(mockStorage.remove).toHaveBeenCalledWith('auth_tokens');
    });
  });

  describe('Update Profile', () => {
    // Ensure profile updates persist to storage even when hook rerenders quickly
    it('should update user profile', async () => {
      const mockUser = {
        id: 'user-123',
        phone: '+8801700000000',
        name: 'Test User',
        role: 'GUARDIAN',
      };
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockStorage.get.mockImplementation((key) => {
        if (key === 'auth_user') return mockUser;
        if (key === 'auth_tokens') return mockTokens;
        return null;
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
        expect(result.current.isAuthenticated).toBe(true);
      }, { timeout: 2000 });

      await act(async () => {
        await result.current.updateProfile({ name: 'Updated Name' });
      });

      await waitFor(() => {
        expect(result.current.user?.name).toBe('Updated Name');
      });
      
      expect(mockStorage.set).toHaveBeenCalledWith(
        'auth_user',
        expect.objectContaining({ name: 'Updated Name' })
      );
    });
  });

  describe('Login with Tokens', () => {
    // Confirm token-based login path initializes state correctly
    it('should login with existing tokens', async () => {
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json({
            success: true,
            user: {
              id: 'user-123',
              phone: '+8801700000000',
              name: 'Test User',
              role: 'GUARDIAN',
            },
          });
        })
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loginWithTokens('access-token', 'refresh-token');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
    });
  });

  describe('Refresh Token', () => {
    // Verify refresh flow persists new tokens to storage
    it('should refresh access token', async () => {
      const mockUser = {
        id: 'user-123',
        phone: '+8801700000000',
        name: 'Test User',
        role: 'GUARDIAN',
      };
      const mockTokens = {
        accessToken: 'old-access-token',
        refreshToken: 'refresh-token',
      };

      mockStorage.get.mockImplementation((key) => {
        if (key === 'auth_user') return mockUser;
        if (key === 'auth_tokens') return mockTokens;
        return null;
      });

      server.use(
        http.post('*/auth/refresh', () => {
          return HttpResponse.json({
            success: true,
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'refresh-token',
            },
          });
        })
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(mockStorage.set).toHaveBeenCalledWith(
        'auth_tokens',
        expect.objectContaining({ accessToken: 'new-access-token' })
      );
    });
  });
});
