import { PrismaClient } from '@prisma/client';

interface OfflineData {
  id: string;
  type: 'care_log' | 'job_assignment' | 'patient_info' | 'payment_info';
  data: any;
  timestamp: number;
  synced: boolean;
}

type OfflineDataType = 'care_log' | 'job_assignment' | 'patient_info' | 'payment_info';

interface SyncQueue {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineService {
  private db: PrismaClient;
  private dbName = 'caregiver_offline';
  private storeName = 'offline_queue';
  private maxRetries = 3;
  private syncInterval = 30000; // 30 seconds

  constructor() {
    this.db = new PrismaClient();
    this.initializeOfflineStorage();
    this.startPeriodicSync();
  }

  // Initialize IndexedDB for offline storage
  private initializeOfflineStorage(): void {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
      };
      
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = event.target.result as IDBDatabase;
        
        // Create object stores for different data types
        if (!db.objectStoreNames.contains('offline_data')) {
          db.createObjectStore('offline_data', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
      };
    }
  }

  // Store data for offline use
  async storeOfflineData(type: OfflineDataType, data: any, id?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const offlineData: OfflineData = {
      id: id || this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    this.storeData('offline_data', offlineData);
  }

  // Get offline data by type
  async getOfflineData(type: string): Promise<OfflineData[]> {
    if (typeof window === 'undefined') return [];
    
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readonly');
        const store = transaction.objectStore('offline_data');
        const index = store.index('type');
        
        const request = index.getAll(type);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
      };
    });
  }

  // Queue action for sync when online
  private queueSyncAction(action: 'create' | 'update' | 'delete', entityType: string, entityId: string, data?: any): void {
    const syncItem: SyncQueue = {
      id: this.generateId(),
      action,
      entityType,
      entityId,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.storeData('sync_queue', syncItem);
  }

  // Store data in IndexedDB
  private storeData(storeName: string, data: any): void {
    const request = indexedDB.open(this.dbName, 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.add(data);
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start periodic sync when online
  private startPeriodicSync(): void {
    setInterval(() => {
      if (navigator.onLine) {
        this.processSyncQueue();
      }
    }, this.syncInterval);
  }

  // Process sync queue
  private async processSyncQueue(): Promise<void> {
    const queueItems = await this.getSyncQueue();
    
    for (const item of queueItems) {
      if (item.retryCount >= this.maxRetries) {
        // Remove item after max retries
        await this.removeFromSyncQueue(item.id);
        continue;
      }

      try {
        await this.syncItem(item);
        // Mark as synced and remove from queue
        await this.markAsSynced(item.id);
        await this.removeFromSyncQueue(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        // Increment retry count
        await this.incrementRetryCount(item.id);
      }
    }
  }

  // Sync individual item to server
  private async syncItem(item: SyncQueue): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const url = `/api/sync/${item.entityType}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: item.action,
        data: item.data,
        entityId: item.entityId,
      }),
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      // Update local data to reflect sync
      if (item.action === 'create') {
        await this.updateOfflineData(item.entityId, result.data);
      } else if (item.action === 'update') {
        await this.updateOfflineData(item.entityId, result.data);
      } else if (item.action === 'delete') {
        await this.deleteOfflineData(item.entityId);
      }
    }
  }

  // Get sync queue
  private async getSyncQueue(): Promise<SyncQueue[]> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['sync_queue'], 'readonly');
        const store = transaction.objectStore('sync_queue');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      };
    });
  }

  // Remove item from sync queue
  private async removeFromSyncQueue(id: string): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['sync_queue'], 'readwrite');
        const store = transaction.objectStore('sync_queue');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      };
    });
  }

  // Mark item as synced
  private async markAsSynced(id: string): Promise<void> {
    const queueItems = await this.getSyncQueue();
    const item = queueItems.find(item => item.id === id);
    
    if (item) {
      const offlineData = await this.getOfflineDataById(id);
      if (offlineData) {
        offlineData.synced = true;
        await this.updateOfflineDataById(id, offlineData);
      }
    }
  }

  // Update offline data
  private async updateOfflineData(id: string, data: any): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readwrite');
        const store = transaction.objectStore('offline_data');
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
          const existingData = getRequest.result;
          if (existingData) {
            const updatedData = { ...existingData, data };
            const putRequest = store.put(updatedData);
            putRequest.onsuccess = () => resolve();
          } else {
            resolve();
          }
        };
      };
    });
  }

  // Update offline data by ID
  private async updateOfflineDataById(id: string, data: OfflineData): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readwrite');
        const store = transaction.objectStore('offline_data');
        const request = store.put(data);
        request.onsuccess = () => resolve();
      };
    });
  }

  // Delete offline data
  public async deleteOfflineData(id: string): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readwrite');
        const store = transaction.objectStore('offline_data');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
      };
    });
  }

  // Get offline data by ID
  private async getOfflineDataById(id: string): Promise<OfflineData | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readonly');
        const store = transaction.objectStore('offline_data');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      };
    });
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline_data'], 'readwrite');
        const store = transaction.objectStore('offline_data');
        const request = store.clear();
        request.onsuccess = () => resolve();
      };
    });
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    queueLength: number;
    lastSyncTime: number | null;
    isOnline: boolean;
  }> {
    const queueItems = await this.getSyncQueue();
    const lastSyncTime = localStorage.getItem('last_sync_time');
    
    return {
      queueLength: queueItems.length,
      lastSyncTime: lastSyncTime ? parseInt(lastSyncTime) : null,
      isOnline: navigator.onLine,
    };
  }

  // Force sync now
  async forceSync(): Promise<void> {
    if (navigator.onLine) {
      await this.processSyncQueue();
      localStorage.setItem('last_sync_time', Date.now().toString());
    }
  }
}

// Create singleton instance
export const offlineService = new OfflineService();