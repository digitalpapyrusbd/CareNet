import { Briefcase, Clock, User, DollarSign, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface JobInboxProps {
  onSelectJob: (jobId: string) => void;
  onAssignCaregiver: (jobId: string) => void;
}

export function JobInbox({ onSelectJob, onAssignCaregiver }: JobInboxProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'assigned' | 'completed'>('pending');

  const jobs = {
    pending: [
      {
        id: "1",
        patient: "Mrs. Fatima Ahmed",
        guardian: "Mohammed Ahmed",
        package: "24/7 Senior Care - Basic",
        startDate: "Dec 10, 2024",
        location: "Dhanmondi, Dhaka",
        payment: 35000,
        urgent: true
      },
      {
        id: "2",
        patient: "Mr. Abdul Rahman",
        guardian: "Sarah Rahman",
        package: "Post-Surgery Care",
        startDate: "Dec 15, 2024",
        location: "Gulshan, Dhaka",
        payment: 28000,
        urgent: false
      },
    ],
    assigned: [
      {
        id: "3",
        patient: "Mrs. Ayesha Khan",
        guardian: "Ali Khan",
        package: "Dementia Care Package",
        caregiver: "Rashida Begum",
        startDate: "Nov 28, 2024",
        location: "Banani, Dhaka",
        payment: 40000
      },
    ],
    completed: []
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Job Inbox</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#FFD180' }}>{jobs.pending.length}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Pending</p>
          </div>
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#7CE577' }}>{jobs.assigned.length}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Assigned</p>
          </div>
          <div className="finance-card p-4 text-center">
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{jobs.completed.length}</p>
            <p className="text-xs" style={{ color: '#848484' }}>Completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'assigned', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm"
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

        {/* Jobs List */}
        <div className="space-y-3">
          {activeTab === 'pending' && jobs.pending.map((job) => (
            <div
              key={job.id}
              className="finance-card p-4"
              style={{
                borderLeft: job.urgent ? '4px solid #FF6B7A' : '4px solid #FFD180'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {job.urgent && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full mb-2 inline-block"
                      style={{ background: '#FF6B7A', color: 'white' }}
                    >
                      🔥 URGENT
                    </span>
                  )}
                  <h3 className="mb-1" style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>{job.package}</p>
                  <div className="space-y-1 text-sm" style={{ color: '#848484' }}>
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Guardian: {job.guardian}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Starts: {job.startDate}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span style={{ color: '#7CE577' }}>৳{job.payment.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onSelectJob(job.id)}
                  variant="outline"
                  className="bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                >
                  View Details
                </Button>
                <Button
                  onClick={() => onAssignCaregiver(job.id)}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                    color: 'white'
                  }}
                >
                  Assign Caregiver
                </Button>
              </div>
            </div>
          ))}

          {activeTab === 'assigned' && jobs.assigned.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className="w-full finance-card p-4 text-left hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#535353' }}>{job.patient}</h3>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>{job.package}</p>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-2"
                    style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}
                  >
                    <User className="w-3 h-3" />
                    Assigned to: {job.caregiver}
                  </div>
                  <p className="text-sm" style={{ color: '#848484' }}>Started: {job.startDate}</p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#7CE577' }}>৳{job.payment.toLocaleString()}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {jobs[activeTab].length === 0 && (
          <div className="text-center py-12 finance-card">
            <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#535353' }}>No {activeTab} jobs</p>
            <p className="text-sm" style={{ color: '#848484' }}>
              {activeTab === 'pending' && "New job requests will appear here"}
              {activeTab === 'assigned' && "Assigned jobs will appear here"}
              {activeTab === 'completed' && "Completed jobs will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
