'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

export default function NotFoundPage() {
  const { t } = useTranslationContext();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Icon */}
      <div 
        className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
          boxShadow: '0px 4px 18px rgba(255, 183, 77, 0.35)'
        }}
      >
        <AlertCircle className="w-12 h-12 text-white" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8 text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#535353' }}>404</h1>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>{t('page.heading.pagenotfound')}</h2>
        <p className="mb-6" style={{ color: '#848484' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)',
              color: 'white'
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm max-w-md" style={{ color: '#848484' }}>
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </div>
  );
}


