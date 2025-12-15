import { Package, Save, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useState } from "react";

interface AgencyPackageTemplateCreatorProps {
  onSave: (template: any) => void;
  onCancel: () => void;
}

export function AgencyPackageTemplateCreator({ onSave, onCancel }: AgencyPackageTemplateCreatorProps) {
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pricingGuidelines, setPricingGuidelines] = useState({ min: "", max: "" });
  const [servicesIncluded, setServicesIncluded] = useState<string[]>([""]);
  const [duration, setDuration] = useState("");

  const addService = () => {
    setServicesIncluded([...servicesIncluded, ""]);
  };

  const removeService = (index: number) => {
    setServicesIncluded(servicesIncluded.filter((_, i) => i !== index));
  };

  const updateService = (index: number, value: string) => {
    const updated = [...servicesIncluded];
    updated[index] = value;
    setServicesIncluded(updated);
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Create Agency Package Template</h1>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Template Name *</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Elderly Care Basic Package"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Category *</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg border"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#535353'
                }}
              >
                <option value="">Select category</option>
                <option value="elderly_care">Elderly Care</option>
                <option value="child_care">Child Care</option>
                <option value="disability_care">Disability Care</option>
                <option value="post_surgery">Post-Surgery Care</option>
                <option value="chronic_illness">Chronic Illness Management</option>
              </select>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this package template..."
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: '#535353' }}>Min Price (৳)</Label>
                <Input
                  type="number"
                  value={pricingGuidelines.min}
                  onChange={(e) => setPricingGuidelines({ ...pricingGuidelines, min: e.target.value })}
                  placeholder="5000"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
              <div>
                <Label style={{ color: '#535353' }}>Max Price (৳)</Label>
                <Input
                  type="number"
                  value={pricingGuidelines.max}
                  onChange={(e) => setPricingGuidelines({ ...pricingGuidelines, max: e.target.value })}
                  placeholder="15000"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Duration (days)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label style={{ color: '#535353' }}>Services Included</Label>
                <Button onClick={addService} size="sm" variant="outline" className="bg-white/50 border-white/50">
                  <Plus className="w-4 h-4 mr-1" />Add Service
                </Button>
              </div>
              <div className="space-y-2">
                {servicesIncluded.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder="e.g., Medication management"
                      className="bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                    {servicesIncluded.length > 1 && (
                      <Button onClick={() => removeService(index)} size="sm" variant="outline" className="bg-white/50 border-white/50">
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
              category,
              description,
              pricingGuidelines,
              servicesIncluded: servicesIncluded.filter(s => s.trim()),
              duration
            })}
            disabled={!templateName || !category}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white',
              opacity: (!templateName || !category) ? 0.5 : 1
            }}
          >
            <Save className="w-4 h-4 mr-2" />Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}

