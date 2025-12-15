import { TrendingUp, Clock, FileText, AlertTriangle, Star } from "lucide-react";

interface QADashboardProps {
  metrics: {
    averageRating: number;
    onTimeCheckInRate: number;
    careLogCompletion: number;
    incidentRate: number;
  };
  caregiverQuality: Array<{
    id: string;
    name: string;
    rating: number;
    completionRate: number;
    incidents: number;
  }>;
  onViewCaregiver: (id: string) => void;
}

export function QADashboard({ metrics, caregiverQuality, onViewCaregiver }: QADashboardProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>QA Dashboard</h1>

        {/* Quality Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.averageRating}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Average Rating</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.onTimeCheckInRate}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>On-time Check-in</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.careLogCompletion}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>Care Log Completion</p>
          </div>

          <div className="finance-card p-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metrics.incidentRate}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>Incident Rate</p>
          </div>
        </div>

        {/* Caregiver Quality Table */}
        <div>
          <h2 className="mb-4" style={{ color: '#535353' }}>Caregiver Quality</h2>
          <div className="space-y-3">
            {caregiverQuality.map((caregiver) => (
              <button
                key={caregiver.id}
                onClick={() => onViewCaregiver(caregiver.id)}
                className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: '#535353' }}>{caregiver.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                    <span style={{ color: '#535353' }}>{caregiver.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: '#848484' }}>Completion: </span>
                    <span style={{ color: '#535353' }}>{caregiver.completionRate}%</span>
                  </div>
                  <div>
                    <span style={{ color: '#848484' }}>Incidents: </span>
                    <span style={{ color: caregiver.incidents > 0 ? '#FF6B7A' : '#7CE577' }}>
                      {caregiver.incidents}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

