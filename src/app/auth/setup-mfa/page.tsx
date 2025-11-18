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
import QRCode from 'qrcode';
import { apiCall } from '@/lib/api-client';

const mfaSetupSchema = z.object({
  code: z
    .string()
    .min(6, 'Authentication code must be 6 digits')
    .max(6, 'Authentication code must be 6 digits')
    .regex(/^\d{6}$/, 'Authentication code must be numeric'),
});

type MFASetupData = z.infer<typeof mfaSetupSchema>;

export default function MFASetupPage() {
  const router = useRouter();
  const { user, setupMFA, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const [step, setStep] = useState<'generate' | 'verify' | 'backup'>('generate');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [totpVerified, setTotpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MFASetupData>({
    resolver: zodResolver(mfaSetupSchema),
  });

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    try {
      const { secret, qrCode } = await apiCall('/auth/setup-mfa', {
        method: 'POST',
      });

      setSecret(secret);
      setQrCode(qrCode);
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to generate MFA secret. Please try again.',
      });
    }
  };

  const onVerifyCode = async (data: MFASetupData) => {
    try {
      await apiCall('/auth/verify-mfa-setup', {
        method: 'POST',
        body: {
          code: data.code,
          secret,
        },
      });

      setTotpVerified(true);
      setStep('backup');
      
      // Generate backup codes
      await generateBackupCodes();
    } catch (error: any) {
      setError('code', {
        message: error.message || 'Verification failed. Please try again.',
      });
    }
  };

  const generateBackupCodes = async () => {
    try {
      const { codes } = await apiCall('/auth/generate-backup-codes', {
        method: 'POST',
        body: {
          secret,
        },
      });

      setBackupCodes(codes);
    } catch (error) {
      console.error('Failed to generate backup codes:', error);
    }
  };

  const onCompleteSetup = async () => {
    try {
      await setupMFA({
        secret,
        backupCodes,
      });
      
      router.push('/dashboard?message=MFA setup completed successfully');
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to complete MFA setup',
      });
    }
  };

  const downloadBackupCodes = () => {
    const content = `CaregiverBD - MFA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.map((code, index) => `Code ${index + 1}: ${code}`).join('\n')}\n\nKeep these codes in a safe place. Each code can only be used once.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caregiverbd-mfa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      const button = document.getElementById('copy-secret-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🔐</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.mfa.setupTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.mfa.setupSubtitle')}
          </p>
        </div>

        {/* Language and Theme Switchers */}
        <div className="flex justify-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {[
              { key: 'generate', label: 'Generate' },
              { key: 'verify', label: 'Verify' },
              { key: 'backup', label: 'Backup' },
            ].map((stepItem, index) => (
              <div
                key={stepItem.key}
                className={`h-2 w-8 rounded-full ${
                  step === stepItem.key || (stepItem.key === 'backup' && totpVerified)
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {step === 'generate' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('auth.mfa.step1Title')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.mfa.step1Description')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg">
                    {qrCode && (
                      <img
                        src={qrCode}
                        alt="MFA QR Code"
                        className="w-48 h-48 mx-auto"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {t('auth.mfa.scanQR')}
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.mfa.manualEntry')}
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-600 rounded-md p-3 font-mono text-sm break-all">
                    {secret}
                  </div>
                  <button
                    id="copy-secret-btn"
                    type="button"
                    onClick={() => copyToClipboard(secret)}
                    className="mt-3 w-full text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t('auth.mfa.copySecret')}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  onClick={() => setStep('verify')}
                  className="w-full"
                  size="lg"
                >
                  {t('auth.mfa.nextStep')}
                </Button>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('auth.mfa.step2Title')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.mfa.step2Description')}
                </p>
              </div>

              <Form onSubmit={handleSubmit(onVerifyCode)} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.mfa.enterCode')}
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">🔢</span>
                    </div>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="pl-10 text-center text-2xl font-mono"
                      {...register('code')}
                      error={errors.code?.message}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={() => setStep('generate')}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('common.back')}
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    {t('auth.mfa.verifyCode')}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={generateSecret}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth.mfa.regenerateSecret')}
                </button>
              </div>
            </div>
          )}

          {step === 'backup' && totpVerified && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('auth.mfa.step3Title')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.mfa.step3Description')}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-yellow-800 dark:text-yellow-200 mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h4 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    {t('auth.mfa.backupCodesWarning')}
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {t('auth.mfa.backupCodesDescription')}
                  </p>
                </div>

                {backupCodes.length > 0 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="w-full text-left text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-700 dark:hover:text-yellow-300"
                    >
                      {showBackupCodes ? t('auth.mfa.hideCodes') : t('auth.mfa.showCodes')}
                      <span className="ml-2">{showBackupCodes ? '🙈' : '👁'}</span>
                    </button>

                    {showBackupCodes && (
                      <div className="mt-4 bg-white dark:bg-gray-800 rounded-md p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {backupCodes.map((code, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-center font-mono text-sm"
                            >
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t('auth.mfa.code')} {index + 1}
                              </div>
                              <div className="font-mono">{code}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-4 mt-6">
                  <Button
                    type="button"
                    onClick={downloadBackupCodes}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('auth.mfa.downloadCodes')}
                  </Button>
                  <Button
                    type="button"
                    onClick={onCompleteSetup}
                    className="flex-1"
                  >
                    {t('auth.mfa.completeSetup')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {t('auth.mfa.needHelp')}
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>{t('auth.mfa.help1')}</p>
            <p>{t('auth.mfa.help2')}</p>
            <p>{t('auth.mfa.help3')}</p>
          </div>
          <div className="mt-4">
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.mfa.contactSupport')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}