import { LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface NavItem {
  icon: LucideIcon;
  label: string;
  page: string;
  badge?: number;
  onClick?: () => void;
}

interface BottomNavProps {
  items: NavItem[];
  currentPage: string;
  onNavigate: (page: any) => void;
}

export function BottomNav({ items, currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      {/* Glass backdrop */}
      <div className="glass-card border-t backdrop-blur-heavy">
        <div className="flex items-center justify-around h-20 px-2 safe-area-bottom">
          {items.map((item) => {
            const isActive = currentPage === item.page;
            const Icon = item.icon;

            return (
              <button
                key={item.page}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    onNavigate(item.page);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-all relative group ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {/* Active indicator removed for cleaner Tesla aesthetic */}
                
                <div className="relative z-10 mt-1">
                  <div className={`relative transition-all duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}>
                    {/* Icon container - Tesla Neumorphic */}
                    <div className={`w-12 h-12 flex items-center justify-center transition-all ${
                      isActive 
                        ? "btn-neumorphic-primary rounded-[22px]" 
                        : "btn-icon-neumorphic"
                    }`}>
                      <Icon
                        className="w-5 h-5"
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    
                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs rounded-full shadow-lg border-2 border-background"
                      >
                        {item.badge > 9 ? "9+" : item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <span className={`text-xs mt-1.5 transition-all ${
                  isActive ? "font-semibold" : "font-medium"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
