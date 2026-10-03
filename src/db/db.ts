import Dexie, { type Table } from 'dexie';
import type {
  WorkerProfile,
  SelfDeclaration,
  PracticalAssessment,
  AIEvidenceAnalysis,
  FinalDecisionRecord,
  AuditLog
} from '../types';

export class SkillSetuDatabase extends Dexie {
  workers!: Table<WorkerProfile>;
  selfDeclarations!: Table<SelfDeclaration>;
  assessments!: Table<PracticalAssessment>;
  aiAnalyses!: Table<AIEvidenceAnalysis>;
  finalResults!: Table<FinalDecisionRecord>;
  auditLogs!: Table<AuditLog>;

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
  }
}

export const db = new SkillSetuDatabase();
