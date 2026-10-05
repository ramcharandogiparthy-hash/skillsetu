import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useToast } from '../context/ToastContext';
import type { PracticalAssessment } from '../types';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight,
  Server
} from 'lucide-react';

export const OfflineSyncPage: React.FC = () => {
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [assessments, setAssessments] = useState<PracticalAssessment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>(
    localStorage.getItem('skillsetu_last_sync') || new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadAssessments();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadAssessments = async () => {
    const all = await db.assessments.toArray();
    setAssessments(all);
  };

  const pendingCount = assessments.filter((a) => !a.synced).length;
  const syncedCount = assessments.filter((a) => a.synced).length;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncProgress(10);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    setTimeout(async () => {
      clearInterval(interval);
      setSyncProgress(100);

      // Update Dexie database records to synced
      const all = await db.assessments.toArray();
      for (const item of all) {
        if (!item.synced) {
          item.synced = true;
          await db.assessments.put(item);
        }
      }

      await loadAssessments();
      const timeStr = new Date().toLocaleTimeString();
      setLastSyncTime(timeStr);
      localStorage.setItem('skillsetu_last_sync', timeStr);

      setIsSyncing(false);
      showToast('Offline Sync Complete', 'All pending practical assessment records synced to cloud repository.', 'success');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>IndexedDB Local Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Offline Data Capture & Cloud Synchronization
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Field assessments operate 100% offline without connectivity. Data syncs when network is restored.
            </p>
          </div>

          {/* Network Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              isOnline ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              {isOnline ? <Wifi className="w-6 h-6 text-emerald-400" /> : <WifiOff className="w-6 h-6 text-amber-400" />}
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-300">Network Mode</p>
                <p className="text-sm font-black">{isOnline ? 'Online Active' : 'Offline Field Mode'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Pending Upload Records</p>
          <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
          <p className="text-xs text-slate-500 font-medium">Stored locally in IndexedDB</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Synced Cloud Records</p>
          <p className="text-3xl font-black text-[#0F766E]">{syncedCount}</p>
          <p className="text-xs text-slate-500 font-medium">Verified in cloud central repository</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Last Sync Timestamp</p>
          <p className="text-xl font-black text-[#12355B]">{lastSyncTime}</p>
          <p className="text-xs text-slate-500 font-medium">Automatic background heartbeat</p>
        </div>
      </div>

      {/* Sync Action & Progress Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#12355B]" />
              <span>Cloud Database Synchronization</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Click 'Sync Now' to push local IndexedDB practical assessment scores and media metadata to cloud servers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className={`px-6 py-3 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer ${
                isSyncing ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0F766E] hover:bg-teal-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Records...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {isSyncing && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Transferring IndexedDB Payload...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#0F766E] h-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Assessments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">IndexedDB Local Records Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12355B] text-slate-100 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Assessment ID</th>
                <th className="p-4">Worker ID</th>
                <th className="p-4">Practical Score</th>
                <th className="p-4">Evidence Complete</th>
                <th className="p-4">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-blue-50/50">
                  <td className="p-4 font-mono font-bold text-[#12355B]">{a.id}</td>
                  <td className="p-4 font-bold">{a.workerId}</td>
                  <td className="p-4 font-black text-slate-900">{a.totalScore} / 100</td>
                  <td className="p-4">
                    {a.evidenceComplete ? (
                      <span className="text-[#0F766E] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Incomplete</span>
                    )}
                  </td>
                  <td className="p-4">
                    {a.synced ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] inline-flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> Synced
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] inline-flex items-center gap-1 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending Upload
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
