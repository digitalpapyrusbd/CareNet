import { Briefcase, MapPin, Clock, DollarSign, User } from "lucide-react";
import { Button } from "../ui/button";

interface NewJobNeedsAssignmentProps {
  job: {
    id: string;
    guardianName: string;
    patientName: string;
    location: string;
    startDate: string;
    duration: string;
    hourlyRate: number;
    requirements: string[];
  };
  availableCaregivers: number;
  onAssignCaregiver: () => void;
  onViewDetails: () => void;
}

export function NewJobNeedsAssignment({
  job,
  availableCaregivers,
  onAssignCaregiver,
  onViewDetails
}: NewJobNeedsAssignmentProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(255, 209, 128, 0.2)' }}>
            <span style={{ color: '#FFB74D' }}>⚠️ Awaiting Assignment</span>
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>New Job Request</h1>
          <p style={{ color: '#848484' }}>Job #{job.id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Job Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>Guardian</p>
                <p style={{ color: '#535353' }}>{job.guardianName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>Patient</p>
                <p style={{ color: '#535353' }}>{job.patientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>Location</p>
                <p style={{ color: '#535353' }}>{job.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
                <div>
                  <p className="text-sm" style={{ color: '#848484' }}>Start Date</p>
                  <p style={{ color: '#535353' }}>{job.startDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
                <div>
                  <p className="text-sm" style={{ color: '#848484' }}>Duration</p>
                  <p style={{ color: '#535353' }}>{job.duration}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 shrink-0" style={{ color: '#7CE577' }} />
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>Hourly Rate</p>
                <p style={{ color: '#535353' }}>৳{job.hourlyRate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#5B9FFF' }} />
                <span style={{ color: '#535353' }}>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <span style={{ color: '#848484' }}>Available Caregivers:</span>
            <span className="text-lg" style={{ color: '#7CE577' }}>{availableCaregivers}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onViewDetails} variant="outline" className="flex-1 bg-white/50 border-white/50">
            View Full Details
          </Button>
          <Button onClick={onAssignCaregiver} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Briefcase className="w-4 h-4 mr-2" />Assign Caregiver
          </Button>
        </div>
      </div>
    </div>
  );
}

