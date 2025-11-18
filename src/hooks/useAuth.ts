import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, AuthTokens } from '@/types';
import { storage } from '@/utils';

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (phone: string, password: string) => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  register: (data: {
    role: string;
    phone: string;
    email?: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const STORAGE_KEYS = {
  TOKENS: 'auth_tokens',
  USER: 'auth_user',
};

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const tokens = storage.get<AuthTokens>(STORAGE_KEYS.TOKENS);
        const user = storage.get<AuthUser>(STORAGE_KEYS.USER);

        setState({
          user,
          tokens,
          isLoading: false,
          isAuthenticated: !!(tokens && user),
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Save auth state to storage
  const saveAuthState = useCallback((user: AuthUser, tokens: AuthTokens) => {
    storage.set(STORAGE_KEYS.TOKENS, tokens);
    storage.set(STORAGE_KEYS.USER, user);
    
    setState({
      user,
      tokens,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  // Clear auth state from storage
  const clearAuthState = useCallback(() => {
    storage.remove(STORAGE_KEYS.TOKENS);
    storage.remove(STORAGE_KEYS.USER);
    
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  // Login function
  const login = useCallback(async (phone: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveAuthState(data.user, data.tokens);
      router.push('/dashboard');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [router, saveAuthState]);

  // Login with tokens function (for use after registration/OTP verification)
  const loginWithTokens = useCallback(async (accessToken: string, refreshToken: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get user data');
      }

      saveAuthState(data.user, { accessToken, refreshToken });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [saveAuthState]);

  // Register function
  const register = useCallback(async (data: {
    role: string;
    phone: string;
    email?: string;
    password: string;
    name: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // After successful registration, log the user in
      await login(data.phone, data.password);
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (state.tokens?.accessToken) {
        await fetch('/api/auth/login', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${state.tokens.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
      router.push('/login');
    }
  }, [state.tokens, router, clearAuthState]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    if (!state.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: state.tokens.refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
      }

      const newTokens = data.tokens;
      storage.set(STORAGE_KEYS.TOKENS, newTokens);
      
      setState(prev => ({
        ...prev,
        tokens: newTokens,
      }));
    } catch (error) {
      // If refresh fails, log out the user
      clearAuthState();
      router.push('/login');
      throw error;
    }
  }, [state.tokens, router, clearAuthState]);

  // Update profile function
  const updateProfile = useCallback(async (data: Partial<AuthUser>) => {
    if (!state.tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.tokens.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Profile update failed');
      }

      const updatedUser = result.user;
      storage.set(STORAGE_KEYS.USER, updatedUser);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  }, [state.tokens]);

  return {
    ...state,
    login,
    loginWithTokens,
    register,
    logout,
    refreshToken,
    updateProfile,
  };
};

// Hook to make authenticated API requests
export const useAuthenticatedFetch = () => {
  const { tokens, refreshToken } = useAuth();

  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    if (!tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    const makeRequest = async (token: string) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If token is expired, try to refresh it
      if (response.status === 401) {
        try {
          await refreshToken();
          // This will throw an error if refresh fails, which is handled by the refreshToken function
          throw new Error('Token refreshed, retry request');
        } catch {
          throw new Error('Authentication failed');
        }
      }

      return response;
    };

    try {
      let response = await makeRequest(tokens.accessToken);
      
      // If we got here, it means the token was refreshed and we need to retry
      if (response.status === 401 && tokens.refreshToken) {
        response = await makeRequest(tokens.accessToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, [tokens, refreshToken]);

  return authenticatedFetch;
};