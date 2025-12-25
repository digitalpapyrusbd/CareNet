import { DollarSign, Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ReviewCounterOfferProps {
  caregiverName: string;
  originalOffer: {
    hourlyRate: number;
    hoursPerWeek: number;
    startDate: string;
  };
  counterOffer: {
    hourlyRate: number;
    hoursPerWeek: number;
    startDate: string;
    notes: string;
  };
  onAccept: () => void;
  onReject: () => void;
  onNegotiate: () => void;
}

export function ReviewCounterOffer({
  caregiverName,
  originalOffer,
  counterOffer,
  onAccept,
  onReject,
  onNegotiate
}: ReviewCounterOfferProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-2" style={{ color: '#535353' }}>Counter Offer Received</h1>
        <p className="mb-6" style={{ color: '#848484' }}>From {caregiverName}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Original Offer */}
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Your Offer</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Hourly Rate</span>
                </div>
                <span style={{ color: '#535353' }}>৳{originalOffer.hourlyRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Hours/Week</span>
                </div>
                <span style={{ color: '#535353' }}>{originalOffer.hoursPerWeek}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#848484' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Start Date</span>
                </div>
                <span style={{ color: '#535353' }}>{originalOffer.startDate}</span>
              </div>
            </div>
          </div>

          {/* Counter Offer */}
          <div className="finance-card p-6" style={{ borderLeft: '4px solid #FFD180' }}>
            <h3 className="mb-4" style={{ color: '#535353' }}>Counter Offer</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" style={{ color: '#FFD180' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Hourly Rate</span>
                </div>
                <span style={{ color: '#FFD180' }}>৳{counterOffer.hourlyRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Hours/Week</span>
                </div>
                <span style={{ color: '#FFD180' }}>{counterOffer.hoursPerWeek}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#FFD180' }} />
                  <span className="text-sm" style={{ color: '#848484' }}>Start Date</span>
                </div>
                <span style={{ color: '#FFD180' }}>{counterOffer.startDate}</span>
              </div>
            </div>
          </div>
        </div>

        {counterOffer.notes && (
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-3" style={{ color: '#535353' }}>Caregiver's Notes</h3>
            <p style={{ color: '#535353' }}>{counterOffer.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Button onClick={onReject} variant="outline" className="bg-white/50 border-white/50">
            <XCircle className="w-4 h-4 mr-2" />Decline
          </Button>
          <Button onClick={onNegotiate} style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
            color: 'white'
          }}>
            Negotiate
          </Button>
          <Button onClick={onAccept} style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
            color: 'white'
          }}>
            <CheckCircle className="w-4 h-4 mr-2" />Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

