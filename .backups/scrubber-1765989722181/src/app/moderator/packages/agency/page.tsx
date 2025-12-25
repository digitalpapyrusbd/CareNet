'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function AgencyPackageTemplateCreatorPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Senior Care');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

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
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('page.heading.createagencypackaget')}</h1>
          <p style={{ color: '#848484' }}>{t('page.text.definereusablepackag')}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" style={{ color: '#535353' }}>Package Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('page.placeholder.eg247seniorcarepremi')}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label htmlFor="category" style={{ color: '#535353' }}>Category *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              >
                <option value="Senior Care">{t('page.text.seniorcare')}</option>
                <option value="Post-Op Care">{t('page.text.postopcare')}</option>
                <option value="Chronic Condition">{t('page.text.chroniccondition')}</option>
                <option value="Pediatric Care">{t('page.text.pediatriccare')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description" style={{ color: '#535353' }}>Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('page.placeholder.describethepackagese')}
                className="mt-2 bg-white/50 border-white/50 min-h-32"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label htmlFor="price" style={{ color: '#535353' }}>Suggested Price (BDT) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.back()}
          disabled={!name || !description || !price}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>
    </div>
    </>

  );
}

