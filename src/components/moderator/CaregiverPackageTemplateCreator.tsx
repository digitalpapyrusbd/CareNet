import { Package, Save, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useState } from "react";

interface CaregiverPackageTemplateCreatorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
}

export function CaregiverPackageTemplateCreator({ onSave, onCancel }: CaregiverPackageTemplateCreatorProps) {
  const [templateName, setTemplateName] = useState("");
  const [tier, setTier] = useState("");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState({ monthly: "", annual: "" });
  const [features, setFeatures] = useState<string[]>([""]);
  const [jobLimit, setJobLimit] = useState("");

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Create Caregiver Package Template</h1>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Template Name *</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Professional Caregiver Plan"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Tier *</Label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="">Select tier</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this subscription plan..."
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: '#535353' }}>Monthly Price (৳)</Label>
                <Input
                  type="number"
                  value={pricing.monthly}
                  onChange={(e) => setPricing({ ...pricing, monthly: e.target.value })}
                  placeholder="500"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
              <div>
                <Label style={{ color: '#535353' }}>Annual Price (৳)</Label>
                <Input
                  type="number"
                  value={pricing.annual}
                  onChange={(e) => setPricing({ ...pricing, annual: e.target.value })}
                  placeholder="5000"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Monthly Job Limit</Label>
              <Input
                type="number"
                value={jobLimit}
                onChange={(e) => setJobLimit(e.target.value)}
                placeholder="10 (leave empty for unlimited)"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label style={{ color: '#535353' }}>Features Included</Label>
                <Button onClick={addFeature} size="sm" variant="outline" className="bg-white/50 border-white/50">
                  <Plus className="w-4 h-4 mr-1" />Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g., Priority job matching"
                      className="bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                    {features.length > 1 && (
                      <Button onClick={() => removeFeature(index)} size="sm" variant="outline" className="bg-white/50 border-white/50">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button
            onClick={() => onSave({
              templateName,
              tier,
              description,
              pricing,
              features: features.filter(f => f.trim()),
              jobLimit: jobLimit || null
            })}
            disabled={!templateName || !tier}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white',
              opacity: (!templateName || !tier) ? 0.5 : 1
            }}
          >
            <Save className="w-4 h-4 mr-2" />Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}

