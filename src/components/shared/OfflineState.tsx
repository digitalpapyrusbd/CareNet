import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface OfflineStateProps {
  onRetry: () => void;
  hasCachedContent?: boolean;
}

export function OfflineState({ onRetry, hasCachedContent = false }: OfflineStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #848484 0%, #535353 100%)',
            boxShadow: '0px 4px 18px rgba(132, 132, 132, 0.35)'
          }}
        >
          <WifiOff className="w-10 h-10 text-white" />
        </div>

        {/* Message */}
        <div className="text-center mb-8">
          <h2 className="mb-4" style={{ color: '#535353' }}>No Internet Connection</h2>
          <p style={{ color: '#848484' }}>
            You're currently offline. Please check your internet connection and try again.
          </p>
        </div>

        {/* Retry Button */}
        <Button
          onClick={onRetry}
          className="w-full mb-4"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            boxShadow: '0px 4px 18px rgba(91, 159, 255, 0.3)',
            color: 'white',
            border: 'none'
          }}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Again
        </Button>

        {/* Cached Content Notice */}
        {hasCachedContent && (
          <div className="finance-card p-4 mt-6">
            <h3 className="mb-2" style={{ color: '#535353' }}>Offline Mode</h3>
            <p className="text-sm" style={{ color: '#848484' }}>
              You can still view previously loaded content while offline. Some features may be limited.
            </p>
            <ul className="mt-3 space-y-2 text-sm" style={{ color: '#535353' }}>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                View saved pages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Read messages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                Send new messages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                Update information
              </li>
            </ul>
          </div>
        )}

        {/* PWA Info */}
        <div className="mt-6 text-center text-sm" style={{ color: '#848484' }}>
          <p>CareNet works best when you're online.</p>
          <p className="mt-2">Install our app for better offline support.</p>
        </div>
      </div>
    </div>
  );
}
