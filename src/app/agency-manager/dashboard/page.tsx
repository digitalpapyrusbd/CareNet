'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { Users, Shield, AlertTriangle, TrendingUp, Clock, BarChart3, FileText, MessageSquare } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';
import { QualityAssuranceDashboard } from '@/components/agency/QualityAssuranceDashboard';

export default function AgencyManagerDashboardPage() {
  const router = useRouter();
  const managerName = 'Quality Manager';
  const agencyName = 'SafeHands Care Agency';

  const kpis = {
    qualityScore: 4.7,
    activeJobs: 18,
    openFeedback: 3,
    incidents: 2
  };

  const queueSummary = {
    feedback: { pending: 3, resolved: 15, total: 18 },
    incidents: { open: 2, investigating: 1, resolved: 8 },
    reviews: { scheduled: 4, completed: 12 }
  };

  const recentActivity = [
    { id: '1', type: 'feedback', action: 'New feedback received for Rahman Ahmed', time: '10 min ago' },
    { id: '2', type: 'incident', action: 'Incident report filed for medication error', time: '1 hour ago' },
    { id: '3', type: 'review', action: 'Performance review completed for Fatima Khan', time: '2 hours ago' },
  ];

  return (
    <>
      <UniversalNav userRole="agency-manager" showBack={true} />
      <div className="min-h-screen pb-24 md:pt-14">
        {/* Header */}
        <div className="p-6">
          <div className="mb-6">
            <h1 style={{ color: '#535353' }}>Quality Manager Dashboard</h1>
            <p style={{ color: '#848484' }}>Welcome back, {managerName}</p>
            <p style={{ color: '#848484' }}>Agency: {agencyName}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="finance-card p-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FD068 100%)'
                }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.qualityScore}</p>
              <p className="text-sm" style={{ color: '#848484' }}>Quality Score</p>
            </div>

            <div className="finance-card p-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.activeJobs}</p>
              <p className="text-sm" style={{ color: '#848484' }}>Active Jobs</p>
            </div>

            <div className="finance-card p-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                }}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.openFeedback}</p>
              <p className="text-sm" style={{ color: '#848484' }}>Open Feedback</p>
            </div>

            <div className="finance-card p-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.incidents}</p>
              <p className="text-sm" style={{ color: '#848484' }}>Active Incidents</p>
            </div>
          </div>

          {/* Queue Summary */}
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Queue Summary</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#848484' }}>Feedback Queue</span>
                  <span className="text-sm" style={{ color: '#535353' }}>
                    {queueSummary.feedback.pending} pending
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255, 211, 128, 0.3)' }}>
                    <div 
                      className="h-2 rounded-full"
                      style={{
                        width: `${(queueSummary.feedback.pending / queueSummary.feedback.total) * 100}%`,
                        background: 'radial-gradient(to right, #FFD180, #FFB74D)'
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: '#848484' }}>
                    {queueSummary.feedback.resolved} ✓
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#848484' }}>Incident Reports</span>
                  <span className="text-sm" style={{ color: '#535353' }}>
                    {queueSummary.incidents.open} open
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255, 107, 122, 0.3)' }}>
                    <div 
                      className="h-2 rounded-full"
                      style={{
                        width: `${(queueSummary.incidents.open / (queueSummary.incidents.open + queueSummary.incidents.resolved)) * 100}%`,
                        background: 'radial-gradient(to right, #FF6B7A, #FF8FA3)'
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: '#848484' }}>
                    {queueSummary.incidents.resolved} ✓
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#848484' }}>Performance Reviews</span>
                  <span className="text-sm" style={{ color: '#535353' }}>
                    {queueSummary.reviews.scheduled} scheduled
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(124, 229, 119, 0.3)' }}>
                    <div 
                      className="h-2 rounded-full"
                      style={{
                        width: `${(queueSummary.reviews.scheduled / (queueSummary.reviews.scheduled + queueSummary.reviews.completed)) * 100}%`,
                        background: 'radial-gradient(to right, #7CE577, #5FD068)'
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: '#848484' }}>
                    {queueSummary.reviews.completed} ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <TouchButton
              variant="secondary"
              size="md"
              onClick={() => router.push('/agency-manager/qa')}
              className="h-20"
            >
              <BarChart3 className="w-6 h-6 mr-3" style={{ color: '#7CE577' }} />
              <div className="text-left">
                <div style={{ color: '#535353' }}>QA Dashboard</div>
                <div className="text-sm" style={{ color: '#848484' }}>Monitor quality</div>
              </div>
            </TouchButton>

            <TouchButton
              variant="ghost"
              size="md"
              onClick={() => router.push('/agency-manager/feedback')}
              className="h-20"
            >
              <MessageSquare className="w-6 h-6 mr-3" style={{ color: '#5B9FFF' }} />
              <div className="text-left">
                <div style={{ color: '#535353' }}>Feedback</div>
                <div className="text-sm" style={{ color: '#848484' }}>Manage reviews</div>
              </div>
            </TouchButton>

            <TouchButton
              variant="ghost"
              size="md"
              onClick={() => router.push('/agency-manager/reports')}
              className="h-20"
            >
              <FileText className="w-6 h-6 mr-3" style={{ color: '#FFD180' }} />
              <div className="text-left">
                <div style={{ color: '#535353' }}>Reports</div>
                <div className="text-sm" style={{ color: '#848484' }}>Generate reports</div>
              </div>
            </TouchButton>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="mb-4" style={{ color: '#535353' }}>Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="finance-card p-4">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: activity.type === 'feedback'
                          ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #8EC5FC 100%)'
                          : activity.type === 'incident'
                          ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                          : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FD068 100%)'
                      }}
                    >
                      {activity.type === 'feedback' && <MessageSquare className="w-5 h-5 text-white" />}
                      {activity.type === 'incident' && <AlertTriangle className="w-5 h-5 text-white" />}
                      {activity.type === 'review' && <FileText className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p style={{ color: '#535353' }}>{activity.action}</p>
                      <p className="text-xs mt-1" style={{ color: '#848484' }}>{activity.time}</p>
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