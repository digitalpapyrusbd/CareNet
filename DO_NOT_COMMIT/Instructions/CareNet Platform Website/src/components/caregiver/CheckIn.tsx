import { useState, useEffect } from 'react';
import { MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface CheckInProps {
  onNavigate?: (page: string) => void;
}

export function CheckIn({ onNavigate }: CheckInProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'mismatch'>('verifying');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(Math.random() > 0.3 ? 'success' : 'mismatch');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        onNavigate?.('caregiver-checkin-confirmation');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (status === 'mismatch') {
      const timer = setTimeout(() => {
        onNavigate?.('caregiver-checkin-location-mismatch');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onNavigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="text-center max-w-md">
        {status === 'verifying' && (
          <>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 animate-pulse"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)', boxShadow: '0px 8px 32px rgba(240, 161, 180, 0.4)' }}>
              <MapPin className="w-16 h-16 text-white" />
            </div>
            <h1 className="mb-4" style={{ color: '#535353' }}>Verifying Location...</h1>
            <p className="mb-8" style={{ color: '#848484' }}>
              Please wait while we verify your location at the patient's address
            </p>
            <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: '#FEB4C5' }} />
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 animate-bounce"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)', boxShadow: '0px 8px 32px rgba(124, 229, 119, 0.4)' }}>
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="mb-4" style={{ color: '#535353' }}>Location Verified!</h1>
            <p style={{ color: '#848484' }}>Proceeding to photo capture...</p>
          </>
        )}

        {status === 'mismatch' && (
          <>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
              style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
              <MapPin className="w-16 h-16" style={{ color: '#FF6B6B' }} />
            </div>
            <h1 className="mb-4" style={{ color: '#535353' }}>Location Mismatch</h1>
            <p style={{ color: '#848484' }}>You're not at the patient's registered address...</p>
          </>
        )}

        <div className="finance-card p-5 mt-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#848484' }}>Current Location:</span>
              <span className="text-sm" style={{ color: '#535353' }}>Dhanmondi, Dhaka</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#848484' }}>Patient Address:</span>
              <span className="text-sm" style={{ color: '#535353' }}>House 45, Road 12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#848484' }}>Distance:</span>
              <span className="text-sm" style={{ color: status === 'success' ? '#7CE577' : '#FF6B6B' }}>
                {status === 'success' ? '5 meters' : '850 meters'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
