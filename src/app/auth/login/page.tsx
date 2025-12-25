'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiCallNoAuth } from '@/lib/api-client';

export default function LoginPage() {
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

  const getPasswordError = (pwd: string): string => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (pwd.length > 128) return 'Password must not exceed 128 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain at least one number';
      if (!/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(pwd)) return 'Password must contain at least one special character';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneError = validatePhone(phone);
    const passwordError = getPasswordError(password);

    if (phoneError || passwordError) {
      setErrors({ phone: phoneError, password: passwordError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiCallNoAuth('/auth/login', {
        method: 'POST',
        body: { phone, password },
      });

      // Handle MFA required response
      if (response.mfa_required) {
        // Store temp token for MFA verification
        if (response.temp_token) {
          localStorage.setItem('mfaTempToken', response.temp_token);
        }
        
        // Redirect to MFA verification page
        router.push('/auth/mfa/verify');
        return;
      }

      // Normal login response - store tokens (backend returns access_token and refresh_token in snake_case)
      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refreshToken', response.refresh_token);
        }
      } else {
        throw new Error('Invalid response: missing access token');
      }

      // Store user info
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Invalid response: missing user data');
      }

      // Redirect based on role
      const role = response.user.role?.toLowerCase() || '';
      if (role.includes('super') || role.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (role.includes('moderator')) {
        router.push('/moderator/dashboard');
      } else if (role.includes('company') || role.includes('agency')) {
        router.push('/agency/dashboard');
      } else if (role.includes('caregiver')) {
        router.push('/caregiver/dashboard');
      } else if (role.includes('guardian')) {
        router.push('/guardian/dashboard');
      } else if (role.includes('patient')) {
        router.push('/patient/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (error.status === 400) {
        // Validation error
        const validationErrors = error.data?.message || error.data?.details;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map((e: any) => e.message || e).join(', ');
        } else if (typeof validationErrors === 'string') {
          errorMessage = validationErrors;
        } else {
          errorMessage = error.data?.message || 'Invalid input. Please check your phone number and password format.';
        }
      } else if (error.status === 401) {
        errorMessage = error.data?.message || 'Invalid phone number or password.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. Your account may be deactivated.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo Section */}
      <div className="w-full max-w-md mb-8 text-center">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
          }}
        >
          <Heart className="w-10 h-10 text-white fill-current" />
        </div>
        <h1 className="mb-2" style={{ color: '#535353' }}>CareNet</h1>
        <p style={{ color: '#535353' }}>
          Quality care, connected
        </p>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-6 text-center" style={{ color: '#535353' }}>Welcome Back</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`bg-white/50 border-white/50 placeholder:text-gray-400 ${errors.phone ? 'border-destructive' : ''}`}
              style={{ color: '#535353' }}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
            <p className="text-xs" style={{ color: '#848484' }}>
              Demo: Use 017XXXXXXXX for Guardian or 018XXXXXXXX for Caregiver
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#535353' }}>Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className={`bg-white/50 border-white/50 placeholder:text-gray-400 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                style={{ color: '#535353' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#848484' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm hover:underline"
              style={{ color: '#DB869A' }}
              onClick={() => router.push('/auth/reset-password/step-1')}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
            style={{
              background: 'radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)',
              boxShadow: '-4px 30px 30px rgba(219, 134, 154, 0.25)',
              color: 'white',
              border: 'none'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#848484' }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push('/auth/role-selection')}
              className="hover:underline"
              style={{ color: '#DB869A' }}
            >
              Register
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm" style={{ color: '#848484' }}>
        <p>CareNet Platform v2.0</p>
        <p className="mt-2">Progressive Web App</p>
      </div>
    </div>
  );
}
