import { AlertTriangle, Phone, MapPin, FileText, Camera, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface EmergencyProtocolProps {
  patientName?: string;
  guardianPhone?: string;
  location?: string;
  onCallEmergency?: () => void;
  onCallGuardian?: () => void;
  onSubmitReport?: (data: any) => void;
  onNavigate?: (page: string) => void;
}

export function EmergencyProtocol({
  patientName = "Patient",
  guardianPhone = "+880 1712-345678",
  location = "Dhaka",
  onCallEmergency,
  onCallGuardian,
  onSubmitReport,
  onNavigate
}: EmergencyProtocolProps) {
  const [emergencyType, setEmergencyType] = useState("");
  const [description, setDescription] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const emergencyTypes = [
    "Fall/Injury",
    "Chest Pain",
    "Difficulty Breathing",
    "Severe Bleeding",
    "Loss of Consciousness",
    "Allergic Reaction",
    "Other Medical Emergency"
  ];

  const handleSubmit = () => {
    onSubmitReport({
      emergencyType,
      description,
      actionsTaken,
      photos,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen pb-6" style={{ background: 'linear-gradient(180deg, #FFE5E5 0%, #FFD5D5 100%)' }}>
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        {/* Emergency Header */}
        <div 
          className="p-6 rounded-2xl mb-6 text-center"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
            boxShadow: '0px 8px 32px rgba(255, 107, 122, 0.4)'
          }}
        >
          <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-2">EMERGENCY PROTOCOL</h1>
          <p className="text-white/90">Patient: {patientName}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={onCallEmergency}
            className="py-6"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
              color: 'white',
              boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
            }}
          >
            <Phone className="w-6 h-6 mr-2" />
            Call 999
          </Button>
          <Button
            onClick={onCallGuardian}
            className="py-6"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <Phone className="w-6 h-6 mr-2" />
            Call Guardian
          </Button>
        </div>

        {/* Location Info */}
        <div 
          className="finance-card p-4 mb-6"
          style={{ borderLeft: '4px solid #FF6B7A' }}
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" style={{ color: '#FF6B7A' }} />
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Current Location</p>
              <p style={{ color: '#535353' }}>{location}</p>
            </div>
          </div>
        </div>

        {/* Emergency Report Form */}
        <div className="finance-card p-6 mb-6">
          <h2 className="mb-4 flex items-center gap-2" style={{ color: '#535353' }}>
            <FileText className="w-5 h-5" />
            Emergency Report
          </h2>

          <div className="space-y-4">
            {/* Emergency Type */}
            <div>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>Type of Emergency *</p>
              <div className="grid grid-cols-2 gap-2">
                {emergencyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmergencyType(type)}
                    className="text-sm px-3 py-2 rounded-lg text-left transition-colors"
                    style={{
                      background: emergencyType === type 
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: emergencyType === type ? 'white' : '#535353'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>What Happened? *</p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the emergency situation in detail..."
                className="bg-white/50 border-white/50 min-h-24"
                style={{ color: '#535353' }}
              />
            </div>

            {/* Actions Taken */}
            <div>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>Actions Taken *</p>
              <Textarea
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
                placeholder="What immediate actions did you take?"
                className="bg-white/50 border-white/50 min-h-24"
                style={{ color: '#535353' }}
              />
            </div>

            {/* Photos */}
            <div>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>Photos (if applicable)</p>
              <label
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Camera className="w-8 h-8" style={{ color: '#848484' }} />
                <span className="text-sm" style={{ color: '#535353' }}>
                  {photos.length > 0 ? `${photos.length} photos selected` : 'Add photos'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && setPhotos(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div 
          className="p-4 rounded-lg mb-6"
          style={{ background: 'rgba(255, 211, 128, 0.2)' }}
        >
          <p className="text-sm mb-2" style={{ color: '#535353' }}>
            <strong>⚠️ Important:</strong>
          </p>
          <ul className="text-sm space-y-1" style={{ color: '#535353' }}>
            <li>• Stay with the patient until help arrives</li>
            <li>• Keep the patient calm and comfortable</li>
            <li>• Document everything that happened</li>
            <li>• Follow emergency medical guidance</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!emergencyType || !description || !actionsTaken}
          className="w-full"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white',
            opacity: (!emergencyType || !description || !actionsTaken) ? 0.5 : 1
          }}
        >
          Submit Emergency Report
        </Button>
      </div>
    </div>
  );
}
