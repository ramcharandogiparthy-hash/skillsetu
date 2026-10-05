import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../db/db';
import { PRACTICAL_CRITERIA, calculateCriterionScore, calculateTotalPracticalScore } from '../utils/assessmentUtils';
import type { PracticalAssessment, WorkerProfile } from '../types';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { 
  ClipboardCheck, 
  Camera, 
  Video, 
  Save, 
  ArrowRight, 
  CheckCircle2, 
  WifiOff, 
  Upload, 
  X,
  FileText
} from 'lucide-react';

export const PracticalAssessmentPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { assessorName } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [scoringLevels, setScoringLevels] = useState<Record<string, 'not_demonstrated' | 'needs_support' | 'demonstrated_independently'>>({
    c1: 'demonstrated_independently',
    c2: 'demonstrated_independently',
    c3: 'demonstrated_independently',
    c4: 'demonstrated_independently',
    c5: 'demonstrated_independently',
    c6: 'demonstrated_independently',
    c7: 'needs_support',
    c8: 'demonstrated_independently'
  });

  const [comments, setComments] = useState<Record<string, string>>({
    c7: 'Required minor guidance on multimeter lead polarity before line check.'
  });

  const [evidenceList, setEvidenceList] = useState<Array<{ id: string; type: 'photo' | 'video'; title: string; url: string; timestamp: string }>>([
    {
      id: 'ev-1',
      type: 'photo',
      title: 'PPE & Tools Verification',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      timestamp: new Date().toISOString()
    },
    {
      id: 'ev-2',
      type: 'video',
      title: 'Switchboard Circuit Test Video (22s)',
      url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=60',
      timestamp: new Date().toISOString()
    }
  ]);

  const [evidenceComplete, setEvidenceComplete] = useState<boolean>(true);

  // Load existing assessment from DB if available
  useEffect(() => {
    const loadAssessment = async () => {
      if (!workerId) return;
      const w = await db.workers.get(workerId);
      if (w) setWorker(w);

      const pa = await db.assessments.where('workerId').equals(workerId).first();
      if (pa) {
        if (Object.keys(pa.scoringLevels).length > 0) setScoringLevels(pa.scoringLevels);
        if (pa.comments) setComments(pa.comments);
        if (pa.evidence) setEvidenceList(pa.evidence);
        setEvidenceComplete(pa.evidenceComplete);
      }
    };
    loadAssessment();
  }, [workerId]);

  const currentTotalScore = calculateTotalPracticalScore(scoringLevels);

  const handleLevelChange = (cId: string, level: 'not_demonstrated' | 'needs_support' | 'demonstrated_independently') => {
    setScoringLevels((prev) => ({ ...prev, [cId]: level }));
  };

  const handleCommentChange = (cId: string, text: string) => {
    setComments((prev) => ({ ...prev, [cId]: text }));
  };

  const handleSimulateEvidenceUpload = (type: 'photo' | 'video') => {
    const newEv = {
      id: `ev-${Date.now()}`,
      type,
      title: type === 'photo' ? 'Wiring Connection Close-up' : 'Bulb Lighting Verification Video',
      url: type === 'photo' 
        ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=60',
      timestamp: new Date().toISOString()
    };
    setEvidenceList((prev) => [...prev, newEv]);
    showToast('Evidence Uploaded', `${type === 'photo' ? 'Photo' : 'Video'} captured and saved locally in IndexedDB.`, 'success');
  };

  const removeEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((e) => e.id !== id));
  };

  const saveAssessmentToDb = async (status: PracticalAssessment['status'] = 'draft') => {
    if (!workerId) return;

    const assessmentId = `pa-${workerId}`;
    const scores: Record<string, number> = {};
    for (const item of PRACTICAL_CRITERIA) {
      scores[item.id] = calculateCriterionScore(item.maxScore, scoringLevels[item.id]);
    }

    const record: PracticalAssessment = {
      id: assessmentId,
      workerId,
      assessorId: 'assessor-1',
      assessorName,
      taskTitle: 'Install and test a basic switchboard with one switch and one bulb holder.',
      scoringLevels,
      scores,
      comments,
      totalScore: currentTotalScore,
      evidence: evidenceList,
      evidenceComplete,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false
    };

    await db.assessments.put(record);

    // Also record audit log
    await db.auditLogs.put({
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString(),
      assessorName,
      workerName: worker?.fullName || 'Worker',
      action: status === 'draft' ? 'Saved Practical Assessment Draft' : 'Submitted Practical Assessment for AI Review',
      status: 'Pending Sync'
    });

    showToast('Saved to IndexedDB', `Practical assessment total score: ${currentTotalScore}/100.`, 'info');
  };

  const handleContinueToAI = async () => {
    await saveAssessmentToDb('awaiting_approval');
    navigate(`/assessor/ai-evidence/${workerId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <ClipboardCheck className="w-4 h-4 text-teal-300" />
              <span>Standardized Practical Task Checklist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Practical Competency Evaluation
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Candidate: <strong>{worker?.fullName || 'Ravi Kumar'}</strong> | Trade: <strong>Assistant Electrician</strong>
            </p>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[150px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Practical Score</p>
            <p className="text-3xl font-black text-amber-400">{currentTotalScore} <span className="text-sm text-slate-300 font-bold">/ 100</span></p>
            <p className="text-[10px] text-teal-300 font-bold mt-0.5">8 Criteria Evaluated</p>
          </div>
        </div>

        {/* Task Objective Statement */}
        <div className="p-4 rounded-2xl bg-blue-950/90 border border-blue-800 text-xs text-slate-200 font-medium">
          <strong className="text-teal-300">Assigned Practical Task:</strong> Install and test a basic single-phase switchboard containing one ON/OFF wall switch and one batten bulb holder with safety insulation.
        </div>
      </div>

      {/* Human-in-the-loop AI Banner */}
      <AIDisclaimerBanner />

      {/* 8 Criteria Scoring Checklist */}
      <div className="space-y-6">
        {PRACTICAL_CRITERIA.map((criterion, idx) => {
          const currentLevel = scoringLevels[criterion.id] || 'not_demonstrated';
          const calculatedScore = calculateCriterionScore(criterion.maxScore, currentLevel);

          return (
            <div key={criterion.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#12355B] text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{criterion.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{criterion.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Item Score:</span>
                  <span className="ml-2 text-lg font-black text-[#12355B]">
                    {calculatedScore} / {criterion.maxScore} pts
                  </span>
                </div>
              </div>

              {/* 3 Level Options Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleLevelChange(criterion.id, 'not_demonstrated')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                    currentLevel === 'not_demonstrated'
                      ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/30 text-rose-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">Not Demonstrated</p>
                  <p className="text-[10px] opacity-75 mt-0.5">0 Marks (Failed criteria)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelChange(criterion.id, 'needs_support')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                    currentLevel === 'needs_support'
                      ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/30 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">Needs Support</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{Math.round(criterion.maxScore * 0.5)} Marks (Minor guidance)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelChange(criterion.id, 'demonstrated_independently')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                    currentLevel === 'demonstrated_independently'
                      ? 'bg-teal-50 border-[#0F766E] ring-2 ring-[#0F766E]/30 text-teal-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">Demonstrated Independently</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{criterion.maxScore} Marks (Full competency)</p>
                </button>
              </div>

              {/* Assessor Comment Field */}
              <div>
                <input
                  type="text"
                  placeholder={`Assessor observation comments for ${criterion.title}...`}
                  value={comments[criterion.id] || ''}
                  onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-[#12355B] focus:outline-none bg-slate-50 font-medium"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo / Video Evidence Upload Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#12355B]" />
              <span>Practical Assessment Evidence Capture</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Upload or capture photos/videos of tool handling, safety gloves, and live testing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulateEvidenceUpload('photo')}
              className="px-3.5 py-2 rounded-xl bg-[#12355B] text-white hover:bg-[#1a4877] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-blue-300" />
              <span>Capture Photo</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateEvidenceUpload('video')}
              className="px-3.5 py-2 rounded-xl bg-[#12355B] text-white hover:bg-[#1a4877] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Video className="w-4 h-4 text-rose-300" />
              <span>Record Video</span>
            </button>
          </div>
        </div>

        {/* Evidence Thumbnails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {evidenceList.map((ev) => (
            <div key={ev.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900 text-white shadow-xs">
              <img src={ev.url} alt={ev.title} className="w-full h-36 object-cover opacity-85 group-hover:opacity-100 transition" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold text-teal-300 uppercase flex items-center gap-1">
                {ev.type === 'photo' ? <Camera className="w-3 h-3" /> : <Video className="w-3 h-3 text-rose-400" />}
                <span>{ev.type}</span>
              </div>
              <button
                onClick={() => removeEvidence(ev.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
                title="Remove evidence item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="p-3 bg-slate-900 text-xs">
                <p className="font-bold text-white truncate">{ev.title}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Saved in IndexedDB</p>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Complete Checkbox */}
        <label className="flex items-center gap-3 p-4 rounded-2xl border border-teal-200 bg-teal-50/60 cursor-pointer">
          <input
            type="checkbox"
            checked={evidenceComplete}
            onChange={(e) => setEvidenceComplete(e.target.checked)}
            className="w-5 h-5 rounded text-[#0F766E] focus:ring-[#0F766E]"
          />
          <span className="text-xs font-bold text-teal-950">
            Confirm all required practical photo & video evidence items are captured and ready for AI analysis.
          </span>
        </label>
      </div>

      {/* Save & Continue Sticky Bar */}
      <div className="sticky bottom-4 bg-[#12355B] text-white p-4 rounded-2xl border border-blue-900 shadow-2xl flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <p className="text-[11px] text-blue-200 font-medium">Practical Assessment Score:</p>
          <p className="text-xl font-extrabold text-amber-400">{currentTotalScore} / 100 Marks</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => saveAssessmentToDb('draft')}
            className="px-4 py-2.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-100 border border-blue-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-blue-300" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleContinueToAI}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to AI Evidence Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
