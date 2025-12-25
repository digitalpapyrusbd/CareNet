'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Globe, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientSettingsPage() {
  const router = useRouter();

  const settings = [
    { icon: Bell, label: 'Notifications', subtitle: 'Manage alerts and reminders', link: '' },
    { icon: Globe, label: 'Language', subtitle: 'English', link: '' },
    { icon: Shield, label: 'Privacy', subtitle: 'Data and security settings', link: '/privacy' },
    { icon: HelpCircle, label: 'Help & Support', subtitle: 'Get assistance', link: '' },
  ];

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Settings</h1>
          <p style={{ color: '#848484' }}>Manage your account preferences</p>
        </div>

        <div className="space-y-3 mb-6">
          {settings.map((setting, idx) => (
            <button
              key={idx}
              onClick={() => setting.link && router.push(setting.link)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <setting.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-0.5" style={{ color: '#535353' }}>{setting.label}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>{setting.subtitle}</p>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="#848484" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={() => router.push('/auth/login')}
          variant="outline"
          className="w-full bg-white/50 border-white/50"
          style={{ color: '#FF6B7A' }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
    </>

  );
}

