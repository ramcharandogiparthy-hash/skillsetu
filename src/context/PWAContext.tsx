import React, { createContext, useContext, useState, useEffect } from 'react';
import { OfflineSyncService } from '../services/offlineSyncService';
import { useToast } from './ToastContext';

export type NetworkSyncStatus = 'online' | 'offline' | 'syncing';

interface PWAContextType {
  isOnline: boolean;
  syncStatus: NetworkSyncStatus;
  isInstallable: boolean;
  promptInstallPWA: () => void;
  triggerSync: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<NetworkSyncStatus>(
    navigator.onLine ? 'online' : 'offline'
  );
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // 1. Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Listen for online / offline status change events
    const handleOnline = async () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      showToast('Connection Restored', 'Internet connection restored. Syncing your local data...', 'info');

      try {
        const { syncedCount } = await OfflineSyncService.synchronizePendingData();
        setSyncStatus('online');
        if (syncedCount > 0) {
          showToast('Sync Complete', `Successfully synchronized ${syncedCount} records with cloud server.`, 'success');
        }
      } catch (err) {
        console.error('PWA Sync Error:', err);
        setSyncStatus('online');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
      showToast('Offline Mode Activated', 'You are offline. Your data will be saved locally in IndexedDB.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  const promptInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      showToast('PWA Installed', 'IS Guide AI is now installed on your device!', 'success');
    }
  };

  const triggerSync = async () => {
    if (!navigator.onLine) {
      showToast('Offline Mode', 'Cannot sync while offline. Data is safely stored in IndexedDB.', 'warning');
      return;
    }
    setSyncStatus('syncing');
    await OfflineSyncService.synchronizePendingData();
    setSyncStatus('online');
  };

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        syncStatus,
        isInstallable,
        promptInstallPWA,
        triggerSync
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
