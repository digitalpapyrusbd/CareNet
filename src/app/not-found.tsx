'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 
            className="text-9xl mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            404
          </h1>
        </div>

        {/* Icon */}
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
          }}
        >
          <Search className="w-10 h-10 text-white" />
        </div>

        {/* Message */}
        <h2 className="mb-4" style={{ color: '#535353' }}>Page Not Found</h2>
        <p className="mb-8" style={{ color: '#848484' }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            size="lg"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 finance-card p-4">
          <p className="text-sm" style={{ color: '#848484' }}>
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
