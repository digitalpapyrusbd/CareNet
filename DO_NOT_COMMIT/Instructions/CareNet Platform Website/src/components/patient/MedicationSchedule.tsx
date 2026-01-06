import { Pill, Clock, Check, Bell, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface MedicationScheduleProps {
  patientName?: string;
  onMarkTaken?: (id: string) => void;
  onSetReminder?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function MedicationSchedule({ patientName = "Patient", onMarkTaken, onSetReminder, onNavigate }: MedicationScheduleProps) {
  const todaySchedule = [
    {
      id: "1",
      name: "Metformin",
      dosage: "500mg",
      time: "8:00 AM",
      taken: true,
      takenAt: "8:05 AM",
      instructions: "Take with food"
    },
    {
      id: "2",
      name: "Amlodipine",
      dosage: "5mg",
      time: "8:00 AM",
      taken: true,
      takenAt: "8:05 AM",
      instructions: "Take with water"
    },
    {
      id: "3",
      name: "Metformin",
      dosage: "500mg",
      time: "2:00 PM",
      taken: false,
      isDue: true,
      instructions: "Take with food"
    },
    {
      id: "4",
      name: "Aspirin",
      dosage: "75mg",
      time: "8:00 PM",
      taken: false,
      instructions: "Take with food"
    },
  ];

  const weeklySchedule = [
    { day: "Mon", count: 4, completed: 4 },
    { day: "Tue", count: 4, completed: 4 },
    { day: "Wed", count: 4, completed: 3 },
    { day: "Thu", count: 4, completed: 4 },
    { day: "Fri", count: 4, completed: 2 },
    { day: "Sat", count: 4, completed: 0 },
    { day: "Sun", count: 4, completed: 0 },
  ];

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

        <h1 className="mb-6" style={{ color: '#535353' }}>My Medications</h1>

        {/* Weekly Progress */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>This Week</h3>
          <div className="flex justify-between gap-2">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="flex-1">
                <div className="text-center mb-2">
                  <div 
                    className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-1"
                    style={{
                      background: day.completed === day.count 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : day.completed > 0
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                        : 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    {day.completed === day.count && <Check className="w-5 h-5 text-white" />}
                    {day.completed > 0 && day.completed < day.count && (
                      <span className="text-xs text-white">{day.completed}</span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: '#848484' }}>{day.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Due Medication Alert */}
        {todaySchedule.some(m => m.isDue) && (
          <div 
            className="finance-card p-4 mb-6"
            style={{ borderLeft: '4px solid #FF6B7A' }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" style={{ color: '#FF6B7A' }} />
              <div>
                <p style={{ color: '#535353' }}>Medication Due Now!</p>
                <p className="text-sm" style={{ color: '#848484' }}>
                  {todaySchedule.find(m => m.isDue)?.name} - {todaySchedule.find(m => m.isDue)?.time}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Today's Schedule</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
              <span className="text-sm" style={{ color: '#848484' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((med) => (
              <div 
                key={med.id} 
                className="finance-card p-4"
                style={{
                  borderLeft: med.taken 
                    ? '4px solid #7CE577' 
                    : med.isDue 
                    ? '4px solid #FF6B7A' 
                    : '4px solid #FFD180'
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: med.taken
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : med.isDue
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                    }}
                  >
                    <Pill className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 style={{ color: '#535353' }}>{med.name}</h3>
                        <p className="text-sm" style={{ color: '#848484' }}>
                          {med.dosage} • {med.time}
                        </p>
                      </div>
                      {med.taken && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: '#7CE577', color: 'white' }}
                        >
                          ✓ Taken
                        </span>
                      )}
                    </div>

                    <p className="text-sm mb-3" style={{ color: '#848484' }}>
                      {med.instructions}
                    </p>

                    {med.taken ? (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#7CE577' }}>
                        <Check className="w-4 h-4" />
                        <span>Taken at {med.takenAt}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => onMarkTaken(med.id)}
                          size="sm"
                          style={{
                            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                            color: 'white'
                          }}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark Taken
                        </Button>
                        <Button
                          onClick={() => onSetReminder(med.id)}
                          size="sm"
                          variant="outline"
                          className="bg-white/50 border-white/50"
                          style={{ color: '#535353' }}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Remind Me
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>
              {todaySchedule.filter(m => m.taken).length}/{todaySchedule.length}
            </p>
            <p className="text-sm" style={{ color: '#848484' }}>Today</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Pill className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>98%</p>
            <p className="text-sm" style={{ color: '#848484' }}>This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}