import { User, Bell, Lock, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface ModeratorSettingsProps {
  currentSettings: {
    name: string;
    email: string;
    notifications: {
      newSubmissions: boolean;
      adminMessages: boolean;
      systemAlerts: boolean;
    };
  };
  onSave: (settings: any) => void;
}

export function ModeratorSettings({ currentSettings, onSave }: ModeratorSettingsProps) {
  const [settings, setSettings] = useState(currentSettings);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Settings</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h3 style={{ color: '#535353' }}>Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Name</Label>
              <Input
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Email</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5" style={{ color: '#FFD180' }} />
            <h3 style={{ color: '#535353' }}>Notification Preferences</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>New Submissions</span>
              <input
                type="checkbox"
                checked={settings.notifications.newSubmissions}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, newSubmissions: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>Admin Messages</span>
              <input
                type="checkbox"
                checked={settings.notifications.adminMessages}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, adminMessages: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>System Alerts</span>
              <input
                type="checkbox"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, systemAlerts: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5" style={{ color: '#FF8FA3' }} />
            <h3 style={{ color: '#535353' }}>Security</h3>
          </div>

          <Button variant="outline" className="w-full bg-white/50 border-white/50">
            Change Password
          </Button>
        </div>

        <Button onClick={() => onSave(settings)} className="w-full"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

