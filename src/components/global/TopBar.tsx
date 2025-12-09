import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Logo } from "./Logo";
import { ThemeSelector, Theme } from "./ThemeSelector";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  onLogout: () => void;
  notificationCount?: number;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function TopBar({ title, onBack, onHome, onLogout, notificationCount = 3, currentTheme, onThemeChange }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-card border-b backdrop-blur-heavy">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Logo or Back + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {onBack ? (
              <>
                <button
                  onClick={onBack}
                  className="btn-icon-neumorphic flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {title && <h2 className="truncate">{title}</h2>}
              </>
            ) : (
              <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Logo size="sm" />
              </button>
            )}
          </div>

          {/* Right: Theme Selector and Notifications */}
          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <ThemeSelector 
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
            />

            {/* Notification Bell */}
            <button className="btn-icon-neumorphic relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs rounded-full bg-red-500 text-white border-2 border-background"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
