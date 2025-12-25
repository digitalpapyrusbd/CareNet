'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, TrendingUp, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QualityDashboardPage() {
  const router = useRouter();

  const metrics = [
    { label: 'Average Rating', value: '4.7', icon: Star, color: '#FFD54F', change: '+0.2' },
    { label: 'On-time Check-in', value: '94%', icon: TrendingUp, color: '#7CE577', change: '+3%' },
    { label: 'Care Log Completion', value: '98%', icon: BarChart3, color: '#5B9FFF', change: '+1%' },
    { label: 'Incident Rate', value: '0.5%', icon: AlertCircle, color: '#FF6B7A', change: '-0.2%' },
  ];

  const caregiverQuality = [
    { name: 'Rashida Begum', rating: 4.9, onTimeRate: 100, logCompletion: 100, incidents: 0 },
    { name: 'Nasrin Akter', rating: 4.8, onTimeRate: 95, logCompletion: 98, incidents: 1 },
    { name: 'Fatima Rahman', rating: 4.6, onTimeRate: 90, logCompletion: 95, incidents: 0 },
  ];

  return (
    <>
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Quality Dashboard</h1>
          <p style={{ color: '#848484' }}>Monitor caregiver performance metrics</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="finance-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                <p className="text-xs" style={{ color: '#848484' }}>{metric.label}</p>
              </div>
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{metric.value}</p>
              <p className="text-xs" style={{ color: metric.change.startsWith('+') ? '#7CE577' : '#FF6B7A' }}>
                {metric.change} this month
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#535353' }}>Caregiver Quality</h2>
            <Button
              onClick={() => router.push('/agency-manager/quality/alerts')}
              size="sm"
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#FF6B7A' }}
            >
              View Alerts
            </Button>
          </div>

          <div className="space-y-3">
            {caregiverQuality.map((cg, idx) => (
              <div key={idx} className="finance-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                      }}
                    >
                      <span className="text-white text-sm">{cg.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p style={{ color: '#535353' }}>{cg.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                        <span className="text-sm" style={{ color: '#848484' }}>{cg.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
                    <p style={{ color: '#7CE577' }}>{cg.onTimeRate}%</p>
                    <p style={{ color: '#848484' }}>On-time</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
                    <p style={{ color: '#5B9FFF' }}>{cg.logCompletion}%</p>
                    <p style={{ color: '#848484' }}>Logs</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: cg.incidents > 0 ? 'rgba(255, 107, 122, 0.1)' : 'rgba(168, 224, 99, 0.1)' }}>
                    <p style={{ color: cg.incidents > 0 ? '#FF6B7A' : '#7CE577' }}>{cg.incidents}</p>
                    <p style={{ color: '#848484' }}>Incidents</p>
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

