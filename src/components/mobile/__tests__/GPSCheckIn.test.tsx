import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GPSCheckIn } from '../GPSCheckIn';
import * as geolocationHook from '@/hooks/use-geolocation';

// Mock the geolocation hook
jest.mock('@/hooks/use-geolocation');

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
});

describe('GPSCheckIn', () => {
  const mockPatientLocation = {
    latitude: 23.8103,
    longitude: 90.4125,
    address: '123 Dhaka Street, Bangladesh',
  };

  const mockOnCheckIn = jest.fn();
  const mockOnCancel = jest.fn();
  const mockGetCurrentPosition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockVibrate.mockClear();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: null,
        loading: true,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.getByText('Getting your location...')).toBeInTheDocument();
      expect(screen.getByText('Make sure location services are enabled')).toBeInTheDocument();
    });

    it('should display patient location address', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: null,
        loading: true,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.getByText('123 Dhaka Street, Bangladesh')).toBeInTheDocument();
    });

    it('should call getCurrentPosition on mount', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: null,
        loading: true,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State', () => {
    it('should show error message when geolocation fails', () => {
      const mockError = { message: 'User denied geolocation' };
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: mockError,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.getByText('Location Error')).toBeInTheDocument();
      expect(screen.getByText('User denied geolocation')).toBeInTheDocument();
    });

    it('should show Try Again button on first error', () => {
      const mockError = { message: 'User denied geolocation' };
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: mockError,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should call getCurrentPosition when Try Again is clicked', () => {
      const mockError = { message: 'User denied geolocation' };
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: mockError,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(2); // Once on mount, once on retry
    });
  });

  describe('Success State - Within Range', () => {
    const mockPosition = {
      latitude: 23.8103,
      longitude: 90.4125,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    it('should show distance and accuracy when position is available', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      // Mock calculateDistance to return 0 (same location)
      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 0);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Distance')).toBeInTheDocument();
        expect(screen.getByText('Accuracy')).toBeInTheDocument();
      });
    });

    it('should show location verified when within range', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50); // 50m away

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
          radiusMeters={100}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Location Verified ✓')).toBeInTheDocument();
      });
    });

    it('should enable check-in button when within range', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        const checkInButton = screen.getByText('Confirm Check-In').closest('button');
        expect(checkInButton).not.toBeDisabled();
      });
    });

    it('should call onCheckIn with location data when confirmed', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        const checkInButton = screen.getByText('Confirm Check-In');
        fireEvent.click(checkInButton);
      });

      expect(mockOnCheckIn).toHaveBeenCalledWith({
        latitude: mockPosition.latitude,
        longitude: mockPosition.longitude,
        accuracy: mockPosition.accuracy,
      });
    });

    it('should trigger vibration on successful check-in', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        const checkInButton = screen.getByText('Confirm Check-In');
        fireEvent.click(checkInButton);
      });

      expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200]);
    });
  });

  describe('Success State - Out of Range', () => {
    const mockPosition = {
      latitude: 23.8200, // Different location
      longitude: 90.4200,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    it('should show out of range message when too far', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 500); // 500m away

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
          radiusMeters={100}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('You are too far from the patient')).toBeInTheDocument();
        expect(screen.getByText('Please move closer. You need to be within 100m.')).toBeInTheDocument();
      });
    });

    it('should disable check-in button when out of range', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 500);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        const checkInButton = screen.getByText('Refresh Location').closest('button');
        expect(checkInButton).toBeDisabled();
      });
    });

    it('should show update location link when out of range', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 500);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Update my location')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should render cancel button when onCancel is provided', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel is not provided', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should call onCancel when cancel button is clicked', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Technical Details', () => {
    it('should show technical details when expanded', async () => {
      const mockPosition = {
        latitude: 23.810300,
        longitude: 90.412500,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };

      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: mockPosition,
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 50);

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      const details = screen.getByText('Technical Details');
      fireEvent.click(details);

      await waitFor(() => {
        expect(screen.getByText('Your Location:')).toBeInTheDocument();
        expect(screen.getByText('Patient Location:')).toBeInTheDocument();
      });
    });
  });

  describe('Privacy Notice', () => {
    it('should display privacy notice', () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: null,
        error: null,
        loading: true,
        getCurrentPosition: mockGetCurrentPosition,
      });

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
        />
      );

      expect(screen.getByText('Privacy Notice:')).toBeInTheDocument();
      expect(screen.getByText(/Your location is used only to verify/)).toBeInTheDocument();
    });
  });

  describe('Custom Radius', () => {
    it('should use custom radius when provided', async () => {
      (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
        position: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        error: null,
        loading: false,
        getCurrentPosition: mockGetCurrentPosition,
      });

      (geolocationHook.calculateDistance as jest.Mock) = jest.fn(() => 150); // 150m away

      render(
        <GPSCheckIn
          patientLocation={mockPatientLocation}
          onCheckIn={mockOnCheckIn}
          radiusMeters={200}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Location Verified ✓')).toBeInTheDocument();
        expect(screen.getByText('You are within 200m of the patient location.')).toBeInTheDocument();
      });
    });
  });
});
