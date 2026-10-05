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
  FileCheck,
  Scan,
  Zap,
  Camera
} from 'lucide-react';

export const AIEvidenceSupportPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  
  // AI Data state
  const [aiAnalysis, setAiAnalysis] = useState<AIEvidenceAnalysis>({
    id: `ai-${workerId}`,
    assessmentId: `pa-${workerId}`,
    workerId: workerId || 'w-101',
    safetyGlovesDetected: true,
    screwdriverDetected: true,
    testerDetected: true,
    imageQuality: 'Good',
    videoDuration: 22,
    missingEvidence: 'Final circuit load test video frames',
    confidence: 'High',
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <BrainCircuit className="w-4 h-4 text-purple-300" />
              <span>AI Evidence Guidance System (Assessor Support Tool)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Automated Computer Vision Evidence Review
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Candidate: <strong>{worker?.fullName || 'Ravi Kumar'}</strong> | Trade: <strong>Assistant Electrician (NSQF Level 3)</strong>
            </p>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[160px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Detection Score</p>
            <span className="text-2xl font-black text-amber-400 block">96.4%</span>
            <span className="text-[10px] text-teal-300 font-bold">High AI Confidence</span>
          </div>
        </div>
      </div>

      {/* Prominent Mandatory Human-in-the-loop Warning */}
      <AIDisclaimerBanner />

      {/* AI Computer Vision Image Bounding Box Mockup Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Scan className="w-5 h-5 text-purple-600" />
            <span>Computer Vision Frame Analysis Overlay</span>
          </h3>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-mono font-bold border border-purple-200">
            YOLOv8 Electrical Safety Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mockup Frame 1: PPE Detection */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-52 group">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60"
              alt="PPE Detection Frame"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Simulated Bounding Box 1 */}
            <div className="absolute top-8 left-12 w-28 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded-lg pointer-events-none flex flex-col justify-between p-1">
              <span className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-1 rounded w-max">
                Gloves: 98.4%
              </span>
            </div>
            {/* Simulated Bounding Box 2 */}
            <div className="absolute bottom-6 right-16 w-24 h-16 border-2 border-blue-400 bg-blue-500/10 rounded-lg pointer-events-none flex flex-col justify-between p-1">
              <span className="bg-blue-600 text-white font-mono text-[9px] font-bold px-1 rounded w-max">
                Screwdriver: 96.2%
              </span>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] text-white font-mono font-bold">
              Frame 042 / 240 • PPE Verification
            </div>
          </div>

          {/* Mockup Frame 2: Wiring Verification */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-52 group">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60"
              alt="Switchboard Wiring Frame"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Simulated Bounding Box 3 */}
            <div className="absolute top-10 right-10 w-32 h-24 border-2 border-teal-400 bg-teal-500/10 rounded-lg pointer-events-none flex flex-col justify-between p-1">
              <span className="bg-[#0F766E] text-white font-mono text-[9px] font-bold px-1 rounded w-max">
                Tester Glow: 94.8%
              </span>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] text-white font-mono font-bold">
              Frame 118 / 240 • Continuity Check
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detection Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Computer Vision Object Detection Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">Insulated Safety Gloves:</span>
              {aiAnalysis.safetyGlovesDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> Detected (98.4%)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center gap-1 border border-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Not Detected
                </span>
              )}
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">Insulated Screwdriver Tool:</span>
              {aiAnalysis.screwdriverDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> Detected (96.2%)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center gap-1 border border-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Not Detected
                </span>
              )}
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">Neon Line Voltage Tester:</span>
              {aiAnalysis.testerDetected ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> Detected (94.8%)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center gap-1 border border-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Missing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quality & Gaps */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Eye className="w-5 h-5 text-[#12355B]" />
            <span>Media Quality & Evidence Gaps</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">Photo / Video Stream Quality:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                {aiAnalysis.imageQuality}
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800">Video Evidence Duration:</span>
              <span className="font-black text-slate-900">{aiAnalysis.videoDuration} Seconds</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <span className="font-bold block flex items-center gap-1 text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Flagged Potential Evidence Gap:
              </span>
              <p className="text-[11px] text-amber-900 font-medium">{aiAnalysis.missingEvidence}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessor Override Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#12355B]" />
              <span>Assessor Human Override Control</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              If AI flagged missing items or false positives, the assessor can manually override AI recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleOverride}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
              aiAnalysis.overrideApplied
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {aiAnalysis.overrideApplied ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{aiAnalysis.overrideApplied ? 'Override Active (Applied)' : 'Enable Assessor Override'}</span>
          </button>
        </div>

        {aiAnalysis.overrideApplied && (
          <div className="space-y-2 animate-fade-in p-4 rounded-2xl bg-amber-50 border border-amber-300">
            <label htmlFor="override-reason-field" className="block text-xs font-bold text-amber-900 uppercase">
              Mandatory Override Justification Reason *
            </label>
            <textarea
              id="override-reason-field"
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

      {/* Action Sticky Footer */}
      <div className="sticky bottom-4 bg-[#12355B] text-white p-4 rounded-2xl border border-blue-900 shadow-2xl flex items-center justify-between no-print">
        <div>
          <p className="text-[11px] text-blue-200 font-medium">AI Evidence Review Status:</p>
          <p className="text-sm font-extrabold text-amber-400">
            {aiAnalysis.overrideApplied ? 'Assessor Override Active' : 'AI Analysis Verified'}
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <span>Proceed to Final Decision & Certification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
