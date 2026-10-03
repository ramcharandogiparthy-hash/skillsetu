import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../db/db';
import type { AIEvidenceAnalysis, WorkerProfile } from '../types';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Eye, 
  ArrowRight, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  FileCheck
} from 'lucide-react';

export const AIEvidenceSupportPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  
  // AI Mock Data state
  const [aiAnalysis, setAiAnalysis] = useState<AIEvidenceAnalysis>({
    id: `ai-${workerId}`,
    assessmentId: `pa-${workerId}`,
    workerId: workerId || 'w-101',
    safetyGlovesDetected: true,
    screwdriverDetected: true,
    testerDetected: true,
    imageQuality: 'Good',
    videoDuration: 22,
    missingEvidence: 'Final circuit testing under load',
    confidence: 'Medium',
    overrideApplied: false,
    overrideReason: '',
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    const loadAiData = async () => {
      if (!workerId) return;
      const w = await db.workers.get(workerId);
      if (w) setWorker(w);

      const existingAi = await db.aiAnalyses.where('workerId').equals(workerId).first();
      if (existingAi) {
        setAiAnalysis(existingAi);
      }
    };
    loadAiData();
  }, [workerId]);

  const handleToggleOverride = () => {
    setAiAnalysis((prev) => ({
      ...prev,
      overrideApplied: !prev.overrideApplied
    }));
  };

  const handleReasonChange = (reason: string) => {
    setAiAnalysis((prev) => ({
      ...prev,
      overrideReason: reason
    }));
  };

  const handleSaveAndProceed = async () => {
    if (aiAnalysis.overrideApplied && !aiAnalysis.overrideReason.trim()) {
      showToast('Override Reason Required', 'Please specify the mandatory override reason before proceeding.', 'warning');
      return;
    }

    await db.aiAnalyses.put(aiAnalysis);
    showToast('AI Review Saved', 'Assessor override and AI evidence metrics stored.', 'success');
    navigate(`/assessor/final-result/${workerId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>AI Evidence Guidance System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Automated Evidence Verification Analysis
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Candidate: <strong>{worker?.fullName || 'Ravi Kumar'}</strong> | Trade: <strong>Assistant Electrician</strong>
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[150px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Confidence</p>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold inline-block mt-1 ${
              aiAnalysis.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {aiAnalysis.confidence} Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Mandatory Human-in-the-loop Warning */}
      <AIDisclaimerBanner />

      {/* AI Analysis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detection Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Computer Vision Object Detection</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Safety Gloves Worn:</span>
              {aiAnalysis.safetyGlovesDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected (Yes)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Not Detected (No)
                </span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Insulated Screwdriver:</span>
              {aiAnalysis.screwdriverDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected (Yes)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Not Detected (No)
                </span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Neon Voltage Tester:</span>
              {aiAnalysis.testerDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Detected (Yes)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quality & Gaps */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span>Media Quality & Evidence Gaps</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Photo/Video Quality:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {aiAnalysis.imageQuality}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Video Duration:</span>
              <span className="font-extrabold text-slate-900">{aiAnalysis.videoDuration} Seconds</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <span className="font-bold block flex items-center gap-1 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing Evidence Flagged:
              </span>
              <p className="text-[11px] text-amber-900 font-medium">{aiAnalysis.missingEvidence}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessor Override Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Assessor Human Override Control</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              If AI flagged missing items or false positives, the assessor can manually override AI recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleOverride}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              aiAnalysis.overrideApplied
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {aiAnalysis.overrideApplied ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{aiAnalysis.overrideApplied ? 'Override Applied (Active)' : 'Enable Assessor Override'}</span>
          </button>
        </div>

        {aiAnalysis.overrideApplied && (
          <div className="space-y-2 animate-fade-in p-4 rounded-2xl bg-amber-50 border border-amber-300">
            <label className="block text-xs font-bold text-amber-900 uppercase">
              Mandatory Override Justification Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="State why you are overriding the AI analysis (e.g., 'Verified final circuit continuity manually using personal multimeter under live power. AI missed video frames due to angle.')"
              value={aiAnalysis.overrideReason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-amber-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-900"
            />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-4 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-300">AI Review Status:</p>
          <p className="text-sm font-extrabold text-emerald-400">
            {aiAnalysis.overrideApplied ? 'Assessor Override Active' : 'AI Analysis Verified'}
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center gap-2"
        >
          <span>Proceed to Final Decision & Certification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
