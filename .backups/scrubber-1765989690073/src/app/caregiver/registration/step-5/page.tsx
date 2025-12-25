'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

const skillOptions = ['Elderly Care', 'Post-Surgery', 'Pediatric', 'Physio Support', 'Medication Management'];

export default function CaregiverRegistrationStepFivePage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Elderly Care']);
  const [experience, setExperience] = useState('3');
  const [languages, setLanguages] = useState('Bangla, English');
  const [rate, setRate] = useState('350');
  const [certsUploaded, setCertsUploaded] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const canContinue = selectedSkills.length > 0 && experience.trim().length > 0 && certsUploaded;

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.step5of6')}</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.skillsexperience')}</h1>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#535353' }}>Select at least one skill *</p>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      background: selectedSkills.includes(skill)
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'rgba(255,255,255,0.6)',
                      color: selectedSkills.includes(skill) ? 'white' : '#535353',
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Years of Experience *</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Expected Hourly Rate (optional)</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>{t('page.text.languages1')}</label>
              <input
                className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#535353' }}>Upload Certifications *</p>
              <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-sm cursor-pointer"
                style={{ borderColor: certsUploaded ? '#7CE577' : 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.4)' }}>
                <span>{certsUploaded ? 'Certificates uploaded ' : 'Tap to upload certificates'}</span>
                <input type="file" multiple accept="application/pdf,image/*" className="hidden" onChange={() => setCertsUploaded(true)} />
              </label>
              <Textarea className="mt-3 bg-white/60 border-white/60" placeholder={t('page.placeholder.notesaboutcertificat')} />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => history.back()} style={{ color: '#535353' }}>
              Back
            </Button>
            <Button className="flex-1" disabled={!canContinue} onClick={() => router.push('/caregiver/registration/step-6')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
