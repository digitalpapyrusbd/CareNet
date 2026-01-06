import { Users, Building2, Heart, Stethoscope, Shield, UserCog, Store, Briefcase, Menu, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const roles = [
  {
    id: "guardian",
    icon: Users,
    title: "Guardian / Family Member",
    description: "Find care for your loved ones",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #80E0FF 0%, #2F5DFD 100%)',
    shadow: '0px 4px 18px rgba(47, 93, 253, 0.3)',
    route: 'guardian-dashboard'
  },
  {
    id: "agency",
    icon: Building2,
    title: "Agency Admin",
    description: "Manage your caregiving agency",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #9B9CF8 0%, #8082ED 100%)',
    shadow: '0px 4px 18px rgba(128, 130, 237, 0.3)',
    route: 'agency-dashboard'
  },
  {
    id: "agency-manager",
    icon: Briefcase,
    title: "Agency Manager",
    description: "QA and operations management",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
    shadow: '0px 4px 18px rgba(168, 224, 99, 0.3)',
    route: 'agency-manager-dashboard'
  },
  {
    id: "caregiver",
    icon: Heart,
    title: "Caregiver",
    description: "Find caregiving opportunities",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
    shadow: '0px 4px 18px rgba(240, 161, 180, 0.4)',
    route: 'caregiver-dashboard'
  },
  {
    id: "patient",
    icon: Stethoscope,
    title: "Patient",
    description: "Access your care information",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD54F 0%, #FFA726 100%)',
    shadow: '0px 4px 18px rgba(255, 167, 38, 0.3)',
    route: 'patient-dashboard'
  },
  {
    id: "moderator",
    icon: Shield,
    title: "Platform Moderator",
    description: "Verify and moderate platform content",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #64B5F6 0%, #42A5F5 100%)',
    shadow: '0px 4px 18px rgba(66, 165, 245, 0.3)',
    route: 'moderator-login'
  },
  {
    id: "admin",
    icon: UserCog,
    title: "Platform Admin",
    description: "System administration and oversight",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #BA68C8 0%, #9C27B0 100%)',
    shadow: '0px 4px 18px rgba(156, 39, 176, 0.3)',
    route: 'admin-login'
  },
  {
    id: "shop",
    icon: Store,
    title: "Shop Admin",
    description: "Manage medical equipment shop",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #81C784 0%, #66BB6A 100%)',
    shadow: '0px 4px 18px rgba(102, 187, 106, 0.3)',
    route: 'shop-dashboard'
  },
  {
    id: "shop-manager",
    icon: Menu,
    title: "Shop Manager",
    description: "Inventory and order management",
    gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #4DD0E1 0%, #26C6DA 100%)',
    shadow: '0px 4px 18px rgba(38, 198, 218, 0.3)',
    route: 'shop-manager-dashboard'
  },
];

export function RoleSelection({ onSelectRole, onBack, onNavigate }: RoleSelectionProps) {
  const handleSelectRole = (role: typeof roles[0]) => {
    // Navigate to the designated page for each role
    if (onNavigate) {
      onNavigate(role.route);
    } else {
      // Fallback: use the old callback
      onSelectRole(role.id);
    }
  };

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
            Select how you'll use CareNet Platform
          </p>
          <p className="text-sm mt-2" style={{ color: '#848484' }}>
            {roles.length} user roles available
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {roles.map((role) => (
          <div
            key={role.id}
            className="finance-card p-5 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => handleSelectRole(role)}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div 
                className="rounded-[14px] p-3 shrink-0"
                style={{
                  background: role.gradient,
                  boxShadow: role.shadow
                }}
              >
                <role.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-1 text-base" style={{ color: '#535353' }}>{role.title}</h3>
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
      <div className="w-full max-w-4xl mx-auto mt-8 finance-card p-5">
        <p className="text-sm text-center" style={{ color: '#848484' }}>
          💡 Auto-login is enabled for testing. Click any role to instantly access that dashboard.
        </p>
      </div>
    </div>
  );
}
