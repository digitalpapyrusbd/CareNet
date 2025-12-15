import { ArrowLeft, MapPin, Calendar, DollarSign, User, Phone, Navigation } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface JobDetailProps {
  job: {
    id: string;
    patient: string;
    guardian: string;
    guardianPhone: string;
    packageName: string;
    startDate: string;
    endDate: string;
    schedule: string;
    location: string;
    address: string;
    payment: number;
    duties: string[];
    patientInfo: {
      age: number;
      gender: string;
      conditions: string[];
      medications: string[];
    };
  };
  onBack: () => void;
  onGetDirections: () => void;
  onCallGuardian: () => void;
  onStartJob: () => void;
}

export function JobDetail({ job, onBack, onGetDirections, onCallGuardian, onStartJob }: JobDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patient' | 'duties'>('overview');

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

        {/* Header Card */}
        <div className="finance-card p-6 mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{job.patient}</h1>
          <p className="mb-4" style={{ color: '#848484' }}>{job.packageName}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" style={{ color: '#7CE577' }} />
              <span className="text-xl" style={{ color: '#7CE577' }}>
                ৳{job.payment.toLocaleString()}
              </span>
            </div>
            <span className="text-sm" style={{ color: '#848484' }}>per shift</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'patient', label: 'Patient Info' },
            { id: 'duties', label: 'Duties' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 px-4 py-2 rounded-lg text-sm"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                  <span style={{ color: '#535353' }}>{job.startDate} - {job.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#848484' }} />
                  <span style={{ color: '#535353' }}>{job.schedule}</span>
                </div>
              </div>
            </div>

            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Location</h3>
              <p className="text-sm mb-3" style={{ color: '#535353' }}>{job.address}</p>
              <Button
                onClick={onGetDirections}
                variant="outline"
                className="w-full bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>

            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Guardian Contact</h3>
              <div className="flex items-center justify-between">
                <span style={{ color: '#535353' }}>{job.guardian}</span>
                <Button
                  onClick={onCallGuardian}
                  size="sm"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                    color: 'white'
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Info Tab */}
        {activeTab === 'patient' && (
          <div className="space-y-3">
            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Age:</span>
                  <span style={{ color: '#535353' }}>{job.patientInfo.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Gender:</span>
                  <span style={{ color: '#535353' }} className="capitalize">{job.patientInfo.gender}</span>
                </div>
              </div>
            </div>

            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Medical Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {job.patientInfo.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div className="finance-card p-4">
              <h3 className="mb-3" style={{ color: '#535353' }}>Current Medications</h3>
              <ul className="space-y-2">
                {job.patientInfo.medications.map((med, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
                    <span style={{ color: '#535353' }}>{med}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Duties Tab */}
        {activeTab === 'duties' && (
          <div className="finance-card p-4">
            <h3 className="mb-4" style={{ color: '#535353' }}>Your Responsibilities</h3>
            <ul className="space-y-3">
              {job.duties.map((duty, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}
                  >
                    <span className="text-xs text-white">{index + 1}</span>
                  </div>
                  <span className="text-sm" style={{ color: '#535353' }}>{duty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start Job Button */}
        <Button
          onClick={onStartJob}
          className="w-full mt-6"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white'
          }}
        >
          Start Job
        </Button>
      </div>
    </div>
  );
}
