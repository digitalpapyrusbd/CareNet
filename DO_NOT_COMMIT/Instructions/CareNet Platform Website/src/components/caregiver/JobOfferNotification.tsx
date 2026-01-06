import { User, Calendar, Clock, MapPin, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface JobOfferNotificationProps {
  onNavigate?: (page: string) => void;
}

const OFFER = {
  patient: 'Mrs. Fatima Rahman',
  age: 72,
  gender: 'Female',
  startDate: 'Dec 27, 2024',
  endDate: 'Jan 27, 2025',
  shiftTime: '9:00 AM - 5:00 PM',
  daysPerWeek: 'Monday - Friday',
  location: 'House 45, Road 12, Dhanmondi, Dhaka',
  wage: '৳600/hour',
  totalEstimated: '৳96,000/month',
  conditions: ['Diabetes', 'Hypertension', 'Mobility Issues'],
  requiredSkills: ['Elderly Care', 'Medication Management', 'Mobility Assistance']
};

export function JobOfferNotification({ onNavigate }: JobOfferNotificationProps) {
  const handleAccept = () => {
    onNavigate?.('caregiver-home');
  };

  const handleDecline = () => {
    onNavigate?.('caregiver-home');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-pulse"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)', boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)' }}>
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="mb-2" style={{ color: '#535353' }}>New Job Offer!</h1>
        <p style={{ color: '#848484' }}>Review and respond within 24 hours</p>
      </div>

      {/* Patient Info */}
      <div className="finance-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
            <User className="w-6 h-6" style={{ color: '#FEB4C5' }} />
          </div>
          <div>
            <h2 style={{ color: '#535353' }}>{OFFER.patient}</h2>
            <p className="text-sm" style={{ color: '#848484' }}>{OFFER.age} years • {OFFER.gender}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{ color: '#848484' }} />
            <div>
              <p className="text-sm" style={{ color: '#535353' }}>
                {OFFER.startDate} - {OFFER.endDate}
              </p>
              <p className="text-xs" style={{ color: '#848484' }}>{OFFER.daysPerWeek}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" style={{ color: '#848484' }} />
            <p className="text-sm" style={{ color: '#535353' }}>{OFFER.shiftTime}</p>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#848484' }} />
            <p className="text-sm" style={{ color: '#535353' }}>{OFFER.location}</p>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5" style={{ color: '#7CE577' }} />
            <div>
              <p className="text-sm" style={{ color: '#535353' }}>{OFFER.wage}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Est. {OFFER.totalEstimated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="finance-card p-5 mb-4">
        <h3 className="mb-3" style={{ color: '#535353' }}>Medical Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {OFFER.conditions.map((condition) => (
            <span key={condition} className="px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(254, 180, 197, 0.2)', color: '#FEB4C5' }}>
              {condition}
            </span>
          ))}
        </div>
      </div>

      {/* Required Skills */}
      <div className="finance-card p-5 mb-4">
        <h3 className="mb-3" style={{ color: '#535353' }}>Required Skills</h3>
        <div className="space-y-2">
          {OFFER.requiredSkills.map((skill) => (
            <div key={skill} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#7CE577' }}>
                <span className="text-xs text-white">✓</span>
              </div>
              <p className="text-sm" style={{ color: '#535353' }}>{skill}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="finance-card p-4 mb-6" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FEB4C5' }} />
          <div>
            <p className="text-sm mb-1" style={{ color: '#535353' }}><strong>Important:</strong></p>
            <p className="text-xs" style={{ color: '#848484' }}>
              Once accepted, cancellation may result in penalties. Review all details carefully before accepting.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handleAccept} className="w-full py-6"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)', color: 'white' }}>
          Accept Job Offer
        </Button>
        <Button onClick={handleDecline} variant="outline" className="w-full py-6"
          style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}>
          Decline Offer
        </Button>
      </div>
    </div>
  );
}
