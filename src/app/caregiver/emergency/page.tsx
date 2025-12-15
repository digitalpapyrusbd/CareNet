'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { AlertTriangle, Phone, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmergencyPage() {
  const router = useRouter();

  const emergencyContacts = [
    { type: 'Guardian', name: 'Fahima Ahmed', phone: '+880 1712-345678' },
    { type: 'Emergency Services', name: '999', phone: '999' },
    { type: 'Platform Support', name: 'CareNet', phone: '+880 1XXX-XXXXXX' },
  ];

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen p-6 pb-24 md:pt-14">
      <div className="max-w-2xl mx-auto">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto block"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)',
            boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
          }}
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>

        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#535353' }}>Emergency Protocol</h1>
          <p style={{ color: '#848484' }}>Quick access to emergency contacts and procedures</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Emergency Contacts</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="finance-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#848484' }}>{contact.type}</p>
                    <p style={{ color: '#535353' }}>{contact.name}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                    }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Emergency Procedures</h3>
          <div className="space-y-3 text-sm" style={{ color: '#535353' }}>
            <p><strong>1. Medical Emergency:</strong> Call 999 immediately, then notify guardian</p>
            <p><strong>2. Safety Concern:</strong> Contact guardian and platform support</p>
            <p><strong>3. Behavioral Crisis:</strong> Follow de-escalation training, contact guardian</p>
            <p><strong>4. Missing Patient:</strong> Contact guardian immediately, then emergency services</p>
          </div>
        </div>

        <Button
          onClick={() => router.back()}
          variant="outline"
          className="w-full bg-white/50 border-white/50"
          style={{ color: '#535353' }}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
    </>

  );
}

