'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Globe, Shield, Lock, User, CreditCard, Smartphone, Eye, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CaregiverSettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', link: '/caregiver/profile' },
        { icon: Shield, label: 'Privacy & Security', link: '/caregiver/profile' },
        { icon: Lock, label: 'Change Password', link: '/caregiver/profile' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', link: '/caregiver/profile', badge: '3 active' },
        { icon: Globe, label: 'Language', link: '/caregiver/profile', badge: 'English' },
        { icon: Moon, label: 'Appearance', link: '/caregiver/profile', badge: 'Dark' },
      ],
    },
    {
      title: 'Payment & Billing',
      items: [
        { icon: CreditCard, label: 'Payment Methods', link: '/caregiver/earnings' },
        { icon: CreditCard, label: 'Billing History', link: '/caregiver/earnings' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: Smartphone, label: 'Connected Devices', link: '/caregiver/profile', badge: '2 devices' },
        { icon: Eye, label: 'Privacy Policy', link: '/caregiver/profile' },
      ],
    },
  ];

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
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

          <div className="space-y-6">
            {settingsSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h2 className="text-sm font-semibold mb-3 px-2" style={{ color: '#848484' }}>
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => item.link && router.push(item.link)}
                      className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                          }}
                        >
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="mb-0.5" style={{ color: '#535353' }}>{item.label}</p>
                          {item.badge && (
                            <p className="text-xs" style={{ color: '#848484' }}>{item.badge}</p>
                          )}
                        </div>
                        <svg className="w-5 h-5" fill="none" stroke="#848484" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


