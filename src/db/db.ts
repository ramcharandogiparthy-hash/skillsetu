import Dexie, { type Table } from 'dexie';
import type {
  WorkerProfile,
  SelfDeclaration,
  PracticalAssessment,
  AIEvidenceAnalysis,
  FinalDecisionRecord,
  AuditLog,
  IndianStandard,
  AIConversation,
  AIMessage,
  AIAnalyticsRecord,
  OfflineSyncQueueItem
} from '../types';

export class SkillSetuDatabase extends Dexie {
  workers!: Table<WorkerProfile>;
  selfDeclarations!: Table<SelfDeclaration>;
  assessments!: Table<PracticalAssessment>;
  aiAnalyses!: Table<AIEvidenceAnalysis>;
  finalResults!: Table<FinalDecisionRecord>;
  auditLogs!: Table<AuditLog>;
  isStandards!: Table<IndianStandard>;
  aiConversations!: Table<AIConversation>;
  aiMessages!: Table<AIMessage>;
  aiAnalytics!: Table<AIAnalyticsRecord>;
  offlineSyncQueue!: Table<OfflineSyncQueueItem>;

  constructor() {
    super('SkillSetuRPLDB');
    this.version(1).stores({
      workers: 'id, fullName, mobileNumber, trade, district, state',
      selfDeclarations: 'id, workerId, trade, completed',
      assessments: 'id, workerId, assessorId, status, synced',
      aiAnalyses: 'id, assessmentId, workerId',
      finalResults: 'id, assessmentId, workerId, finalDecision',
      auditLogs: 'id, timestamp, workerName, assessorName'
    });

    this.version(2).stores({
      workers: 'id, fullName, mobileNumber, trade, district, state',
      selfDeclarations: 'id, workerId, trade, completed',
      assessments: 'id, workerId, assessorId, status, synced',
      aiAnalyses: 'id, assessmentId, workerId',
      finalResults: 'id, assessmentId, workerId, finalDecision',
      auditLogs: 'id, timestamp, workerName, assessorName',
      isStandards: 'id, isNumber, code, category',
      aiConversations: 'id, userId, title, createdAt',
      aiMessages: 'id, conversationId, role, createdAt',
      aiAnalytics: 'id, timestamp, category, requestedStandard'
    });

    this.version(3).stores({
      workers: 'id, fullName, mobileNumber, trade, district, state',
      selfDeclarations: 'id, workerId, trade, completed',
      assessments: 'id, workerId, assessorId, status, synced',
      aiAnalyses: 'id, assessmentId, workerId',
      finalResults: 'id, assessmentId, workerId, finalDecision',
      auditLogs: 'id, timestamp, workerName, assessorName',
      isStandards: 'id, isNumber, code, category',
      aiConversations: 'id, userId, title, createdAt',
      aiMessages: 'id, conversationId, role, createdAt',
      aiAnalytics: 'id, timestamp, category, requestedStandard',
      offlineSyncQueue: 'id, timestamp, status, entity'
    });
  }
}

export const db = new SkillSetuDatabase();


