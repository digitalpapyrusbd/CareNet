import { Building, MapPin, CreditCard, Bell, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AgencySettingsProps {
  currentSettings: {
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    serviceAreas: string[];
    paymentMethod: string;
    accountNumber: string;
    notifications: boolean;
  };
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export function AgencySettings({ currentSettings, onSave, onCancel }: AgencySettingsProps) {
  const { t } = useTranslationContext();
  const [settings, setSettings] = useState(currentSettings);

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>{t('agencysettings.heading.agencysettings')}</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('agencysettings.heading.companyinformation')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('agencysettings.text.updateyouragencydeta')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Company Name *</Label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Contact Person *</Label>
                <Input
                  value={settings.contactPerson}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-2 bg-white/50 border-white/50"
                />
              </div>
            </div>

            <div>
              <Label>{t('agencysettings.text.email')}</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
              />
            </div>

            <div>
              <Label>Address *</Label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                className="mt-2 bg-white/50 border-white/50"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('agencysettings.heading.serviceareas')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('agencysettings.text.areaswhereyouprovide')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.serviceAreas.map((area, index) => (
              <span key={index} className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {area}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 bg-white/50 border-white/50">
            Edit Service Areas
          </Button>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('agencysettings.heading.paymentmethod')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('agencysettings.text.howyoureceivepayment')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>{t('agencysettings.text.paymentmethod1')}</Label>
              <Input
                value={settings.paymentMethod}
                disabled
                className="mt-2 bg-white/30 border-white/50"
              />
            </div>
            <div>
              <Label>{t('agencysettings.text.accountnumber')}</Label>
              <Input
                value={settings.accountNumber}
                disabled
                className="mt-2 bg-white/30 border-white/50"
              />
            </div>
            <p className="text-xs" style={{ color: '#848484' }}>
              Contact support to update payment details
            </p>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('agencysettings.heading.notifications')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('agencysettings.text.managenotificationpr')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <div>
              <p style={{ color: '#535353' }}>{t('agencysettings.text.pushnotifications')}</p>
              <p className="text-sm" style={{ color: '#848484' }}>{t('agencysettings.text.receivejobandbooking')}</p>
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

