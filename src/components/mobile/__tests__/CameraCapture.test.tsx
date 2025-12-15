import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CameraCapture } from '../CameraCapture';
import * as cameraHook from '@/hooks/use-camera';

// Mock the camera hook
jest.mock('@/hooks/use-camera');

describe('CameraCapture', () => {
  const mockOnCapture = jest.fn();
  const mockOnClose = jest.fn();
  const mockStartCamera = jest.fn();
  const mockStopCamera = jest.fn();
  const mockCapturePhoto = jest.fn();
  const mockVideoRef = { current: document.createElement('video') };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render with default title', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByText('Take a Photo')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(
        <CameraCapture
          onCapture={mockOnCapture}
          onClose={mockOnClose}
          title="Capture Care Log Photo"
        />
      );

      expect(screen.getByText('Capture Care Log Photo')).toBeInTheDocument();
    });

    it('should start camera on mount', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(mockStartCamera).toHaveBeenCalledTimes(1);
    });

    it('should stop camera on unmount', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      const { unmount } = render(
        <CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />
      );

      unmount();

      expect(mockStopCamera).toHaveBeenCalled();
    });

    it('should use environment camera by default', () => {
      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(cameraHook.useCamera).toHaveBeenCalledWith({
        facingMode: 'environment',
      });
    });

    it('should use user-facing camera when specified', () => {
      render(
        <CameraCapture
          onCapture={mockOnCapture}
          onClose={mockOnClose}
          facingMode="user"
        />
      );

      expect(cameraHook.useCamera).toHaveBeenCalledWith({
        facingMode: 'user',
      });
    });
  });

  describe('Close Functionality', () => {
    it('should render close button', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByLabelText('Close camera')).toBeInTheDocument();
    });

    it('should stop camera and call onClose when close button is clicked', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Close camera'));

      expect(mockStopCamera).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State', () => {
    it('should display error message when camera fails', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: 'Camera not available',
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByText('Camera not available')).toBeInTheDocument();
    });

    it('should show Try Again button on error', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: 'Camera not available',
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should call startCamera when Try Again is clicked', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: 'Camera not available',
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByText('Try Again'));

      expect(mockStartCamera).toHaveBeenCalledTimes(2); // Once on mount, once on retry
    });

    it('should not show capture button when there is an error', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: null,
        error: 'Camera not available',
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.queryByLabelText('Capture photo')).not.toBeInTheDocument();
    });
  });

  describe('Camera Stream Active', () => {
    const mockStream = {} as MediaStream;

    it('should show video element when stream is active', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('autoplay');
      expect(video).toHaveAttribute('playsinline');
      // muted is a boolean attribute, check property instead
      expect(video?.muted).toBe(true);
    });

    it('should show capture button when stream is active', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByLabelText('Capture photo')).toBeInTheDocument();
    });

    it('should disable capture button when isCapturing is true', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: true,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      const captureButton = screen.getByLabelText('Capture photo');
      expect(captureButton).toBeDisabled();
    });
  });

  describe('Photo Capture', () => {
    const mockStream = {} as MediaStream;
    const mockCapturedImage = {
      dataUrl: 'data:image/png;base64,mockImageData',
      blob: new Blob(),
      timestamp: new Date(),
    };

    it('should call capturePhoto when capture button is clicked', async () => {
      mockCapturePhoto.mockResolvedValue(mockCapturedImage);

      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Capture photo'));

      await waitFor(() => {
        expect(mockCapturePhoto).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onCapture with captured image', async () => {
      mockCapturePhoto.mockResolvedValue(mockCapturedImage);

      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Capture photo'));

      await waitFor(() => {
        expect(mockOnCapture).toHaveBeenCalledWith(mockCapturedImage);
      });
    });

    it('should stop camera after successful capture', async () => {
      mockCapturePhoto.mockResolvedValue(mockCapturedImage);

      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Capture photo'));

      await waitFor(() => {
        expect(mockStopCamera).toHaveBeenCalled();
      });
    });

    it('should close after successful capture', async () => {
      mockCapturePhoto.mockResolvedValue(mockCapturedImage);

      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Capture photo'));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onCapture if capturePhoto returns null', async () => {
      mockCapturePhoto.mockResolvedValue(null);

      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      fireEvent.click(screen.getByLabelText('Capture photo'));

      await waitFor(() => {
        expect(mockCapturePhoto).toHaveBeenCalled();
      });

      expect(mockOnCapture).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    const mockStream = {} as MediaStream;

    it('should have proper ARIA labels', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      expect(screen.getByLabelText('Close camera')).toBeInTheDocument();
      expect(screen.getByLabelText('Capture photo')).toBeInTheDocument();
    });

    it('should have minimum touch target sizes', () => {
      (cameraHook.useCamera as jest.Mock).mockReturnValue({
        videoRef: mockVideoRef,
        stream: mockStream,
        error: null,
        isCapturing: false,
        startCamera: mockStartCamera,
        stopCamera: mockStopCamera,
        capturePhoto: mockCapturePhoto,
      });

      render(<CameraCapture onCapture={mockOnCapture} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close camera');
      expect(closeButton).toHaveClass('min-h-[48px]');
      expect(closeButton).toHaveClass('min-w-[48px]');

      const captureButton = screen.getByLabelText('Capture photo');
      expect(captureButton).toHaveClass('min-h-[48px]');
      expect(captureButton).toHaveClass('min-w-[48px]');
    });
  });
});
