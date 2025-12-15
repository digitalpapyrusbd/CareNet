import { Calendar, Clock, User, Plus, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  caregiverId?: string;
  caregiverName?: string;
}

interface InterviewSchedulerProps {
  slots: InterviewSlot[];
  pendingCaregivers: Array<{
    id: string;
    name: string;
    submittedDate: string;
  }>;
  onCreateSlot: (date: string, time: string) => void;
  onAssignCaregiver: (slotId: string, caregiverId: string) => void;
}

export function InterviewScheduler({ slots, pendingCaregivers, onCreateSlot, onAssignCaregiver }: InterviewSchedulerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleCreateSlot = () => {
    if (newSlot.date && newSlot.time) {
      onCreateSlot(newSlot.date, newSlot.time);
      setNewSlot({ date: '', time: '' });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Interview Scheduler</h1>
          <Button onClick={() => setShowCreateForm(true)} size="sm"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />Add Slot
          </Button>
        </div>

        {showCreateForm && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Create Interview Slot</h3>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newSlot.time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1 bg-white/50 border-white/50">
                  Cancel
                </Button>
                <Button onClick={handleCreateSlot} disabled={!newSlot.date || !newSlot.time} className="flex-1"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                  Create Slot
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Pending Caregivers ({pendingCaregivers.length})</h3>
          {pendingCaregivers.length === 0 ? (
            <p className="text-center py-4" style={{ color: '#848484' }}>No caregivers waiting for interview</p>
          ) : (
            <div className="space-y-2">
              {pendingCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div>
                    <p style={{ color: '#535353' }}>{caregiver.name}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>Submitted: {caregiver.submittedDate}</p>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white/50 border-white/50"
                    onClick={() => setSelectedSlot(caregiver.id)}>
                    Assign Slot
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Interview Slots</h3>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div key={slot.id} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: slot.available 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}>
                    {slot.available ? (
                      <Calendar className="w-6 h-6 text-white" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#535353' }}>{slot.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                        <span style={{ color: '#535353' }}>{slot.time}</span>
                      </div>
                    </div>
                    {slot.caregiverName ? (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4" style={{ color: '#848484' }} />
                        <span style={{ color: '#848484' }}>{slot.caregiverName}</span>
                      </div>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full"
                        style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}>
                        Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

