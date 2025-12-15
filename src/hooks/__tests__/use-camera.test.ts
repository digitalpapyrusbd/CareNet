import { renderHook, act, waitFor } from '@testing-library/react';
import { useCamera } from '../use-camera';

// Mock MediaStream
class MockMediaStream {
  private tracks: MediaStreamTrack[] = [];

  constructor() {
    this.tracks = [
      {
        stop: jest.fn(),
        kind: 'video',
        enabled: true,
      } as unknown as MediaStreamTrack,
    ];
  }

  getTracks() {
    return this.tracks;
  }
}

// Mock HTMLVideoElement
const createMockVideo = () => ({
  srcObject: null,
  videoWidth: 1920,
  videoHeight: 1080,
  play: jest.fn(),
  pause: jest.fn(),
});

// Mock HTMLCanvasElement
const createMockCanvas = () => {
  const mockCtx = {
    drawImage: jest.fn(),
  };

  return {
    width: 0,
    height: 0,
    getContext: jest.fn(() => mockCtx),
    toBlob: jest.fn((callback, type, quality) => {
      const blob = new Blob(['mock-image-data'], { type: 'image/jpeg' });
      Object.defineProperty(blob, 'size', { value: 1024 * 100 }); // 100KB
      callback(blob);
    }),
    toDataURL: jest.fn(() => 'data:image/jpeg;base64,mockImageData'),
  };
};

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn();

Object.defineProperty(global.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
  },
});

// Mock document.createElement for canvas
const originalCreateElement = document.createElement.bind(document);
const mockCreateElement = jest.fn((tagName: string) => {
  if (tagName === 'canvas') {
    return createMockCanvas() as any;
  }
  return originalCreateElement(tagName);
});

document.createElement = mockCreateElement as any;

describe('useCamera Hook', () => {
  let mockVideo: ReturnType<typeof createMockVideo>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVideo = createMockVideo();
    mockGetUserMedia.mockResolvedValue(new MockMediaStream());
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useCamera());

      expect(result.current.stream).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isCapturing).toBe(false);
      expect(result.current.videoRef).toBeDefined();
    });

    it('should return all required functions', () => {
      const { result } = renderHook(() => useCamera());

      expect(result.current.startCamera).toBeDefined();
      expect(result.current.stopCamera).toBeDefined();
      expect(result.current.capturePhoto).toBeDefined();
      expect(typeof result.current.startCamera).toBe('function');
      expect(typeof result.current.stopCamera).toBe('function');
      expect(typeof result.current.capturePhoto).toBe('function');
    });
  });

  describe('startCamera', () => {
    it('should start camera successfully', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.stream).not.toBeNull();
        expect(result.current.error).toBeNull();
      });
    });

    it('should call getUserMedia with correct constraints', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
    });

    it('should use user-facing camera when specified', async () => {
      const { result } = renderHook(() => useCamera({ facingMode: 'user' }));

      await act(async () => {
        await result.current.startCamera();
      });

      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
    });

    it('should set video srcObject when videoRef is available', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.videoRef.current?.srcObject).toBeDefined();
      });
    });

    it('should handle camera access error', async () => {
      mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Permission denied');
        expect(result.current.stream).toBeNull();
      });
    });

    it('should handle camera not supported error', async () => {
      const originalMediaDevices = navigator.mediaDevices;
      Object.defineProperty(global.navigator, 'mediaDevices', {
        writable: true,
        value: undefined,
      });

      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Camera not supported on this device');
      });

      // Restore
      Object.defineProperty(global.navigator, 'mediaDevices', {
        writable: true,
        value: originalMediaDevices,
      });
    });

    it('should clear previous error when starting camera', async () => {
      mockGetUserMedia.mockRejectedValueOnce(new Error('First error'));

      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      mockGetUserMedia.mockResolvedValueOnce(new MockMediaStream());

      await act(async () => {
        await result.current.startCamera();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('stopCamera', () => {
    it('should stop all media tracks', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      const tracks = result.current.stream?.getTracks() || [];

      act(() => {
        result.current.stopCamera();
      });

      tracks.forEach((track) => {
        expect(track.stop).toHaveBeenCalled();
      });
    });

    it('should clear stream state', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      expect(result.current.stream).not.toBeNull();

      act(() => {
        result.current.stopCamera();
      });

      expect(result.current.stream).toBeNull();
    });

    it('should clear video srcObject', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      act(() => {
        result.current.stopCamera();
      });

      expect(result.current.videoRef.current?.srcObject).toBeNull();
    });

    it('should handle stopping when no stream exists', () => {
      const { result } = renderHook(() => useCamera());

      expect(() => {
        act(() => {
          result.current.stopCamera();
        });
      }).not.toThrow();
    });
  });

  describe('capturePhoto', () => {
    it('should capture photo successfully', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).not.toBeNull();
      expect(capturedImage.dataUrl).toBe('data:image/jpeg;base64,mockImageData');
      expect(capturedImage.blob).toBeInstanceOf(Blob);
      expect(capturedImage.file).toBeInstanceOf(File);
    });

    it('should return null when camera not started', async () => {
      const { result } = renderHook(() => useCamera());

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).toBeNull();
      expect(result.current.error).toBe('Camera not started');
    });

    it('should set isCapturing state during capture', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      let capturePromise: Promise<any>;

      act(() => {
        capturePromise = result.current.capturePhoto();
      });

      expect(result.current.isCapturing).toBe(true);

      await act(async () => {
        await capturePromise!;
      });

      expect(result.current.isCapturing).toBe(false);
    });

    it('should create canvas with correct dimensions', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      await act(async () => {
        await result.current.capturePhoto();
      });

      expect(mockCreateElement).toHaveBeenCalledWith('canvas');
    });

    it('should draw video frame to canvas', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      await act(async () => {
        await result.current.capturePhoto();
      });

      const mockCtx = mockCanvas.getContext('2d');
      expect(mockCtx?.drawImage).toHaveBeenCalledWith(mockVideo, 0, 0);
    });

    it('should use specified quality', async () => {
      const { result } = renderHook(() => useCamera({ quality: 0.5 }));
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      await act(async () => {
        await result.current.capturePhoto();
      });

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.5
      );
    });

    it('should generate unique filenames', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      let image1: any, image2: any;

      await act(async () => {
        image1 = await result.current.capturePhoto();
      });

      await act(async () => {
        image2 = await result.current.capturePhoto();
      });

      expect(image1?.file.name).not.toBe(image2?.file.name);
      expect(image1?.file.name).toMatch(/^photo-\d+\.jpg$/);
    });

    it('should handle canvas context error', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCanvas.getContext = jest.fn(() => null);
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).toBeNull();
      expect(result.current.error).toBe('Failed to get canvas context');
    });

    it('should handle blob creation error', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCanvas.toBlob = jest.fn((callback) => callback(null));
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).toBeNull();
      expect(result.current.error).toBe('Failed to create blob');
    });
  });

  describe('Image Compression', () => {
    it('should compress image when exceeds maxSize', async () => {
      const { result } = renderHook(() => useCamera({ maxSize: 50 * 1024 })); // 50KB max
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      let callCount = 0;
      mockCanvas.toBlob = jest.fn((callback, type, quality) => {
        callCount++;
        const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
        // First call: 100KB (exceeds limit), second call: 40KB (within limit)
        Object.defineProperty(blob, 'size', { value: callCount === 1 ? 100 * 1024 : 40 * 1024 });
        callback(blob);
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(mockCanvas.toBlob).toHaveBeenCalledTimes(2);
      expect(capturedImage).not.toBeNull();
    });

    it('should reduce quality when compressing', async () => {
      const { result } = renderHook(() => useCamera({ maxSize: 50 * 1024, quality: 0.8 }));
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      let callCount = 0;
      mockCanvas.toBlob = jest.fn((callback, type, quality) => {
        callCount++;
        const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
        Object.defineProperty(blob, 'size', { value: callCount === 1 ? 100 * 1024 : 40 * 1024 });
        callback(blob);
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      await act(async () => {
        await result.current.capturePhoto();
      });

      // First call with original quality (0.8), second with reduced (0.8 - 0.2 = 0.6)
      expect(mockCanvas.toBlob).toHaveBeenNthCalledWith(1, expect.any(Function), 'image/jpeg', 0.8);
      // Use closeTo for floating point comparison
      const secondCall = (mockCanvas.toBlob as jest.Mock).mock.calls[1];
      expect(secondCall[1]).toBe('image/jpeg');
      expect(secondCall[2]).toBeCloseTo(0.6, 1);
    });

    it('should not reduce quality below 0.3', async () => {
      const { result } = renderHook(() => useCamera({ maxSize: 50 * 1024, quality: 0.4 }));
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      let callCount = 0;
      mockCanvas.toBlob = jest.fn((callback, type, quality) => {
        callCount++;
        const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
        Object.defineProperty(blob, 'size', { value: callCount === 1 ? 100 * 1024 : 40 * 1024 });
        callback(blob);
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      await act(async () => {
        await result.current.capturePhoto();
      });

      // Quality should be max(0.3, 0.4 - 0.2) = 0.3
      expect(mockCanvas.toBlob).toHaveBeenNthCalledWith(2, expect.any(Function), 'image/jpeg', 0.3);
    });

    it('should throw error if compressed image still exceeds maxSize', async () => {
      const { result } = renderHook(() => useCamera({ maxSize: 30 * 1024 })); // 30KB max
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCanvas.toBlob = jest.fn((callback) => {
        const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
        Object.defineProperty(blob, 'size', { value: 100 * 1024 }); // Always 100KB
        callback(blob);
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).toBeNull();
      expect(result.current.error).toMatch(/Image too large/);
    });

    it('should handle compression blob creation failure', async () => {
      const { result } = renderHook(() => useCamera({ maxSize: 50 * 1024 }));
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      let callCount = 0;
      mockCanvas.toBlob = jest.fn((callback) => {
        callCount++;
        if (callCount === 1) {
          const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
          Object.defineProperty(blob, 'size', { value: 100 * 1024 });
          callback(blob);
        } else {
          callback(null); // Compression fails
        }
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).toBeNull();
      expect(result.current.error).toBe('Failed to compress image');
    });
  });

  describe('Options', () => {
    it('should use default maxSize', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCanvas.toBlob = jest.fn((callback) => {
        const blob = new Blob(['mock-data'], { type: 'image/jpeg' });
        Object.defineProperty(blob, 'size', { value: 1 * 1024 * 1024 }); // 1MB - within 2MB default
        callback(blob);
      });
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      let capturedImage: any;

      await act(async () => {
        capturedImage = await result.current.capturePhoto();
      });

      expect(capturedImage).not.toBeNull();
      expect(mockCanvas.toBlob).toHaveBeenCalledTimes(1); // No compression needed
    });

    it('should use default quality (0.8)', async () => {
      const { result } = renderHook(() => useCamera());
      result.current.videoRef.current = mockVideo as any;

      await act(async () => {
        await result.current.startCamera();
      });

      const mockCanvas = createMockCanvas();
      mockCreateElement.mockReturnValueOnce(mockCanvas as any);

      await act(async () => {
        await result.current.capturePhoto();
      });

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.8
      );
    });

    it('should use default facingMode (environment)', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      expect(mockGetUserMedia).toHaveBeenCalledWith(
        expect.objectContaining({
          video: expect.objectContaining({
            facingMode: 'environment',
          }),
        })
      );
    });
  });

  describe('Cleanup', () => {
    it('should stop camera on unmount if stream exists', async () => {
      const { result, unmount } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      const tracks = result.current.stream?.getTracks() || [];

      unmount();

      tracks.forEach((track) => {
        expect(track.stop).toHaveBeenCalled();
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complete photo capture workflow', async () => {
      const { result } = renderHook(() => useCamera({ quality: 0.9, maxSize: 5 * 1024 * 1024 }));
      result.current.videoRef.current = mockVideo as any;

      // Start camera
      await act(async () => {
        await result.current.startCamera();
      });

      expect(result.current.stream).not.toBeNull();
      expect(result.current.error).toBeNull();

      // Capture photo
      let photo: any;
      await act(async () => {
        photo = await result.current.capturePhoto();
      });

      expect(photo).not.toBeNull();
      expect(photo.file.type).toBe('image/jpeg');
      expect(photo.file.name).toMatch(/^photo-\d+\.jpg$/);

      // Stop camera
      act(() => {
        result.current.stopCamera();
      });

      expect(result.current.stream).toBeNull();
    });

    it('should handle rapid start/stop cycles', async () => {
      const { result } = renderHook(() => useCamera());

      await act(async () => {
        await result.current.startCamera();
      });

      act(() => {
        result.current.stopCamera();
      });

      await act(async () => {
        await result.current.startCamera();
      });

      expect(result.current.stream).not.toBeNull();
    });

    it('should handle switching between cameras', async () => {
      const { result, rerender } = renderHook(
        ({ facingMode }) => useCamera({ facingMode }),
        { initialProps: { facingMode: 'environment' as const } }
      );

      await act(async () => {
        await result.current.startCamera();
      });

      expect(mockGetUserMedia).toHaveBeenLastCalledWith(
        expect.objectContaining({
          video: expect.objectContaining({ facingMode: 'environment' }),
        })
      );

      rerender({ facingMode: 'user' });

      await act(async () => {
        await result.current.startCamera();
      });

      expect(mockGetUserMedia).toHaveBeenLastCalledWith(
        expect.objectContaining({
          video: expect.objectContaining({ facingMode: 'user' }),
        })
      );
    });
  });
});
