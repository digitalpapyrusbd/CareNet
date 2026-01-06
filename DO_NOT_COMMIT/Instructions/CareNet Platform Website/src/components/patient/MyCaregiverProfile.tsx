import { User, Star, Phone, MessageSquare, Calendar, Clock, Award, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface MyCaregiverProfileProps {
  caregiver?: {
    name: string;
    photo: string | null;
    rating: number;
    totalReviews: number;
    experience: string;
    specializations: string[];
    languages: string[];
    certifications: string[];
    schedule: string;
    phone: string;
  };
  onCall?: () => void;
  onMessage?: () => void;
  onNavigate?: (page: string) => void;
}

export function MyCaregiverProfile({ caregiver, onCall, onMessage, onNavigate }: MyCaregiverProfileProps) {
  const defaultCaregiver = {
    name: "Rashida Begum",
    photo: null,
    rating: 4.9,
    totalReviews: 124,
    experience: "8 years",
    specializations: ["Elderly Care", "Post-Surgery Care", "Diabetes Management"],
    languages: ["Bengali", "English"],
    certifications: ["Certified Nursing Assistant", "First Aid & CPR"],
    schedule: "Mon-Fri, 2:00 PM - 10:00 PM",
    phone: "+880 1712-345678"
  };

  const caregiverData = caregiver || defaultCaregiver;

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

        <h1 className="mb-6" style={{ color: '#535353' }}>My Caregiver</h1>

        {/* Profile Card */}
        <div className="finance-card p-6 mb-6 text-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
            }}
          >
            {caregiverData.photo ? (
              <img src={caregiverData.photo} alt={caregiverData.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>

          <h2 className="mb-2" style={{ color: '#535353' }}>{caregiverData.name}</h2>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className="w-4 h-4 fill-current"
                  style={{ color: i < Math.floor(caregiverData.rating) ? '#FFD54F' : '#E0E0E0' }}
                />
              ))}
            </div>
            <span style={{ color: '#535353' }}>{caregiverData.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="finance-card p-3">
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{caregiverData.totalReviews}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Total Reviews</p>
            </div>
            <div className="finance-card p-3">
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{caregiverData.experience}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Experience</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onCall}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call
            </Button>
            <Button
              onClick={onMessage}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Next Visit */}
        <div 
          className="finance-card p-4 mb-6"
          style={{ borderLeft: '4px solid #5B9FFF' }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" style={{ color: '#5B9FFF' }} />
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Next Visit</p>
              <p style={{ color: '#535353' }}><strong>Not Scheduled</strong></p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {caregiverData.specializations.map((spec, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Regular Schedule</h3>
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}
            >
              <span style={{ color: '#535353' }}>{caregiverData.schedule}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}