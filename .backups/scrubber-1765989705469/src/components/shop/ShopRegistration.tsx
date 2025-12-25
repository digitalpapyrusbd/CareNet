import { Store, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface ShopRegistrationProps {
  onSubmit: (data: any) => void;
}

export function ShopRegistration({ onSubmit }: ShopRegistrationProps) {
  const { t } = useTranslationContext();
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    tradeLicense: "",
    address: "",
    area: "",
    productCategories: [] as string[]
  });

  const categories = ["Medical Equipment", "Mobility Aids", "Personal Care", "Home Care", "Nutrition", "Other"];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <Store className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>{t('shopregistration.heading.shopregistration')}</h2>
          <p className="text-sm" style={{ color: '#848484' }}>{t('shopregistration.text.joincarenetmarketpla')}</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>Shop Name *</Label>
            <Input
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder={t('shopregistration.placeholder.entershopname')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Owner Name *</Label>
            <Input
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder={t('shopregistration.placeholder.fullname')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Phone Number *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('shopregistration.placeholder.01xxxxxxxxx')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Email Address *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('shopregistration.placeholder.shopexamplecom')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Trade License Number *</Label>
            <Input
              value={formData.tradeLicense}
              onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
              placeholder={t('shopregistration.placeholder.entertradelicensenum')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Shop Address *</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('shopregistration.placeholder.fulladdress')}
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Product Categories *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (formData.productCategories.includes(cat)) {
                      setFormData({
                        ...formData,
                        productCategories: formData.productCategories.filter(c => c !== cat)
                      });
                    } else {
                      setFormData({
                        ...formData,
                        productCategories: [...formData.productCategories, cat]
                      });
                    }
                  }}
                  className="px-3 py-1 rounded-full text-sm transition-all"
                  style={{
                    background: formData.productCategories.includes(cat)
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: formData.productCategories.includes(cat) ? 'white' : '#535353'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => onSubmit(formData)}
          disabled={!formData.shopName || !formData.ownerName || !formData.phone || !formData.email || !formData.tradeLicense || !formData.address || formData.productCategories.length === 0}
          className="w-full mt-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
            color: 'white',
            opacity: (!formData.shopName || !formData.ownerName || !formData.phone || !formData.email || !formData.tradeLicense || !formData.address || formData.productCategories.length === 0) ? 0.5 : 1
          }}
        >
          Submit Registration <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

