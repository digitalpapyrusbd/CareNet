'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Input, Form } from '@/components/ui';
import { LanguageSwitcher, ThemeSwitcher } from '@/components/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiCall } from '@/lib/api-client';

// Bangladesh phone number validation
const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { t, locale } = useTranslation();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const watchedPhone = watch('phone');

  useEffect(() => {
    if (watchedPhone) {
      setPhoneNumber(watchedPhone);
    }
  }, [watchedPhone]);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (digits.startsWith('880')) {
      return `+${digits}`;
    } else if (digits.startsWith('01')) {
      return `+880${digits}`;
    } else if (digits.length === 10 && digits.startsWith('1')) {
      return `+880${digits}`;
    }
    
    return phone;
  };

  const onPasswordSubmit = async (data: LoginFormData) => {
    try {
      await login({
        phone: formatPhoneNumber(data.phone),
        password: data.password,
        rememberMe: data.rememberMe || false,
      });
      
      // Redirect based on user role
      router.push('/dashboard');
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Login failed. Please try again.',
      });
    }
  };

  const onOTPSend = async () => {
    if (!phoneNumber) {
      setError('phone', { message: 'Phone number is required' });
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setError('phone', { message: 'Please enter a valid Bangladesh phone number' });
      return;
    }

    try {
      // Send OTP API call
      await apiCall('/auth/send-otp', {
        method: 'POST',
        body: {
          phone: formatPhoneNumber(phoneNumber),
        },
      });

      setOtpSent(true);
    } catch (error: any) {
      setError('phone', { message: error.message || 'Failed to send OTP. Please try again.' });
    }
  };

  const onOTPSubmit = async (otp: string) => {
    try {
      await login({
        phone: formatPhoneNumber(phoneNumber),
        otp,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      setError('root', {
        message: error.message || 'OTP verification failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">বিডি</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Language and Theme Switchers */}
        <div className="flex justify-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* Login Method Toggle */}
        <div className="bg-white dark:bg-gray-800 py-6 px-4 shadow-lg rounded-lg">
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'password'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('auth.login.passwordLogin')}
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('auth.login.otpLogin')}
            </button>
          </div>
        </div>

        {/* Login Form */}
        <Form onSubmit={handleSubmit(onPasswordSubmit)} className="mt-8 space-y-6">
          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
            </div>
          )}

          {loginMethod === 'password' ? (
            <>
              {/* Phone Number Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.phone.label')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">📱</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX or 01XXXXXXXXX"
                    className="pl-10"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('auth.phone.help')}
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.password.label')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">🔒</span>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    {t('auth.login.rememberMe')}
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="/auth/reset-password"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('auth.login.forgotPassword')}
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {t('auth.login.signIn')}
              </Button>
            </>
          ) : (
            /* OTP Login */
            <div className="space-y-6">
              {!otpSent ? (
                <>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.phone.label')}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">📱</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+8801XXXXXXXXX or 01XXXXXXXXX"
                        className="pl-10"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          register('phone').onChange(e);
                        }}
                        error={errors.phone?.message}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {t('auth.phone.help')}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={onOTPSend}
                    className="w-full"
                    size="lg"
                  >
                    {t('auth.login.sendOTP')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('auth.login.otpSent', { phone: formatPhoneNumber(phoneNumber) })}
                    </p>
                  </div>

                  <OTPInput onSubmit={onOTPSubmit} />
                  
                  <Button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    {t('auth.login.back')}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.login.noAccount')}{' '}
              <a
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('auth.login.signUp')}
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}

// OTP Input Component
function OTPInput({ onSubmit }: { onSubmit: (otp: string) => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
  const { t } = useTranslation();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    // Submit if all digits are filled
    if (newOtp.every(digit => digit !== '')) {
      onSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}