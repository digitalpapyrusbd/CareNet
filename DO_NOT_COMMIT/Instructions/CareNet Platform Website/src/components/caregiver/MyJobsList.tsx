import { Search, Calendar, User, MapPin, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface MyJobsListProps {
  onSelectJob?: (jobId: string) => void;
  onNavigate?: (page: string) => void;
}

export function MyJobsList({ onSelectJob, onNavigate }: MyJobsListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');

  const jobs = {
    upcoming: [
      {
        id: "1",
        patient: "Mrs. Fatima Ahmed",
        date: "Tomorrow",
        time: "2:00 PM - 10:00 PM",
        location: "House 45, Dhanmondi",
        distance: "2.3 km",
        payment: 2500
      },
      {
        id: "2",
        patient: "Mr. Abdul Rahman",
        date: "Dec 10",
        time: "10:00 AM - 6:00 PM",
        location: "Road 8, Gulshan",
        distance: "5.1 km",
        payment: 2000
      },
    ],
    active: [
      {
        id: "3",
        patient: "Mrs. Ayesha Khan",
        startTime: "2:00 PM",
        endTime: "10:00 PM",
        location: "Banani, Dhaka",
        checkIn: "2:05 PM",
        payment: 2500
      },
    ],
    completed: [
      {
        id: "4",
        patient: "Mrs. Fatima Ahmed",
        date: "Yesterday",
        duration: "8 hours",
        payment: 2500,
        rating: 5
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

        <h1 className="mb-6" style={{ color: '#535353' }}>My Jobs</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
          <Input
            placeholder="Search jobs..."
            className="pl-10 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {[
            { id: 'upcoming', label: 'Upcoming', count: jobs.upcoming.length },
            { id: 'active', label: 'Active', count: jobs.active.length },
            { id: 'completed', label: 'Completed', count: jobs.completed.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                background: activeTab === tab.id 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: activeTab === tab.id ? 'white' : '#535353'
              }}
            >
              <span className="text-sm">{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(132, 132, 132, 0.2)'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          {activeTab === 'upcoming' && jobs.upcoming.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    {job.date} • {job.time}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#7CE577' }}>৳{job.payment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#848484' }}>
                <MapPin className="w-4 h-4" />
                <span>{job.location} • {job.distance}</span>
              </div>
            </button>
          ))}

          {activeTab === 'active' && jobs.active.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
              style={{ borderLeft: '4px solid #7CE577' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{job.patient}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#7CE577', color: 'white' }}
                    >
                      ● In Progress
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Checked in at {job.checkIn}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#7CE577' }}>৳{job.payment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#848484' }}>
                <Clock className="w-4 h-4" />
                <span>{job.startTime} - {job.endTime}</span>
              </div>
            </button>
          ))}

          {activeTab === 'completed' && jobs.completed.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>
                    {job.date} • {job.duration}
                  </p>
                  {job.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < job.rating! ? '#FFD54F' : '#E0E0E0' }}>★</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p style={{ color: '#535353' }}>৳{job.payment}</p>
                  <p className="text-xs" style={{ color: '#7CE577' }}>Paid</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {jobs[activeTab].length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No {activeTab} jobs</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              {activeTab === 'upcoming' && "New job offers will appear here"}
              {activeTab === 'active' && "Check in to a job to see it here"}
              {activeTab === 'completed' && "Your completed jobs will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
