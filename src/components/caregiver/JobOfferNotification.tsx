import { Check, X, Calendar, MapPin, DollarSign, Clock, User } from "lucide-react";
import { Button } from "../ui/button";

interface JobOfferNotificationProps {
  offer: {
    id: string;
    patient: string;
    guardian: string;
    package: string;
    startDate: string;
    endDate: string;
    schedule: string;
    location: string;
    distance: string;
    payment: number;
    duties: string[];
  };
  onAccept: () => void;
  onDecline: () => void;
  onViewDetails: () => void;
}

export function JobOfferNotification({ offer, onAccept, onDecline, onViewDetails }: JobOfferNotificationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>New Job Offer!</h1>
          <p style={{ color: '#848484' }}>You have a new job opportunity</p>
        </div>

        {/* Offer Details */}
        <div className="finance-card p-6 mb-6">
          <div className="mb-4">
            <h2 style={{ color: '#535353' }}>{offer.patient}</h2>
            <p className="text-sm" style={{ color: '#848484' }}>{offer.package}</p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 shrink-0" style={{ color: '#848484' }} />
              <div>
                <p className="text-sm" style={{ color: '#535353' }}>{offer.startDate} - {offer.endDate}</p>
                <p className="text-xs" style={{ color: '#848484' }}>{offer.schedule}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0" style={{ color: '#848484' }} />
              <div>
                <p className="text-sm" style={{ color: '#535353' }}>{offer.location}</p>
                <p className="text-xs" style={{ color: '#848484' }}>{offer.distance} from you</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 shrink-0" style={{ color: '#848484' }} />
              <div>
                <p style={{ color: '#7CE577' }}>৳{offer.payment.toLocaleString()}</p>
                <p className="text-xs" style={{ color: '#848484' }}>Per shift</p>
              </div>
            </div>
          </div>

          {/* Duties */}
          <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <p className="text-sm mb-2" style={{ color: '#848484' }}>Key Duties:</p>
            <ul className="space-y-1">
              {offer.duties.map((duty, index) => (
                <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#535353' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
                  {duty}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expiry Timer */}
        <div 
          className="flex items-center justify-center gap-2 p-3 rounded-lg mb-6"
          style={{ background: 'rgba(255, 211, 128, 0.2)' }}
        >
          <Clock className="w-5 h-5" style={{ color: '#FFB74D' }} />
          <p className="text-sm" style={{ color: '#535353' }}>
            Respond within <strong>24 hours</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onAccept}
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}
          >
            <Check className="w-5 h-5 mr-2" />
            Accept Offer
          </Button>

          <Button
            onClick={onViewDetails}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            View Full Details
          </Button>

          <Button
            onClick={onDecline}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <X className="w-5 h-5 mr-2" />
            Decline
          </Button>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
          Guardian: {offer.guardian}
        </p>
      </div>
    </div>
  );
}
