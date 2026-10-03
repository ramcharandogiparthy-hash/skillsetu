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
  MapPin
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Worker Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeWorker?.fullName || 'Ravi Kumar'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-3">
                <span><MapPin className="w-3 h-3 inline text-emerald-400" /> {activeWorker?.district || 'Visakhapatnam'}</span>
                <span><Phone className="w-3 h-3 inline text-blue-400" /> {activeWorker?.mobileNumber || '9848012345'}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-center min-w-[150px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Enrolled Trade</p>
            <p className="text-sm font-extrabold text-amber-400 mt-0.5">{activeWorker?.trade || 'Assistant Electrician'}</p>
            <p className="text-[10px] text-slate-300 font-medium">NSQF Level 3</p>
          </div>
        </div>
      </div>

      {/* Assessment Step Progress Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span>My RPL Certification Progress</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Self-Declaration Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            selfDecl ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Step 1: Self-Declaration</span>
              {selfDecl ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Skill Questionnaire</h4>
            <p className="text-xs text-slate-600">
              {selfDecl ? `Completed with score: ${selfDecl.score}%` : 'Not completed yet'}
            </p>
            {!selfDecl && (
              <button
                onClick={() => navigate('/worker/self-declaration')}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-500 transition"
              >
                Start Self-Declaration
              </button>
            )}
          </div>

          {/* Step 2: Practical Assessment Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            assessment && assessment.status !== 'draft' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Step 2: Practical Task</span>
              {assessment && assessment.status !== 'draft' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Switchboard Evaluation</h4>
            <p className="text-xs text-slate-600">
              {assessment ? `Score: ${assessment.totalScore}/100 pts (${assessment.status})` : 'Awaiting Assessor Session'}
            </p>
          </div>

          {/* Step 3: Final Certification Status */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isApproved ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Step 3: Certification</span>
              {isApproved ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-500" />}
            </div>
            <h4 className="font-bold text-base text-slate-900">Final Decision Outcome</h4>
            <p className="text-xs text-slate-600">
              {finalResult ? `Decision: ${finalResult.finalDecision}` : 'Pending Assessor Review'}
            </p>
            {isApproved && (
              <button
                onClick={() => navigate(`/report/${activeWorker?.id || 'w-101'}`)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Assessment Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offline Storage Status Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Local Data & Offline Sync Status</h4>
            <p className="text-xs text-slate-500">
              All your registration details and self-declarations are stored safely in local browser storage (IndexedDB).
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/offline-sync')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shrink-0"
        >
          Check Sync Status
        </button>
      </div>
    </div>
  );
};
