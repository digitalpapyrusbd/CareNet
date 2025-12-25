'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';

export default function CaregiverCheckInLocationMismatchPage() {
  const { t } = useTranslationContext();
  const [note, setNote] = useState('Patient temporarily moved to daughter\'s apartment for follow-up visit.');

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-lg finance-card p-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>{t('page.heading.locationmismatch1')}</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            Your GPS location does not match the expected Banani address. Add a short reason so the guardian and moderator can review.
          </p>

          <label className="text-sm font-medium mb-2 block" style={{ color: '#535353' }}>Reason *</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-white/60 border-white/50 min-h-[140px]"
            placeholder={t('page.placeholder.explainwhythelocatio')}
          />

          <div className="mt-6 space-y-3">
            <Button
              disabled={!note.trim()}
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
                opacity: note.trim() ? 1 : 0.5,
              }}
            >
              Submit Note & Continue
            </Button>
            <Button variant="outline" className="w-full bg-white/50 border-white/50" style={{ color: '#535353' }}>
              Cancel Check-In
            </Button>
          </div>

          <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
            Overrides are logged and reviewed to keep everyone safe.
          </p>
        </div>
      </div>
    </Layout>
    </>

  );
}
