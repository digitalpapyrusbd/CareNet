'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PWAContextType {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  showInstallPrompt: boolean;
  deferredPrompt: any;
  handleInstall: () => void;
  dismissInstallPrompt: () => void;
  checkInstallStatus: () => void;
  registerServiceWorker: () => Promise<void>;
  showOfflineIndicator: boolean;
  setShowOfflineIndicator: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    checkInstallStatus();
    registerServiceWorker();
    setupEventListeners();
  }, []);

  const checkInstallStatus = () => {
    // Check if app is installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    
    // Check if running in standalone mode
    setIsStandalone(window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);
    
    // Check if installation is possible
    setCanInstall('serviceWorker' in navigator && 'PushManager' in window);
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const setupEventListeners = () => {
    // Before install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    });

    // Online/offline detection
    window.addEventListener('online', () => {
      setShowOfflineIndicator(false);
    });

    window.addEventListener('offline', () => {
      setShowOfflineIndicator(true);
    });
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  const value: PWAContextType = {
    isInstalled,
    isStandalone,
    canInstall,
    showInstallPrompt,
    deferredPrompt,
    handleInstall,
    dismissInstallPrompt,
    checkInstallStatus,
    registerServiceWorker,
    showOfflineIndicator,
    setShowOfflineIndicator
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}

// Install Prompt Component
export function InstallPrompt() {
  const { showInstallPrompt, handleInstall, dismissInstallPrompt } = usePWA();

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <div className="finance-card p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 style={{ color: '#535353' }} className="font-semibold">
                Install CareNet
              </h3>
              <p style={{ color: '#848484' }} className="text-sm">
                Add to your home screen for quick access
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 py-2 px-4 rounded-lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            Install App
          </button>
          <button
            onClick={dismissInstallPrompt}
            className="flex-1 py-2 px-4 rounded-lg border"
            style={{
              borderColor: 'rgba(132, 132, 132, 0.2)',
              color: '#535353'
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

// Offline Indicator Component
export function OfflineIndicator() {
  const { showOfflineIndicator } = usePWA();

  if (!showOfflineIndicator) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
}

// PWA Features Component
export function PWAFeatures() {
  const { isInstalled, isStandalone, canInstall, registerServiceWorker } = usePWA();

  return (
    <div className="space-y-4">
      <h3 style={{ color: '#535353' }} className="text-lg font-semibold">
        PWA Features
      </h3>
      
      <div className="space-y-3">
        <div className="finance-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ color: '#535353' }} className="font-medium">
                Install App
              </h4>
              <p style={{ color: '#848484' }} className="text-sm">
                Add to home screen for quick access
              </p>
            </div>
            <span 
              className={`px-3 py-1 rounded-full text-sm ${
                isInstalled 
                  ? 'bg-green-100 text-green-800' 
                  : canInstall 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isInstalled ? 'Installed' : canInstall ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>

        <div className="finance-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ color: '#535353' }} className="font-medium">
                Standalone Mode
              </h4>
              <p style={{ color: '#848484' }} className="text-sm">
                Running as standalone app
              </p>
            </div>
            <span 
              className={`px-3 py-1 rounded-full text-sm ${
                isStandalone 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isStandalone ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="finance-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ color: '#535353' }} className="font-medium">
                Service Worker
              </h4>
              <p style={{ color: '#848484' }} className="text-sm">
                Offline functionality enabled
              </p>
            </div>
            <button
              onClick={registerServiceWorker}
              className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}