import { User, Phone, Star, Calendar, MessageSquare, Heart } from "lucide-react";
import { Button } from "../ui/button";

interface MyCaregiverProfileProps {
  caregiver: {
    name: string;
    photo?: string;
    rating: number;
    jobsCompleted: number;
    yearsExperience: number;
    specializations: string[];
    phone: string;
    nextVisit: string;
    schedule: Array<{
      day: string;
      time: string;
    }>;
  };
  onCall: () => void;
  onMessage: () => void;
}

export function MyCaregiverProfile({ caregiver, onCall, onMessage }: MyCaregiverProfileProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>My Caregiver</h1>

        {/* Profile Card */}
        <div className="finance-card p-6 mb-6 text-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
            }}
          >
            {caregiver.photo ? (
              <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>

          <h2 className="mb-2" style={{ color: '#535353' }}>{caregiver.name}</h2>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className="w-4 h-4 fill-current"
                  style={{ color: i < Math.floor(caregiver.rating) ? '#FFD54F' : '#E0E0E0' }}
                />
              ))}
            </div>
            <span style={{ color: '#535353' }}>{caregiver.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="finance-card p-3">
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{caregiver.jobsCompleted}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Jobs Completed</p>
            </div>
            <div className="finance-card p-3">
              <p className="text-2xl mb-1" style={{ color: '#535353' }}>{caregiver.yearsExperience}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Years Experience</p>
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
              <p style={{ color: '#535353' }}><strong>{caregiver.nextVisit}</strong></p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {caregiver.specializations.map((spec, index) => (
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
            {caregiver.schedule.map((slot, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}
              >
                <span style={{ color: '#535353' }}>{slot.day}</span>
                <span style={{ color: '#848484' }}>{slot.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
