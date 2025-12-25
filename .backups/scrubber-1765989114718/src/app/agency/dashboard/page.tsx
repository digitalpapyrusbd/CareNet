'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Users, Briefcase, DollarSign, Star, Plus } from 'lucide-react';

export default function AgencyDashboardPage() {
  const router = useRouter();
  const agencyName = 'SafeHands Care Agency';

  const kpis = {
    caregivers: 24,
    activeJobs: 18,
    revenue: 450000,
    rating: 4.7
  };

  const jobPipeline = {
    new: 5,
    assigned: 12,
    active: 18,
    completed: 142
  };

  const recentJobs = [
    { id: '1', patient: 'Mrs. Fatima Ahmed', package: '24/7 Senior Care', status: 'needs-assignment', date: 'Dec 10' },
    { id: '2', patient: 'Mr. Abdul Rahman', package: 'Post-Surgery Care', status: 'active', caregiver: 'Rashida Begum' },
  ];

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      {/* Header */}
      <div className="p-6">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>{agencyName}</h1>
          <p style={{ color: '#848484' }}>Agency Dashboard</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.caregivers}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Caregivers</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.activeJobs}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active Jobs</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>৳{(kpis.revenue / 1000).toFixed(0)}K</p>
            <p className="text-sm" style={{ color: '#848484' }}>This Month</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.rating}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Rating</p>
          </div>
        </div>

        {/* Job Pipeline */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Job Pipeline</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto"
                style={{ background: 'rgba(142, 197, 252, 0.2)' }}
              >
                <span style={{ color: '#5B9FFF' }}>{jobPipeline.new}</span>
              </div>
              <p className="text-xs" style={{ color: '#848484' }}>New</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto"
                style={{ background: 'rgba(255, 211, 128, 0.2)' }}
              >
                <span style={{ color: '#FFB74D' }}>{jobPipeline.assigned}</span>
              </div>
              <p className="text-xs" style={{ color: '#848484' }}>Assigned</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto"
                style={{ background: 'rgba(168, 224, 99, 0.2)' }}
              >
                <span style={{ color: '#7CE577' }}>{jobPipeline.active}</span>
              </div>
              <p className="text-xs" style={{ color: '#848484' }}>Active</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 mx-auto"
                style={{ background: 'rgba(184, 167, 255, 0.2)' }}
              >
                <span style={{ color: '#8B7AE8' }}>{jobPipeline.completed}</span>
              </div>
              <p className="text-xs" style={{ color: '#848484' }}>Done</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => router.push('/agency/packages/new')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Create Package</p>
          </button>

          <button
            onClick={() => router.push('/agency/caregivers/add')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Add Caregiver</p>
          </button>

          <button
            onClick={() => router.push('/agency/jobs')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>View Jobs</p>
          </button>
        </div>

        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Recent Jobs</h3>
            <button
              onClick={() => router.push('/agency/jobs')}
              className="text-sm"
              style={{ color: '#5B9FFF' }}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p style={{ color: '#535353' }}>{job.patient}</p>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>{job.package}</p>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: job.status === 'needs-assignment' ? 'rgba(255, 179, 193, 0.3)' : 'rgba(124, 229, 119, 0.3)',
                        color: job.status === 'needs-assignment' ? '#FFB3C1' : '#7CE577'
                      }}
                    >
                      {job.status === 'needs-assignment' ? 'Needs Assignment' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
