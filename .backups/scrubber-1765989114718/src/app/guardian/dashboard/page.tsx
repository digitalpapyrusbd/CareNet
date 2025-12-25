'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Plus, Package, Bell, User, MessageSquare, Heart, Calendar, FileText, Activity, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GuardianDashboardPage() {
  const router = useRouter();

  const patients = [
    { id: '1', name: 'Anwar Hossain', age: 72, condition: 'Post-Surgery', careStatus: 'Active', caregiver: 'Shaila Khatun', nextVisit: 'Today 9:00 AM' },
    { id: '2', name: 'Fatima Begum', age: 68, condition: 'Diabetes Care', careStatus: 'Active', caregiver: 'Nusrat Ahmed', nextVisit: 'Tomorrow 10:00 AM' },
  ];

  const recentActivity = [
    { type: 'vitals', patient: 'Anwar Hossain', message: 'Vitals logged - BP: 130/85, normal range', time: '2 hours ago', icon: Heart },
    { type: 'medication', patient: 'Fatima Begum', message: 'Morning medications administered', time: '3 hours ago', icon: FileText },
    { type: 'appointment', patient: 'Anwar Hossain', message: 'Doctor appointment scheduled for Dec 10', time: 'Yesterday', icon: Calendar },
  ];

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen pb-20 pb-24 md:pt-14">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Hello, Fahima</h1>
            <p style={{ color: '#848484' }}>Welcome back to CareNet</p>
          </div>
          <button
            onClick={() => router.push('/guardian/messages')}
            className="relative"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ background: '#FF6B7A' }}>
              3
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => router.push('/guardian/patients/new')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm" style={{ color: '#535353' }}>Add Patient</p>
          </button>

          <button
            onClick={() => router.push('/guardian/packages')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm" style={{ color: '#535353' }}>Browse Packages</p>
          </button>
        </div>
      </div>

      {/* Patients List */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#535353' }}>My Patients</h2>
          <button className="text-sm" style={{ color: '#5B9FFF' }}>
            View All
          </button>
        </div>

        <div className="space-y-3">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => router.push(`/guardian/patients/${patient.id}`)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{patient.name}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: '#7CE577', color: 'white' }}
                    >
                      {patient.careStatus || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>
                    {patient.age} yrs • {patient.condition}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: '#535353' }}>
                      Caregiver: {patient.caregiver}
                    </span>
                    <span style={{ color: '#848484' }}>
                      Next visit: {patient.nextVisit}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6">
        <h2 className="mb-4" style={{ color: '#535353' }}>Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => {
            const ActivityIcon = activity.type === 'care-log' ? Heart : activity.type === 'message' ? MessageSquare : FileText;
            return (
              <div key={activity.id} className="finance-card p-4 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: activity.type === 'care-log' 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FD068 100%)'
                      : activity.type === 'message'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <ActivityIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#535353' }}>{activity.message}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-white/50 px-6 py-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-4 text-xs font-medium text-center">
          <Link href="/guardian/dashboard" className="flex flex-col items-center" style={{ color: '#FFB3C1' }}>
            <Home className="w-5 h-5 mb-1" />
            Home
          </Link>
          <Link href="/guardian/packages" className="flex flex-col items-center" style={{ color: '#848484' }}>
            <Package className="w-5 h-5 mb-1" />
            Packages
          </Link>
          <Link href="/guardian/jobs" className="flex flex-col items-center" style={{ color: '#848484' }}>
            <Activity className="w-5 h-5 mb-1" />
            Jobs
          </Link>
          <Link href="/guardian/messages" className="flex flex-col items-center" style={{ color: '#848484' }}>
            <MessageSquare className="w-5 h-5 mb-1" />
            Messages
          </Link>
        </div>
      </div>
    </div>
    </>

  );
}
