'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { DollarSign, Clock, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/api-client';

export default function SystemSettingsPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [settings, setSettings] = useState({
    platformCommission: 10,
    paymentGracePeriod: 7,
    verificationTimeout: 48,
    minCaregiverRating: 4.0,
    maxDisputeDays: 14
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/admin/system-settings', {
        method: 'GET',
      });
      if (response.settings) {
        setSettings(response.settings);
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await apiCall('/admin/system-settings', {
        method: 'PUT',
        body: settings,
      });
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14" style={{ background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)' }}>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>{t('page.heading.systemsettings')}</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('page.heading.financialsettings')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.platformcommissionan')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Platform Commission (%)</Label>
              <Input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => setSettings(prev => ({ ...prev, platformCommission: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                min="0"
                max="100"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Percentage taken from each transaction
              </p>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Payment Grace Period (days)</Label>
              <Input
                type="number"
                value={settings.paymentGracePeriod}
                onChange={(e) => setSettings(prev => ({ ...prev, paymentGracePeriod: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
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
              <h3 style={{ color: '#535353' }}>{t('page.heading.timebasedsettings')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.timeoutsanddeadlines')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Verification Timeout (hours)</Label>
              <Input
                type="number"
                value={settings.verificationTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, verificationTimeout: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                min="1"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                Maximum time for moderator to review verifications
              </p>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>{t('page.text.maxdisputeresolution')}</Label>
              <Input
                type="number"
                value={settings.maxDisputeDays}
                onChange={(e) => setSettings(prev => ({ ...prev, maxDisputeDays: Number(e.target.value) }))}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
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
              <h3 style={{ color: '#535353' }}>{t('page.heading.qualitystandards')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.minimumrequirements')}</p>
            </div>
          </div>

          <div>
            <Label style={{ color: '#535353' }}>{t('page.text.minimumcaregiverrati')}</Label>
            <Input
              type="number"
              value={settings.minCaregiverRating}
              onChange={(e) => setSettings(prev => ({ ...prev, minCaregiverRating: Number(e.target.value) }))}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
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
            ⚠️ <strong>{t('page.text.warning')}</strong> Changes to these settings affect all users immediately. 
            Please review carefully before saving.
          </p>
        </div>

        {error && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FF8FA3' }}>
            <p className="text-sm" style={{ color: '#FF8FA3' }}>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #7CE577' }}>
            <p className="text-sm" style={{ color: '#7CE577' }}>
              ✓ {success}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 bg-white/50 border-white/50" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={saving || loading}
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
