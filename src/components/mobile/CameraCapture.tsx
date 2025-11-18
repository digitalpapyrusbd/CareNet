'use client';

import { useEffect } from 'react';
import { useCamera, CapturedImage } from '@/hooks/use-camera';
import { X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CameraCaptureProps {
  onCapture: (image: CapturedImage) => void;
  onClose: () => void;
  facingMode?: 'user' | 'environment';
  title?: string;
}

export function CameraCapture({
  onCapture,
  onClose,
  facingMode = 'environment',
  title = 'Take a Photo',
}: CameraCaptureProps) {
  const {
    videoRef,
    stream,
    error,
    isCapturing,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera({ facingMode });

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    const image = await capturePhoto();
    if (image) {
      onCapture(image);
      stopCamera();
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <h2 className="text-white font-semibold">{title}</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center">
        {error ? (
          <div className="text-center p-4">
            <p className="text-white mb-4">{error}</p>
            <Button onClick={startCamera} variant="outline">
              <RotateCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Camera guide overlay */}
        {stream && !error && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-lg" />
          </div>
        )}
      </div>

      {/* Controls */}
      {stream && !error && (
        <div className="p-8 bg-black/50 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[48px] min-w-[48px]"
            aria-label="Capture photo"
          >
            <span className="sr-only">Capture</span>
          </button>
        </div>
      )}
    </div>
  );
}
