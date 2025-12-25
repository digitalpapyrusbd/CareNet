'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Bell, Shield, CreditCard, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function GuardianSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing' | 'preferences'>('profile');

  const [profile, setProfile] = useState({
    name: 'Fahima Ahmed',
    email: 'fahima@example.com',
    phone: '+880 1712-345678',
    address: 'House 45, Road 12, Dhanmondi, Dhaka'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
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

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 style={{ color: '#535353' }}>Profile Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" style={{ color: '#535353' }}>Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label htmlFor="email" style={{ color: '#535353' }}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label htmlFor="address" style={{ color: '#535353' }}>Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <Button
                onClick={() => alert('Profile updated!')}
                className="w-full"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h2 style={{ color: '#535353' }}>Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Email Notifications', description: 'Receive updates via email', enabled: true },
                { label: 'SMS Notifications', description: 'Receive updates via SMS', enabled: false },
                { label: 'Push Notifications', description: 'Receive push notifications', enabled: true },
                { label: 'Job Updates', description: 'Get notified about job status changes', enabled: true },
                { label: 'Payment Reminders', description: 'Reminders for upcoming payments', enabled: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div>
                    <p style={{ color: '#535353' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>{item.description}</p>
                  </div>
                  <button
                    className="w-12 h-6 rounded-full relative transition-colors"
                    style={{
                      background: item.enabled ? '#7CE577' : '#848484'
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform"
                      style={{
                        transform: item.enabled ? 'translateX(6px)' : 'translateX(0.5px)'
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 style={{ color: '#535353' }}>Security Settings</h2>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/auth/reset-password/step-1')}
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Change Password
              </Button>

              <Button
                onClick={() => router.push('/auth/setup-mfa')}
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Setup Two-Factor Authentication
              </Button>

              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
                <p className="text-sm mb-2" style={{ color: '#535353' }}>Active Sessions</p>
                <p className="text-xs" style={{ color: '#848484' }}>Current device • Windows • Chrome</p>
                <p className="text-xs mt-1" style={{ color: '#848484' }}>Last active: Just now</p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                }}
              >
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 style={{ color: '#535353' }}>Billing & Payment</h2>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/guardian/billing')}
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                View Billing History
              </Button>

              <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <p className="text-sm mb-2" style={{ color: '#535353' }}>Payment Methods</p>
                <p className="text-xs" style={{ color: '#848484' }}>No payment methods saved</p>
                <Button
                  onClick={() => {}}
                  size="sm"
                  className="mt-3"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                    color: 'white'
                  }}
                >
                  Add Payment Method
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 style={{ color: '#535353' }}>Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label style={{ color: '#535353' }}>Language</Label>
                <select className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50" style={{ color: '#535353' }}>
                  <option>English</option>
                  <option>বাংলা (Bangla)</option>
                </select>
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Time Zone</Label>
                <select className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50" style={{ color: '#535353' }}>
                  <option>Asia/Dhaka (GMT+6)</option>
                </select>
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Date Format</Label>
                <select className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50" style={{ color: '#535353' }}>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-6">
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
    </div>
    </>

  );
}

