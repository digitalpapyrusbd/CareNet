'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Clock, FileX, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QualityAlertsPage() {
  const router = useRouter();

  const alerts = [
    { id: '1', type: 'low_rating', caregiver: 'Nasrin Akter', issue: 'Rating dropped to 4.2', severity: 'medium', date: 'Dec 4' },
    { id: '2', type: 'missed_checkin', caregiver: 'Fatima Rahman', issue: 'Missed check-in for Job #234', severity: 'high', date: 'Dec 3' },
    { id: '3', type: 'incomplete_log', caregiver: 'Rashida Begum', issue: 'Care log incomplete for 2 days', severity: 'low', date: 'Dec 2' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'low_rating': return Star;
      case 'missed_checkin': return Clock;
      case 'incomplete_log': return FileX;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF6B7A';
      case 'medium': return '#FFD180';
      case 'low': return '#FFB3C1';
      default: return '#848484';
    }
  };

  return (
    <div>
      <UniversalNav userRole="agency-manager" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Quality Alerts</h1>
          <p style={{ color: '#848484' }}>Issues flagged for review</p>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <p style={{ color: '#535353' }}>Active Alerts</p>
            <span className="text-2xl" style={{ color: '#FF6B7A' }}>{alerts.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <div key={alert.id} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: `rgba(${getSeverityColor(alert.severity)}, 0.2)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: getSeverityColor(alert.severity) }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p style={{ color: '#535353' }}>{alert.caregiver}</p>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: `${getSeverityColor(alert.severity)}20`,
                          color: getSeverityColor(alert.severity)
                        }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>{alert.issue}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>{alert.date}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                >
                  Review
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
}

