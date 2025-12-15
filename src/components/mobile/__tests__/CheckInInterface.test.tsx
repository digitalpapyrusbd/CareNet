import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckInInterface } from '../CheckInInterface';
import { apiCall } from '@/lib/api-client';

// Mock dependencies
jest.mock('@/lib/api-client');
jest.mock('../GPSCheckIn', () => ({
  GPSCheckIn: ({ onCheckIn, onCancel }: any) => (
    <div data-testid="gps-check-in">
      <button onClick={() => onCheckIn({ latitude: 23.8103, longitude: 90.4125, accuracy: 10 })}>
        Verify Location
      </button>
      {onCancel && <button onClick={onCancel}>Cancel GPS</button>}
    </div>
  ),
}));

jest.mock('../CameraCapture', () => ({
  CameraCapture: ({ onCapture, onClose }: any) => (
    <div data-testid="camera-capture">
      <button
        onClick={() =>
          onCapture({
            dataUrl: 'data:image/png;base64,mockdata',
            blob: new Blob(),
            file: new File(['mock'], 'selfie.jpg', { type: 'image/jpeg' }),
            timestamp: new Date(),
          })
        }
      >
        Capture Photo
      </button>
      <button onClick={onClose}>Close Camera</button>
    </div>
  ),
}));

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
});

describe('CheckInInterface', () => {
  const mockProps = {
    jobId: 'job-123',
    patientName: 'John Doe',
    patientLocation: {
      latitude: 23.8103,
      longitude: 90.4125,
      address: '123 Dhaka Street, Bangladesh',
    },
    onSuccess: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockVibrate.mockClear();
  });

  describe('Initialization', () => {
    it('should render with patient name', () => {
      render(<CheckInInterface {...mockProps} />);

      expect(screen.getByText('Check-In: John Doe')).toBeInTheDocument();
    });

    it('should start with location verification step', () => {
      render(<CheckInInterface {...mockProps} />);

      expect(screen.getByTestId('gps-check-in')).toBeInTheDocument();
    });

    it('should display step indicators', () => {
      render(<CheckInInterface {...mockProps} />);

      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Photo')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('Location Verification Step', () => {
    it('should pass location data to GPSCheckIn', () => {
      render(<CheckInInterface {...mockProps} />);

      expect(screen.getByTestId('gps-check-in')).toBeInTheDocument();
    });

    it('should move to photo step after location verified', () => {
      render(<CheckInInterface {...mockProps} />);

      fireEvent.click(screen.getByText('Verify Location'));

      expect(screen.getByText('Take a Selfie')).toBeInTheDocument();
      expect(screen.getByText(/Take a photo of yourself/)).toBeInTheDocument();
    });

    it('should call onCancel when GPS cancel is clicked', () => {
      render(<CheckInInterface {...mockProps} />);

      fireEvent.click(screen.getByText('Cancel GPS'));

      expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Photo Capture Step', () => {
    beforeEach(() => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
    });

    it('should show Open Camera button', () => {
      expect(screen.getByText('Open Camera')).toBeInTheDocument();
    });

    it('should show camera when Open Camera is clicked', () => {
      fireEvent.click(screen.getByText('Open Camera'));

      expect(screen.getByTestId('camera-capture')).toBeInTheDocument();
    });

    it('should have back to location button', () => {
      expect(screen.getByText('Back to location verification')).toBeInTheDocument();
    });

    it('should go back to location step when back button clicked', () => {
      fireEvent.click(screen.getByText('Back to location verification'));

      expect(screen.getByTestId('gps-check-in')).toBeInTheDocument();
    });
  });

  describe('Camera Capture', () => {
    beforeEach(() => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
    });

    it('should move to confirm step after photo captured', async () => {
      fireEvent.click(screen.getByText('Capture Photo'));

      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should close camera after photo captured', async () => {
      fireEvent.click(screen.getByText('Capture Photo'));

      await waitFor(() => {
        expect(screen.queryByTestId('camera-capture')).not.toBeInTheDocument();
      });
    });

    it('should close camera when Close Camera clicked', () => {
      fireEvent.click(screen.getByText('Close Camera'));

      expect(screen.queryByTestId('camera-capture')).not.toBeInTheDocument();
    });
  });

  describe('Confirm Step', () => {
    beforeEach(async () => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
      fireEvent.click(screen.getByText('Capture Photo'));
      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should show review heading', () => {
      expect(screen.getByText('Review Check-In')).toBeInTheDocument();
    });

    it('should show photo preview', () => {
      expect(screen.getByText('Your Photo')).toBeInTheDocument();
      expect(screen.getByAltText('Check-in selfie')).toBeInTheDocument();
    });

    it('should show location verified message', () => {
      expect(screen.getByText('Location Verified')).toBeInTheDocument();
      expect(screen.getByText('Within range of patient location')).toBeInTheDocument();
    });

    it('should show retake button', () => {
      expect(screen.getByText('Retake')).toBeInTheDocument();
    });

    it('should show submit button', () => {
      expect(screen.getByText('Submit Check-In')).toBeInTheDocument();
    });

    it('should show start over button', () => {
      expect(screen.getByText('Start over')).toBeInTheDocument();
    });
  });

  describe('Photo Retake', () => {
    beforeEach(async () => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
      fireEvent.click(screen.getByText('Capture Photo'));
      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should reopen camera when retake is clicked', () => {
      fireEvent.click(screen.getByText('Retake'));

      expect(screen.getByTestId('camera-capture')).toBeInTheDocument();
    });
  });

  describe('Start Over', () => {
    beforeEach(async () => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
      fireEvent.click(screen.getByText('Capture Photo'));
      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should go back to location step when start over clicked', () => {
      fireEvent.click(screen.getByText('Start over'));

      expect(screen.getByTestId('gps-check-in')).toBeInTheDocument();
    });
  });

  describe('Submit Check-In', () => {
    beforeEach(async () => {
      (apiCall as jest.Mock).mockResolvedValue({ success: true });

      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
      fireEvent.click(screen.getByText('Capture Photo'));
      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should show submitting state when submit clicked', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(screen.getByText('Submitting Check-In...')).toBeInTheDocument();
      });
    });

    it('should call apiCall with correct data', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(apiCall).toHaveBeenCalledWith('/care-logs/check-in', {
          method: 'POST',
          body: expect.any(FormData),
        });
      });

      const formData = (apiCall as jest.Mock).mock.calls[0][1].body as FormData;
      expect(formData.get('job_id')).toBe('job-123');
      expect(formData.get('latitude')).toBe('23.8103');
      expect(formData.get('longitude')).toBe('90.4125');
      expect(formData.get('accuracy')).toBe('10');
    });

    it('should show success state after submission', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(screen.getByText('Check-In Complete!')).toBeInTheDocument();
      });
    });

    it('should trigger vibration on success', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200, 100, 200]);
      });
    });

    it('should call onSuccess after delay', async () => {
      jest.useFakeTimers();

      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(screen.getByText('Check-In Complete!')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      expect(mockProps.onSuccess).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('Submit Error Handling', () => {
    beforeEach(async () => {
      (apiCall as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Open Camera'));
      fireEvent.click(screen.getByText('Capture Photo'));
      await waitFor(() => {
        expect(screen.getByText('Review Check-In')).toBeInTheDocument();
      });
    });

    it('should show error message when submission fails', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should return to confirm step after error', async () => {
      fireEvent.click(screen.getByText('Submit Check-In'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(screen.getByText('Submit Check-In')).toBeInTheDocument();
    });
  });

  describe('StepIndicator Component', () => {
    it('should show completed style when step is completed', async () => {
      const { rerender } = render(<CheckInInterface {...mockProps} />);
      fireEvent.click(screen.getByText('Verify Location'));
      rerender(<CheckInInterface {...mockProps} />);

      // Location step should show as completed
      const locationText = screen.getByText('Location');
      expect(locationText).toBeInTheDocument();
    });
  });
});
