import { Calendar, Clock, MapPin, User, Plus, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface AppointmentsScheduleProps {
  onAddAppointment?: () => void;
  onViewDetails?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function AppointmentsSchedule({ onAddAppointment, onViewDetails, onNavigate }: AppointmentsScheduleProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const appointments = {
    upcoming: [
      {
        id: "1",
        type: "Doctor Visit",
        doctor: "Dr. Rahman",
        specialty: "Cardiologist",
        date: "Tomorrow",
        time: "10:00 AM",
        location: "Dhaka Medical Center"
      },
      {
        id: "2",
        type: "Blood Test",
        date: "Dec 10",
        time: "8:00 AM",
        location: "Popular Diagnostic Center"
      },
    ],
    past: [
      {
        id: "3",
        type: "Checkup",
        doctor: "Dr. Ahmed",
        date: "Nov 28",
        time: "2:00 PM",
        location: "Square Hospital",
        status: "completed"
      },
    ]
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Appointments</h1>
          <Button
            onClick={onAddAppointment}
            size="sm"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize"
              style={{
                background: activeTab === tab 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab ? 'white' : '#535353'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {appointments[activeTab].map((apt) => (
            <button
              key={apt.id}
              onClick={() => onViewDetails(apt.id)}
              className="w-full finance-card p-4 text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: apt.type === 'Doctor Visit'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{apt.type}</h3>
                  {apt.doctor && (
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      {apt.doctor} {apt.specialty && `• ${apt.specialty}`}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#848484' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </span>
                  </div>
                  <p className="text-sm mt-1 flex items-center gap-1" style={{ color: '#848484' }}>
                    <MapPin className="w-3 h-3" />
                    {apt.location}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {appointments[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No {activeTab} appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}