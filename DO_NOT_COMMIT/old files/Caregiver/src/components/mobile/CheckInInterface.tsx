'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GPSCheckIn } from './GPSCheckIn';
import { CameraCapture } from './CameraCapture';
import type { CapturedImage } from '@/hooks/use-camera';
import { Button } from '@/components/ui/Button';
import { Camera, MapPin, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiCall } from '@/lib/api-client';

interface CheckInInterfaceProps {
  jobId: string;
  patientName: string;
  patientLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

type CheckInStep = 'verify-location' | 'take-photo' | 'confirm' | 'submitting' | 'success';

export function CheckInInterface({
  jobId,
  patientName,
  patientLocation,
  onSuccess,
  onCancel,
}: CheckInInterfaceProps) {
  const [step, setStep] = useState<CheckInStep>('verify-location');
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [photo, setPhoto] = useState<CapturedImage | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationVerified = (location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  }) => {
    setLocationData(location);
    setStep('take-photo');
  };

  const handlePhotoCapture = (image: CapturedImage) => {
    setPhoto(image);
    setShowCamera(false);
    setStep('confirm');
  };

  const handleSubmitCheckIn = async () => {
    if (!locationData || !photo) {
      setError('Missing location or photo data');
      return;
    }

    try {
      setStep('submitting');
      setError(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('latitude', locationData.latitude.toString());
      formData.append('longitude', locationData.longitude.toString());
      formData.append('accuracy', locationData.accuracy.toString());
      formData.append('photo', photo.file);
      formData.append('timestamp', new Date().toISOString());

      // Submit check-in
      await apiCall('/care-logs/check-in', {
        method: 'POST',
        body: formData,
      });

      // Haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }

      setStep('success');

      // Call success callback after delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in');
      setStep('confirm');
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    setShowCamera(true);
  };

  const handleStartOver = () => {
    setLocationData(null);
    setPhoto(null);
    setError(null);
    setStep('verify-location');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Camera Capture Overlay */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          title="Take Check-In Selfie"
          facingMode="user"
        />
      )}

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Check-In: {patientName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <StepIndicator
              icon={MapPin}
              label="Location"
              active={step === 'verify-location'}
              completed={!!locationData}
            />
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div
                className={cn(
                  'h-full bg-primary-600 transition-all',
                  locationData ? 'w-full' : 'w-0'
                )}
              />
            </div>
            <StepIndicator
              icon={Camera}
              label="Photo"
              active={step === 'take-photo'}
              completed={!!photo}
            />
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div
                className={cn(
                  'h-full bg-primary-600 transition-all',
                  photo ? 'w-full' : 'w-0'
                )}
              />
            </div>
            <StepIndicator
              icon={CheckCircle}
              label="Confirm"
              active={step === 'confirm' || step === 'submitting'}
              completed={step === 'success'}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Step 1: GPS Verification */}
        {step === 'verify-location' && (
          <GPSCheckIn
            patientLocation={patientLocation}
            onCheckIn={handleLocationVerified}
            onCancel={onCancel}
          />
        )}

        {/* Step 2: Photo Capture */}
        {step === 'take-photo' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-fit mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Take a Selfie
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Take a photo of yourself to confirm your presence at the patient&apos;s location.
              </p>
            </div>

            <Button
              onClick={() => setShowCamera(true)}
              className="w-full min-h-[48px]"
            >
              <Camera className="w-5 h-5 mr-2" />
              Open Camera
            </Button>

            <button
              onClick={handleStartOver}
              className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 hover:underline min-h-[48px]"
            >
              Back to location verification
            </button>
          </div>
        )}

        {/* Step 3: Confirm & Submit */}
        {step === 'confirm' && locationData && photo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Review Check-In
            </h2>

            {/* Photo Preview */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Photo
              </p>
              <div className="relative rounded-lg overflow-hidden h-64">
                <Image
                  src={photo.dataUrl}
                  alt="Check-in selfie"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={handleRetake}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors min-h-[48px]"
                >
                  Retake
                </button>
              </div>
            </div>

            {/* Location Summary */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="font-medium text-green-900 dark:text-green-100">
                  Location Verified
                </p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Within range of patient location
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmitCheckIn}
              className="w-full min-h-[48px] bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Check-In
            </Button>

            <button
              onClick={handleStartOver}
              className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 hover:underline min-h-[48px]"
            >
              Start over
            </button>
          </div>
        )}

        {/* Step 4: Submitting */}
        {step === 'submitting' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-pulse" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Submitting Check-In...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we process your check-in.
            </p>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check-In Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your check-in has been recorded successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({
  icon: Icon,
  label,
  active,
  completed,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
          completed
            ? 'bg-green-600 dark:bg-green-600'
            : active
            ? 'bg-primary-600 dark:bg-primary-600'
            : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <Icon
          className={cn(
            'w-5 h-5',
            completed || active ? 'text-white' : 'text-gray-500 dark:text-gray-400'
          )}
        />
      </div>
      <span
        className={cn(
          'text-xs font-medium',
          active || completed
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        )}
      >
        {label}
      </span>
    </div>
  );
}
