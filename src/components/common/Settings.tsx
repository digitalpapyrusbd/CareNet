import { User, Bell, Lock, Globe, CreditCard, Shield, Smartphone, Moon, Sun, Volume2, Eye } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", page: "profile-edit", badge: null },
        { icon: Shield, label: "Privacy & Security", page: "privacy", badge: null },
        { icon: Lock, label: "Change Password", page: "change-password", badge: null },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", page: "notification-settings", badge: "3 active" },
        { icon: Globe, label: "Language", page: "language", badge: "English" },
        { icon: Moon, label: "Appearance", page: "appearance", badge: "Dark" },
      ],
    },
    {
      title: "Payment & Billing",
      items: [
        { icon: CreditCard, label: "Payment Methods", page: "payment-methods", badge: null },
        { icon: CreditCard, label: "Billing History", page: "billing-history", badge: null },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: Smartphone, label: "Connected Devices", page: "devices", badge: "2 devices" },
        { icon: Eye, label: "Privacy Policy", page: "privacy-policy", badge: null },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Quick View */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full btn-neumorphic-primary flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">A</span>
            </div>
            <div className="flex-1">
              <h3 className="mb-1">Amina Khan</h3>
              <p className="text-sm text-muted-foreground">amina.khan@example.com</p>
              <Badge className="btn-neumorphic text-xs px-2 py-1 mt-2">
                Verified Account
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="px-6 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-sm text-muted-foreground uppercase tracking-wider">{section.title}</h3>
            
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className="modern-card p-0 border-0 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
                    onClick={() => onNavigate(item.page)}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 btn-icon-neumorphic flex-shrink-0">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                      </div>

                      {item.badge && (
                        <Badge className="btn-neumorphic text-xs px-2 py-1">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="px-6 mt-8 mb-6">
        <Card className="modern-card p-4 border-0 text-center">
          <p className="text-sm text-muted-foreground mb-1">CareNet Version</p>
          <p className="font-medium">1.0.0 (Build 100)</p>
        </Card>
      </div>
    </div>
  );
}
