import { AlertCircle, Phone, MapPin, Heart, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface EmergencySOSProps {
  patientName: string;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relation: string;
    phone: string;
  }>;
  caregiver?: {
    name: string;
    phone: string;
  };
  onCancel: () => void;
  onConfirmEmergency: () => void;
}

export function EmergencySOS({ patientName, emergencyContacts, caregiver, onCancel, onConfirmEmergency }: EmergencySOSProps) {
  const [countdown, setCountdown] = useState(5);
  const [isActivated, setIsActivated] = useState(false);

  const handleActivate = () => {
    setIsActivated(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onConfirmEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (isActivated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-red-500/90 backdrop-blur-sm">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"
              style={{
                background: 'white',
                boxShadow: '0px 8px 32px rgba(255, 255, 255, 0.5)'
              }}
            >
              <AlertCircle className="w-16 h-16" style={{ color: '#FF6B7A' }} />
            </div>

            <h1 className="text-4xl mb-4 text-white">EMERGENCY!</h1>
            <p className="text-xl mb-2 text-white">Alerting contacts in</p>
            <p className="text-6xl text-white mb-6">{countdown}</p>

            <Button
              onClick={onCancel}
              size="lg"
              className="bg-white text-red-500 hover:bg-white/90"
            >
              <X className="w-6 h-6 mr-2" />
              Cancel Emergency
            </Button>
          </div>

          <div className="finance-card p-6">
            <p className="text-sm mb-3" style={{ color: '#535353' }}>
              <strong>Alerting:</strong>
            </p>
            <ul className="space-y-2 text-sm" style={{ color: '#535353' }}>
              {emergencyContacts.slice(0, 3).map((contact) => (
                <li key={contact.id} className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: '#848484' }} />
                  {contact.name} ({contact.relation})
                </li>
              ))}
              {caregiver && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: '#848484' }} />
                  {caregiver.name} (Caregiver)
                </li>
              )}
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: '#848484' }} />
                Emergency Services (999)
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-md">
        <div className="finance-card p-8 text-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 24px rgba(255, 107, 122, 0.4)'
            }}
          >
            <AlertCircle className="w-12 h-12 text-white" />
          </div>

          <h2 className="mb-4" style={{ color: '#535353' }}>Emergency SOS</h2>
          <p className="mb-6" style={{ color: '#848484' }}>
            This will immediately alert your emergency contacts, caregiver, and emergency services
          </p>

          {/* What Happens */}
          <div className="finance-card p-4 mb-6 text-left">
            <p className="text-sm mb-3" style={{ color: '#535353' }}>
              <strong>What happens next:</strong>
            </p>
            <ul className="space-y-2 text-sm" style={{ color: '#848484' }}>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#FF6B7A' }} />
                Emergency alert sent to all contacts
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#FF6B7A' }} />
                Your location shared with contacts
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#FF6B7A' }} />
                Caregiver immediately notified
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#FF6B7A' }} />
                Emergency services will be called
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="finance-card p-4 mb-6 text-left">
            <p className="text-sm mb-3" style={{ color: '#535353' }}>
              <strong>Will be alerted:</strong>
            </p>
            <ul className="space-y-2">
              {emergencyContacts.slice(0, 3).map((contact) => (
                <li key={contact.id} className="flex items-center justify-between text-sm">
                  <span style={{ color: '#535353' }}>{contact.name}</span>
                  <span style={{ color: '#848484' }}>{contact.relation}</span>
                </li>
              ))}
              {caregiver && (
                <li className="flex items-center justify-between text-sm">
                  <span style={{ color: '#535353' }}>{caregiver.name}</span>
                  <span style={{ color: '#848484' }}>Caregiver</span>
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleActivate}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
                color: 'white',
                boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
              }}
            >
              <AlertCircle className="w-6 h-6 mr-2" />
              Activate Emergency SOS
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
