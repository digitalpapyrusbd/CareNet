import { User, Star, Briefcase, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface AssignCaregiverFlowProps {
  jobId: string;
  jobDetails: {
    patient: string;
    package: string;
    requirements: string[];
  };
  availableCaregivers: Array<{
    id: string;
    name: string;
    rating: number;
    completedJobs: number;
    specializations: string[];
    availability: string;
    matchScore: number;
  }>;
  onAssign: (caregiverId: string, message: string) => void;
  onCancel: () => void;
}

export function AssignCaregiverFlow({
  jobId,
  jobDetails,
  availableCaregivers,
  onAssign,
  onCancel
}: AssignCaregiverFlowProps) {
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [message, setMessage] = useState("");

  const handleAssign = () => {
    if (selectedCaregiver) {
      onAssign(selectedCaregiver, message);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Assign Caregiver</h1>

        {/* Job Info */}
        <div className="finance-card p-4 mb-6">
          <h3 className="mb-2" style={{ color: '#535353' }}>{jobDetails.patient}</h3>
          <p className="text-sm mb-3" style={{ color: '#848484' }}>{jobDetails.package}</p>
          <div className="flex flex-wrap gap-2">
            {jobDetails.requirements.map((req, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Available Caregivers */}
        <div className="mb-6">
          <h2 className="mb-4" style={{ color: '#535353' }}>
            Available Caregivers ({availableCaregivers.length})
          </h2>

          <div className="space-y-3">
            {availableCaregivers.map((caregiver) => (
              <button
                key={caregiver.id}
                onClick={() => setSelectedCaregiver(caregiver.id)}
                className="w-full finance-card p-4 text-left transition-all"
                style={{
                  border: selectedCaregiver === caregiver.id 
                    ? '2px solid #FFB3C1'
                    : '2px solid transparent',
                  background: selectedCaregiver === caregiver.id
                    ? 'rgba(255, 179, 193, 0.1)'
                    : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    }}
                  >
                    <User className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ color: '#535353' }}>{caregiver.name}</h3>
                      <div 
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: caregiver.matchScore >= 80
                            ? 'rgba(124, 229, 119, 0.2)'
                            : caregiver.matchScore >= 60
                            ? 'rgba(255, 211, 128, 0.2)'
                            : 'rgba(255, 179, 193, 0.2)',
                          color: caregiver.matchScore >= 80
                            ? '#7CE577'
                            : caregiver.matchScore >= 60
                            ? '#FFD180'
                            : '#FFB3C1'
                        }}
                      >
                        {caregiver.matchScore}% Match
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" style={{ color: '#FFD54F' }} />
                        <span style={{ color: '#535353' }}>{caregiver.rating}</span>
                      </div>
                      <span style={{ color: '#848484' }}>
                        {caregiver.completedJobs} jobs
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {caregiver.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: 'rgba(184, 167, 255, 0.2)', color: '#8B7AE8' }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs" style={{ color: '#7CE577' }}>
                      {caregiver.availability}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message to Caregiver */}
        {selectedCaregiver && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-3" style={{ color: '#535353' }}>Message to Caregiver (Optional)</h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any special instructions or notes for the caregiver..."
              className="bg-white/50 border-white/50 min-h-24"
              style={{ color: '#535353' }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCaregiver}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: !selectedCaregiver ? 0.5 : 1
            }}
          >
            <Send className="w-4 h-4 mr-2" />
            Assign Caregiver
          </Button>
        </div>
      </div>
    </div>
  );
}
