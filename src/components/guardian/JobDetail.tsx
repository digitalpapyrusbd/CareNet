import { ArrowLeft, User, Calendar, Phone, MessageSquare, AlertTriangle, Star, FileText, Activity, Pill } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
  onMessageCaregiver: () => void;
  onReportIssue: () => void;
  onRateReview: () => void;
}

export function JobDetail({ jobId, onBack, onMessageCaregiver, onReportIssue, onRateReview }: JobDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'vitals' | 'meds'>('overview');

  const job = {
    patient: "Mrs. Fatima Ahmed",
    package: "24/7 Senior Care - Basic",
    caregiver: {
      name: "Rashida Begum",
      phone: "+880 1712-345678",
      rating: 4.9,
      photo: null
    },
    startDate: "Dec 1, 2024",
    endDate: "Dec 31, 2024",
    schedule: "2:00 PM - 10:00 PM daily",
    status: "active",
    progress: 25
  };

  const careLogs = [
    { id: "1", type: "vitals", time: "3:00 PM", caregiver: "Rashida Begum", note: "BP: 130/85, Heart Rate: 78 bpm, Temperature: 98.2°F - All normal" },
    { id: "2", type: "medication", time: "2:30 PM", caregiver: "Rashida Begum", note: "Administered afternoon medications as scheduled" },
    { id: "3", type: "activity", time: "4:00 PM", caregiver: "Rashida Begum", note: "Assisted with light walking exercise - 15 minutes" },
  ];

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Job Header */}
        <div className="finance-card p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="mb-1" style={{ color: '#535353' }}>{job.patient}</h2>
              <p className="text-sm" style={{ color: '#848484' }}>{job.package}</p>
            </div>
            <span 
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: '#7CE577', color: 'white' }}
            >
              Active
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2" style={{ color: '#535353' }}>
              <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
              <span>{job.startDate} - {job.endDate}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#535353' }}>
              <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
              <span>{job.schedule}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#848484' }}>
              <span>Progress</span>
              <span>{job.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div 
                className="h-full rounded-full"
                style={{
                  width: `${job.progress}%`,
                  background: 'radial-gradient(to right, #7CE577, #A8E063)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Caregiver Card */}
        <div className="finance-card p-4 mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p style={{ color: '#535353' }}>{job.caregiver.name}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                <span className="text-sm" style={{ color: '#848484' }}>{job.caregiver.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onMessageCaregiver}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 179, 193, 0.3)' }}
              >
                <MessageSquare className="w-5 h-5" style={{ color: '#FFB3C1' }} />
              </button>
              <a
                href={`tel:${job.caregiver.phone}`}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(124, 229, 119, 0.3)' }}
              >
                <Phone className="w-5 h-5" style={{ color: '#7CE577' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-4">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'logs', label: 'Care Logs', icon: FileText },
            { id: 'vitals', label: 'Vitals', icon: Activity },
            { id: 'meds', label: 'Medications', icon: Pill },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Job Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Patient:</span>
                  <span style={{ color: '#535353' }}>{job.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Package:</span>
                  <span style={{ color: '#535353' }}>{job.package}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Duration:</span>
                  <span style={{ color: '#535353' }}>{job.startDate} - {job.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Schedule:</span>
                  <span style={{ color: '#535353' }}>{job.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-3">
            {careLogs.map((log) => (
              <div key={log.id} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: log.type === 'vitals' 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                        : log.type === 'medication'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}
                  >
                    {log.type === 'vitals' && <Activity className="w-5 h-5 text-white" />}
                    {log.type === 'medication' && <Pill className="w-5 h-5 text-white" />}
                    {log.type === 'activity' && <FileText className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize" style={{ color: '#535353' }}>{log.type}</span>
                      <span className="text-xs" style={{ color: '#848484' }}>{log.time}</span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>{log.note}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>By {log.caregiver}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="finance-card p-4">
            <p className="text-center py-8 text-sm" style={{ color: '#848484' }}>
              Vitals data will appear here
            </p>
          </div>
        )}

        {activeTab === 'meds' && (
          <div className="finance-card p-4">
            <p className="text-center py-8 text-sm" style={{ color: '#848484' }}>
              Medication schedule will appear here
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            onClick={onReportIssue}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
          <Button
            onClick={onRateReview}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Rate & Review
          </Button>
        </div>
      </div>
    </div>
  );
}
