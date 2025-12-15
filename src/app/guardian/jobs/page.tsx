'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Search, Calendar, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function GuardianJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'disputed'>('active');

  const jobs = {
    active: [
      {
        id: '1',
        patient: 'Mrs. Fatima Ahmed',
        package: '24/7 Senior Care - Basic',
        caregiver: 'Rashida Begum',
        startDate: 'Dec 1, 2024',
        endDate: 'Dec 31, 2024',
        status: 'active',
        progress: 25
      },
      {
        id: '2',
        patient: 'Mr. Abdul Rahman',
        package: 'Post-Stroke Care',
        caregiver: 'Nasrin Akter',
        startDate: 'Nov 28, 2024',
        endDate: 'Dec 12, 2024',
        status: 'active',
        progress: 70
      },
    ],
    completed: [
      {
        id: '3',
        patient: 'Mrs. Ayesha Khan',
        package: 'Recovery Care Package',
        caregiver: 'Fatema Begum',
        startDate: 'Nov 1, 2024',
        endDate: 'Nov 25, 2024',
        status: 'completed',
        rating: 5
      },
    ],
    disputed: []
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#7CE577';
      case 'completed': return '#5B9FFF';
      case 'disputed': return '#FF6B7A';
      default: return '#848484';
    }
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen pb-24 md:pt-14">
      {/* Header */}
      <div className="p-6">
        <h1 className="mb-4" style={{ color: '#535353' }}>My Jobs</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
          <Input
            placeholder="Search jobs..."
            className="pl-10 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'active', label: 'Active', count: jobs.active.length },
            { id: 'completed', label: 'Completed', count: jobs.completed.length },
            { id: 'disputed', label: 'Disputed', count: jobs.disputed.length },
          ].map((tab) => (
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
              <span className="text-sm">{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-6 space-y-3">
        {/* Active Jobs */}
        {activeTab === 'active' && jobs.active.map((job) => (
          <button
            key={job.id}
            onClick={() => router.push(`/guardian/jobs/${job.id}`)}
            className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>{job.package}</p>
                </div>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: getStatusColor(job.status), color: 'white' }}
              >
                Active
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#535353' }}>
                <User className="w-4 h-4" style={{ color: '#848484' }} />
                <span>Caregiver: {job.caregiver}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#535353' }}>
                <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                <span>{job.startDate} - {job.endDate}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#848484' }}>
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${job.progress}%`,
                    background: 'radial-gradient(to right, #7CE577, #A8E063)'
                  }}
                />
              </div>
            </div>
          </button>
        ))}

        {/* Completed Jobs */}
        {activeTab === 'completed' && jobs.completed.map((job) => (
          <button
            key={job.id}
            onClick={() => router.push(`/guardian/jobs/${job.id}`)}
            className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>{job.package}</p>
                </div>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: getStatusColor(job.status), color: 'white' }}
              >
                Completed
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#535353' }}>
                <User className="w-4 h-4" style={{ color: '#848484' }} />
                <span>Caregiver: {job.caregiver}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#535353' }}>
                <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                <span>{job.startDate} - {job.endDate}</span>
              </div>
            </div>

            {/* Rating */}
            {job.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < job.rating! ? '#FFD54F' : '#848484' }}>★</span>
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#848484' }}>Rated {job.rating}/5</span>
              </div>
            )}
          </button>
        ))}

        {/* Empty State */}
        {activeTab === 'active' && jobs.active.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No active jobs</p>
            <p className="text-sm" style={{ color: '#848484' }}>Browse packages to get started</p>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
