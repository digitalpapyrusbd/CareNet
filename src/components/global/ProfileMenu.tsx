import { User, Settings, HelpCircle, LogOut, Users, Briefcase, Package, ShoppingBag, DollarSign, FileText, Star, ChevronRight } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface ProfileMenuProps {
  userName: string;
  userRole: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

const roleMenus = {
  guardian: [
    { icon: Users, label: "My Patients", page: "guardian-patients" },
    { icon: Briefcase, label: "Active Jobs", page: "guardian-jobs" },
    { icon: Package, label: "Browse Packages", page: "packages" },
    { icon: ShoppingBag, label: "Shop", page: "guardian-shop" },
    { icon: DollarSign, label: "Payment History", page: "guardian-payments" },
  ],
  caregiver: [
    { icon: Briefcase, label: "My Jobs", page: "caregiver-jobs" },
    { icon: DollarSign, label: "Earnings", page: "caregiver-earnings" },
    { icon: FileText, label: "Documents", page: "caregiver-documents" },
    { icon: Star, label: "My Reviews", page: "caregiver-reviews" },
  ],
};

export function ProfileMenu({ userName, userRole, onNavigate, onLogout }: ProfileMenuProps) {
  const menuItems = roleMenus[userRole as keyof typeof roleMenus] || roleMenus.guardian;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header - Modern Card Style */}
      <div className="px-6 pt-6 mb-6">
        <Card className="modern-card p-6 border-0 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20 btn-neumorphic-primary">
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {userName.charAt(0)}
                </div>
              </Avatar>
              <div className="flex-1">
                <h2 className="mb-1">{userName}</h2>
                <Badge className="capitalize btn-neumorphic text-xs px-3 py-1">
                  {userRole}
                </Badge>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl number-display mb-1">4.9</div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center border-l border-r border-border/50">
                <div className="text-2xl number-display mb-1">
                  {userRole === "guardian" ? "2" : "18"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userRole === "guardian" ? "Patients" : "Jobs"}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl number-display mb-1">
                  {userRole === "guardian" ? "৳45K" : "৳12.5K"}
                </div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Menu Items */}
      <div className="px-6 mb-6">
        <h3 className="mb-4">Quick Access</h3>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.page}
                className="modern-card p-0 border-0 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => onNavigate(item.page)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 btn-icon-neumorphic flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.label}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Settings & Support */}
      <div className="px-6 space-y-2">
        <h3 className="mb-4">Settings & Support</h3>
        
        {/* Settings */}
        <Card
          className="modern-card p-0 border-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={() => onNavigate("settings")}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 btn-icon-neumorphic flex-shrink-0">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Settings</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Help */}
        <Card
          className="modern-card p-0 border-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={() => onNavigate("help")}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 btn-icon-neumorphic flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Help & Support</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Logout */}
        <Card
          className="modern-card p-0 border-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={onLogout}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 btn-icon-neumorphic flex-shrink-0">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-destructive">Logout</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
