import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../db/db';
import type { FinalDecisionRecord, WorkerProfile, PracticalAssessment, SelfDeclaration } from '../types';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  PenTool, 
  Calendar, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FinalResultPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { assessorName } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [selfDeclScore, setSelfDeclScore] = useState<number>(88);
  const [practicalScore, setPracticalScore] = useState<number>(85);

  const [finalDecision, setFinalDecision] = useState<FinalDecisionRecord['finalDecision']>('Approved');
  const [assessorComments, setAssessorComments] = useState<string>(
    'Candidate possesses solid practical wiring experience, follows safety protocols, and correctly executed the single-phase switchboard setup.'
  );
  const [digitalSignature, setDigitalSignature] = useState<string>(
    `Signed by ${assessorName} (#AP-ELEC-409) on ${new Date().toLocaleDateString()}`
  );

  useEffect(() => {
    const loadResultData = async () => {
      if (!workerId) return;
      const w = await db.workers.get(workerId);
      if (w) setWorker(w);

      const sd = await db.selfDeclarations.where('workerId').equals(workerId).first();
      if (sd) setSelfDeclScore(sd.score);

      const pa = await db.assessments.where('workerId').equals(workerId).first();
      if (pa) setPracticalScore(pa.totalScore);

      const existingDecision = await db.finalResults.where('workerId').equals(workerId).first();
      if (existingDecision) {
        setFinalDecision(existingDecision.finalDecision);
        setAssessorComments(existingDecision.assessorComments);
        if (existingDecision.digitalSignature) setDigitalSignature(existingDecision.digitalSignature);
      }
    };
    loadResultData();
  }, [workerId]);

  // Calculate final score = 20% self decl + 80% practical
  const finalCalculatedScore = Number((0.2 * selfDeclScore + 0.8 * practicalScore).toFixed(1));

  // Determine system recommendation based on score
  let systemRecommendation: FinalDecisionRecord['systemRecommendation'] = 'Recommended for assessor approval';
  if (finalCalculatedScore >= 70) {
    systemRecommendation = 'Recommended for assessor approval';
  } else if (finalCalculatedScore >= 50) {
    systemRecommendation = 'Recommend gap training';
  } else {
    systemRecommendation = 'Recommend reassessment';
  }

  const handleConfirmDecision = async () => {
    if (!workerId) return;

    const record: FinalDecisionRecord = {
      id: `fr-${workerId}`,
      assessmentId: `pa-${workerId}`,
      workerId,
      selfDeclScore,
      practicalScore,
      finalScore: finalCalculatedScore,
      competencyStatuses: {
        toolHandling: 'Competent',
        basicWiring: 'Competent',
        safetyProcedures: 'Competent',
        switchboardInstallation: 'Competent',
        circuitTesting: practicalScore > 75 ? 'Competent' : 'Needs review'
      },
      systemRecommendation,
      finalDecision,
      assessorComments,
      digitalSignature,
      assessorName,
      decidedAt: new Date().toISOString()
    };

    await db.finalResults.put(record);

    // Update assessment status in DB
    const pa = await db.assessments.where('workerId').equals(workerId).first();
    if (pa) {
      pa.status = finalDecision === 'Approved' ? 'approved' : finalDecision === 'Gap Training Recommended' ? 'gap_training' : 'reassessment';
      pa.synced = true;
      await db.assessments.put(pa);
    }

    // Add Audit Log
    await db.auditLogs.put({
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString(),
      assessorName,
      workerName: worker?.fullName || 'Worker',
      action: `Confirmed Final Decision: ${finalDecision}`,
      status: 'Completed'
    });

    showToast('Decision Confirmed', `Assessor decision "${finalDecision}" stored in IndexedDB.`, 'success');
    navigate(`/report/${workerId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Award className="w-4 h-4 text-teal-300" />
              <span>Competency Decision Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Final Assessment Scoring & Certification Decision
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Worker: <strong>{worker?.fullName || 'Ravi Kumar'}</strong> | Trade: <strong>Assistant Electrician (NSQF Level 3)</strong>
            </p>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[160px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Weighted Score</p>
            <p className="text-4xl font-black text-amber-400">{finalCalculatedScore}%</p>
            <p className="text-[10px] text-slate-200 font-bold">20% Self + 80% Practical</p>
          </div>
        </div>
      </div>

      {/* Human-in-the-loop AI Banner */}
      <AIDisclaimerBanner />

      {/* Score Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">1. Self-Declaration Score</p>
          <p className="text-3xl font-black text-[#12355B]">{selfDeclScore}%</p>
          <p className="text-xs text-slate-600 font-medium">Weight: 20% = {(0.2 * selfDeclScore).toFixed(1)} pts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">2. Practical Evaluation Score</p>
          <p className="text-3xl font-black text-[#0F766E]">{practicalScore}%</p>
          <p className="text-xs text-slate-600 font-medium">Weight: 80% = {(0.8 * practicalScore).toFixed(1)} pts</p>
        </div>

        <div className="bg-[#12355B] text-white p-6 rounded-3xl shadow-xs space-y-2 border border-blue-900">
          <p className="text-xs font-bold text-blue-200 uppercase">3. Total Final Score</p>
          <p className="text-3xl font-black text-amber-400">{finalCalculatedScore}%</p>
          <p className="text-xs text-slate-200 font-medium">Passing benchmark: 70% overall</p>
        </div>
      </div>

      {/* Competency Status Breakdown Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <CheckCircle2 className="w-5 h-5 text-[#12355B]" />
          <span>Competency-by-Competency Analysis</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Tool Handling', status: 'Competent' },
            { title: 'Basic Wiring', status: 'Competent' },
            { title: 'Safety Procedures', status: 'Competent' },
            { title: 'Switchboard Installation', status: 'Competent' },
            { title: 'Circuit Testing', status: practicalScore >= 75 ? 'Competent' : 'Needs review' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">{item.title}</span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                item.status === 'Competent' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Recommendation vs Final Assessor Decision */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* System Suggestion Badge */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900">System Algorithmic Recommendation:</p>
              <p className="text-sm font-black text-indigo-800">{systemRecommendation}</p>
            </div>
          </div>
          <span className="text-[10px] px-3 py-1 rounded-full bg-indigo-200 text-indigo-950 font-bold uppercase tracking-wider">
            Non-Binding Suggestion
          </span>
        </div>

        {/* Final Assessor Radio Decision Controls */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
            <span>Assessor Official Decision *</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { val: 'Approved', label: 'Approve & Issue Certificate', desc: 'Candidate fully competent', color: 'emerald' },
              { val: 'Gap Training Recommended', label: 'Recommend Gap Training', desc: 'Needs 2-week upskilling', color: 'amber' },
              { val: 'Reassessment Scheduled', label: 'Schedule Reassessment', desc: 'Retake practical test', color: 'blue' },
              { val: 'Rejected', label: 'Reject Assessment', desc: 'Insufficient safety skills', color: 'rose' }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFinalDecision(opt.val as any)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                  finalDecision === opt.val
                    ? opt.color === 'emerald'
                      ? 'bg-teal-50 border-[#0F766E] ring-2 ring-[#0F766E]/30 text-teal-950 font-bold'
                      : opt.color === 'amber'
                      ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/30 text-amber-950 font-bold'
                      : opt.color === 'blue'
                      ? 'bg-blue-50 border-[#12355B] ring-2 ring-[#12355B]/30 text-blue-950 font-bold'
                      : 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/30 text-rose-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <p className="text-xs font-bold">{opt.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Assessor Comments & Digital Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label htmlFor="assessor-comments-field" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assessor Remarks & Recommendations
            </label>
            <textarea
              id="assessor-comments-field"
              rows={3}
              value={assessorComments}
              onChange={(e) => setAssessorComments(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#12355B] focus:outline-none text-slate-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="digital-signature-field" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assessor Digital Signature Placeholder
            </label>
            <input
              id="digital-signature-field"
              type="text"
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-4 bg-[#12355B] text-white p-4 rounded-2xl border border-blue-900 shadow-2xl flex items-center justify-between no-print">
        <div>
          <p className="text-[11px] text-blue-200 font-medium">Assessor Decision Selected:</p>
          <p className="text-base font-extrabold text-amber-400">{finalDecision}</p>
        </div>

        <button
          onClick={handleConfirmDecision}
          className="px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Confirm & Generate Assessment Report</span>
        </button>
      </div>
    </div>
  );
};
