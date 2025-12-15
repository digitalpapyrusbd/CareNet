import { Palette } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type Theme = 
  | "light-default"
  | "light-ocean"
  | "light-sunset"
  | "light-forest"
  | "light-lavender"
  | "dark-default"
  | "dark-midnight"
  | "dark-cyberpunk"
  | "dark-forest"
  | "dark-royal";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes = {
  light: [
    { id: "light-default" as Theme, name: "Sky Blue", gradient: "from-blue-400 to-blue-600" },
    { id: "light-ocean" as Theme, name: "Ocean Breeze", gradient: "from-cyan-400 to-teal-600" },
    { id: "light-sunset" as Theme, name: "Sunset Glow", gradient: "from-orange-400 to-pink-600" },
    { id: "light-forest" as Theme, name: "Forest Fresh", gradient: "from-green-400 to-emerald-600" },
    { id: "light-lavender" as Theme, name: "Lavender Dream", gradient: "from-purple-400 to-pink-600" },
  ],
  dark: [
    { id: "dark-default" as Theme, name: "Midnight", gradient: "from-slate-700 to-slate-900" },
    { id: "dark-midnight" as Theme, name: "Deep Ocean", gradient: "from-blue-900 to-indigo-950" },
    { id: "dark-cyberpunk" as Theme, name: "Cyberpunk", gradient: "from-fuchsia-900 to-purple-950" },
    { id: "dark-forest" as Theme, name: "Dark Forest", gradient: "from-green-900 to-emerald-950" },
    { id: "dark-royal" as Theme, name: "Royal Night", gradient: "from-violet-900 to-purple-950" },
  ],
};

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn-icon-neumorphic">
          <Palette className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Light Themes</DropdownMenuLabel>
        <div className="grid grid-cols-1 gap-1 p-2">
          {themes.light.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} shadow-md`} />
                <span className="flex-1">{theme.name}</span>
                {currentTheme === theme.id && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Dark Themes</DropdownMenuLabel>
        <div className="grid grid-cols-1 gap-1 p-2">
          {themes.dark.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} shadow-md border border-white/10`} />
                <span className="flex-1">{theme.name}</span>
                {currentTheme === theme.id && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
