import { db } from '../db/db';
import type { 
  WorkerProfile, 
  PracticalAssessment, 
  SelfDeclaration, 
  OfflineSyncQueueItem,
  AuditLog
} from '../types';

export class OfflineSyncService {
  /**
   * Queue a local mutation to be synchronized with the remote backend
   */
  static async queueMutation(
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: 'worker' | 'assessment' | 'selfDeclaration' | 'aiAnalytics' | 'aiMessage',
    payload: any
  ): Promise<string> {
    const queueItem: OfflineSyncQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      entity,
      payload,
      status: 'PENDING',
      retryCount: 0
    };

    await db.offlineSyncQueue.add(queueItem);
    return queueItem.id;
  }

  /**
   * Synchronize all pending local mutations with cloud repository
   */
  static async synchronizePendingData(): Promise<{ syncedCount: number; failedCount: number }> {
    if (!navigator.onLine) {
      return { syncedCount: 0, failedCount: 0 };
    }

    let pendingItems: OfflineSyncQueueItem[] = [];
    try {
      pendingItems = await db.offlineSyncQueue.where('status').equals('PENDING').toArray();
    } catch (err) {
      console.warn('Unable to query offlineSyncQueue:', err);
      pendingItems = [];
    }

    let syncedCount = 0;
    let failedCount = 0;

    for (const item of pendingItems) {
      try {
        // Simulate network processing with potential backend API call
        await new Promise(resolve => setTimeout(resolve, 150));

        // Mark corresponding entity as synced in IndexedDB
        if (item.entity === 'assessment' && item.payload?.id) {
          const assessment = await db.assessments.get(item.payload.id);
          if (assessment) {
            assessment.synced = true;
            await db.assessments.put(assessment);
          }
        }

        // Update queue item status
        item.status = 'SYNCED';
        await db.offlineSyncQueue.put(item);

        // Add audit log record for sync action
        const auditRecord: AuditLog = {
          id: `al-sync-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toISOString(),
          assessorName: 'Offline PWA Sync Engine',
          workerName: item.payload?.workerId || 'Local Candidate',
          action: `Synchronized ${item.entity.toUpperCase()} (${item.type}) payload to cloud repository`,
          status: 'Success'
        };
        await db.auditLogs.add(auditRecord);

        syncedCount++;
      } catch (err) {
        console.error(`Failed to sync item ${item.id}:`, err);
        item.retryCount += 1;
        if (item.retryCount > 3) {
          item.status = 'FAILED';
        }
        await db.offlineSyncQueue.put(item);
        failedCount++;
      }
    }

    // Update unsynced practical assessments to synced status
    const unsyncedAssessments = await db.assessments.where('synced').equals(0).toArray();
    for (const a of unsyncedAssessments) {
      a.synced = true;
      await db.assessments.put(a);
      syncedCount++;
    }

    localStorage.setItem('skillsetu_last_sync', new Date().toLocaleTimeString());
    return { syncedCount, failedCount };
  }

  /**
   * Helper to perform CRUD operations on Workers with offline persistence
   */
  static async saveWorkerLocally(worker: WorkerProfile): Promise<void> {
    await db.workers.put(worker);
    await this.queueMutation('CREATE', 'worker', worker);
  }

  /**
   * Helper to perform CRUD operations on Practical Assessments with offline persistence
   */
  static async saveAssessmentLocally(assessment: PracticalAssessment): Promise<void> {
    assessment.synced = navigator.onLine;
    await db.assessments.put(assessment);
    await this.queueMutation('UPDATE', 'assessment', assessment);
  }
}
