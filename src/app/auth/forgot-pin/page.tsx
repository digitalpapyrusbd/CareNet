'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiCallNoAuth } from '@/lib/api-client';

export default function ForgotPinPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const validatePhone = (value: string) => {
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(value)) {
      return "Enter a valid Bangladesh phone number";
    }
    return "";
  };

  const handlePhoneChange = (value: string) => {
    // Auto-add +880 if user starts with 01
    if (value.startsWith("01") && !value.startsWith("+880")) {
      value = "+880" + value.slice(1);
    }
    setPhone(value);
    setMessage('');
    setMessageType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneError = validatePhone(phone);
    if (phoneError) {
      setMessage(phoneError);
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType(null);

    try {
      const response = await apiCallNoAuth('/auth/forgot-pin', {
        method: 'POST',
        body: { phone },
      });

      setMessage(response.message);
      setMessageType('success');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      let errorMessage = "Failed to send reset link. Please try again.";

      if (error.status === 0) {
        errorMessage = "Cannot connect to server. Please ensure the backend is running.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setMessageType('error');
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
            background:
              "radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)",
            boxShadow: "0px 4px 18px rgba(255, 143, 163, 0.35)",
          }}
        >
          <Heart className="w-10 h-10 text-white fill-current" />
        </div>
        <h1 className="mb-2" style={{ color: "#535353" }}>
          CareNet
        </h1>
        <p style={{ color: "#535353" }}>Quality care, connected</p>
      </div>

      {/* Forgot PIN Form Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="mb-6 text-center" style={{ color: "#535353" }}>
          Forgot PIN?
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              messageType === 'success'
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: "#535353" }}>
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`bg-white/50 border-white/50 placeholder:text-gray-400`}
                style={{ color: "#535353" }}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs" style={{ color: "#848484" }}>
              Enter your registered phone number. We'll send a reset link to your email.
            </p>
          </div>

          {/* Reset Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !phone}
            style={{
              background:
                !phone
                  ? "rgba(132, 132, 132, 0.3)"
                  : "radial-gradient(118.75% 157.07% at 34.74% -18.75%, #DB869A 0%, #8082ED 100%)",
              boxShadow: "-4px 30px 30px rgba(219, 134, 154, 0.25)",
              color: "white",
              border: "none",
            }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm hover:underline"
            style={{ color: "#DB869A" }}
          >
            Back to Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm" style={{ color: "#848484" }}>
        <p>CareNet Platform v2.0</p>
        <p className="mt-2">Progressive Web App</p>
      </div>
    </div>
  );
}
