import { db } from './db';
import type {
  WorkerProfile,
  SelfDeclaration,
  PracticalAssessment,
  AIEvidenceAnalysis,
  FinalDecisionRecord,
  AuditLog
} from '../types';

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-101',
    fullName: 'Ravi Kumar',
    mobileNumber: '9848012345',
    age: 29,
    gender: 'Male',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    preferredLanguage: 'Telugu',
    trade: 'Assistant Electrician',
    yearsOfExperience: 6,
    workType: 'Independent',
    consentGiven: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'w-102',
    fullName: 'Suresh Babu',
    mobileNumber: '9848023456',
    age: 34,
    gender: 'Male',
    district: 'Vijayawada',
    state: 'Andhra Pradesh',
    preferredLanguage: 'Telugu',
    trade: 'Assistant Electrician',
    yearsOfExperience: 4,
    workType: 'Helper',
    consentGiven: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'w-103',
    fullName: 'Lakshmi Devi',
    mobileNumber: '9848034567',
    age: 38,
    gender: 'Female',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    preferredLanguage: 'Telugu',
    trade: 'Assistant Electrician',
    yearsOfExperience: 7,
    workType: 'Supervisor',
    consentGiven: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'w-104',
    fullName: 'Venkatesh Rao',
    mobileNumber: '9848045678',
    age: 41,
    gender: 'Male',
    district: 'Hyderabad',
    state: 'Telangana',
    preferredLanguage: 'Telugu',
    trade: 'Assistant Electrician',
    yearsOfExperience: 8,
    workType: 'Contractor',
    consentGiven: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'w-105',
    fullName: 'Anitha Reddy',
    mobileNumber: '9848056789',
    age: 26,
    gender: 'Female',
    district: 'Warangal',
    state: 'Telangana',
    preferredLanguage: 'English',
    trade: 'Assistant Electrician',
    yearsOfExperience: 3,
    workType: 'Helper',
    consentGiven: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString()
  }
];

export const INITIAL_SELF_DECLARATIONS: SelfDeclaration[] = [
  {
    id: 'sd-101',
    workerId: 'w-101',
    trade: 'Assistant Electrician',
    answers: {
      exp: 'can_do_independently',
      tools: 'can_do_independently',
      switchInstall: 'can_do_independently',
      bulbHolder: 'can_do_independently',
      socketInstall: 'can_do_independently',
      houseWiring: 'can_do_independently',
      circuitTest: 'can_do_with_help',
      powerCutOff: 'can_do_independently',
      ppeSafety: 'can_do_independently',
      independentWork: 'can_do_independently'
    },
    score: 88,
    voiceNotesRecorded: true,
    completed: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'sd-102',
    workerId: 'w-102',
    trade: 'Assistant Electrician',
    answers: {
      exp: 'can_do_independently',
      tools: 'can_do_independently',
      switchInstall: 'can_do_independently',
      bulbHolder: 'can_do_independently',
      socketInstall: 'can_do_with_help',
      houseWiring: 'can_do_with_help',
      circuitTest: 'have_seen',
      powerCutOff: 'can_do_independently',
      ppeSafety: 'can_do_with_help',
      independentWork: 'can_do_with_help'
    },
    score: 64,
    voiceNotesRecorded: false,
    completed: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'sd-103',
    workerId: 'w-103',
    trade: 'Assistant Electrician',
    answers: {
      exp: 'can_do_independently',
      tools: 'can_do_independently',
      switchInstall: 'can_do_independently',
      bulbHolder: 'can_do_independently',
      socketInstall: 'can_do_independently',
      houseWiring: 'can_do_independently',
      circuitTest: 'can_do_independently',
      powerCutOff: 'can_do_independently',
      ppeSafety: 'can_do_independently',
      independentWork: 'can_do_independently'
    },
    score: 95,
    voiceNotesRecorded: true,
    completed: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'sd-104',
    workerId: 'w-104',
    trade: 'Assistant Electrician',
    answers: {
      exp: 'can_do_independently',
      tools: 'can_do_independently',
      switchInstall: 'can_do_independently',
      bulbHolder: 'can_do_independently',
      socketInstall: 'can_do_independently',
      houseWiring: 'can_do_independently',
      circuitTest: 'can_do_independently',
      powerCutOff: 'can_do_independently',
      ppeSafety: 'can_do_independently',
      independentWork: 'can_do_independently'
    },
    score: 92,
    voiceNotesRecorded: true,
    completed: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'sd-105',
    workerId: 'w-105',
    trade: 'Assistant Electrician',
    answers: {
      exp: 'can_do_with_help',
      tools: 'can_do_independently',
      switchInstall: 'can_do_with_help',
      bulbHolder: 'can_do_with_help',
      socketInstall: 'have_seen',
      houseWiring: 'cannot_do',
      circuitTest: 'cannot_do',
      powerCutOff: 'can_do_independently',
      ppeSafety: 'can_do_with_help',
      independentWork: 'cannot_do'
    },
    score: 48,
    voiceNotesRecorded: false,
    completed: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString()
  }
];

export const INITIAL_PRACTICAL_ASSESSMENTS: PracticalAssessment[] = [
  {
    id: 'pa-101',
    workerId: 'w-101',
    assessorId: 'assessor-1',
    assessorName: 'Rajesh Sharma (Senior Electrical Assessor)',
    taskTitle: 'Install and test a basic switchboard with one switch and one bulb holder.',
    scoringLevels: {},
    scores: {},
    comments: {},
    totalScore: 0,
    evidence: [],
    evidenceComplete: false,
    status: 'draft',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    synced: true
  },
  {
    id: 'pa-102',
    workerId: 'w-102',
    assessorId: 'assessor-1',
    assessorName: 'Rajesh Sharma (Senior Electrical Assessor)',
    taskTitle: 'Install and test a basic switchboard with one switch and one bulb holder.',
    scoringLevels: {
      c1: 'demonstrated_independently',
      c2: 'needs_support',
      c3: 'demonstrated_independently',
      c4: 'needs_support',
      c5: 'needs_support',
      c6: 'not_demonstrated',
      c7: 'not_demonstrated',
      c8: 'needs_support'
    },
    scores: { c1: 5, c2: 3, c3: 10, c4: 5, c5: 15, c6: 0, c7: 0, c8: 5 },
    comments: {
      c2: 'Forgot safety gloves initially',
      c6: 'Exposed wire joint left uninsulated'
    },
    totalScore: 43,
    evidence: [
      {
        id: 'ev-1',
        type: 'photo',
        title: 'Switchboard wiring setup',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
        timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
      }
    ],
    evidenceComplete: false,
    status: 'draft',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    synced: false
  },
  {
    id: 'pa-103',
    workerId: 'w-103',
    assessorId: 'assessor-1',
    assessorName: 'Rajesh Sharma (Senior Electrical Assessor)',
    taskTitle: 'Install and test a basic switchboard with one switch and one bulb holder.',
    scoringLevels: {
      c1: 'demonstrated_independently',
      c2: 'demonstrated_independently',
      c3: 'demonstrated_independently',
      c4: 'demonstrated_independently',
      c5: 'demonstrated_independently',
      c6: 'demonstrated_independently',
      c7: 'needs_support',
      c8: 'demonstrated_independently'
    },
    scores: { c1: 5, c2: 5, c3: 10, c4: 10, c5: 25, c6: 10, c7: 10, c8: 10 },
    comments: {
      c7: 'Used tester correctly, double-checked line phase.'
    },
    totalScore: 85,
    evidence: [
      {
        id: 'ev-103-1',
        type: 'photo',
        title: 'PPE & Tools Verification',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'ev-103-2',
        type: 'video',
        title: 'Switchboard Bulb Testing Video (22s)',
        url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=60',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ],
    evidenceComplete: true,
    status: 'awaiting_approval',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    synced: true
  },
  {
    id: 'pa-104',
    workerId: 'w-104',
    assessorId: 'assessor-1',
    assessorName: 'Rajesh Sharma (Senior Electrical Assessor)',
    taskTitle: 'Install and test a basic switchboard with one switch and one bulb holder.',
    scoringLevels: {
      c1: 'demonstrated_independently',
      c2: 'demonstrated_independently',
      c3: 'demonstrated_independently',
      c4: 'demonstrated_independently',
      c5: 'demonstrated_independently',
      c6: 'demonstrated_independently',
      c7: 'demonstrated_independently',
      c8: 'demonstrated_independently'
    },
    scores: { c1: 5, c2: 5, c3: 10, c4: 10, c5: 25, c6: 10, c7: 15, c8: 10 },
    comments: {
      c5: 'Flawless termination in terminal blocks.',
      c7: 'Thorough safety testing with digital multimeter.'
    },
    totalScore: 95,
    evidence: [
      {
        id: 'ev-104-1',
        type: 'photo',
        title: 'Completed Switchboard',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
        timestamp: new Date(Date.now() - 8 * 86400000).toISOString()
      }
    ],
    evidenceComplete: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    synced: true
  }
];

export const INITIAL_AI_ANALYSES: AIEvidenceAnalysis[] = [
  {
    id: 'ai-103',
    assessmentId: 'pa-103',
    workerId: 'w-103',
    safetyGlovesDetected: true,
    screwdriverDetected: true,
    testerDetected: true,
    imageQuality: 'Good',
    videoDuration: 22,
    missingEvidence: 'Final circuit testing under load',
    confidence: 'Medium',
    overrideApplied: false,
    overrideReason: '',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'ai-104',
    assessmentId: 'pa-104',
    workerId: 'w-104',
    safetyGlovesDetected: true,
    screwdriverDetected: true,
    testerDetected: true,
    imageQuality: 'Good',
    videoDuration: 45,
    missingEvidence: 'None',
    confidence: 'High',
    overrideApplied: false,
    overrideReason: '',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

export const INITIAL_FINAL_RESULTS: FinalDecisionRecord[] = [
  {
    id: 'fr-104',
    assessmentId: 'pa-104',
    workerId: 'w-104',
    selfDeclScore: 92,
    practicalScore: 95,
    finalScore: 94.4,
    competencyStatuses: {
      toolHandling: 'Competent',
      basicWiring: 'Competent',
      safetyProcedures: 'Competent',
      switchboardInstallation: 'Competent',
      circuitTesting: 'Competent'
    },
    systemRecommendation: 'Recommended for assessor approval',
    finalDecision: 'Approved',
    assessorComments: 'Candidate possesses exceptional practical knowledge and adheres strictly to electrical safety norms.',
    digitalSignature: 'Rajesh Sharma, Senior Assessor #AP-ELEC-409',
    assessorName: 'Rajesh Sharma',
    decidedAt: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al-1',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    assessorName: 'Rajesh Sharma',
    workerName: 'Lakshmi Devi',
    action: 'Completed Practical Assessment Scoring',
    status: 'Success'
  },
  {
    id: 'al-2',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    assessorName: 'Rajesh Sharma',
    workerName: 'Suresh Babu',
    action: 'Saved Offline Practical Assessment Draft',
    status: 'Pending Sync'
  },
  {
    id: 'al-3',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    assessorName: 'Rajesh Sharma',
    workerName: 'Venkatesh Rao',
    action: 'Issued Final Assessment Approval & Certification Recommendation',
    status: 'Approved'
  },
  {
    id: 'al-4',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
    assessorName: 'System AI',
    workerName: 'Lakshmi Devi',
    action: 'Generated Evidence Analysis Confidence Report',
    status: 'Completed'
  }
];

export async function seedDatabaseIfEmpty() {
  const count = await db.workers.count();
  if (count === 0) {
    await forceResetSeedData();
  }
}

export async function forceResetSeedData() {
  await db.transaction('rw', [db.workers, db.selfDeclarations, db.assessments, db.aiAnalyses, db.finalResults, db.auditLogs], async () => {
    await db.workers.clear();
    await db.selfDeclarations.clear();
    await db.assessments.clear();
    await db.aiAnalyses.clear();
    await db.finalResults.clear();
    await db.auditLogs.clear();

    await db.workers.bulkAdd(INITIAL_WORKERS);
    await db.selfDeclarations.bulkAdd(INITIAL_SELF_DECLARATIONS);
    await db.assessments.bulkAdd(INITIAL_PRACTICAL_ASSESSMENTS);
    await db.aiAnalyses.bulkAdd(INITIAL_AI_ANALYSES);
    await db.finalResults.bulkAdd(INITIAL_FINAL_RESULTS);
    await db.auditLogs.bulkAdd(INITIAL_AUDIT_LOGS);
  });
}
