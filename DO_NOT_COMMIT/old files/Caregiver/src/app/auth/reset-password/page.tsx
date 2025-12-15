'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const resetSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)'),
});

const newPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;
type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetToken, setResetToken] = useState(searchParams.get('token') || '');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '', '', '']);

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    setError: setResetError,
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const {
    register: registerNewPassword,
    handleSubmit: handleNewPasswordSubmit,
    formState: { errors: newPasswordErrors },
    setError: setNewPasswordError,
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      token: resetToken,
    },
  });

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('880')) {
      return `+${digits}`;
    } else if (digits.startsWith('01')) {
      return `+880${digits}`;
    } else if (digits.length === 10 && digits.startsWith('1')) {
      return `+880${digits}`;
    }
    return phone;
  };

  const onResetRequest = async (data: ResetFormData) => {
    try {
      await apiCall('/auth/reset-password', {
        method: 'POST',
        body: {
          phone: formatPhoneNumber(data.phone),
        },
      });

      setPhoneNumber(formatPhoneNumber(data.phone));
      setOtpSent(true);
      setStep('verify');
    } catch (error: any) {
      setResetError('phone', { message: error.message || 'Failed to send reset code. Please try again.' });
    }
  };

  const onOTPVerify = async () => {
    try {
      const { token } = await apiCall('/auth/verify-reset-otp', {
        method: 'POST',
        body: {
          phone: phoneNumber,
          otp: verificationCode.join(''),
        },
      });

      setResetToken(token);
      setStep('reset');
    } catch (error: any) {
      setResetError('root', {
        message: error.message || 'OTP verification failed. Please try again.',
      });
    }
  };

  const onPasswordReset = async (data: NewPasswordFormData) => {
    try {
      await resetPassword({
        token: data.token,
        password: data.password,
      });
      
      router.push('/auth/login?message=Password reset successful. Please login with your new password.');
    } catch (error: any) {
      setNewPasswordError('root', {
        message: error.message || 'Password reset failed. Please try again.',
      });
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOTP = [...verificationCode];
    newOTP[index] = value;
    setVerificationCode(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    // Auto-submit if all digits are filled
    if (newOTP.every(digit => digit !== '')) {
      onOTPVerify();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  // Check if user came with a valid reset token
  React.useEffect(() => {
    if (resetToken) {
      setStep('reset');
    }
  }, [resetToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🔒</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.resetPassword.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.resetPassword.subtitle')}
          </p>
        </div>

        {/* Language and Theme Switchers */}
        <div className="flex justify-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <div className="bg-white dark:bg-gray-800 py-6 px-4 shadow-lg rounded-lg">
          {step === 'request' && (
            <Form onSubmit={handleResetSubmit(onResetRequest)} className="space-y-6">
              {resetErrors.root && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{resetErrors.root.message}</p>
                </div>
              )}

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
                    {...registerReset('phone')}
                    error={resetErrors.phone?.message}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('auth.phone.help')}
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {t('auth.resetPassword.sendResetCode')}
              </Button>

              <div className="text-center mt-4">
                <a
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.resetPassword.backToLogin')}
                </a>
              </div>
            </Form>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('auth.resetPassword.enterOTP')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.resetPassword.otpSent', { phone: phoneNumber })}
                </p>
              </div>

              {resetErrors.root && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{resetErrors.root.message}</p>
                </div>
              )}

              <div className="flex justify-center space-x-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  />
                ))}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    setOtpSent(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  {t('common.back')}
                </Button>
                <Button
                  type="button"
                  onClick={onOTPVerify}
                  className="flex-1"
                >
                  {t('auth.resetPassword.verify')}
                </Button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={onResetRequest}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.resetPassword.resendCode')}
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <Form onSubmit={handleNewPasswordSubmit(onPasswordReset)} className="space-y-6">
              {newPasswordErrors.root && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{newPasswordErrors.root.message}</p>
                </div>
              )}

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.resetPassword.resetToken')}
                </label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Reset token"
                  {...registerNewPassword('token')}
                  error={newPasswordErrors.token?.message}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.resetPassword.newPassword')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">🔐</span>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    {...registerNewPassword('password')}
                    error={newPasswordErrors.password?.message}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.resetPassword.confirmPassword')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">🔒</span>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    {...registerNewPassword('confirmPassword')}
                    error={newPasswordErrors.confirmPassword?.message}
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {t('auth.resetPassword.resetPassword')}
              </Button>

              <div className="text-center mt-4">
                <a
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.resetPassword.backToLogin')}
                </a>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}