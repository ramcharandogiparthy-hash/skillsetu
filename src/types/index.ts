export type UserRole = 'guest' | 'worker' | 'assessor' | 'admin';

export type AppLanguage = 'en' | 'te';

export interface WorkerProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  state: string;
  preferredLanguage: 'English' | 'Telugu' | 'Hindi';
  trade: 'Assistant Electrician';
  yearsOfExperience: number;
  workType: 'Independent' | 'Helper' | 'Supervisor' | 'Contractor';
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillAnswerOption = 
  | 'can_do_independently' 
  | 'can_do_with_help' 
  | 'have_seen' 
  | 'cannot_do';

export interface SelfDeclaration {
  id: string;
  workerId: string;
  trade: string;
  answers: Record<string, SkillAnswerOption>;
  score: number; // 0-100
  voiceNotesRecorded: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PracticalCriterion {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  category: 'tools' | 'safety' | 'wiring' | 'testing';
}

export interface PracticalAssessment {
  id: string;
  workerId: string;
  assessorId: string;
  assessorName: string;
  taskTitle: string;
  scoringLevels: Record<string, 'not_demonstrated' | 'needs_support' | 'demonstrated_independently'>;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number; // 0-100
  evidence: Array<{
    id: string;
    type: 'photo' | 'video';
    title: string;
    url: string;
    timestamp: string;
  }>;
  evidenceComplete: boolean;
  status: 'draft' | 'awaiting_approval' | 'approved' | 'gap_training' | 'reassessment' | 'rejected';
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export interface AIEvidenceAnalysis {
  id: string;
  assessmentId: string;
  workerId: string;
  safetyGlovesDetected: boolean;
  screwdriverDetected: boolean;
  testerDetected: boolean;
  imageQuality: 'Good' | 'Fair' | 'Poor';
  videoDuration: number; // seconds
  missingEvidence: string;
  confidence: 'High' | 'Medium' | 'Low';
  overrideApplied: boolean;
  overrideReason: string;
  createdAt: string;
}

export interface FinalDecisionRecord {
  id: string;
  assessmentId: string;
  workerId: string;
  selfDeclScore: number;
  practicalScore: number;
  finalScore: number; // 20% self + 80% practical
  competencyStatuses: {
    toolHandling: 'Competent' | 'Needs review' | 'Not competent';
    basicWiring: 'Competent' | 'Needs review' | 'Not competent';
    safetyProcedures: 'Competent' | 'Needs review' | 'Not competent';
    switchboardInstallation: 'Competent' | 'Needs review' | 'Not competent';
    circuitTesting: 'Competent' | 'Needs review' | 'Not competent';
  };
  systemRecommendation: 'Recommended for assessor approval' | 'Recommend gap training' | 'Recommend reassessment';
  finalDecision: 'Approved' | 'Gap Training Recommended' | 'Reassessment Scheduled' | 'Rejected' | 'Pending';
  assessorComments: string;
  digitalSignature: string;
  assessorName: string;
  decidedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  assessorName: string;
  workerName: string;
  action: string;
  status: string;
}

export interface MappingResult {
  suggestedQualification: string;
  suggestedNSQFLevel: string;
  matchPercentage: number;
  confidence: 'Low' | 'Medium' | 'High';
  skillsFound: string[];
  skillsRequiringVerification: string[];
  domainBreakdown: {
    toolKnowledge: number;
    safetyKnowledge: number;
    wiringSkills: number;
    testingSkills: number;
    experienceScore: number;
  };
}

export interface IndianStandard {
  id: string;
  isNumber: string;
  code: string;
  year: string;
  title: string;
  category: string;
  tags: string[];
  scope: string;
  typicalApplications: string[];
  technicalParameters: string[];
  testingRequirements: string[];
  normativeReferences: string[];
  procurementNotes: string;
  verificationStatus: 'Verified from database' | 'Requires verification' | 'AI Recommendation';
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface StandardSourceRef {
  isNumber: string;
  title: string;
  status: 'Verified from database' | 'Requires verification' | 'AI Recommendation';
}

export interface ProcurementSpecDraft {
  product: string;
  intendedUse: string;
  quantity?: string;
  requiredPerformance?: string;
  applicationIndustry?: string;
  productDescription: string;
  recommendedStandards: Array<{ isNumber: string; title: string; applicability: string }>;
  technicalParameters: string[];
  testingRequirements: string[];
  qualityRequirements: string[];
  complianceRequirements: string[];
  disclaimer: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  followUps?: string[];
  sources?: StandardSourceRef[];
  verificationStatus?: 'Verified from database' | 'Requires verification' | 'AI Recommendation';
  specificationDraft?: ProcurementSpecDraft;
}

export interface AIAnalyticsRecord {
  id: string;
  timestamp: string;
  query: string;
  category: string;
  requestedStandard?: string;
  isVerified: boolean;
  hasError: boolean;
}

export interface OfflineSyncQueueItem {
  id: string;
  timestamp: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'worker' | 'assessment' | 'selfDeclaration' | 'aiAnalytics' | 'aiMessage';
  payload: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
}


