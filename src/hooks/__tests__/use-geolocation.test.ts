/* eslint-env jest */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeolocation, calculateDistance } from '../use-geolocation';

type MockCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

type MockPosition = {
  coords: MockCoords;
  timestamp: number;
};

type MockPositionCallback = (position: MockPosition) => void;
type MockError = { code: number; message: string };
type MockErrorCallback = (error: MockError) => void;

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  writable: true,
  configurable: true,
  value: mockGeolocation,
});

describe('useGeolocation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Ensure geolocation is restored for each test
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      configurable: true,
      value: mockGeolocation,
    });
  });

  describe('Initialization', () => {
    it('should initialize with null position and no error', () => {
      const { result } = renderHook(() => useGeolocation());

      expect(result.current.position).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should return required functions', () => {
      const { result } = renderHook(() => useGeolocation());

      expect(result.current.getCurrentPosition).toBeDefined();
      expect(result.current.watchPosition).toBeDefined();
      expect(typeof result.current.getCurrentPosition).toBe('function');
      expect(typeof result.current.watchPosition).toBe('function');
    });
  });

  describe('getCurrentPosition', () => {
    it('should get current position successfully', async () => {
      const mockPosition = {
        coords: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.position).toEqual({
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          timestamp: mockPosition.timestamp,
        });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should set loading state while fetching position', async () => {
      let successCallback: MockPositionCallback | null = null;
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        successCallback = success;
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      expect(result.current.loading).toBe(true);

      expect(successCallback).toBeTruthy();

      act(() => {
        successCallback?.({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle permission denied error', async () => {
      const mockError = { code: 1, message: 'User denied geolocation' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 1,
          message: 'Permission denied. Please allow location access.',
        });
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle position unavailable error', async () => {
      const mockError = { code: 2, message: 'Position unavailable' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 2,
          message: 'Position unavailable. Unable to retrieve your location.',
        });
      });
    });

    it('should handle timeout error', async () => {
      const mockError = { code: 3, message: 'Timeout' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 3,
          message: 'Timeout. Location request took too long.',
        });
      });
    });

    it('should handle unknown error', async () => {
      const mockError = { code: 999, message: 'Unknown error' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 999,
          message: 'An unknown error occurred.',
        });
      });
    });

    it('should clear previous error when getting new position', async () => {
      const mockError = { code: 1, message: 'Denied' };
      const mockPosition = {
        coords: { latitude: 23.8103, longitude: 90.4125, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
        timestamp: Date.now(),
      };

      mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
        error(mockError);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
        success(mockPosition);
      });

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.position).not.toBeNull();
      });
    });

    it('should handle geolocation not supported', async () => {
      const originalValue = navigator.geolocation;
      Object.defineProperty(global.navigator, 'geolocation', {
        configurable: true,
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 0,
          message: 'Geolocation is not supported by your browser',
        });
      });

      // Restore
      Object.defineProperty(global.navigator, 'geolocation', {
        configurable: true,
        value: originalValue,
        writable: true,
      });
    });
  });

  describe('Options', () => {
    it('should use default options', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error, options) => {
        expect(options).toEqual({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
        success({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('should use custom enableHighAccuracy option', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error, options) => {
        expect(options?.enableHighAccuracy).toBe(false);
        success({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      const { result } = renderHook(() => useGeolocation({ enableHighAccuracy: false }));

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('should use custom timeout option', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error, options) => {
        expect(options?.timeout).toBe(5000);
        success({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      const { result } = renderHook(() => useGeolocation({ timeout: 5000 }));

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('should use custom maximumAge option', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error, options) => {
        expect(options?.maximumAge).toBe(10000);
        success({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      const { result } = renderHook(() => useGeolocation({ maximumAge: 10000 }));

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it('should use multiple custom options', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error, options) => {
        expect(options).toEqual({
          enableHighAccuracy: false,
          timeout: 3000,
          maximumAge: 5000,
        });
        success({
          coords: { latitude: 0, longitude: 0, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      const { result } = renderHook(() =>
        useGeolocation({ enableHighAccuracy: false, timeout: 3000, maximumAge: 5000 })
      );

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      });
    });
  });

  describe('watchPosition', () => {
    it('should watch position changes', async () => {
      const watchId = 123;
      mockGeolocation.watchPosition.mockReturnValue(watchId);

      mockGeolocation.watchPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 23.8103, longitude: 90.4125, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
        return watchId;
      });

      const { result } = renderHook(() => useGeolocation());

      let cleanup: (() => void) | null = null;

      act(() => {
        cleanup = result.current.watchPosition() || null;
      });

      await waitFor(() => {
        expect(result.current.position).toEqual({
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          timestamp: expect.any(Number),
        });
      });

      expect(cleanup).toBeDefined();
    });

    it('should return cleanup function', async () => {
      const watchId = 123;
      mockGeolocation.watchPosition.mockReturnValue(watchId);

      const { result } = renderHook(() => useGeolocation());

      let cleanup: (() => void) | null = null;

      act(() => {
        cleanup = result.current.watchPosition() || null;
      });

      expect(cleanup).toBeDefined();
      expect(typeof cleanup).toBe('function');

      act(() => {
        cleanup?.();
      });

      expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId);
    });

    it('should update position on location changes', async () => {
      let successCallback: MockPositionCallback | null = null;
      const watchId = 123;

      mockGeolocation.watchPosition.mockImplementation((success) => {
        successCallback = success;
        return watchId;
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.watchPosition();
      });

      act(() => {
        successCallback?.({
          coords: { latitude: 23.8103, longitude: 90.4125, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      await waitFor(() => {
        expect(result.current.position?.latitude).toBe(23.8103);
      });

      act(() => {
        successCallback?.({
          coords: { latitude: 23.8200, longitude: 90.4200, accuracy: 8, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
          timestamp: Date.now(),
        });
      });

      await waitFor(() => {
        expect(result.current.position?.latitude).toBe(23.8200);
        expect(result.current.position?.longitude).toBe(90.4200);
      });
    });

    it('should handle watch position error', async () => {
      let errorCallback: MockErrorCallback | null = null;
      const watchId = 123;

      mockGeolocation.watchPosition.mockImplementation((success, error) => {
        errorCallback = error;
        return watchId;
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.watchPosition();
      });

      act(() => {
        errorCallback?.({ code: 1, message: 'Permission denied' });
      });

      await waitFor(() => {
        expect(result.current.error).toEqual({
          code: 1,
          message: 'Permission denied. Please allow location access.',
        });
      });
    });

    it('should return null if geolocation not supported', async () => {
      const originalValue = navigator.geolocation;
      Object.defineProperty(global.navigator, 'geolocation', {
        configurable: true,
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      let cleanup: (() => void) | null = null;

      act(() => {
        cleanup = result.current.watchPosition() || null;
      });

      expect(cleanup).toBeNull();
      expect(result.current.error).toEqual({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });

      // Restore
      Object.defineProperty(global.navigator, 'geolocation', {
        configurable: true,
        value: originalValue,
        writable: true,
      });
    });

    it('should use options when watching position', async () => {
      const watchId = 123;

      mockGeolocation.watchPosition.mockImplementation((success, error, options) => {
        expect(options).toEqual({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5000,
        });
        return watchId;
      });

      const { result } = renderHook(() =>
        useGeolocation({ enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 })
      );

      act(() => {
        result.current.watchPosition();
      });

      expect(mockGeolocation.watchPosition).toHaveBeenCalled();
    });
  });

  describe('Position Data', () => {
    it('should capture all position coordinates', async () => {
      const mockPosition = {
        coords: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: 150,
          altitudeAccuracy: 5,
          heading: 90,
          speed: 5.5,
        },
        timestamp: 1700000000000,
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.position).toEqual({
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: 150,
          altitudeAccuracy: 5,
          heading: 90,
          speed: 5.5,
          timestamp: 1700000000000,
        });
      });
    });

    it('should handle null altitude values', async () => {
      const mockPosition = {
        coords: {
          latitude: 23.8103,
          longitude: 90.4125,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const { result } = renderHook(() => useGeolocation());

      act(() => {
        result.current.getCurrentPosition();
      });

      await waitFor(() => {
        expect(result.current.position?.altitude).toBeNull();
        expect(result.current.position?.altitudeAccuracy).toBeNull();
        expect(result.current.position?.heading).toBeNull();
        expect(result.current.position?.speed).toBeNull();
      });
    });
  });
});

describe('calculateDistance Utility', () => {
  it('should calculate distance between two close points', () => {
    const lat1 = 23.8103;
    const lon1 = 90.4125;
    const lat2 = 23.8104;
    const lon2 = 90.4126;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(20); // Should be less than 20 meters
  });

  it('should calculate distance between Dhaka and Chittagong', () => {
    const dhaka = { lat: 23.8103, lon: 90.4125 };
    const chittagong = { lat: 22.3569, lon: 91.7832 };

    const distance = calculateDistance(dhaka.lat, dhaka.lon, chittagong.lat, chittagong.lon);

    expect(distance).toBeGreaterThan(200000); // ~200+ km
    expect(distance).toBeLessThan(250000);
  });

  it('should return 0 for same coordinates', () => {
    const lat = 23.8103;
    const lon = 90.4125;

    const distance = calculateDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  it('should calculate distance across equator', () => {
    const north = { lat: 10, lon: 0 };
    const south = { lat: -10, lon: 0 };

    const distance = calculateDistance(north.lat, north.lon, south.lat, south.lon);

    expect(distance).toBeGreaterThan(2200000); // ~2200+ km
  });

  it('should calculate distance across prime meridian', () => {
    const west = { lat: 0, lon: -10 };
    const east = { lat: 0, lon: 10 };

    const distance = calculateDistance(west.lat, west.lon, east.lat, east.lon);

    expect(distance).toBeGreaterThan(2200000); // ~2200+ km
  });

  it('should handle negative coordinates', () => {
    const lat1 = -23.8103;
    const lon1 = -90.4125;
    const lat2 = -23.8104;
    const lon2 = -90.4126;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(20);
  });

  it('should be symmetric (same distance both directions)', () => {
    const lat1 = 23.8103;
    const lon1 = 90.4125;
    const lat2 = 22.3569;
    const lon2 = 91.7832;

    const distance1 = calculateDistance(lat1, lon1, lat2, lon2);
    const distance2 = calculateDistance(lat2, lon2, lat1, lon1);

    expect(distance1).toBe(distance2);
  });

  it('should handle very small differences', () => {
    const lat1 = 23.810300;
    const lon1 = 90.412500;
    const lat2 = 23.810301;
    const lon2 = 90.412501;

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(2); // Should be less than 2 meters
  });

  it('should handle large distances', () => {
    const newYork = { lat: 40.7128, lon: -74.0060 };
    const london = { lat: 51.5074, lon: -0.1278 };

    const distance = calculateDistance(newYork.lat, newYork.lon, london.lat, london.lon);

    expect(distance).toBeGreaterThan(5500000); // ~5500+ km
    expect(distance).toBeLessThan(5600000);
  });
});
