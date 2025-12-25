'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { Activity, Upload, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function VerificationPhysicalPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [testDate, setTestDate] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('page.heading.step5physicalhealthc')}</h1>
          <p style={{ color: '#848484' }}>{t('page.text.uploadyourphysicalhe')}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('page.heading.physicalhealthcertif')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.issuedwithinlast3mon')}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(168, 224, 99, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>{t('page.text.requirements')}</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>{t('page.text.generalhealthexamina')}</li>
              <li>{t('page.text.nocommunicablediseas')}</li>
              <li>{t('page.text.physicallyfitforcare')}</li>
              <li>{t('page.text.signedbyregisteredme')}</li>
            </ul>
          </div>

          <div className="mb-4">
            <Label htmlFor="testDate" style={{ color: '#535353' }}>Examination Date *</Label>
            <Input
              id="testDate"
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}>
            <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
            <p className="mb-2" style={{ color: '#535353' }}>{t('page.text.dropfilehereorclickt')}</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="physical-upload"
            />
            <label htmlFor="physical-upload">
              <Button type="button" variant="outline" className="bg-white/50 border-white/50"
                onClick={() => document.getElementById('physical-upload')?.click()}>
                Select File
              </Button>
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
              <span className="text-sm" style={{ color: '#535353' }}>{file.name}</span>
              <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Skip for Now
          </Button>
          <Button onClick={() => router.push('/caregiver/pending-verification')} disabled={!file || !testDate} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            Submit Report
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}

