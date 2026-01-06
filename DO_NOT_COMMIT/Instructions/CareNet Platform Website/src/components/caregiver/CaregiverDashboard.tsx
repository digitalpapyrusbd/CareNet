import { Heart, Calendar, MapPin, Clock, TrendingUp, Bell, Menu, DollarSign, User, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface CaregiverDashboardProps {
  onNavigate?: (page: string) => void;
  userName?: string;
}

const TODAYS_JOB = {
  patient: 'Mrs. Fatima Rahman',
  age: 72,
  conditions: ['Diabetes', 'Hypertension'],
  address: 'House 45, Road 12, Dhanmondi, Dhaka',
  time: '9:00 AM - 5:00 PM',
  startTime: '9:00 AM',
  status: 'Not Checked In'
};

const WEEKLY_STATS = [
  { label: 'Hours Worked', value: '32h', icon: Clock, color: '#9B9CF8' },
  { label: 'Jobs Completed', value: '8', icon: Calendar, color: '#7CE577' },
  { label: 'This Week Earnings', value: '৳8,500', icon: DollarSign, color: '#FEB4C5' },
  { label: 'Rating', value: '4.8★', icon: TrendingUp, color: '#FFD54F' }
];

const UPCOMING_JOBS = [
  { patient: 'Mr. Karim Ahmed', date: 'Tomorrow', time: '10:00 AM - 6:00 PM', location: 'Gulshan' },
  { patient: 'Mrs. Nasrin Begum', date: 'Dec 28', time: '2:00 PM - 8:00 PM', location: 'Uttara' },
  { patient: 'Mr. Salam Mia', date: 'Dec 29', time: '9:00 AM - 5:00 PM', location: 'Banani' }
];

export function CaregiverDashboard({ onNavigate, userName = 'Ayesha' }: CaregiverDashboardProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div className="finance-card p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm" style={{ color: '#848484' }}>{greeting} 👋</p>
            <h1 style={{ color: '#535353' }}>{userName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full finance-card flex items-center justify-center">
              <Bell className="w-5 h-5" style={{ color: '#535353' }} />
            </button>
            <button
              onClick={() => onNavigate?.('toc')}
              className="w-10 h-10 rounded-full finance-card flex items-center justify-center"
            >
              <Menu className="w-5 h-5" style={{ color: '#535353' }} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate?.('caregiver-jobs')}
            className="py-3"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
              color: 'white'
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            My Jobs
          </Button>
          <Button
            onClick={() => onNavigate?.('caregiver-earnings')}
            variant="outline"
            className="py-3"
            style={{ color: '#535353', borderColor: 'rgba(132, 132, 132, 0.2)' }}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Earnings
          </Button>
        </div>
      </div>

      {/* Today's Schedule Card */}
      <div className="px-6 mb-4">
        <h2 className="mb-3" style={{ color: '#535353' }}>Today's Schedule</h2>
        <div className="finance-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(254, 180, 197, 0.2)' }}
                >
                  <User className="w-6 h-6" style={{ color: '#FEB4C5' }} />
                </div>
                <div>
                  <h3 style={{ color: '#535353' }}>{TODAYS_JOB.patient}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>{TODAYS_JOB.age} years old</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#535353' }}>{TODAYS_JOB.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#535353' }}>{TODAYS_JOB.address}</span>
                </div>
              </div>

              {/* Conditions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {TODAYS_JOB.conditions.map(condition => (
                  <span
                    key={condition}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(254, 180, 197, 0.2)', color: '#FEB4C5' }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate?.('caregiver-check-in')}
              className="w-full py-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
                color: 'white'
              }}
            >
              Check In
            </Button>
            <Button
              onClick={() => onNavigate?.('caregiver-job-detail')}
              variant="outline"
              className="w-full py-3"
              style={{ color: '#535353', borderColor: 'rgba(132, 132, 132, 0.2)' }}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="px-6 mb-4">
        <h2 className="mb-3" style={{ color: '#535353' }}>This Week</h2>
        <div className="grid grid-cols-2 gap-3">
          {WEEKLY_STATS.map((stat, index) => (
            <div key={index} className="finance-card p-4">
              <div
                className="w-10 h-10 rounded-[14px] flex items-center justify-center mb-3"
                style={{
                  background: `${stat.color}20`,
                }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>{stat.label}</p>
              <p className="text-xl" style={{ color: '#535353' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ color: '#535353' }}>Upcoming Jobs</h2>
          <button
            onClick={() => onNavigate?.('caregiver-jobs')}
            style={{ color: '#FEB4C5' }}
            className="text-sm"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {UPCOMING_JOBS.map((job, index) => (
            <div key={index} className="finance-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(254, 180, 197, 0.2)', color: '#FEB4C5' }}>
                  {job.date}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#848484' }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 finance-card p-4 flex items-center justify-around">
        <button
          onClick={() => onNavigate?.('caregiver-home')}
          className="flex flex-col items-center gap-1"
          style={{ color: '#FEB4C5' }}
        >
          <Heart className="w-6 h-6 fill-current" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => onNavigate?.('caregiver-jobs')}
          className="flex flex-col items-center gap-1"
          style={{ color: '#848484' }}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Jobs</span>
        </button>
        <button
          onClick={() => onNavigate?.('caregiver-care-logs')}
          className="flex flex-col items-center gap-1"
          style={{ color: '#848484' }}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs">Logs</span>
        </button>
        <button
          onClick={() => onNavigate?.('caregiver-messages')}
          className="flex flex-col items-center gap-1"
          style={{ color: '#848484' }}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">Messages</span>
        </button>
        <button
          onClick={() => onNavigate?.('toc')}
          className="flex flex-col items-center gap-1"
          style={{ color: '#848484' }}
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}
