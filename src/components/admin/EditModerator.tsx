import { User, Mail, Shield, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface EditModeratorProps {
  moderator: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: {
      canVerifyAgencies: boolean;
      canVerifyCaregivers: boolean;
      canCreatePackages: boolean;
      canManageDisputes: boolean;
    };
  };
  onSave: (moderator: any) => void;
  onDeactivate: () => void;
}

export function EditModerator({ moderator, onSave, onDeactivate }: EditModeratorProps) {
  const [editedModerator, setEditedModerator] = useState(moderator);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Edit Moderator</h1>
          <p style={{ color: '#848484' }}>Moderator ID: {moderator.id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Name</Label>
              <Input
                value={editedModerator.name}
                onChange={(e) => setEditedModerator({ ...editedModerator, name: e.target.value })}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Email</Label>
              <Input
                type="email"
                value={editedModerator.email}
                onChange={(e) => setEditedModerator({ ...editedModerator, email: e.target.value })}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Role</Label>
              <Input
                value={editedModerator.role}
                onChange={(e) => setEditedModerator({ ...editedModerator, role: e.target.value })}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h3 style={{ color: '#535353' }}>Permissions</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>Can Verify Agencies</span>
              <input
                type="checkbox"
                checked={editedModerator.permissions.canVerifyAgencies}
                onChange={(e) => setEditedModerator({
                  ...editedModerator,
                  permissions: { ...editedModerator.permissions, canVerifyAgencies: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>Can Verify Caregivers</span>
              <input
                type="checkbox"
                checked={editedModerator.permissions.canVerifyCaregivers}
                onChange={(e) => setEditedModerator({
                  ...editedModerator,
                  permissions: { ...editedModerator.permissions, canVerifyCaregivers: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>Can Create Packages</span>
              <input
                type="checkbox"
                checked={editedModerator.permissions.canCreatePackages}
                onChange={(e) => setEditedModerator({
                  ...editedModerator,
                  permissions: { ...editedModerator.permissions, canCreatePackages: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
              style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span style={{ color: '#535353' }}>Can Manage Disputes</span>
              <input
                type="checkbox"
                checked={editedModerator.permissions.canManageDisputes}
                onChange={(e) => setEditedModerator({
                  ...editedModerator,
                  permissions: { ...editedModerator.permissions, canManageDisputes: e.target.checked }
                })}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onDeactivate} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Deactivate Moderator
          </Button>
          <Button onClick={() => onSave(editedModerator)} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

