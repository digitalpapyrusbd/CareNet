'use client';

import { useState, useRef, useCallback } from 'react';

export interface CameraOptions {
  maxSize?: number; // Max file size in bytes (default: 2MB)
  quality?: number; // JPEG quality 0-1 (default: 0.8)
  facingMode?: 'user' | 'environment'; // Front or back camera
}

export interface CapturedImage {
  dataUrl: string;
  blob: Blob;
  file: File;
}

export function useCamera(options: CameraOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    maxSize = 2 * 1024 * 1024, // 2MB
    quality = 0.8,
    facingMode = 'environment',
  } = options;

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      console.error('Camera error:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(async (): Promise<CapturedImage | null> => {
    if (!videoRef.current || !stream) {
      setError('Camera not started');
      return null;
    }

    try {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob with compression
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) {
              resolve(b);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          quality
        );
      });

      // Check file size
      if (blob.size > maxSize) {
        // Try to compress further by reducing quality
        const reducedQuality = Math.max(0.3, quality - 0.2);
        const compressedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) {
                resolve(b);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            reducedQuality
          );
        });
        
        if (compressedBlob.size > maxSize) {
          throw new Error(`Image too large (${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB). Please try again.`);
        }
        
        const dataUrl = canvas.toDataURL('image/jpeg', reducedQuality);
        const file = new File([compressedBlob], `photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        
        return { dataUrl, blob: compressedBlob, file };
      }

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      return { dataUrl, blob, file };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture photo');
      console.error('Capture error:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [stream, quality, maxSize]);

  return {
    videoRef,
    stream,
    error,
    isCapturing,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
