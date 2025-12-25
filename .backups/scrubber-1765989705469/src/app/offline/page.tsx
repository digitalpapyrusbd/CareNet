'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

export default function OfflinePage() {
  const { t } = useTranslationContext();
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md finance-card p-8 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(139,122,232,0.1)' }}>
          <WifiOff className="w-10 h-10" style={{ color: '#8B7AE8' }} />
        </div>

        <h1 className="text-2xl font-semibold mb-3" style={{ color: '#535353' }}>{t('page.heading.youreoffline')}</h1>
        <p className="text-sm mb-6" style={{ color: '#848484' }}>
          It looks like you've lost your internet connection. Some features may not be available right now.
        </p>

        <div className="mb-6 p-4 rounded-2xl text-left" style={{ background: 'rgba(139,122,232,0.05)' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: '#535353' }}>{t('page.heading.whatyoucanstilldo')}</h3>
          <ul className="text-sm space-y-1" style={{ color: '#848484' }}>
            <li>{t('page.text.viewpreviouslyloaded')}</li>
            <li>{t('page.text.accesscachedcarelogs')}</li>
            <li>{t('page.text.reviewsavedpatientin')}</li>
            <li>✓ Draft messages (will send when online)</li>
          </ul>
        </div>

        <Button
          className="w-full"
          onClick={handleRefresh}
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
            color: 'white',
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>

        <p className="text-xs mt-4" style={{ color: '#848484' }}>
          Your data will automatically sync when you're back online
        </p>
      </div>
    </div>
  );
}

