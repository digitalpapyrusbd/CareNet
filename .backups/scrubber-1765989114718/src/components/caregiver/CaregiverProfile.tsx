import { User, Edit, Star } from "lucide-react";
import { Button } from "../ui/button";

interface CaregiverProfileProps {
  profile: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    jobsCompleted: number;
    yearsExperience: number;
    specializations: string[];
    certifications: string[];
  };
  onEdit: () => void;
}

export function CaregiverProfile({ profile, onEdit }: CaregiverProfileProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>My Profile</h1>
          <Button onClick={onEdit} size="sm" style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white'
          }}>
            <Edit className="w-4 h-4 mr-2" />Edit
          </Button>
        </div>

        <div className="finance-card p-6 mb-6 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-2" style={{ color: '#535353' }}>{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current"
                style={{ color: i < profile.rating ? '#FFD54F' : '#E0E0E0' }} />
            ))}
            <span style={{ color: '#535353' }}>{profile.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.jobsCompleted}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Jobs</p>
            </div>
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.yearsExperience}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Years</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Contact Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Phone:</span>
              <span style={{ color: '#535353' }}>{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Email:</span>
              <span style={{ color: '#535353' }}>{profile.email}</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Certifications</h3>
          <ul className="space-y-2">
            {profile.certifications.map((cert, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#7CE577' }} />
                <span style={{ color: '#535353' }}>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

