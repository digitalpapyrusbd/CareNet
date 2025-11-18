'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PendingAction {
  id: string;
  type: string;
  timestamp: number;
  data: any;
}

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [cachedPages, setCachedPages] = useState<string[]>([]);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger background sync
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('sync-care-logs');
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions from IndexedDB
    loadPendingActions();

    // Get cached pages from service worker
    getCachedPages();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingActions = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('pending-actions', 'readonly');
      const store = tx.objectStore('pending-actions');
      const actions = await store.getAll();
      setPendingActions(actions);
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  };

  const getCachedPages = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const cache = await caches.open(cacheNames[0] || 'caregiver-v1');
      const requests = await cache.keys();
      const pages = requests.map((req) => new URL(req.url).pathname);
      setCachedPages([...new Set(pages)].filter((p) => p !== '/offline'));
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CaregiverDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pending-actions')) {
          db.createObjectStore('pending-actions', { keyPath: 'id' });
        }
      };
    });
  };

  const handleRetry = () => {
    if (navigator.onLine) {
      router.back();
    } else {
      window.location.reload();
    }
  };

  const handleGoToCached = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Offline Icon */}
        <div className="text-center mb-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isOnline ? 'Connection Restored' : 'You&apos;re Offline'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {isOnline
              ? 'Your connection has been restored. Syncing pending actions...'
              : 'No internet connection. Some features may be limited, but you can still view cached data.'}
          </p>

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-8">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors min-h-[48px]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isOnline ? 'Go Back' : 'Try Again'}
          </button>
        </div>

        {/* Pending Actions Queue */}
        {pendingActions.length > 0 && (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Pending Actions ({pendingActions.length})
              </h3>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
              These actions will be synced automatically when you&apos;re back online:
            </p>
            <ul className="space-y-2">
              {pendingActions.slice(0, 5).map((action) => (
                <li
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {action.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(action.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    Queued
                  </div>
                </li>
              ))}
            </ul>
            {pendingActions.length > 5 && (
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                +{pendingActions.length - 5} more actions
              </p>
            )}
          </div>
        )}

        {/* Cached Pages */}
        {cachedPages.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Available Offline
              </h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              You can access these cached pages while offline:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cachedPages.slice(0, 8).map((path) => (
                <button
                  key={path}
                  onClick={() => handleGoToCached(path)}
                  className="p-2 text-left text-sm bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors min-h-[44px]"
                >
                  {path === '/' ? 'Home' : path.split('/').pop() || path}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Offline Mode Notice */}
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Offline Mode Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View previously loaded pages and data</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Create check-ins and care logs (saved locally)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Automatic sync when connection restored</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Some features require internet connection</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
