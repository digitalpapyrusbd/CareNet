'use client';

import { useState, useEffect } from 'react';
import { useGeolocation, calculateDistance } from '@/hooks/use-geolocation';
import { MapPin, CheckCircle, XCircle, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface GPSCheckInProps {
  patientLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onCheckIn: (location: { latitude: number; longitude: number; accuracy: number }) => void;
  onCancel?: () => void;
  radiusMeters?: number;
}

export function GPSCheckIn({
  const { t } = useTranslationContext();
  patientLocation,
  onCheckIn,
  onCancel,
  radiusMeters = 100,
}: GPSCheckInProps) {
  const { position, error, loading, getCurrentPosition } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  });

  const [distance, setDistance] = useState<number | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Calculate distance when position updates
  useEffect(() => {
    if (position) {
      const dist = calculateDistance(
        position.latitude,
        position.longitude,
        patientLocation.latitude,
        patientLocation.longitude
      );
      setDistance(dist);
      setIsWithinRange(dist <= radiusMeters);
    }
  }, [position, patientLocation, radiusMeters]);

  // Auto-fetch location on mount
  useEffect(() => {
    getCurrentPosition();
    setAttemptCount(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    getCurrentPosition();
    setAttemptCount((prev) => prev + 1);
  };

  const handleConfirmCheckIn = () => {
    if (position && isWithinRange) {
      // Haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      onCheckIn({
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
          <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            GPS Check-In
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verify your location
          </p>
        </div>
      </div>

      {/* Patient Address */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Patient Location
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {patientLocation.address}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Getting your location...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Make sure location services are enabled
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-900 dark:text-white font-medium mb-2">
            Location Error
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            {error.message}
          </p>
          {attemptCount < 3 && (
            <Button onClick={handleRetry} variant="outline" className="min-h-[48px]">
              <Navigation className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {attemptCount >= 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              <p>Unable to get location after {attemptCount} attempts.</p>
              <p>Check your device settings or contact support.</p>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {position && !loading && (
        <>
          {/* Location Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Distance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {distance !== null ? Math.round(distance) : '--'}
                <span className="text-sm font-normal ml-1">m</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Accuracy
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ±{Math.round(position.accuracy)}
                <span className="text-sm font-normal ml-1">m</span>
              </p>
            </div>
          </div>

          {/* Verification Status */}
          <div
            className={cn(
              'p-4 rounded-lg mb-6 flex items-start gap-3',
              isWithinRange
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            )}
          >
            {isWithinRange ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p
                className={cn(
                  'font-medium mb-1',
                  isWithinRange
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                )}
              >
                {isWithinRange
                  ? 'Location Verified ✓'
                  : 'You are too far from the patient'}
              </p>
              <p
                className={cn(
                  'text-sm',
                  isWithinRange
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                )}
              >
                {isWithinRange
                  ? `You are within ${radiusMeters}m of the patient location.`
                  : `Please move closer. You need to be within ${radiusMeters}m.`}
              </p>
            </div>
          </div>

          {/* GPS Coordinates (for debugging) */}
          <details className="mb-6">
            <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
              Technical Details
            </summary>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
              <p>{t('gpscheckin.text.yourlocation')}</p>
              <p>Lat: {position.latitude.toFixed(6)}</p>
              <p>Lng: {position.longitude.toFixed(6)}</p>
              <p className="mt-2">{t('gpscheckin.text.patientlocation')}</p>
              <p>Lat: {patientLocation.latitude.toFixed(6)}</p>
              <p>Lng: {patientLocation.longitude.toFixed(6)}</p>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 min-h-[48px]"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleConfirmCheckIn}
              disabled={!isWithinRange}
              className={cn(
                'flex-1 min-h-[48px]',
                isWithinRange &&
                  'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
              )}
            >
              {isWithinRange ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Check-In
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Refresh Location
                </>
              )}
            </Button>
          </div>

          {/* Retry Location */}
          {!isWithinRange && (
            <button
              onClick={handleRetry}
              className="w-full mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline min-h-[48px]"
            >
              Update my location
            </button>
          )}
        </>
      )}

      {/* Permission Notice */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>{t('gpscheckin.text.privacynotice')}</strong> Your location is used only to verify
          you&apos;re at the patient&apos;s location. It is stored with the care log for
          compliance purposes.
        </p>
      </div>
    </div>
  );
}
