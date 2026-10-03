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
