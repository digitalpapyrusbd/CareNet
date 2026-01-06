import { Building, Edit, Star, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";

interface AgencyProfileProps {
  profile: {
    agencyName: string;
    logo?: string;
    rating: number;
    totalJobs: number;
    activeCaregivers: number;
    serviceAreas: string[];
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    established: string;
    licenseNumber: string;
  };
  onEdit: () => void;
}

export function AgencyProfile({ profile, onEdit }: AgencyProfileProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Agency Profile</h1>
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
            {profile.logo ? (
              <img src={profile.logo} alt={profile.agencyName} className="w-full h-full object-cover rounded-full" />
            ) : (
              <Building className="w-12 h-12 text-white" />
            )}
          </div>
          <h2 className="mb-2" style={{ color: '#535353' }}>{profile.agencyName}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current"
                style={{ color: i < profile.rating ? '#FFD54F' : '#E0E0E0' }} />
            ))}
            <span style={{ color: '#535353' }}>{profile.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.totalJobs}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Total Jobs</p>
            </div>
            <div className="finance-card p-3">
              <p className="text-2xl" style={{ color: '#535353' }}>{profile.activeCaregivers}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Caregivers</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Company Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>License Number:</span>
              <span style={{ color: '#535353' }}>{profile.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Established:</span>
              <span style={{ color: '#535353' }}>{profile.established}</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Phone</p>
                <p style={{ color: '#535353' }}>{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Email</p>
                <p style={{ color: '#535353' }}>{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Address</p>
                <p style={{ color: '#535353' }}>{profile.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Service Areas</h3>
          <div className="flex flex-wrap gap-2">
            {profile.serviceAreas.map((area, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

