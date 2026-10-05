import React from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, RefreshCw } from 'lucide-react';

export const NetworkStatusBadge: React.FC = () => {
  const { syncStatus, isInstallable, promptInstallPWA, triggerSync } = usePWA();

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* PWA Install Button if eligible */}
      {isInstallable && (
        <button
          onClick={promptInstallPWA}
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#12355B] font-extrabold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition"
          title="Install App as PWA"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>
      )}

      {/* Network Indicator Badge */}
      {syncStatus === 'online' && (
        <span 
          onClick={triggerSync}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/40 cursor-pointer hover:bg-emerald-500/30 transition"
          title="🟢 Online - Click to trigger sync check"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>🟢 Online</span>
        </span>
      )}

      {syncStatus === 'offline' && (
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-[11px] border border-rose-500/40"
          title="🔴 Offline - Saved locally in IndexedDB"
        >
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>🔴 Offline</span>
        </span>
      )}

      {syncStatus === 'syncing' && (
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/40"
          title="🟡 Syncing local data with cloud"
        >
          <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
          <span>🟡 Syncing</span>
        </span>
      )}
    </div>
  );
};
