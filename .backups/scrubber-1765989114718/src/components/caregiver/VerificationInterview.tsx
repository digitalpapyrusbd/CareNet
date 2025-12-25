import { Video, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface VerificationInterviewProps {
  availableSlots: InterviewSlot[];
  onSchedule: (slotId: string) => void;
  scheduledSlot?: InterviewSlot;
  status?: 'pending' | 'scheduled' | 'completed' | 'passed' | 'failed';
  score?: number;
  feedback?: string;
}

export function VerificationInterview({ 
  availableSlots, 
  onSchedule, 
  scheduledSlot,
  status, 
  score,
  feedback 
}: VerificationInterviewProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Step 3: Interview</h1>
          <p style={{ color: '#848484' }}>Schedule and complete your verification interview</p>
        </div>

        {status === 'passed' && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #7CE577' }}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
              <p style={{ color: '#535353' }}>Interview Passed</p>
            </div>
            {score && <p className="text-sm mb-2" style={{ color: '#848484' }}>Score: {score}/100</p>}
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        {status === 'failed' && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FF6B7A' }}>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
              <p style={{ color: '#535353' }}>Interview Not Passed</p>
            </div>
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        {scheduledSlot ? (
          <div className="finance-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ color: '#535353' }}>Interview Scheduled</h3>
                <p className="text-sm" style={{ color: '#848484' }}>Your interview has been confirmed</p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5" style={{ color: '#7CE577' }} />
                <p style={{ color: '#535353' }}>{scheduledSlot.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: '#7CE577' }} />
                <p style={{ color: '#535353' }}>{scheduledSlot.time}</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
              <p className="text-sm mb-2" style={{ color: '#535353' }}>Interview Topics:</p>
              <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
                <li>• Communication skills assessment</li>
                <li>• Professional experience discussion</li>
                <li>• Scenario-based questions</li>
                <li>• Caregiving knowledge evaluation</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="finance-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ color: '#535353' }}>Schedule Interview</h3>
                <p className="text-sm" style={{ color: '#848484' }}>Select a convenient time slot</p>
              </div>
            </div>

            <div className="space-y-2">
              {availableSlots.filter(s => s.available).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className="w-full p-4 rounded-lg text-left"
                  style={{
                    background: selectedSlot === slot.id 
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: selectedSlot === slot.id ? 'white' : '#535353'
                  }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{slot.date}</p>
                      <p className="text-sm opacity-80">{slot.time}</p>
                    </div>
                    {selectedSlot === slot.id && <CheckCircle className="w-5 h-5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!scheduledSlot && (
          <Button 
            onClick={() => selectedSlot && onSchedule(selectedSlot)} 
            disabled={!selectedSlot} 
            className="w-full"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            Confirm Interview
          </Button>
        )}
      </div>
    </div>
  );
}

