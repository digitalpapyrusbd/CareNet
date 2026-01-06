'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Users, MapPin, Heart, Shield, X, Clock } from 'lucide-react';
import { TouchButton } from '@/components/layout/MobileFirstLayout';
import { MobileCard } from '@/components/layout/MobileFirstLayout';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: 'primary' | 'secondary';
  isAvailable: boolean;
}

interface EmergencySOSProps {
  patientName?: string;
  onEmergencyCall?: (contact: EmergencyContact) => void;
  onLocationShare?: () => void;
}

export function EmergencySOS({ 
  patientName = "Anwar Hossain",
  onEmergencyCall,
  onLocationShare
}: EmergencySOSProps) {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [location, setLocation] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Mr. Karim',
      relationship: 'Son',
      phone: '+880 1712345678',
      priority: 'primary',
      isAvailable: true
    },
    {
      id: '2',
      name: 'Dr. Rahman',
      relationship: 'Physician',
      phone: '+880 1812345678',
      priority: 'secondary',
      isAvailable: true
    },
    {
      id: '3',
      name: 'Ambulance',
      relationship: 'Emergency Services',
      phone: '999',
      priority: 'emergency',
      isAvailable: true
    }
  ];

  useEffect(() => {
    if (isSOSActive && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isSOSActive && countdown === 0) {
      handleEmergencyTrigger();
    }
  }, [isSOSActive, countdown]);

  const getLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location unavailable');
          setIsLocationLoading(false);
        }
      );
    } else {
      setLocation('Geolocation not supported');
      setIsLocationLoading(false);
    }
  };

  const handleEmergencyTrigger = () => {
    setIsSOSActive(false);
    setCountdown(10);
    
    // Simulate emergency call sequence
    emergencyContacts.forEach((contact, index) => {
      setTimeout(() => {
        if (contact.priority === 'emergency') {
          // Call ambulance
          window.open(`tel:${contact.phone}`);
        } else {
          // Send emergency notification
          console.log(`Notifying ${contact.name} at ${contact.phone}`);
        }
      }, index * 2000);
    });

    // Share location
    if (location) {
      onLocationShare?.();
    }
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    setCountdown(10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
            boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
          }}
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
        <h2 style={{ color: '#535353' }} className="text-xl font-semibold">
          Emergency Assistance
        </h2>
        <p style={{ color: '#848484' }} className="text-sm">
          {patientName}
        </p>
      </div>

      {/* SOS Button */}
      {!isSOSActive ? (
        <div className="text-center">
          <TouchButton
            variant="primary"
            size="lg"
            onClick={() => setIsSOSActive(true)}
            className="w-32 h-32 rounded-full text-lg font-bold shadow-2xl"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
              color: 'white',
              boxShadow: '0px 8px 24px rgba(255, 107, 122, 0.4)'
            }}
          >
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <span>EMERGENCY</span>
              <span className="text-xs opacity-80">SOS</span>
            </div>
          </TouchButton>
          <p className="mt-4 text-xs" style={{ color: '#848484' }}>
            Hold for 3 seconds to cancel
          </p>
        </div>
      ) : (
        /* SOS Active State */
        <MobileCard className="text-center">
          <div className="animate-pulse">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
              }}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h3 style={{ color: '#535353' }} className="text-lg font-semibold mb-2">
              Emergency Alert
            </h3>
            <p style={{ color: '#848484' }} className="mb-4">
              Calling emergency contacts in {countdown} seconds...
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(countdown / 10) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                  }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3">
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={cancelSOS}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </TouchButton>
              <TouchButton
                variant="secondary"
                size="sm"
                onClick={handleEmergencyTrigger}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </TouchButton>
            </div>
          </div>
        </MobileCard>
      )}

      {/* Emergency Contacts */}
      <div>
        <h3 style={{ color: '#535353' }} className="mb-4 font-semibold">
          Emergency Contacts
        </h3>
        
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="finance-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: contact.priority === 'primary' 
                        ? 'rgba(142, 197, 252, 0.2)'
                        : contact.priority === 'secondary'
                        ? 'rgba(255, 211, 128, 0.2)'
                        : 'rgba(255, 107, 122, 0.2)',
                      color: contact.priority === 'primary' 
                        ? '#5B9FFF'
                        : contact.priority === 'secondary'
                        ? '#FFB74D'
                        : '#FF6B7A'
                    }}
                  >
                    {contact.priority === 'emergency' ? (
                      <Shield className="w-6 h-6" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 style={{ color: '#535353' }} className="font-medium">
                        {contact.name}
                      </h4>
                      <span 
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          background: contact.isAvailable ? '#7CE577' : '#FF6B7A',
                          color: 'white'
                        }}
                      >
                        {contact.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {contact.relationship} " {contact.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.open(`tel:${contact.phone}`);
                    onEmergencyCall?.(contact);
                  }}
                  className="p-2 rounded-lg hover:bg-white/50"
                  style={{ color: '#848484' }}
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Sharing */}
      <div>
        <h3 style={{ color: '#535353' }} className="mb-4 font-semibold">
          Location Sharing
        </h3>
        
        <MobileCard>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'rgba(142, 197, 252, 0.2)',
                  color: '#5B9FFF'
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 style={{ color: '#535353' }} className="font-medium">
                  Current Location
                </h4>
                <p className="text-sm" style={{ color: '#848484' }}>
                  {location || 'Location not shared'}
                </p>
              </div>
            </div>
            
            <TouchButton
              variant="secondary"
              size="sm"
              onClick={getLocation}
              disabled={isLocationLoading}
            >
              {isLocationLoading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                'Get Location'
              )}
            </TouchButton>
          </div>

          <div className="text-xs" style={{ color: '#848484' }}>
            Your location will be shared with emergency contacts when SOS is activated
          </div>
        </MobileCard>
      </div>

      {/* Health Information */}
      <div>
        <h3 style={{ color: '#535353' }} className="mb-4 font-semibold">
          Health Information
        </h3>
        
        <MobileCard>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
              <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <div className="text-sm" style={{ color: '#535353' }}>Blood Type</div>
              <div className="text-xs" style={{ color: '#848484' }}>A+</div>
            </div>
            
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
              <AlertTriangle className="w-6 h-6 mx-auto mb-2" style={{ color: '#FF6B7A' }} />
              <div className="text-sm" style={{ color: '#535353' }}>Allergies</div>
              <div className="text-xs" style={{ color: '#848484' }}>Penicillin</div>
            </div>
            
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
              <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
              <div className="text-sm" style={{ color: '#535353' }}>Insurance</div>
              <div className="text-xs" style={{ color: '#848484' }}>Green Cross</div>
            </div>
            
            <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255, 211, 128, 0.1)' }}>
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#FFB74D' }} />
              <div className="text-sm" style={{ color: '#535353' }}>Primary Doctor</div>
              <div className="text-xs" style={{ color: '#848484' }}>Dr. Rahman</div>
            </div>
          </div>
        </MobileCard>
      </div>

      {/* Safety Tips */}
      <div>
        <h3 style={{ color: '#535353' }} className="mb-4 font-semibold">
          Safety Tips
        </h3>
        
        <div className="space-y-3">
          <MobileCard>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'rgba(142, 197, 252, 0.2)',
                  color: '#5B9FFF'
                }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 style={{ color: '#535353' }} className="font-medium mb-1">
                  Keep Phone Charged
                </h4>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Ensure your phone is charged and within reach at all times
                </p>
              </div>
            </div>
          </MobileCard>
          
          <MobileCard>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'rgba(255, 211, 128, 0.2)',
                  color: '#FFB74D'
                }}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 style={{ color: '#535353' }} className="font-medium mb-1">
                  Inform Contacts
                </h4>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Let your emergency contacts know about this feature
                </p>
              </div>
            </div>
          </MobileCard>
          
          <MobileCard>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'rgba(255, 179, 193, 0.2)',
                  color: '#FF6B7A'
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 style={{ color: '#535353' }} className="font-medium mb-1">
                  Use Responsibly
                </h4>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Only use SOS for genuine emergencies to avoid unnecessary calls
                </p>
              </div>
            </div>
          </MobileCard>
        </div>
      </div>
    </div>
  );
}