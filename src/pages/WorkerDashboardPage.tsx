import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/db';
import type { PracticalAssessment, SelfDeclaration, FinalDecisionRecord } from '../types';
import { 
  User, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Wifi, 
  RefreshCw, 
  ArrowRight,
  Zap,
  Phone,
  MapPin,
  Building2,
  Sparkles
} from 'lucide-react';

export const WorkerDashboardPage: React.FC = () => {
  const { activeWorker } = useAuth();
  const navigate = useNavigate();

  const [selfDecl, setSelfDecl] = useState<SelfDeclaration | null>(null);
  const [assessment, setAssessment] = useState<PracticalAssessment | null>(null);
  const [finalResult, setFinalResult] = useState<FinalDecisionRecord | null>(null);

  useEffect(() => {
    const loadWorkerState = async () => {
      if (!activeWorker) return;
      const sd = await db.selfDeclarations.where('workerId').equals(activeWorker.id).first();
      if (sd) setSelfDecl(sd);

      const pa = await db.assessments.where('workerId').equals(activeWorker.id).first();
      if (pa) setAssessment(pa);

      const fr = await db.finalResults.where('workerId').equals(activeWorker.id).first();
      if (fr) setFinalResult(fr);
    };
    loadWorkerState();
  }, [activeWorker]);

  const isApproved = finalResult?.finalDecision === 'Approved';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Worker Greeting Header */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Worker Profile Portal</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeWorker?.fullName || 'Ravi Kumar'}
              </h1>
              <p className="text-xs text-slate-200 mt-1 flex flex-wrap items-center gap-3 font-medium">
                <span><MapPin className="w-3.5 h-3.5 inline text-amber-400" /> {activeWorker?.district || 'Visakhapatnam'}</span>
                <span><Phone className="w-3.5 h-3.5 inline text-teal-300" /> {activeWorker?.mobileNumber || '9848012345'}</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[160px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase">Enrolled Trade</p>
            <p className="text-sm font-extrabold text-amber-400 mt-0.5">{activeWorker?.trade || 'Assistant Electrician'}</p>
            <p className="text-[10px] text-slate-200 font-bold">NSQF Level 3 Aligned</p>
          </div>
        </div>
      </div>

      {/* Assessment Step Progress Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-[#12355B]" />
          <span>My RPL Certification Progress Timeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Self-Declaration Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            selfDecl ? 'bg-teal-50/60 border-teal-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 1: Self-Declaration</span>
              {selfDecl ? <CheckCircle2 className="w-5 h-5 text-[#0F766E]" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Skill Questionnaire</h4>
            <p className="text-xs text-slate-600 font-medium">
              {selfDecl ? `Completed with score: ${selfDecl.score}%` : 'Not completed yet'}
            </p>
            {!selfDecl && (
              <button
                onClick={() => navigate('/worker/self-declaration')}
                className="w-full py-2.5 rounded-xl bg-[#12355B] text-white font-bold text-xs shadow-xs hover:bg-[#1a4877] transition cursor-pointer"
              >
                Start Self-Declaration
              </button>
            )}
          </div>

          {/* Step 2: Practical Assessment Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            assessment && assessment.status !== 'draft' ? 'bg-teal-50/60 border-teal-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 2: Practical Task</span>
              {assessment && assessment.status !== 'draft' ? <CheckCircle2 className="w-5 h-5 text-[#0F766E]" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Switchboard Evaluation</h4>
            <p className="text-xs text-slate-600 font-medium">
              {assessment ? `Score: ${assessment.totalScore}/100 pts (${assessment.status})` : 'Awaiting Assessor Session'}
            </p>
          </div>

          {/* Step 3: Final Certification Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isApproved ? 'bg-teal-50/60 border-teal-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 3: Certification</span>
              {isApproved ? <CheckCircle2 className="w-5 h-5 text-[#0F766E]" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Final Decision Outcome</h4>
            <p className="text-xs text-slate-600 font-medium">
              {finalResult ? `Decision: ${finalResult.finalDecision}` : 'Pending Assessor Review'}
            </p>
            {isApproved && (
              <button
                onClick={() => navigate(`/report/${activeWorker?.id || 'w-101'}`)}
                className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offline Storage Status Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-100 text-[#0F766E]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">IndexedDB Offline Storage Status</h4>
            <p className="text-xs text-slate-500 font-medium">
              All registration details and questionnaire scores are stored locally in IndexedDB.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/offline-sync')}
          className="px-4 py-2.5 rounded-xl bg-[#12355B] hover:bg-[#1a4877] text-white font-bold text-xs transition shrink-0 cursor-pointer"
        >
          Check Sync Status
        </button>
      </div>
    </div>
  );
};
