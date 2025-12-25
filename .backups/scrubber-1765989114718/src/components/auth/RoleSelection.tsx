import { Users, Building2, Heart, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
  onBack: () => void;
}

const roles = [
  {
    id: "guardian",
    icon: Users,
    title: "Guardian / Family Member",
    description: "Find care for your loved ones",
    color: "bg-blue-500",
  },
  {
    id: "agency",
    icon: Building2,
    title: "Caregiving Agency",
    description: "List your services and manage caregivers",
    color: "bg-purple-500",
  },
  {
    id: "caregiver",
    icon: Heart,
    title: "Caregiver",
    description: "Find caregiving opportunities",
    color: "bg-pink-500",
  },
];

export function RoleSelection({ onSelectRole, onBack }: RoleSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header with Back Button */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
        
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 mx-auto"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Choose Your Role</h1>
          <p style={{ color: '#848484' }}>
            Select how you'll use CareNet
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="w-full max-w-2xl mx-auto space-y-4 flex-1">
        {roles.map((role) => (
          <div
            key={role.id}
            className="finance-card p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => onSelectRole(role.id)}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div 
                className="rounded-[14px] p-3 shrink-0"
                style={{
                  background: role.id === 'guardian' 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #80E0FF 0%, #2F5DFD 100%)'
                    : role.id === 'agency'
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #9B9CF8 0%, #8082ED 100%)'
                    : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
                  boxShadow: role.id === 'guardian'
                    ? '0px 4px 18px rgba(47, 93, 253, 0.3)'
                    : role.id === 'agency'
                    ? '0px 4px 18px rgba(128, 130, 237, 0.3)'
                    : '0px 4px 18px rgba(240, 161, 180, 0.4)'
                }}
              >
                <role.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-1" style={{ color: '#535353' }}>{role.title}</h3>
                <p className="text-sm" style={{ color: '#848484' }}>
                  {role.description}
                </p>
              </div>

              {/* Arrow */}
              <div style={{ color: '#848484' }}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="w-full max-w-2xl mx-auto mt-8 finance-card p-5">
        <p className="text-sm text-center" style={{ color: '#848484' }}>
          New registration will guide you through role-specific setup including document verification and profile creation
        </p>
      </div>
    </div>
  );
}