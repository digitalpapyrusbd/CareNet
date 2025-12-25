'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PoliceReviewPage() {
  const { t } = useTranslationContext();
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('page.heading.policeclearancerevie')}</h1>
          <p style={{ color: '#848484' }}>{t('page.text.reviewpoliceclearanc')}</p>
        </div>

        <div className="finance-card p-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
            }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <p style={{ color: '#535353' }}>Page content will be implemented based on specific requirements.</p>
        </div>
      </div>
    </div>
    </>

  );
}
