import { UserPlus, Search, Users } from "lucide-react";
import { Button } from "../ui/button";

interface AddCaregiverOptionsProps {
  onInviteNew: () => void;
  onBrowsePool: () => void;
  onViewMyTeam: () => void;
}

export function AddCaregiverOptions({ onInviteNew, onBrowsePool, onViewMyTeam }: AddCaregiverOptionsProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-2 text-center" style={{ color: '#535353' }}>Add Caregiver</h1>
        <p className="mb-8 text-center" style={{ color: '#848484' }}>
          Choose how you'd like to add a caregiver to your team
        </p>

        <div className="space-y-4">
          <div className="finance-card p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onInviteNew}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>Invite New Caregiver</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  Send an invitation to someone who isn't on the platform yet. They'll need to complete registration and verification.
                </p>
                <Button size="sm" style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  color: 'white'
                }}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>

          <div className="finance-card p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onBrowsePool}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>Browse Verified Pool</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  Search through verified caregivers who are available and looking for opportunities. Send them offers directly.
                </p>
                <Button size="sm" style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: 'white'
                }}>
                  Browse Pool
                </Button>
              </div>
            </div>
          </div>

          <div className="finance-card p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onViewMyTeam}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>View My Team</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  See all caregivers currently associated with your agency, including pending invitations.
                </p>
                <Button size="sm" style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
                  color: 'white'
                }}>
                  View Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

