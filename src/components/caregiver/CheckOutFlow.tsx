import { Camera, FileText, Star, Check, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface CheckOutFlowProps {
  jobId: string;
  patientName: string;
  checkInTime: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

type Step = 'photo' | 'summary' | 'confirmation';

export function CheckOutFlow({ jobId, patientName, checkInTime, onComplete, onCancel }: CheckOutFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('photo');
  const [photo, setPhoto] = useState<File | null>(null);
  const [shiftSummary, setShiftSummary] = useState("");
  const [checkOutTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setCurrentStep('summary');
    }
  };

  const handleComplete = () => {
    onComplete({
      checkOutTime,
      photo,
      shiftSummary,
      duration: calculateDuration()
    });
  };

  const calculateDuration = () => {
    const checkIn = new Date(`2024-01-01 ${checkInTime}`);
    const checkOut = new Date(`2024-01-01 ${checkOutTime}`);
    const diff = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Step: Photo Capture */}
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
            <h2 className="mb-4" style={{ color: '#535353' }}>Check-Out Photo</h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              Take a photo to confirm your departure
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

      {/* Step: Shift Summary */}
      {currentStep === 'summary' && (
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
                boxShadow: '0px 4px 18px rgba(184, 167, 255, 0.35)'
              }}
            >
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="finance-card p-8">
            <h2 className="mb-4" style={{ color: '#535353' }}>Shift Summary</h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              Provide a brief summary of the care session with {patientName}
            </p>

            <div className="mb-6">
              <Textarea
                value={shiftSummary}
                onChange={(e) => setShiftSummary(e.target.value)}
                placeholder="Patient was in good spirits today. All medications administered on time. Completed afternoon walk and meal assistance..."
                className="bg-white/50 border-white/50 min-h-32"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="finance-card p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Check-In:</span>
                  <span style={{ color: '#535353' }}>{checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Check-Out:</span>
                  <span style={{ color: '#535353' }}>{checkOutTime}</span>
                </div>
                <div className="flex justify-between pt-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                  <span style={{ color: '#848484' }}>Duration:</span>
                  <span style={{ color: '#7CE577' }}>{calculateDuration()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep('photo')}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep('confirmation')}
                disabled={!shiftSummary.trim()}
                className="flex-1"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white',
                  opacity: !shiftSummary.trim() ? 0.5 : 1
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step: Confirmation */}
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
            <h2 className="mb-4" style={{ color: '#535353' }}>Ready to Check-Out?</h2>
            <p className="mb-6" style={{ color: '#848484' }}>
              Please review your shift details before completing check-out
            </p>

            <div className="finance-card p-6 mb-6 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Patient:</span>
                  <span style={{ color: '#535353' }}>{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Duration:</span>
                  <span style={{ color: '#535353' }}>{calculateDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Photo:</span>
                  <span className="flex items-center gap-1" style={{ color: '#7CE577' }}>
                    <Check className="w-4 h-4" />
                    Captured
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#848484' }}>Summary:</span>
                  <span className="flex items-center gap-1" style={{ color: '#7CE577' }}>
                    <Check className="w-4 h-4" />
                    Provided
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep('summary')}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Edit
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  color: 'white'
                }}
              >
                <Send className="w-5 h-5 mr-2" />
                Complete Check-Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
