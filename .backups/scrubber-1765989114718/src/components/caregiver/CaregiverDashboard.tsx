import { MapPin, Phone, Heart, Calendar, DollarSign, User, MessageSquare, Settings } from "lucide-react";
import { Button } from "../ui/button";

interface CaregiverDashboardProps {
  caregiverName: string;
  onNavigateToJob: (jobId: string) => void;
  onCheckIn: (jobId: string) => void;
  onNavigate: (jobId: string) => void;
  onNavigateToProfile: () => void;
  onNavigateToEarnings: () => void;
}

export function CaregiverDashboard({
  caregiverName,
  onNavigateToJob,
  onCheckIn,
  onNavigate,
  onNavigateToProfile,
  onNavigateToEarnings
}: CaregiverDashboardProps) {
  const todayJobs = [
    {
      id: "1",
      patientName: "Mrs. Fatima Ahmed",
      time: "2:00 PM - 10:00 PM",
      location: "House 45, Dhanmondi",
      distance: "2.3 km",
      conditions: ["Diabetes", "Hypertension"],
      status: "scheduled"
    }
  ];

  const weeklyStats = {
    hoursWorked: 32,
    jobsCompleted: 8,
    earnings: 24000,
    rating: 4.9
  };

  const upcomingJobs = [
    { id: "2", patientName: "Mr. Abdul Rahman", date: "Tomorrow", time: "10:00 AM - 6:00 PM" },
    { id: "3", patientName: "Mrs. Ayesha Khan", date: "Dec 10", time: "8:00 AM - 4:00 PM" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Hello, {caregiverName}</h1>
          <p style={{ color: '#848484' }}>Ready to make a difference today</p>
        </div>

        {/* Today's Schedule */}
        {todayJobs.length > 0 && (
          <div className="finance-card p-6 mb-6">
            <h2 className="mb-4" style={{ color: '#535353' }}>Today's Schedule</h2>
            {todayJobs.map((job) => (
              <div key={job.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                    }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 style={{ color: '#535353' }}>{job.patientName}</h3>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>{job.time}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.conditions.map((condition) => (
                        <span
                          key={condition}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: 'rgba(255, 179, 193, 0.3)', color: '#535353' }}
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#848484' }}>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                      <span>• {job.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => onNavigate(job.id)}
                    variant="outline"
                    className="bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                  <Button
                    onClick={() => onCheckIn(job.id)}
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                      color: 'white'
                    }}
                  >
                    Check In
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{weeklyStats.hoursWorked}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Hours This Week</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>৳{weeklyStats.earnings.toLocaleString()}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Earnings</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <Heart className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{weeklyStats.jobsCompleted}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Jobs Completed</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <span className="text-white text-sm">★</span>
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{weeklyStats.rating}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Rating</p>
          </div>
        </div>

        {/* Upcoming Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: '#535353' }}>Upcoming Jobs</h2>
            <button className="text-sm" style={{ color: '#5B9FFF' }}>
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onNavigateToJob(job.id)}
                className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                    }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: '#535353' }}>{job.patientName}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {job.date} • {job.time}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
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
            <Calendar className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Jobs</span>
          </button>
          <button className="flex flex-col items-center gap-1" onClick={onNavigateToEarnings}>
            <DollarSign className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Earnings</span>
          </button>
          <button className="flex flex-col items-center gap-1" onClick={onNavigateToProfile}>
            <User className="w-6 h-6" style={{ color: '#848484' }} />
            <span className="text-xs" style={{ color: '#848484' }}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
