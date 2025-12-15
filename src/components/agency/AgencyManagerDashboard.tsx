import { AlertCircle, TrendingUp, Briefcase, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface AgencyManagerDashboardProps {
  metrics: {
    qualityScore: number;
    activeJobs: number;
    openFeedback: number;
    incidents: number;
  };
  onNavigateToQA: () => void;
  onNavigateToFeedback: () => void;
  onNavigateToReports: () => void;
  onNavigateToAssignments: () => void;
}

export function AgencyManagerDashboard({
  metrics,
  onNavigateToQA,
  onNavigateToFeedback,
  onNavigateToReports,
  onNavigateToAssignments
}: AgencyManagerDashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Manager Dashboard</h1>

        {/* Restrictions Banner */}
        <div className="finance-card p-4 mb-6" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
            <div>
              <p style={{ color: '#535353' }}>Manager Access - Operations Only</p>
              <p className="text-sm" style={{ color: '#848484' }}>
                You have limited access to quality monitoring and operations. Contact admin for full access.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.qualityScore}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>Quality Score</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.activeJobs}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active Jobs</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.openFeedback}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Open Feedback</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.incidents}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Incidents</p>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="mb-4" style={{ color: '#535353' }}>Quick Access</h2>
          <div className="space-y-3">
            <button onClick={onNavigateToQA} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>QA Dashboard</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Monitor quality metrics</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToFeedback} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Feedback Queue</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Respond to guardian feedback</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToReports} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>Reports</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Generate performance reports</p>
                </div>
              </div>
            </button>

            <button onClick={onNavigateToAssignments} className="w-full finance-card p-4 hover:shadow-lg transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>View Assignments</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Read-only access</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

