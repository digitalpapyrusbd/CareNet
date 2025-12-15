import { useEffect, useState, useCallback, useRef } from 'react';
import { offlineService } from '@/lib/offline-service';

interface UseOfflineSyncOptions {
  onSyncStart?: () => void;
  onSyncComplete?: (success: boolean, itemCount: number) => void;
  onSyncError?: (error: string) => void;
  autoSync?: boolean;
  syncInterval?: number; // in milliseconds
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  queueLength: number;
}

const getTimerFns = () => {
  const setIntervalFn =
    (typeof globalThis !== 'undefined' && globalThis.setInterval)
      || (typeof window !== 'undefined' ? window.setInterval : undefined);
  const clearIntervalFn =
    (typeof globalThis !== 'undefined' && globalThis.clearInterval)
      || (typeof window !== 'undefined' ? window.clearInterval : undefined);

  return { setIntervalFn, clearIntervalFn } as const;
};

export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    queueLength: 0,
  });
  const syncInProgressRef = useRef(false);

  // Update online status
  const updateOnlineStatus = useCallback(() => {
    setSyncStatus(prev => ({
      ...prev,
      isOnline: navigator.onLine,
    }));
  }, []);

  // Get sync status
  const updateSyncStatus = useCallback(async () => {
    try {
      const status = await offlineService.getSyncStatus();
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: status.lastSyncTime,
        queueLength: status.queueLength,
      }));
    } catch (error) {
      console.error('Failed to get sync status:', error);
    }
  }, []);

  // Manual sync
  const sync = useCallback(async () => {
    if (syncInProgressRef.current) return;

    syncInProgressRef.current = true;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    if (options.onSyncStart) {
      options.onSyncStart();
    }

    try {
      await offlineService.forceSync();
      
      const status = await offlineService.getSyncStatus();
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: status.lastSyncTime,
        queueLength: status.queueLength,
      }));
      
      if (options.onSyncComplete) {
        options.onSyncComplete(true, status.queueLength);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      
      if (options.onSyncError) {
        options.onSyncError(error.message || 'Unknown sync error');
      }
      
      if (options.onSyncComplete) {
        options.onSyncComplete(false, 0);
      }
    } finally {
      syncInProgressRef.current = false;
    }
  }, [options.onSyncStart, options.onSyncComplete, options.onSyncError]);

  // Get offline data
  const getOfflineData = useCallback(async (type: any) => {
    try {
      return await offlineService.getOfflineData(type);
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return [];
    }
  }, []);

  // Store offline data
  const storeOfflineData = useCallback(async (type: string, data: any) => {
    try {
      await offlineService.storeOfflineData(type, data);
      
      // Update sync status
      await updateSyncStatus();
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }, [updateSyncStatus]);

  // Clear offline data
  const clearOfflineData = useCallback(async (type?: string) => {
    try {
      if (type) {
        // Clear specific type
        const data = await offlineService.getOfflineData(type);
        for (const item of data) {
          await offlineService.deleteOfflineData(item.id);
        }
      } else {
        // Clear all data
        await offlineService.clearOfflineData();
      }
      
      // Update sync status
      await updateSyncStatus();
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, [updateSyncStatus]);

  // Initialize effects
  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateSyncStatus();

    let interval: ReturnType<typeof setInterval> | null = null;
    const { setIntervalFn, clearIntervalFn } = getTimerFns();
    if (options.autoSync && options.syncInterval && typeof setIntervalFn === 'function') {
      interval = setIntervalFn(async () => {
        if (navigator.onLine && !syncStatus.isSyncing) {
          await sync();
        }
      }, options.syncInterval);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (interval && typeof clearIntervalFn === 'function') {
        clearIntervalFn(interval as any);
      }
    };
  }, [updateOnlineStatus, updateSyncStatus, sync, options.autoSync, options.syncInterval, syncStatus.isSyncing]);

  return {
    syncStatus,
    sync,
    getOfflineData,
    storeOfflineData,
    clearOfflineData,
  };
}