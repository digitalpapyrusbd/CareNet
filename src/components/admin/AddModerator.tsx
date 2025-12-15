import { UserPlus, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface AddModeratorProps {
  onSendInvite: (data: any) => void;
  onCancel: () => void;
}

export function AddModerator({ onSendInvite, onCancel }: AddModeratorProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    permissionLevel: "standard"
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>Add New Moderator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>Full Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="moderator@carenet.bd"
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
              placeholder="01XXXXXXXXX"
              className="mt-2 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Permission Level *</Label>
            <select
              value={formData.permissionLevel}
              onChange={(e) => setFormData({ ...formData, permissionLevel: e.target.value })}
              className="w-full mt-2 p-3 rounded-lg border"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.5)',
                color: '#535353'
              }}
            >
              <option value="standard">Standard Moderator</option>
              <option value="senior">Senior Moderator</option>
              <option value="lead">Lead Moderator</option>
            </select>
          </div>

          <div className="p-3 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>
              An invitation email will be sent with login credentials and setup instructions.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button
            onClick={() => onSendInvite(formData)}
            disabled={!formData.name || !formData.email || !formData.phone}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white',
              opacity: (!formData.name || !formData.email || !formData.phone) ? 0.5 : 1
            }}
          >
            <Send className="w-4 h-4 mr-2" />Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}

