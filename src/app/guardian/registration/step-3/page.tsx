'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function GuardianRegistrationStep3Page() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [language, setLanguage] = useState('english');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const canSubmit = fullName && termsAccepted && privacyAccepted;

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: 3 >= s 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: 3 >= s ? 'white' : '#848484'
                }}
              >
                {3 > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div 
                  className="flex-1 h-1 mx-2"
                  style={{
                    background: 3 > s 
                      ? 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs" style={{ color: '#848484' }}>
          <span>Account</span>
          <span>Verify</span>
          <span>Profile</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-6" style={{ color: '#535353' }}>Complete Profile</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" style={{ color: '#535353' }}>Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo" style={{ color: '#535353' }}>Profile Photo</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="photo"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-white/30 transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {profilePhoto ? profilePhoto.name : 'Upload Photo'}
                </span>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" style={{ color: '#535353' }}>Language Preference</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-lg border"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.5)',
                color: '#535353'
              }}
            >
              <option value="english">English</option>
              <option value="bengali">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                I accept the <Link href="/terms" className="hover:underline" style={{ color: '#FFB3C1' }}>Terms & Conditions</Link>
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm cursor-pointer" style={{ color: '#535353' }}>
                I accept the <Link href="/privacy" className="hover:underline" style={{ color: '#FFB3C1' }}>Privacy Policy</Link>
              </Label>
            </div>
          </div>

          <Button
            onClick={() => router.push('/guardian/dashboard')}
            disabled={!canSubmit}
            className="w-full mt-6"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none',
              opacity: canSubmit ? 1 : 0.5
            }}
          >
            Complete Registration
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
