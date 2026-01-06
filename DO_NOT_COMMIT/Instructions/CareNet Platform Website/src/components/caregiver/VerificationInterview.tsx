import { useState } from 'react';
import { ArrowLeft, Video, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface VerificationInterviewProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function VerificationInterview({ onNavigate, onBack }: VerificationInterviewProps) {
  const [status] = useState<'schedule' | 'scheduled' | 'completed'>('schedule');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const availableDates = [
    { date: '2024-12-27', label: 'Tomorrow', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { date: '2024-12-28', label: 'Dec 28', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { date: '2024-12-29', label: 'Dec 29', slots: ['10:00 AM', '1:00 PM', '5:00 PM'] }
  ];

  const handleSchedule = () => {
    onNavigate?.('caregiver-pending-verification');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onBack?.()}
          className="mb-6 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
              boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
            }}
          >
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Virtual Interview</h1>
          <p style={{ color: '#848484' }}>
            {status === 'completed' ? 'Interview Completed' : 'Schedule Your Interview'}
          </p>
        </div>
      </div>

      {status === 'completed' && (
        <div className="finance-card p-5 mb-6" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" style={{ color: '#7CE577' }} />
            <div>
              <p style={{ color: '#535353' }}>Interview completed successfully!</p>
              <p className="text-sm" style={{ color: '#848484' }}>Results will be available within 24 hours</p>
            </div>
          </div>
        </div>
      )}

      {status === 'scheduled' && (
        <div className="finance-card p-5 mb-6" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <h3 className="mb-3" style={{ color: '#535353' }}>Your Interview is Scheduled</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: '#FEB4C5' }} />
              <span style={{ color: '#535353' }}>December 27, 2024</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: '#FEB4C5' }} />
              <span style={{ color: '#535353' }}>10:00 AM (30 minutes)</span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5" style={{ color: '#FEB4C5' }} />
              <span style={{ color: '#535353' }}>Google Meet (link will be sent via SMS)</span>
            </div>
          </div>
        </div>
      )}

      {status === 'schedule' && (
        <div className="flex-1 space-y-6">
          {/* Interview Info */}
          <div className="finance-card p-5">
            <h2 className="mb-3" style={{ color: '#535353' }}>About the Interview</h2>
            <p className="text-sm mb-4" style={{ color: '#848484' }}>
              A 30-minute video interview with our verification team to assess your caregiving experience and communication skills.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
                <p className="text-sm" style={{ color: '#848484' }}>Basic caregiving questions</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
                <p className="text-sm" style={{ color: '#848484' }}>Scenario-based assessments</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
                <p className="text-sm" style={{ color: '#848484' }}>Language proficiency check</p>
              </div>
            </div>
          </div>

          {/* Schedule Selection */}
          <div>
            <h2 className="mb-3" style={{ color: '#535353' }}>Select Date & Time</h2>
            <div className="space-y-3">
              {availableDates.map((dateOption) => (
                <div key={dateOption.date} className="finance-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5" style={{ color: '#FEB4C5' }} />
                    <h3 style={{ color: '#535353' }}>{dateOption.label}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {dateOption.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedDate(dateOption.date);
                          setSelectedTime(slot);
                        }}
                        className={`finance-card px-3 py-2 text-sm transition-all ${
                          selectedDate === dateOption.date && selectedTime === slot ? 'ring-2' : ''
                        }`}
                        style={{
                          color: selectedDate === dateOption.date && selectedTime === slot ? '#FEB4C5' : '#535353',
                          borderColor: selectedDate === dateOption.date && selectedTime === slot ? '#FEB4C5' : 'transparent'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Tips */}
          <div className="finance-card p-4" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FEB4C5' }} />
              <div>
                <p className="text-sm mb-2" style={{ color: '#535353' }}>
                  <strong>Preparation Tips:</strong>
                </p>
                <ul className="text-xs space-y-1" style={{ color: '#848484' }}>
                  <li>• Ensure stable internet connection</li>
                  <li>• Find a quiet, well-lit space</li>
                  <li>• Have your certificates ready for reference</li>
                  <li>• Dress professionally</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'schedule' && (
        <Button
          onClick={handleSchedule}
          disabled={!selectedDate || !selectedTime}
          className="w-full py-6 mt-6"
          style={{
            background: (!selectedDate || !selectedTime)
              ? 'rgba(132, 132, 132, 0.3)'
              : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
            color: 'white',
            boxShadow: (!selectedDate || !selectedTime) ? 'none' : '0px 4px 18px rgba(240, 161, 180, 0.4)',
            cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer'
          }}
        >
          Confirm Interview Schedule
        </Button>
      )}

      {status === 'scheduled' && (
        <Button
          variant="outline"
          onClick={() => onNavigate?.('caregiver-pending-verification')}
          className="w-full py-6 mt-6"
          style={{ color: '#535353', borderColor: 'rgba(132, 132, 132, 0.2)' }}
        >
          Back to Verification Status
        </Button>
      )}
    </div>
  );
}
