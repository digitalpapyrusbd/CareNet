'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function EditPackagePage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [name, setName] = useState('24/7 Senior Care - Premium');
  const [description, setDescription] = useState('Comprehensive care for elderly patients');
  const [price, setPrice] = useState('45000');

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('page.heading.editpackage')}</h1>
          <p style={{ color: '#848484' }}>Package ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>{t('page.text.packagename')}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>{t('page.text.description')}</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 bg-white/50 border-white/50 min-h-32"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Price (BDT)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.back()}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
    </>

  );
}
