import {
  Calendar,
  Heart,
  Activity,
  Pill,
  User,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";

interface PatientDashboardProps {
  patientName?: string;
  onChatCaregiver?: () => void;
  onEmergency?: () => void;
  onCallGuardian?: () => void;
  onViewMedications?: () => void;
  onViewCaregiver?: () => void;
  onNavigate?: (page: string) => void;
}

export function PatientDashboard({
  patientName = "Patient",
  onChatCaregiver,
  onEmergency,
  onCallGuardian,
  onViewMedications,
  onViewCaregiver,
  onNavigate
}: PatientDashboardProps) {
  const todayCaregiver = {
    name: "Rashida Begum",
    photo: null,
    rating: 4.9,
    arrivalTime: "2:00 PM",
    departureTime: "10:00 PM"
  };

  const todayMedications = [
    { id: "1", name: "Metformin", dosage: "500mg", time: "2:00 PM", status: "taken" },
    { id: "2", name: "Amlodipine", dosage: "5mg", time: "2:00 PM", status: "taken" },
    { id: "3", name: "Aspirin", dosage: "75mg", time: "8:00 PM", status: "due" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Hello, {patientName}</h1>
          <p style={{ color: '#848484' }}>How are you feeling today?</p>
        </div>

        {/* Emergency Button */}
        <button
          onClick={onEmergency}
          className="w-full finance-card p-6 mb-6 hover:shadow-lg transition-all"
          style={{ borderLeft: '4px solid #FF6B7A' }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
              }}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 style={{ color: '#535353' }}>Emergency SOS</h2>
              <p className="text-sm" style={{ color: '#848484' }}>Tap for immediate help</p>
            </div>
          </div>
        </button>

        {/* Today's Caregiver */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Today's Caregiver</h3>
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 style={{ color: '#535353' }}>{todayCaregiver.name}</h3>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm" style={{ color: '#FFD54F' }}>★</span>
                <span className="text-sm" style={{ color: '#848484' }}>{todayCaregiver.rating}</span>
              </div>
              <p className="text-sm" style={{ color: '#848484' }}>
                {todayCaregiver.arrivalTime} - {todayCaregiver.departureTime}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onViewCaregiver}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <User className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button
              onClick={onChatCaregiver}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Today's Medications */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Today's Medications</h3>
            <button
              onClick={onViewMedications}
              className="text-sm"
              style={{ color: '#5B9FFF' }}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {todayMedications.map((med) => (
              <div key={med.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: med.status === 'taken' 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>{med.name}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>{med.dosage} • {med.time}</p>
                </div>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: med.status === 'taken' ? '#7CE577' : '#5B9FFF',
                    color: 'white'
                  }}
                >
                  {med.status === 'taken' ? '✓ Taken' : 'Due'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCallGuardian}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Phone className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-center" style={{ color: '#535353' }}>Call Family</p>
          </button>

          <button className="finance-card p-4 hover:shadow-lg transition-all">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
              }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-center" style={{ color: '#535353' }}>Schedule</p>
          </button>

          <button className="finance-card p-4 hover:shadow-lg transition-all">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-center" style={{ color: '#535353' }}>Care Logs</p>
          </button>

          <button className="finance-card p-4 hover:shadow-lg transition-all">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <Phone className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-center" style={{ color: '#535353' }}>Emergencies</p>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
      >
        <div className="flex items-center justify-around p-4">
          <button className="flex flex-col items-center gap-1">
            <Heart className="w-6 h-6" style={{ color: '#FFB3C1' }} />
            <span className="text-xs" style={{ color: '#FFB3C1' }}>Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Pill className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Medications</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <User className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}