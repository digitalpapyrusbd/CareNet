import { Edit, Save, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface AgencyPackageTemplateEditorProps {
  template: {
    id: string;
    name: string;
    description: string;
    monthlyFee: number;
    caregiverLimit: number;
    features: string[];
    commissionRate: number;
  };
  onSave: (template: any) => void;
  onDelete: () => void;
}

export function AgencyPackageTemplateEditor({ template, onSave, onDelete }: AgencyPackageTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState(template);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedTemplate);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ color: '#535353' }}>Edit Package Template</h1>
            <p style={{ color: '#848484' }}>Template ID: {template.id}</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="bg-white/50 border-white/50"
          >
            <Edit className="w-4 h-4 mr-2" />{isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Package Name</Label>
              <Input
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                disabled={!isEditing}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Description</Label>
              <Textarea
                value={editedTemplate.description}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, description: e.target.value })}
                disabled={!isEditing}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: '#535353' }}>Monthly Fee (৳)</Label>
                <Input
                  type="number"
                  value={editedTemplate.monthlyFee}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, monthlyFee: Number(e.target.value) })}
                  disabled={!isEditing}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Caregiver Limit</Label>
                <Input
                  type="number"
                  value={editedTemplate.caregiverLimit}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, caregiverLimit: Number(e.target.value) })}
                  disabled={!isEditing}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Commission Rate (%)</Label>
              <Input
                type="number"
                value={editedTemplate.commissionRate}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, commissionRate: Number(e.target.value) })}
                disabled={!isEditing}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Features</h3>
          <div className="space-y-2">
            {editedTemplate.features.map((feature, index) => (
              <div key={index} className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <p style={{ color: '#535353' }}>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <Button onClick={onDelete} variant="outline" className="flex-1 bg-white/50 border-white/50">
              <Trash2 className="w-4 h-4 mr-2" />Delete Template
            </Button>
            <Button onClick={handleSave} className="flex-1"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
              <Save className="w-4 h-4 mr-2" />Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

