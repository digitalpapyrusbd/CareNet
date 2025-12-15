import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    );
  }

  const themes = [
    { 
      key: 'light', 
      name: 'Light', 
      icon: '☀️', 
      description: 'Light mode'
    },
    { 
      key: 'dark', 
      name: 'Dark', 
      icon: '🌙', 
      description: 'Dark mode'
    },
    { 
      key: 'system', 
      name: 'System', 
      icon: '🖥️', 
      description: 'Use system preference'
    },
  ];

  const currentTheme = themes.find(t => t.key === theme) || themes[0];

  return (
    <div className={`relative ${className}`}>
      {/* Simple Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        title={`Current theme: ${currentTheme.name}. Click to toggle.`}
      >
        <span className="text-xl">{currentTheme.icon}</span>
      </button>
    </div>
  );
};

// Enhanced version with dropdown for more control
export const ThemeSwitcherDropdown: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, changeTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    );
  }

  const themes = [
    { 
      key: 'light', 
      name: 'Light', 
      icon: '☀️', 
      description: 'Light mode with bright colors'
    },
    { 
      key: 'dark', 
      name: 'Dark', 
      icon: '🌙', 
      description: 'Dark mode with reduced eye strain'
    },
    { 
      key: 'system', 
      name: 'System', 
      icon: '🖥️', 
      description: 'Follow your device preference'
    },
  ];

  const currentTheme = themes.find(t => t.key === theme) || themes[0];

  const handleThemeChange = (themeKey: string) => {
    changeTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <span className="hidden sm:block">{currentTheme.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="py-1" role="listbox">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Theme Preference
              </div>
              
              {themes.map((themeOption) => (
                <button
                  key={themeOption.key}
                  type="button"
                  onClick={() => handleThemeChange(themeOption.key)}
                  className={`
                    w-full px-4 py-3 text-left flex items-center space-x-3
                    ${theme === themeOption.key
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                  role="option"
                  aria-selected={theme === themeOption.key}
                >
                  <span className="text-xl">{themeOption.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{themeOption.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {themeOption.description}
                    </p>
                  </div>
                  {theme === themeOption.key && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;