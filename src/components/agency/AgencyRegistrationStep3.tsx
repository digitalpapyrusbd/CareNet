import { Building, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface AgencyRegistrationStep3Props {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export function AgencyRegistrationStep3({ onContinue, onBack }: AgencyRegistrationStep3Props) {
  const [formData, setFormData] = useState({
    agencyName: "",
    tradeLicenseNumber: "",
    tin: "",
    contactPerson: "",
    contactPhone: "",
    address: "",
    area: "",
    zone: ""
  });

  const areas = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];
  const zones = ["North", "South", "East", "West", "Central"];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>Company Information</h2>
          <p className="text-sm" style={{ color: '#848484' }}>Step 3 of 5</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>Company Name *</Label>
            <Input
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              placeholder="Enter company name"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Trade License Number *</Label>
            <Input
              value={formData.tradeLicenseNumber}
              onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
              placeholder="Enter trade license number"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>TIN (Optional)</Label>
            <Input
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              placeholder="Tax Identification Number"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Contact Person *</Label>
            <Input
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Full name"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Contact Phone *</Label>
            <Input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Company Address *</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label style={{ color: '#535353' }}>Area *</Label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="">Select area</option>
                {areas.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Zone *</Label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="">Select zone</option>
                {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Back
          </Button>
          <Button
            onClick={() => onContinue(formData)}
            disabled={!formData.agencyName || !formData.tradeLicenseNumber || !formData.contactPerson || !formData.contactPhone || !formData.address || !formData.area || !formData.zone}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white',
              opacity: (!formData.agencyName || !formData.tradeLicenseNumber || !formData.contactPerson || !formData.contactPhone || !formData.address || !formData.area || !formData.zone) ? 0.5 : 1
            }}
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

