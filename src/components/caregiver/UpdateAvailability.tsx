import { Calendar, Save } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface TimeSlot {
  day: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

interface UpdateAvailabilityProps {
  currentAvailability: TimeSlot[];
  onSave: (availability: TimeSlot[]) => void;
  onCancel: () => void;
}

export function UpdateAvailability({ currentAvailability, onSave, onCancel }: UpdateAvailabilityProps) {
  const [availability, setAvailability] = useState<TimeSlot[]>(currentAvailability);

  const toggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].available = !updated[index].available;
    setAvailability(updated);
  };

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Update Availability</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Weekly Schedule</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Set your available hours for each day</p>
            </div>
          </div>

          <div className="space-y-3">
            {availability.map((slot, index) => (
              <div key={slot.day} className="finance-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span style={{ color: '#535353' }}>{slot.day}</span>
                  <button
                    onClick={() => toggleDay(index)}
                    className="px-4 py-1 rounded-full text-sm"
                    style={{
                      background: slot.available 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'rgba(255, 107, 122, 0.2)',
                      color: slot.available ? 'white' : '#FF6B7A'
                    }}>
                    {slot.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>

                {slot.available && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#848484' }}>Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/50 border border-white/50"
                        style={{ color: '#535353' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#848484' }}>End Time</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                        className="w-full p-2 rounded-lg bg-white/50 border border-white/50"
                        style={{ color: '#535353' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">Cancel</Button>
          <Button onClick={() => onSave(availability)} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

