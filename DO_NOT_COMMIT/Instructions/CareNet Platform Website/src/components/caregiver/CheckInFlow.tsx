import { MapPin, Camera, Check, AlertTriangle, Navigation } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface CheckInFlowProps {
  jobId: string;
  patientName: string;
  expectedLocation: { lat: number; lng: number; address: string };
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'location' | 'location-mismatch' | 'photo' | 'confirmation';

export function CheckInFlow({ jobId, patientName, expectedLocation, onComplete, onCancel }: CheckInFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [isVerifying, setIsVerifying] = useState(false);
  const [locationMatch, setLocationMatch] = useState<boolean | null>(null);
  const [mismatchNote, setMismatchNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [checkInTime, setCheckInTime] = useState("");

  // Simulate location verification
  const verifyLocation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Randomly simulate match/mismatch for demo
      const isMatch = Math.random() > 0.3; // 70% match rate
      setLocationMatch(isMatch);
      setIsVerifying(false);
      
      if (isMatch) {
        setCurrentStep('photo');
      } else {
        setCurrentStep('location-mismatch');
      }
    }, 2000);
  };

  const handleLocationMismatchProceed = () => {
    if (mismatchNote.trim()) {
      setCurrentStep('photo');
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setCheckInTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setCurrentStep('confirmation');
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Step 1: Location Verification */}
      {currentStep === 'location' && (
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: isVerifying
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
              }}
            >
              {isVerifying ? (
                <Navigation className="w-10 h-10 text-white animate-pulse" />
              ) : (
                <MapPin className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          <div className="finance-card p-8 text-center">
            <h2 className="mb-4" style={{ color: '#535353' }}>
              {isVerifying ? "Verifying Location..." : "Check In"}
            </h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              {isVerifying 
                ? "Please wait while we verify your location"
                : `Ready to check in for ${patientName}?`
              }
            </p>

            <div className="finance-card p-4 mb-6 text-left">
              <p className="text-sm mb-2" style={{ color: '#848484' }}>Expected Location:</p>
              <p className="text-sm" style={{ color: '#535353' }}>{expectedLocation.address}</p>
            </div>

            {!isVerifying && (
              <div className="space-y-3">
                <Button
                  onClick={verifyLocation}
                  className="w-full"
                  size="lg"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                    color: 'white'
                  }}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Verify Location
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
            )}

            {isVerifying && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#FFB3C1' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Location Mismatch */}
      {currentStep === 'location-mismatch' && (
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                boxShadow: '0px 4px 18px rgba(255, 211, 128, 0.35)'
              }}
            >
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="finance-card p-8">
            <h2 className="mb-4 text-center" style={{ color: '#535353' }}>Location Mismatch</h2>
            <p className="mb-6 text-center" style={{ color: '#848484' }}>
              Your current location doesn't match the expected job location. Please provide a note to proceed.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block" style={{ color: '#535353' }}>
                  Reason for location mismatch *
                </label>
                <Textarea
                  value={mismatchNote}
                  onChange={(e) => setMismatchNote(e.target.value)}
                  placeholder="E.g., Patient temporarily at different location, GPS error, etc."
                  className="bg-white/50 border-white/50 min-h-24"
                  style={{ color: '#535353' }}
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleLocationMismatchProceed}
                  disabled={!mismatchNote.trim()}
                  className="w-full"
                  size="lg"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                    color: 'white',
                    opacity: !mismatchNote.trim() ? 0.5 : 1
                  }}
                >
                  Proceed with Override
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                >
                  Cancel Check-In
                </Button>
              </div>
            </div>

            <div 
              className="mt-6 p-3 rounded-lg"
              style={{ background: 'rgba(255, 211, 128, 0.1)' }}
            >
              <p className="text-xs" style={{ color: '#848484' }}>
                Note: This override will be logged and reviewed by the guardian and platform moderators.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Photo Capture */}
      {currentStep === 'photo' && (
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                boxShadow: '0px 4px 18px rgba(142, 197, 252, 0.35)'
              }}
            >
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="finance-card p-8 text-center">
            <h2 className="mb-4" style={{ color: '#535353' }}>Capture Arrival Photo</h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              Take a photo to confirm your arrival at the location
            </p>

            <label
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors mb-6"
              style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Camera className="w-12 h-12" style={{ color: '#848484' }} />
              <span style={{ color: '#535353' }}>Tap to capture photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>

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
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 'confirmation' && (
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)'
              }}
            >
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="finance-card p-8 text-center">
            <h2 className="mb-4" style={{ color: '#535353' }}>Check-In Successful!</h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              You've successfully checked in for {patientName}
            </p>

            <div className="finance-card p-6 mb-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Check-in Time:</span>
                  <span style={{ color: '#535353' }}>{checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Location:</span>
                  <span className="flex items-center gap-1" style={{ color: '#7CE577' }}>
                    <Check className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Photo:</span>
                  <span className="flex items-center gap-1" style={{ color: '#7CE577' }}>
                    <Check className="w-4 h-4" />
                    Captured
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}
            >
              Start Care Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
