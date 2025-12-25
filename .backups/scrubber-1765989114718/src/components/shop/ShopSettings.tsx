import { Store, MapPin, Clock, CreditCard, Bell, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface ShopSettingsProps {
  currentSettings: {
    shopName: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    operatingHours: {
      open: string;
      close: string;
    };
    deliveryFee: number;
    minOrderAmount: number;
    paymentMethods: string[];
    notifications: boolean;
  };
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export function ShopSettings({ currentSettings, onSave, onCancel }: ShopSettingsProps) {
  const [settings, setSettings] = useState(currentSettings);

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Shop Settings</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Shop Information</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Basic shop details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Shop Name *</Label>
              <Input
                value={settings.shopName}
                onChange={(e) => setSettings(prev => ({ ...prev, shopName: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
            </div>

            <div>
              <Label>Address *</Label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Operating Hours</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Shop opening and closing times</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Opening Time</Label>
              <Input
                type="time"
                value={settings.operatingHours.open}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, open: e.target.value }
                }))}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>
            <div>
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={settings.operatingHours.close}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  operatingHours: { ...prev.operatingHours, close: e.target.value }
                }))}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Pricing & Delivery</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Order and delivery settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Delivery Fee (৳)</Label>
                <Input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings(prev => ({ ...prev, deliveryFee: Number(e.target.value) }))}
                  className="mt-2 bg-white/50 border-white/50"
                  min="0"
                />
              </div>
              <div>
                <Label>Min Order Amount (৳)</Label>
                <Input
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                  className="mt-2 bg-white/50 border-white/50"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label>Accepted Payment Methods</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.paymentMethods.map((method, index) => (
                  <span key={index} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Notifications</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Manage notification preferences</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <div>
              <p style={{ color: '#535353' }}>Order Notifications</p>
              <p className="text-sm" style={{ color: '#848484' }}>Receive alerts for new orders</p>
            </div>
            <button
              onClick={toggleNotifications}
              className="w-12 h-6 rounded-full relative"
              style={{ background: settings.notifications ? '#7CE577' : '#E0E0E0' }}>
              <span className="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all"
                style={{ left: settings.notifications ? '26px' : '2px' }} />
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

