import { Shield, AlertCircle, Users, Building2, CheckCircle, FileText, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface ModeratorDashboardProps {
  moderatorName: string;
  onVerificationQueue: () => void;
  onDisputeCenter: () => void;
  onSupportTickets: () => void;
  onAnalytics: () => void;
}

export function ModeratorDashboard({
  moderatorName,
  onVerificationQueue,
  onDisputeCenter,
  onSupportTickets,
  onAnalytics
}: ModeratorDashboardProps) {
  const kpis = {
    pendingVerifications: 12,
    openDisputes: 3,
    activeCaregivers: 156,
    activeAgencies: 42
  };

  const queueSummary = {
    agencies: { pending: 5, approved: 38, rejected: 4 },
    caregivers: { pending: 7, inProgress: 15, approved: 134 }
  };

  const recentActivity = [
    { id: "1", type: "verification", action: "Caregiver verification approved", user: "Rashida Begum", time: "10 min ago" },
    { id: "2", type: "dispute", action: "Dispute case #D-1045 resolved", time: "1 hour ago" },
    { id: "3", type: "verification", action: "Agency documents review completed", user: "Green Care Agency", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="p-6">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Moderator Dashboard</h1>
          <p style={{ color: '#848484' }}>Welcome back, {moderatorName}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                }}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{kpis.pendingVerifications}</p>
                <p className="text-sm" style={{ color: '#848484' }}>Pending</p>
              </div>
            </div>
            <Button
              onClick={onVerificationQueue}
              size="sm"
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              Review Now
            </Button>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#535353' }}>{kpis.openDisputes}</p>
                <p className="text-sm" style={{ color: '#848484' }}>Disputes</p>
              </div>
            </div>
            <Button
              onClick={onDisputeCenter}
              size="sm"
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                color: 'white'
              }}
            >
              Resolve
            </Button>
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
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.activeCaregivers}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active Caregivers</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.activeAgencies}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active Agencies</p>
          </div>
        </div>

        {/* Verification Queue Summary */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Verification Queue</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#848484' }}>Agencies</span>
                <span className="text-sm" style={{ color: '#535353' }}>
                  {queueSummary.agencies.pending} pending
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255, 179, 193, 0.3)' }}>
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: `${(queueSummary.agencies.pending / (queueSummary.agencies.pending + queueSummary.agencies.approved + queueSummary.agencies.rejected)) * 100}%`,
                      background: 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: '#848484' }}>
                  {queueSummary.agencies.approved} ✓
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#848484' }}>Caregivers</span>
                <span className="text-sm" style={{ color: '#535353' }}>
                  {queueSummary.caregivers.pending} pending
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(142, 197, 252, 0.3)' }}>
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: `${(queueSummary.caregivers.inProgress / (queueSummary.caregivers.pending + queueSummary.caregivers.inProgress + queueSummary.caregivers.approved)) * 100}%`,
                      background: 'radial-gradient(to right, #8EC5FC, #5B9FFF)'
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: '#848484' }}>
                  {queueSummary.caregivers.approved} ✓
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={onVerificationQueue}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Verify</p>
          </button>

          <button
            onClick={onDisputeCenter}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Disputes</p>
          </button>

          <button
            onClick={onSupportTickets}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Support</p>
          </button>
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
                      background: activity.type === 'verification'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                    }}
                  >
                    {activity.type === 'verification' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Shield className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>{activity.action}</p>
                    {activity.user && (
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>{activity.user}</p>
                    )}
                    <p className="text-xs" style={{ color: '#848484' }}>{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
