import { Package, Plus, Minus, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AgencySubscriptionPackageCreatorAdminProps {
  onSave: (packageData: any) => void;
  onPreview: (packageData: any) => void;
}

export function AgencySubscriptionPackageCreatorAdmin({ onSave, onPreview }: AgencySubscriptionPackageCreatorAdminProps) {
  const { t } = useTranslationContext();
  const [packageData, setPackageData] = useState({
    name: "",
    description: "",
    monthlyFee: "",
    caregiverLimit: "",
    features: [""] as string[],
    commissionRate: "",
    isActive: true
  });

  const addFeature = () => {
    setPackageData({ ...packageData, features: [...packageData.features, ""] });
  };

  const removeFeature = (index: number) => {
    setPackageData({
      ...packageData,
      features: packageData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...packageData.features];
    newFeatures[index] = value;
    setPackageData({ ...packageData, features: newFeatures });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>{t('agencysubscriptionpackagecreatoradmin.heading.createagencysubscrip')}</h1>
          <p style={{ color: '#848484' }}>{t('agencysubscriptionpackagecreatoradmin.text.admindefineanewsubsc')}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('agencysubscriptionpackagecreatoradmin.heading.basicinformation')}</h3>
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Package Name *</Label>
              <Input
                value={packageData.name}
                onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
                placeholder={t('agencysubscriptionpackagecreatoradmin.placeholder.egprofessionalenterp')}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Description *</Label>
              <Textarea
                value={packageData.description}
                onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
                placeholder={t('agencysubscriptionpackagecreatoradmin.placeholder.describethispackage')}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: '#535353' }}>Monthly Fee (৳) *</Label>
                <Input
                  type="number"
                  value={packageData.monthlyFee}
                  onChange={(e) => setPackageData({ ...packageData, monthlyFee: e.target.value })}
                  placeholder="5000"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Caregiver Limit *</Label>
                <Input
                  type="number"
                  value={packageData.caregiverLimit}
                  onChange={(e) => setPackageData({ ...packageData, caregiverLimit: e.target.value })}
                  placeholder="10"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Commission Rate (%) *</Label>
              <Input
                type="number"
                value={packageData.commissionRate}
                onChange={(e) => setPackageData({ ...packageData, commissionRate: e.target.value })}
                placeholder="15"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <input
                type="checkbox"
                checked={packageData.isActive}
                onChange={(e) => setPackageData({ ...packageData, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              <span style={{ color: '#535353' }}>Active (visible to agencies)</span>
            </label>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>{t('agencysubscriptionpackagecreatoradmin.heading.features')}</h3>
            <Button onClick={addFeature} size="sm" style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}>
              <Plus className="w-4 h-4 mr-2" />Add Feature
            </Button>
          </div>

          <div className="space-y-3">
            {packageData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={t('agencysubscriptionpackagecreatoradmin.placeholder.enterfeaturedescript')}
                  className="flex-1 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
                <Button
                  onClick={() => removeFeature(index)}
                  variant="outline"
                  size="sm"
                  className="bg-white/50 border-white/50"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => onPreview(packageData)} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Preview
          </Button>
          <Button
            onClick={() => onSave(packageData)}
            disabled={!packageData.name || !packageData.monthlyFee || !packageData.caregiverLimit || !packageData.commissionRate}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: (!packageData.name || !packageData.monthlyFee || !packageData.caregiverLimit || !packageData.commissionRate) ? 0.5 : 1
            }}
          >
            <Save className="w-4 h-4 mr-2" />Save Package
          </Button>
        </div>
      </div>
    </div>
  );
}

