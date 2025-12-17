'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

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
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return 'Password must contain at least one special character';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneError = validatePhone(phone);
    const passwordError = getPasswordError(password);

    if (phoneError || passwordError) {
      setErrors({ phone: phoneError, password: passwordError });
      return;
    }

    // Mock login - redirect based on phone number pattern
    if (phone.includes('017')) {
      router.push('/guardian/dashboard');
    } else if (phone.includes('018')) {
      router.push('/caregiver/dashboard');
    } else if (phone.includes('019')) {
      router.push('/agency/dashboard');
    } else {
      router.push('/');
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
            style={{
              background: 'radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)',
              boxShadow: '-4px 30px 30px rgba(219, 134, 154, 0.25)',
              color: 'white',
              border: 'none'
            }}
          >
            Login
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#848484' }}>
            Don't have an account?{' '}
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
