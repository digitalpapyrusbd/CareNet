import { Activity, Heart, Pill, AlertCircle, Calendar } from "lucide-react";
import { useState } from "react";

interface CareLogsViewProps {
  patientName: string;
}

export function CareLogsView({ patientName }: CareLogsViewProps) {
  const [activeTab, setActiveTab] = useState<'vitals' | 'medications' | 'activities' | 'incidents'>('vitals');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const logs = {
    vitals: [
      {
        time: "8:00 AM",
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 98.6,
        glucose: 110,
        oxygen: 98
      },
      {
        time: "2:00 PM",
        bloodPressure: "118/78",
        heartRate: 75,
        temperature: 98.4,
        glucose: 105,
        oxygen: 97
      },
    ],
    medications: [
      {
        time: "8:05 AM",
        medication: "Metformin 500mg",
        status: "taken",
        notes: "Taken with breakfast"
      },
      {
        time: "2:10 PM",
        medication: "Metformin 500mg",
        status: "taken",
        notes: "Taken with lunch"
      },
    ],
    activities: [
      {
        time: "9:00 AM",
        type: "Exercise",
        description: "15-minute walk in garden",
        notes: "Patient in good spirits"
      },
      {
        time: "12:00 PM",
        type: "Meal",
        description: "Lunch - ate 80% of meal",
        notes: "Good appetite"
      },
    ],
    incidents: []
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Care Logs</h1>

        {/* Date Selector */}
        <div className="finance-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[
            { id: 'vitals', label: 'Vitals', icon: Heart, count: logs.vitals.length },
            { id: 'medications', label: 'Meds', icon: Pill, count: logs.medications.length },
            { id: 'activities', label: 'Activities', icon: Activity, count: logs.activities.length },
            { id: 'incidents', label: 'Incidents', icon: AlertCircle, count: logs.incidents.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center justify-center gap-2 p-3 rounded-lg"
                style={{
                  background: activeTab === tab.id 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: activeTab === tab.id ? 'white' : '#535353'
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Vitals Logs */}
        {activeTab === 'vitals' && (
          <div className="space-y-3">
            {logs.vitals.map((log, index) => (
              <div key={index} className="finance-card p-4">
                <p className="mb-3" style={{ color: '#848484' }}>{log.time}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Blood Pressure</p>
                    <p style={{ color: '#535353' }}>{log.bloodPressure}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(168, 224, 99, 0.1)' }}>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Heart Rate</p>
                    <p style={{ color: '#535353' }}>{log.heartRate} bpm</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 211, 128, 0.1)' }}>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Temperature</p>
                    <p style={{ color: '#535353' }}>{log.temperature}°F</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>Oxygen</p>
                    <p style={{ color: '#535353' }}>{log.oxygen}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medications Logs */}
        {activeTab === 'medications' && (
          <div className="space-y-3">
            {logs.medications.map((log, index) => (
              <div key={index} className="finance-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="mb-1" style={{ color: '#535353' }}>{log.medication}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>{log.time}</p>
                  </div>
                  <span 
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: '#7CE577', color: 'white' }}
                  >
                    ✓ {log.status}
                  </span>
                </div>
                {log.notes && (
                  <p className="text-sm" style={{ color: '#848484' }}>{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Activities Logs */}
        {activeTab === 'activities' && (
          <div className="space-y-3">
            {logs.activities.map((log, index) => (
              <div key={index} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                    }}
                  >
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1" style={{ color: '#535353' }}>{log.type}</p>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>{log.time}</p>
                    <p className="text-sm" style={{ color: '#535353' }}>{log.description}</p>
                    {log.notes && (
                      <p className="text-sm mt-2" style={{ color: '#848484' }}>Note: {log.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {logs[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No {activeTab} logged today</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              Your caregiver will log activities during their visit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
