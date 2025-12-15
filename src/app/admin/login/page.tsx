'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auth/verify-mfa');
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
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#535353' }}>Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@carenet.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#535353' }}>Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 border-white/50 placeholder:text-gray-400 pr-10"
                style={{ color: '#535353' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#848484' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
              boxShadow: '0px 4px 18px rgba(184, 167, 255, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            Login
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
