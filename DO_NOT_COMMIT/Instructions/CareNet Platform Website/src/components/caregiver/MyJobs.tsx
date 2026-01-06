import { useState } from 'react';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface MyJobsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const JOBS = {
  today: [
    { id: 1, patient: 'Mrs. Fatima Rahman', age: 72, time: '9:00 AM - 5:00 PM', location: 'Dhanmondi, Dhaka', conditions: ['Diabetes', 'Hypertension'], status: 'ongoing' }
  ],
  upcoming: [
    { id: 2, patient: 'Mr. Karim Ahmed', age: 68, time: '10:00 AM - 6:00 PM', location: 'Gulshan-2', date: 'Tomorrow', conditions: ['Post-Surgery'], status: 'confirmed' },
    { id: 3, patient: 'Mrs. Nasrin Begum', age: 75, time: '2:00 PM - 8:00 PM', location: 'Uttara', date: 'Dec 28', conditions: ['Dementia'], status: 'confirmed' },
    { id: 4, patient: 'Mr. Salam Mia', age: 70, time: '9:00 AM - 5:00 PM', location: 'Banani', date: 'Dec 29', conditions: ['Mobility Issues'], status: 'pending' }
  ],
  completed: [
    { id: 5, patient: 'Mrs. Khaleda Akter', age: 69, time: '9:00 AM - 5:00 PM', location: 'Mirpur', date: 'Yesterday', conditions: ['Diabetes'], status: 'completed', rating: 5 },
    { id: 6, patient: 'Mr. Abdul Hamid', age: 74, time: '10:00 AM - 6:00 PM', location: 'Mohakhali', date: 'Dec 24', conditions: ['Heart Disease'], status: 'completed', rating: 5 }
  ]
};

export function MyJobs({ onNavigate, onBack }: MyJobsProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');

  const currentJobs = JOBS[activeTab];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <Button variant="ghost" onClick={() => onBack?.()} className="mb-4 hover:bg-white/30" style={{ color: '#535353' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 style={{ color: '#535353' }}>My Jobs</h1>
        <p style={{ color: '#848484' }}>Manage your care assignments</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2 flex gap-2">
          {(['today', 'upcoming', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-lg transition-all ${activeTab === tab ? 'finance-card' : ''}`}
              style={{
                color: activeTab === tab ? '#FEB4C5' : '#848484',
                background: activeTab === tab ? 'white' : 'transparent'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-xs">({JOBS[tab].length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-6 space-y-4">
        {currentJobs.map((job) => (
          <div key={job.id} className="finance-card p-5" onClick={() => onNavigate?.('caregiver-job-detail')} style={{ cursor: 'pointer' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
                  <User className="w-6 h-6" style={{ color: '#FEB4C5' }} />
                </div>
                <div>
                  <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>{job.age} years old</p>
                </div>
              </div>
              {job.status === 'ongoing' && (
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#7CE577', color: 'white' }}>
                  Ongoing
                </span>
              )}
              {job.status === 'pending' && (
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#FFD54F', color: 'white' }}>
                  Pending
                </span>
              )}
              {job.status === 'completed' && (
                <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(132, 132, 132, 0.3)', color: '#535353' }}>
                  Completed
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {'date' in job && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#535353' }}>{job.date}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>{job.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>{job.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.conditions.map((condition) => (
                <span key={condition} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(254, 180, 197, 0.2)', color: '#FEB4C5' }}>
                  {condition}
                </span>
              ))}
            </div>

            {job.status === 'ongoing' && (
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => onNavigate?.('caregiver-care-logs')} className="py-2"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)', color: 'white' }}>
                  Care Logs
                </Button>
                <Button onClick={() => onNavigate?.('caregiver-check-out')} variant="outline" className="py-2"
                  style={{ color: '#535353', borderColor: 'rgba(132, 132, 132, 0.2)' }}>
                  Check Out
                </Button>
              </div>
            )}

            {job.status === 'completed' && 'rating' in job && (
              <div className="text-center py-2" style={{ color: '#FFD54F' }}>
                {'⭐'.repeat(job.rating)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
