import { Settings, DollarSign, Clock, Shield, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface SystemSettingsProps {
  currentSettings: {
    platformCommission: number;
    paymentGracePeriod: number;
    verificationTimeout: number;
    minCaregiverRating: number;
    maxDisputeDays: number;
  };
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export function SystemSettings({ currentSettings, onSave, onCancel }: SystemSettingsProps) {
  const { t } = useTranslationContext();
  const [settings, setSettings] = useState(currentSettings);

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>{t('systemsettings.heading.systemsettings')}</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('systemsettings.heading.financialsettings')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('systemsettings.text.platformcommissionan')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Platform Commission (%)</Label>
              <Input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => setSettings(prev => ({ ...prev, platformCommission: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                min="0"
                max="100"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Percentage taken from each transaction
              </p>
            </div>

            <div>
              <Label>Payment Grace Period (days)</Label>
              <Input
                type="number"
                value={settings.paymentGracePeriod}
                onChange={(e) => setSettings(prev => ({ ...prev, paymentGracePeriod: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                min="1"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Days before account lockout for unpaid invoices
              </p>
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
              <h3 style={{ color: '#535353' }}>{t('systemsettings.heading.timebasedsettings')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('systemsettings.text.timeoutsanddeadlines')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Verification Timeout (hours)</Label>
              <Input
                type="number"
                value={settings.verificationTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, verificationTimeout: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                min="1"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Maximum time for moderator to review verifications
              </p>
            </div>

            <div>
              <Label>{t('systemsettings.text.maxdisputeresolution')}</Label>
              <Input
                type="number"
                value={settings.maxDisputeDays}
                onChange={(e) => setSettings(prev => ({ ...prev, maxDisputeDays: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                min="1"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Maximum days to resolve a dispute
              </p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('systemsettings.heading.qualitystandards')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('systemsettings.text.minimumrequirements')}</p>
            </div>
          </div>

          <div>
            <Label>{t('systemsettings.text.minimumcaregiverrati')}</Label>
            <Input
              type="number"
              value={settings.minCaregiverRating}
              onChange={(e) => setSettings(prev => ({ ...prev, minCaregiverRating: Number(e.target.value) }))}
              className="mt-2 bg-white/50 border-white/50"
              min="0"
              max="5"
              step="0.1"
            />
            <p className="text-xs mt-1" style={{ color: '#848484' }}>
              Minimum rating to remain active (out of 5)
            </p>
          </div>
        </div>

        <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FFD180' }}>
          <p className="text-sm" style={{ color: '#535353' }}>
            ⚠️ <strong>{t('systemsettings.text.warning')}</strong> Changes to these settings affect all users immediately. 
            Please review carefully before saving.
          </p>
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

