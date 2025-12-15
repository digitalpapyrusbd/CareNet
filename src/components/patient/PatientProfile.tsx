import { User, Edit, Heart, Activity } from "lucide-react";
import { Button } from "../ui/button";

interface PatientProfileProps {
  profile: {
    name: string;
    age: number;
    bloodGroup: string;
    conditions: string[];
    allergies: string[];
    mobility: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  onEdit: () => void;
}

export function PatientProfile({ profile, onEdit }: PatientProfileProps) {
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
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-2" style={{ color: '#535353' }}>{profile.name}</h2>
          <p className="text-sm mb-4" style={{ color: '#848484' }}>Age {profile.age} • {profile.bloodGroup}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="finance-card p-3">
              <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: '#FF8FA3' }} />
              <p className="text-xs" style={{ color: '#848484' }}>Conditions</p>
              <p className="text-sm" style={{ color: '#535353' }}>{profile.conditions.length}</p>
            </div>
            <div className="finance-card p-3">
              <Activity className="w-6 h-6 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <p className="text-xs" style={{ color: '#848484' }}>Mobility</p>
              <p className="text-sm" style={{ color: '#535353' }}>{profile.mobility}</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Medical Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {profile.conditions.map((condition, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(255, 143, 163, 0.2)', color: '#FF8FA3' }}>
                {condition}
              </span>
            ))}
          </div>
        </div>

        {profile.allergies.length > 0 && (
          <div className="finance-card p-6 mb-6" style={{ borderLeft: '4px solid #FF6B7A' }}>
            <h3 className="mb-3" style={{ color: '#FF6B7A' }}>⚠️ Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="finance-card p-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Emergency Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Name:</span>
              <span style={{ color: '#535353' }}>{profile.emergencyContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Relationship:</span>
              <span style={{ color: '#535353' }}>{profile.emergencyContact.relationship}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Phone:</span>
              <span style={{ color: '#535353' }}>{profile.emergencyContact.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

