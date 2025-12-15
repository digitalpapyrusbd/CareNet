import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { useOfflineSync } from '../useOfflineSync';
import { offlineService } from '@/lib/offline-service';

const TEST_SYNC_INTERVAL = 50;
const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
type OfflineSyncOptions = Parameters<typeof useOfflineSync>[0];

const renderOfflineSyncHook = async (options?: OfflineSyncOptions) => {
  const rendered = renderHook(() => useOfflineSync(options));
  await act(async () => {
    await Promise.resolve();
  });
  return rendered;
};

// Mock offline service
jest.mock('@/lib/offline-service', () => ({
  offlineService: {
    getSyncStatus: jest.fn(),
    forceSync: jest.fn(),
    getOfflineData: jest.fn(),
    storeOfflineData: jest.fn(),
    deleteOfflineData: jest.fn(),
    clearOfflineData: jest.fn(),
  },
}));

describe('useOfflineSync Hook', () => {
  // Use stable callback references to prevent effect re-runs
  const mockOnSyncStart = jest.fn();
  const mockOnSyncComplete = jest.fn();
  const mockOnSyncError = jest.fn();

  // Store original navigator.onLine descriptor
  const originalOnLineDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    'onLine'
  );

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
      lastSyncTime: Date.now(),
      queueLength: 0,
    });

    (offlineService.forceSync as jest.Mock).mockResolvedValue(undefined);
    (offlineService.getOfflineData as jest.Mock).mockResolvedValue([]);
    (offlineService.storeOfflineData as jest.Mock).mockResolvedValue(undefined);
    (offlineService.clearOfflineData as jest.Mock).mockResolvedValue(undefined);
    (offlineService.deleteOfflineData as jest.Mock).mockResolvedValue(undefined);

    // Reset navigator.onLine to true for each test
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();

    if (originalOnLineDescriptor) {
      Object.defineProperty(navigator, 'onLine', originalOnLineDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'onLine');
    }
  });

  describe('Initialization', () => {
    it('should initialize with correct state', async () => {
      const { result } = await renderOfflineSyncHook();

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(true);
        expect(result.current.syncStatus.isSyncing).toBe(false);
        expect(result.current.syncStatus.queueLength).toBe(0);
      });
    });

    it('should return all required functions', async () => {
      const { result } = await renderOfflineSyncHook();

      expect(result.current.sync).toBeDefined();
      expect(result.current.getOfflineData).toBeDefined();
      expect(result.current.storeOfflineData).toBeDefined();
      expect(result.current.clearOfflineData).toBeDefined();
      expect(typeof result.current.sync).toBe('function');
    });

    it('should fetch initial sync status on mount', async () => {
      await renderOfflineSyncHook();

      await waitFor(() => {
        expect(offlineService.getSyncStatus).toHaveBeenCalled();
      });
    });

    it('should add online/offline event listeners on mount', async () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      await renderOfflineSyncHook();

      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });

  describe('Online/Offline Status', () => {
    it('should update status when going offline', async () => {
      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(true);
      });

      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: false });
        window.dispatchEvent(new Event('offline'));
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(false);
      });
    });

    it('should update status when going online', async () => {
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false });

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(false);
      });

      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: true });
        window.dispatchEvent(new Event('online'));
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(true);
      });
    });
  });

  describe('Manual Sync', () => {
    it('should sync successfully', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 5,
      });

      const { result } = renderHook(() => useOfflineSync());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(offlineService.forceSync).toHaveBeenCalled();
      expect(result.current.syncStatus.isSyncing).toBe(false);
    });

    it('should set isSyncing state during sync', async () => {
      let resolveForceSyncPromise: () => void;
      const forceSyncPromise = new Promise<void>((resolve) => {
        resolveForceSyncPromise = resolve;
      });
      (offlineService.forceSync as jest.Mock).mockReturnValue(forceSyncPromise);

      const { result } = renderHook(() => useOfflineSync());

      await act(async () => {
        result.current.sync();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isSyncing).toBe(true);
      });

      await act(async () => {
        resolveForceSyncPromise!();
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isSyncing).toBe(false);
      });
    });

    it('should call onSyncStart callback', async () => {
      const { result } = renderHook(() =>
        useOfflineSync({ onSyncStart: mockOnSyncStart })
      );

      await act(async () => {
        await result.current.sync();
      });

      expect(mockOnSyncStart).toHaveBeenCalled();
    });

    it('should call onSyncComplete callback with success', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 3,
      });

      const { result } = renderHook(() =>
        useOfflineSync({ onSyncComplete: mockOnSyncComplete })
      );

      await act(async () => {
        await result.current.sync();
      });

      expect(mockOnSyncComplete).toHaveBeenCalledWith(true, 3);
    });

    it('should handle sync errors', async () => {
      (offlineService.forceSync as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() =>
        useOfflineSync({ onSyncError: mockOnSyncError, onSyncComplete: mockOnSyncComplete })
      );

      await act(async () => {
        await result.current.sync();
      });

      expect(mockOnSyncError).toHaveBeenCalledWith('Network error');
      expect(mockOnSyncComplete).toHaveBeenCalledWith(false, 0);
      expect(result.current.syncStatus.isSyncing).toBe(false);
    });

    it('should prevent concurrent syncs', async () => {
      let resolveForceSyncPromise: () => void;
      const forceSyncPromise = new Promise<void>((resolve) => {
        resolveForceSyncPromise = resolve;
      });
      (offlineService.forceSync as jest.Mock).mockReturnValue(forceSyncPromise);

      const { result } = renderHook(() => useOfflineSync());

      expect(result.current).toBeTruthy();

      await act(async () => {
        result.current.sync();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isSyncing).toBe(true);
      });

      // Try to sync again while first sync is in progress
      await act(async () => {
        await result.current.sync();
      });

      // Should only call forceSync once
      expect(offlineService.forceSync).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveForceSyncPromise!();
      });
    });

    it('should update lastSyncTime after successful sync', async () => {
      const syncTime = Date.now();
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: syncTime,
        queueLength: 0,
      });

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus.lastSyncTime).toBe(syncTime);
    });

    it('should update queueLength after sync', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 7,
      });

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus.queueLength).toBe(7);
    });
  });

  describe('Auto Sync', () => {

    it('should auto sync at specified interval when online', async () => {
      const { result } = renderHook(() =>
        useOfflineSync({ autoSync: true, syncInterval: TEST_SYNC_INTERVAL })
      );

      await waitFor(() => {
        expect(offlineService.getSyncStatus).toHaveBeenCalled();
      });

      // Clear initial calls
      jest.clearAllMocks();

      await act(async () => {
        await sleep(TEST_SYNC_INTERVAL + 10);
      });

      await waitFor(() => {
        expect(offlineService.forceSync).toHaveBeenCalled();
      });
    });

    it('should not auto sync when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false });

      renderHook(() =>
        useOfflineSync({ autoSync: true, syncInterval: TEST_SYNC_INTERVAL })
      );

      await waitFor(() => {
        expect(offlineService.getSyncStatus).toHaveBeenCalled();
      });

      jest.clearAllMocks();

      await act(async () => {
        await sleep(TEST_SYNC_INTERVAL + 10);
      });

      await waitFor(() => {
        expect(offlineService.forceSync).not.toHaveBeenCalled();
      });
    });

    it('should not auto sync if autoSync is false', async () => {
      renderHook(() => useOfflineSync({ autoSync: false, syncInterval: TEST_SYNC_INTERVAL }));

      await waitFor(() => {
        expect(offlineService.getSyncStatus).toHaveBeenCalled();
      });

      jest.clearAllMocks();

      await act(async () => {
        await sleep(TEST_SYNC_INTERVAL * 2);
      });

      expect(offlineService.forceSync).not.toHaveBeenCalled();
    });

    it('should clear interval on unmount', async () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() =>
        useOfflineSync({ autoSync: true, syncInterval: TEST_SYNC_INTERVAL })
      );

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should not auto sync during manual sync', async () => {
      let resolveForceSyncPromise: () => void;
      const forceSyncPromise = new Promise<void>((resolve) => {
        resolveForceSyncPromise = resolve;
      });
      (offlineService.forceSync as jest.Mock).mockReturnValue(forceSyncPromise);

      const { result } = renderHook(() =>
        useOfflineSync({ autoSync: true, syncInterval: TEST_SYNC_INTERVAL })
      );

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      // Start manual sync
      await act(async () => {
        result.current.sync();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isSyncing).toBe(true);
      });

      jest.clearAllMocks();

      // Trigger auto sync while manual sync is in progress
      await act(async () => {
        await sleep(TEST_SYNC_INTERVAL + 10);
      });

      // Should not call forceSync again
      expect(offlineService.forceSync).not.toHaveBeenCalled();

      await act(async () => {
        resolveForceSyncPromise!();
      });
    });
  });

  describe('getOfflineData', () => {

    it('should retrieve offline data by type', async () => {
      const mockData = [{ id: 1, data: 'test' }];
      (offlineService.getOfflineData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      let data: any;
      await act(async () => {
        data = await result.current.getOfflineData('care-logs');
      });

      expect(offlineService.getOfflineData).toHaveBeenCalledWith('care-logs');
      expect(data).toEqual(mockData);
    });

    it('should return empty array on error', async () => {
      (offlineService.getOfflineData as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      let data: any;
      await act(async () => {
        data = await result.current.getOfflineData('care-logs');
      });

      expect(data).toEqual([]);
    });
  });

  describe('storeOfflineData', () => {

    it('should store offline data', async () => {
      const mockData = { id: 1, description: 'Test log' };

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.storeOfflineData('care-logs', mockData);
      });

      expect(offlineService.storeOfflineData).toHaveBeenCalledWith('care-logs', mockData);
    });

    it('should update sync status after storing', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 1,
      });

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.storeOfflineData('care-logs', { id: 1 });
      });

      await waitFor(() => {
        expect(result.current.syncStatus.queueLength).toBe(1);
      });
    });

    it('should handle storage errors', async () => {
      (offlineService.storeOfflineData as jest.Mock).mockRejectedValue(
        new Error('Storage full')
      );

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.storeOfflineData('care-logs', { id: 1 });
      });

      // Should not throw
      expect(offlineService.storeOfflineData).toHaveBeenCalled();
    });
  });

  describe('clearOfflineData', () => {

    it('should clear all offline data when no type specified', async () => {
      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.clearOfflineData();
      });

      expect(offlineService.clearOfflineData).toHaveBeenCalled();
    });

    it('should clear specific type of offline data', async () => {
      (offlineService.getOfflineData as jest.Mock).mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.clearOfflineData('care-logs');
      });

      expect(offlineService.getOfflineData).toHaveBeenCalledWith('care-logs');
      expect(offlineService.deleteOfflineData).toHaveBeenCalledTimes(2);
      expect(offlineService.deleteOfflineData).toHaveBeenCalledWith(1);
      expect(offlineService.deleteOfflineData).toHaveBeenCalledWith(2);
    });

    it('should update sync status after clearing', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 0,
      });

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.clearOfflineData();
      });

      await waitFor(() => {
        expect(offlineService.getSyncStatus).toHaveBeenCalled();
      });
    });

    it('should handle clear errors', async () => {
      (offlineService.clearOfflineData as jest.Mock).mockRejectedValue(
        new Error('Clear failed')
      );

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.clearOfflineData();
      });

      // Should not throw
      expect(offlineService.clearOfflineData).toHaveBeenCalled();
    });
  });

  describe('Real-world Scenarios', () => {

    it('should handle offline-first workflow', async () => {
      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      // Store data while offline
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false });
      act(() => {
        window.dispatchEvent(new Event('offline'));
      });

      await act(async () => {
        await result.current.storeOfflineData('care-logs', { id: 1, data: 'test' });
      });

      expect(offlineService.storeOfflineData).toHaveBeenCalled();

      // Go back online
      Object.defineProperty(navigator, 'onLine', { writable: true, value: true });
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      // Sync
      await act(async () => {
        await result.current.sync();
      });

      expect(offlineService.forceSync).toHaveBeenCalled();
    });

    it('should handle complete sync lifecycle with callbacks', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockResolvedValue({
        lastSyncTime: Date.now(),
        queueLength: 5,
      });

      const { result } = renderHook(() =>
        useOfflineSync({
          onSyncStart: mockOnSyncStart,
          onSyncComplete: mockOnSyncComplete,
        })
      );

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(mockOnSyncStart).toHaveBeenCalled();
      expect(offlineService.forceSync).toHaveBeenCalled();
      expect(mockOnSyncComplete).toHaveBeenCalledWith(true, 5);
    });

    it('should retrieve and clear offline data', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      (offlineService.getOfflineData as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      // Get data
      let data: any;
      await act(async () => {
        data = await result.current.getOfflineData('care-logs');
      });

      expect(data).toEqual(mockData);

      // Clear data
      await act(async () => {
        await result.current.clearOfflineData('care-logs');
      });

      expect(offlineService.deleteOfflineData).toHaveBeenCalledTimes(2);
    });

    it('should handle network recovery with auto sync', async () => {
      // Start offline
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false });

      const { result } = renderHook(() =>
        useOfflineSync({ autoSync: true, syncInterval: TEST_SYNC_INTERVAL })
      );

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(false);
      });

      jest.clearAllMocks();

      // Network comes back
      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: true });
        window.dispatchEvent(new Event('online'));
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(true);
      });

      // Auto sync should trigger
      await act(async () => {
        await sleep(TEST_SYNC_INTERVAL + 10);
      });

      await waitFor(() => {
        expect(offlineService.forceSync).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {

    it('should handle getSyncStatus error on initialization', async () => {
      (offlineService.getSyncStatus as jest.Mock).mockRejectedValue(
        new Error('Database not available')
      );

      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current.syncStatus.lastSyncTime).toBeNull();
      });
    });

    it('should handle sync error without message', async () => {
      (offlineService.forceSync as jest.Mock).mockRejectedValue({});

      const { result } = renderHook(() =>
        useOfflineSync({ onSyncError: mockOnSyncError })
      );

      await waitFor(() => {
        expect(result.current).not.toBeNull();
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(mockOnSyncError).toHaveBeenCalledWith('Unknown sync error');
    });

    it('should handle rapid online/offline changes', async () => {
      const { result } = renderHook(() => useOfflineSync());

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(true);
      });

      // Rapid changes
      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: false });
        window.dispatchEvent(new Event('offline'));
      });

      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: true });
        window.dispatchEvent(new Event('online'));
      });

      act(() => {
        Object.defineProperty(navigator, 'onLine', { writable: true, value: false });
        window.dispatchEvent(new Event('offline'));
      });

      await waitFor(() => {
        expect(result.current.syncStatus.isOnline).toBe(false);
      });
    });
  });
});
