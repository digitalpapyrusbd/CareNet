'use client';

import { useState } from 'react';
import { apiCallNoAuth } from '@/lib/api-client';

interface GoogleSignInButtonProps {
  phone?: string;
  email?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'login' | 'register';
}

export function GoogleSignInButton({ 
  phone, 
  email, 
  onSuccess, 
  onError,
  variant = 'login' 
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // For registration, check if phone is already associated with Google
      if (variant === 'register' && phone) {
        const checkResponse = await apiCallNoAuth('/auth/check-google-association', {
          method: 'POST',
          body: { phone },
        });

        if (checkResponse.hasGoogleAccount) {
          // Phone is already associated - block registration
          if (onError) {
            onError(`This phone number is already associated with ${checkResponse.googleEmail || 'a Google account'}. Please use the login page.`);
          }
          setIsLoading(false);
          return;
        }
        // Phone is not associated - proceed with registration
      }

      // For login, check if phone/email is associated with Google
      if (variant === 'login' && (phone || email)) {
        const checkResponse = await apiCallNoAuth('/auth/check-google-association', {
          method: 'POST',
          body: { phone, email },
        });

        if (checkResponse.hasGoogleAccount) {
          // Phone/email is associated with Google - proceed with OAuth
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          const redirectUrl = phone 
            ? `${backendUrl}/api/auth/google?phone=${encodeURIComponent(phone)}`
            : `${backendUrl}/api/auth/google`;
          
          window.location.href = redirectUrl;
          return;
        } else {
          // Not associated with Google - show error
          if (onError) {
            onError('This account is not linked to Google. Please use email and password to sign in.');
          }
          setIsLoading(false);
          return;
        }
      }

      // For registration without phone check or when no phone/email provided, initiate Google OAuth flow
      // Phone will be passed as query param if provided (for linking during registration)
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const redirectUrl = phone 
        ? `${backendUrl}/api/auth/google?phone=${encodeURIComponent(phone)}`
        : `${backendUrl}/api/auth/google`;
      
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (onError) {
        onError(error.message || 'Failed to initiate Google sign-in');
      }
      setIsLoading(false);
    }
  };

  // For registration, check if phone is required and if it's already linked
  const isDisabled = isLoading || (variant === 'register' && (!phone || phone.length < 10));

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isDisabled}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        borderColor: isDisabled ? '#D0D0D0' : '#E0E0E0',
        backgroundColor: 'white',
        color: '#535353',
      }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="font-medium">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  );
}

