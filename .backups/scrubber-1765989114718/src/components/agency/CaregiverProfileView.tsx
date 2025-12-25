import { User, MapPin, Star, Award, Calendar, Send } from "lucide-react";
import { Button } from "../ui/button";

interface CaregiverProfileViewProps {
  caregiver: {
    id: string;
    name: string;
    photo?: string;
    rating: number;
    totalJobs: number;
    experience: string;
    location: string;
    specializations: string[];
    certifications: string[];
    availability: string;
    hourlyRate: number;
  };
  onSendOffer: () => void;
  onViewFullProfile: () => void;
}

export function CaregiverProfileView({ caregiver, onSendOffer, onViewFullProfile }: CaregiverProfileViewProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="finance-card p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1" style={{ color: '#535353' }}>{caregiver.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4" style={{ color: '#FFD180' }} />
                <span style={{ color: '#535353' }}>{caregiver.rating}</span>
                <span className="text-sm" style={{ color: '#848484' }}>({caregiver.totalJobs} jobs)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#848484' }}>{caregiver.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Experience</p>
              <p style={{ color: '#535353' }}>{caregiver.experience}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Hourly Rate</p>
              <p style={{ color: '#535353' }}>৳{caregiver.hourlyRate}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Availability</p>
            <p style={{ color: '#535353' }}>{caregiver.availability}</p>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {caregiver.specializations.map((spec, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Certifications</h3>
          <div className="space-y-2">
            {caregiver.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: '#7CE577' }} />
                <span style={{ color: '#535353' }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onViewFullProfile} variant="outline" className="flex-1 bg-white/50 border-white/50">
            View Full Profile
          </Button>
          <Button onClick={onSendOffer} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Send className="w-4 h-4 mr-2" />Send Offer
          </Button>
        </div>
      </div>
    </div>
  );
}

