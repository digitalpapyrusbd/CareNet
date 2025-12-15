import { Calendar, MapPin, Clock, Star, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Job {
  id: string;
  patientName: string;
  location: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  earnings: number;
  rating?: number;
  status: 'completed' | 'cancelled';
}

interface ViewJobHistoryProps {
  jobs: Job[];
  onViewDetails: (jobId: string) => void;
}

export function ViewJobHistory({ jobs, onViewDetails }: ViewJobHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filteredJobs = jobs.filter(job => filter === 'all' || job.status === filter);

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Job History</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'completed', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No jobs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: job.status === 'completed' 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    }}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#535353' }}>{job.patientName}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2" style={{ color: '#848484' }}>
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2" style={{ color: '#848484' }}>
                        <Clock className="w-3 h-3" />
                        {job.startDate} - {job.endDate} • {job.totalHours}h
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/50">
                  <div>
                    <p className="text-lg" style={{ color: '#7CE577' }}>৳{job.earnings.toLocaleString()}</p>
                    {job.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                        <span className="text-xs" style={{ color: '#848484' }}>{job.rating}</span>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => onViewDetails(job.id)} size="sm" variant="outline"
                    className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-2" />View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

