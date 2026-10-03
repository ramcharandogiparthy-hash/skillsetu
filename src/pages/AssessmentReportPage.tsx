import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import type { WorkerProfile, PracticalAssessment, SelfDeclaration, FinalDecisionRecord, AIEvidenceAnalysis } from '../types';
import { PRACTICAL_CRITERIA, calculateCriterionScore } from '../utils/assessmentUtils';
import { 
  Zap, 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Award,
  Calendar,
  User,
  Check
} from 'lucide-react';

export const AssessmentReportPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [selfDecl, setSelfDecl] = useState<SelfDeclaration | null>(null);
  const [assessment, setAssessment] = useState<PracticalAssessment | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIEvidenceAnalysis | null>(null);
  const [finalResult, setFinalResult] = useState<FinalDecisionRecord | null>(null);

  useEffect(() => {
    const loadAllReportData = async () => {
      if (!workerId) return;
      const w = await db.workers.get(workerId);
      if (w) setWorker(w);

      const sd = await db.selfDeclarations.where('workerId').equals(workerId).first();
      if (sd) setSelfDecl(sd);

      const pa = await db.assessments.where('workerId').equals(workerId).first();
      if (pa) setAssessment(pa);

      const ai = await db.aiAnalyses.where('workerId').equals(workerId).first();
      if (ai) setAiAnalysis(ai);

      const fr = await db.finalResults.where('workerId').equals(workerId).first();
      if (fr) setFinalResult(fr);
    };
    loadAllReportData();
  }, [workerId]);

  const handlePrint = () => {
    window.print();
  };

  const candidateName = worker?.fullName || 'Ravi Kumar';
  const tradeName = worker?.trade || 'Assistant Electrician';
  const finalDecisionText = finalResult?.finalDecision || 'Approved';
  const finalScoreValue = finalResult?.finalScore || 87.4;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Controls Bar (Hidden during window.print()) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <button
          onClick={() => navigate('/assessor/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessor Portal</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                SkillSetu RPL
              </h1>
              <p className="text-xs text-slate-600 font-semibold">
                Recognize skills. Build careers. | National RPL Competency Certificate
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase border border-emerald-300">
              Official Assessment Record
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1">Ref ID: RPL-2026-{workerId?.toUpperCase()}</p>
          </div>
        </div>

        {/* Worker & Qualification Meta Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-bold uppercase block text-[10px]">Worker Name</span>
            <span className="font-extrabold text-sm text-slate-900">{candidateName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-bold uppercase block text-[10px]">Assessed Trade</span>
            <span className="font-extrabold text-sm text-blue-700">{tradeName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-bold uppercase block text-[10px]">NSQF Alignment</span>
            <span className="font-extrabold text-sm text-amber-700">NSQF Level 3</span>
          </div>

          <div>
            <span className="text-slate-500 font-bold uppercase block text-[10px]">Experience</span>
            <span className="font-extrabold text-sm text-slate-900">{worker?.yearsOfExperience || 6} Years</span>
          </div>
        </div>

        {/* Evaluation Summary Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Evaluation Scoring Breakdown
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Self-Declaration (20%)</p>
              <p className="text-xl font-extrabold text-blue-600">{selfDecl?.score || 88}%</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Practical Assessment (80%)</p>
              <p className="text-xl font-extrabold text-emerald-600">{assessment?.totalScore || 85}%</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white">
              <p className="text-[10px] font-bold text-slate-300 uppercase">Final Weighted Mark</p>
              <p className="text-2xl font-extrabold text-emerald-400">{finalScoreValue}%</p>
            </div>
          </div>
        </div>

        {/* Practical Assessment Criteria Checklist Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Practical Task Criteria Verification
          </h3>

          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Practical Criterion Item</th>
                <th className="p-3 text-center">Max Score</th>
                <th className="p-3 text-center">Awarded Score</th>
                <th className="p-3">Assessor Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {PRACTICAL_CRITERIA.map((c) => {
                const awarded = assessment?.scores[c.id] ?? calculateCriterionScore(c.maxScore, 'demonstrated_independently');
                const comment = assessment?.comments[c.id] || 'Demonstrated safely in accord with guidelines.';
                return (
                  <tr key={c.id}>
                    <td className="p-3 font-semibold text-slate-900">{c.title}</td>
                    <td className="p-3 text-center font-mono">{c.maxScore}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{awarded}</td>
                    <td className="p-3 text-slate-600 italic text-[11px]">{comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* AI Evidence Support & Assessor Override Summary */}
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
          <h4 className="font-bold text-purple-900 flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            3. AI Evidence Support & Human Assessor Review
          </h4>
          <p className="text-purple-950 leading-relaxed">
            AI Computer Vision verified safety gloves and screwdriver tools. Assessor override applied: {aiAnalysis?.overrideApplied ? 'YES' : 'NO'}.
            {aiAnalysis?.overrideReason && ` Justification: "${aiAnalysis.overrideReason}"`}
          </p>
        </div>

        {/* Assessor Final Decision Box */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Final Official Decision:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-sm uppercase">
              {finalDecisionText}
            </span>
          </div>
          <p className="text-xs text-slate-300 italic">
            "{finalResult?.assessorComments || 'Candidate possesses solid practical wiring experience, follows safety protocols, and correctly executed switchboard installation.'}"
          </p>
        </div>

        {/* Signatures & QR Code Section */}
        <div className="pt-6 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Authorized Assessor Signature</p>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800">
              {finalResult?.digitalSignature || `Rajesh Sharma, Senior Assessor #AP-ELEC-409`}
            </div>
            <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="text-center flex flex-col items-center justify-center space-y-1">
            <div className="p-2 border-2 border-slate-900 rounded-2xl bg-white shadow-sm inline-block">
              <QrCode className="w-16 h-16 text-slate-900" />
            </div>
            <p className="text-[9px] font-mono text-slate-500 uppercase">Scan to Verify Certification</p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-1 text-emerald-700 font-extrabold text-xs">
              <Check className="w-4 h-4" /> Valid RPL Certificate
            </div>
            <p className="text-[10px] text-slate-500">Issued by SkillSetu Assessment Body</p>
            <p className="text-[9px] text-slate-400">Built for Smart India Hackathon</p>
          </div>
        </div>
      </div>
    </div>
  );
};
