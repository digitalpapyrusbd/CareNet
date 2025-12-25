import { AlertTriangle, Star, Clock, FileText } from "lucide-react";
import { Button } from "../ui/button";

interface Alert {
  id: string;
  type: 'low_rating' | 'missed_checkin' | 'incomplete_log';
  caregiverName: string;
  jobId: string;
  details: string;
  timestamp: string;
}

interface QualityAlertsProps {
  alerts: Alert[];
  onViewAlert: (id: string) => void;
  onResolve: (id: string) => void;
}

export function QualityAlerts({ alerts, onViewAlert, onResolve }: QualityAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_rating': return Star;
      case 'missed_checkin': return Clock;
      case 'incomplete_log': return FileText;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'low_rating': return '#FFD180';
      case 'missed_checkin': return '#FF6B7A';
      case 'incomplete_log': return '#FFB3C1';
      default: return '#848484';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Quality Alerts</h1>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const color = getAlertColor(alert.type);

            return (
              <div key={alert.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${color}33` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: '#535353' }}>{alert.caregiverName}</p>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>{alert.details}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>{alert.timestamp}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => onViewAlert(alert.id)} variant="outline" className="bg-white/50 border-white/50">
                    View Details
                  </Button>
                  <Button onClick={() => onResolve(alert.id)}
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                    Resolve
                  </Button>
                </div>
              </div>
            );
          })}

          {alerts.length === 0 && (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>No quality alerts at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

