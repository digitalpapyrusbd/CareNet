'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCallNoAuth } from '@/lib/api-client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (value: string) => {
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(value)) {
      return 'Enter a valid Bangladesh phone number';
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    // Auto-add +880 if user starts with 01
    if (value.startsWith('01') && !value.startsWith('+880')) {
      value = '+880' + value.slice(1);
    }
    setPhone(value);
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setErrors({ phone: phoneError });
      return;
    }

    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // #region agent log
    console.log('[DEBUG] Starting login attempt', { phone, passwordLength: password.length });
    // #endregion

    try {
      // #region agent log
      console.log('[DEBUG] Calling apiCallNoAuth with:', { endpoint: '/auth/login', phone });
      // #endregion

      const response = await apiCallNoAuth('/auth/login', {
        method: 'POST',
        body: { phone, password },
      });

      // #region agent log
      console.log('[DEBUG] Login API response received', { hasResponse: !!response, hasAccessToken: !!response.access_token, hasUser: !!response.user, userRole: response.user?.role });
      // #endregion

      // Handle MFA required response
      if (response.requiresMFA || response.mfa_required) {
        // Store temp token for MFA verification
        if (response.temp_token || response.tempSessionId) {
          localStorage.setItem('mfaTempToken', response.temp_token || response.tempSessionId);
        }
        
        // Redirect to MFA verification page
        router.push('/auth/verify-mfa');
        return;
      }

      // Normal login response - store tokens
      if (response.access_token) {
        // #region agent log
        console.log('[DEBUG] Storing tokens', { 
          accessTokenLength: response.access_token.length,
          accessTokenPrefix: response.access_token.substring(0, 50),
          hasRefreshToken: !!response.refresh_token,
          refreshTokenLength: response.refresh_token?.length
        });
        // #endregion
        
        localStorage.setItem('authToken', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
        
        // #region agent log
        console.log('[DEBUG] Tokens stored, verifying stored token', {
          storedToken: localStorage.getItem('authToken')?.substring(0, 50),
          matches: localStorage.getItem('authToken') === response.access_token
        });
        // #endregion
      } else {
        throw new Error('Invalid response: missing access token');
      }

      // Store user info
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Invalid response: missing user data');
      }

      // Redirect to admin dashboard
      // #region agent log
      console.log('[DEBUG] Login successful, redirecting to admin dashboard');
      // #endregion
      router.push('/admin/dashboard');
    } catch (error: any) {
      // #region agent log
      console.error('[DEBUG] Login error caught', { errorStatus: error.status, errorMessage: error.message, errorData: error.data, errorName: error.name });
      // #endregion

      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.status === 0) {
        errorMessage = error.message || 'Cannot connect to server. Please ensure the backend is running.';
      } else if (error.status === 400) {
        // Validation error from backend
        const validationErrors = error.data?.message || error.data?.details || error.data?.error;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map((e: any) => e.message || e).join(', ');
        } else if (typeof validationErrors === 'string') {
          errorMessage = validationErrors;
        } else {
          errorMessage = error.data?.message || 'Invalid input. Please check your phone number and password format.';
        }
      } else if (error.status === 401) {
        errorMessage = error.data?.message || 'Invalid phone number or password.';
      } else if (error.status === 429) {
        errorMessage = error.data?.error || 'Too many login attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
          boxShadow: '0px 4px 18px rgba(184, 167, 255, 0.35)'
        }}
      >
        <Shield className="w-10 h-10 text-white" />
      </div>

      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-2 text-center" style={{ color: '#535353' }}>Admin Login</h2>
        <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
          Secure access for platform administrators
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#535353' }}>{t('page.text.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('page.placeholder.enteryourpassword')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className="bg-white/50 border-white/50 placeholder:text-gray-400 pr-10"
                style={{ color: '#535353' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-1 hover:opacity-70 transition-opacity"
                style={{ color: '#848484', pointerEvents: 'auto' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5 pointer-events-none" /> : <Eye className="w-5 h-5 pointer-events-none" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
              boxShadow: '0px 4px 18px rgba(184, 167, 255, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 finance-card p-4">
          <p className="text-xs text-center" style={{ color: '#848484' }}>
            🔒 Two-factor authentication required for all admin accounts
          </p>
        </div>
      </div>
    </div>
    </>

  );
}
