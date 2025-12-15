import { Settings, Bell, Globe, Lock, Save } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PatientSettingsProps {
  currentSettings: {
    notifications: boolean;
    medicationReminders: boolean;
    language: 'en' | 'bn';
  };
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export function PatientSettings({ currentSettings, onSave, onCancel }: PatientSettingsProps) {
  const [settings, setSettings] = useState(currentSettings);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Settings</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Notifications</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <div>
                <p style={{ color: '#535353' }}>Push Notifications</p>
                <p className="text-sm" style={{ color: '#848484' }}>Receive app notifications</p>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                className="w-12 h-6 rounded-full relative"
                style={{ background: settings.notifications ? '#7CE577' : '#E0E0E0' }}>
                <span className="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all"
                  style={{ left: settings.notifications ? '26px' : '2px' }} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
              <div>
                <p style={{ color: '#535353' }}>Medication Reminders</p>
                <p className="text-sm" style={{ color: '#848484' }}>Get reminders for medications</p>
              </div>
              <button
                onClick={() => toggleSetting('medicationReminders')}
                className="w-12 h-6 rounded-full relative"
                style={{ background: settings.medicationReminders ? '#7CE577' : '#E0E0E0' }}>
                <span className="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all"
                  style={{ left: settings.medicationReminders ? '26px' : '2px' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Language</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Choose your preferred language</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'en', label: 'English' },
              { value: 'bn', label: 'বাংলা' }
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setSettings(prev => ({ ...prev, language: lang.value as 'en' | 'bn' }))}
                className="p-3 rounded-lg"
                style={{
                  background: settings.language === lang.value 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: settings.language === lang.value ? 'white' : '#535353'
                }}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Privacy & Security</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Manage your account security</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full p-3 rounded-lg text-left"
              style={{ background: 'rgba(255, 255, 255, 0.3)', color: '#535353' }}>
              Change Password
            </button>
            <button className="w-full p-3 rounded-lg text-left"
              style={{ background: 'rgba(255, 255, 255, 0.3)', color: '#535353' }}>
              Privacy Settings
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button onClick={() => onSave(settings)} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

