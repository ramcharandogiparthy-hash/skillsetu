import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/db';
import { computeQualificationMapping, calculateSelfDeclarationScore } from '../utils/mappingEngine';
import type { MappingResult, SelfDeclaration } from '../types';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  FileCheck,
  ChevronRight,
  Download,
  Info,
  Sparkles
} from 'lucide-react';

export const QualificationMappingPage: React.FC = () => {
  const { activeWorker } = useAuth();
  const navigate = useNavigate();

  const [mapping, setMapping] = useState<MappingResult | null>(null);
  const [selfDeclScore, setSelfDeclScore] = useState<number>(85);

  useEffect(() => {
    const loadMappingData = async () => {
      let answers = {
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
      };

      if (activeWorker) {
        const decl = await db.selfDeclarations.where('workerId').equals(activeWorker.id).first();
        if (decl) {
          answers = decl.answers as any;
          setSelfDeclScore(decl.score);
        }
      }

      const res = computeQualificationMapping(answers as any, activeWorker?.yearsOfExperience || 6);
      setMapping(res);
    };

    loadMappingData();
  }, [activeWorker]);

  if (!mapping) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold text-sm animate-pulse">
        Calculating NSQF qualification mapping rules...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>NSQF Qualification Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Preliminary Skill Qualification Mapping
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Candidate: <strong>{activeWorker?.fullName || 'Ravi Kumar'}</strong> ({activeWorker?.yearsOfExperience || 6} Years Experience)
            </p>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[150px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Suggested NSQF</p>
            <p className="text-3xl font-black text-amber-400">{mapping.suggestedNSQFLevel}</p>
            <p className="text-[11px] text-slate-200 font-extrabold">{mapping.suggestedQualification}</p>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">
            <strong>Preliminary Recommendation:</strong> This qualification mapping is generated automatically by standard rule metrics. Certified practical task evaluation and human assessor sign-off are required to issue official certificates.
          </span>
        </div>
      </div>

      {/* Main Grid: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Percentage Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trade Match Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#12355B]">{mapping.matchPercentage}%</span>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">High Match</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Based on {activeWorker?.yearsOfExperience || 6} years experience and self-declaration.
          </p>
        </div>

        {/* Confidence Level Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rule Engine Confidence</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${
              mapping.confidence === 'High' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {mapping.confidence} Confidence Level
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Strong alignment with Assistant Electrician Level 3 standard criteria.
          </p>
        </div>

        {/* Action Button Card */}
        <div className="bg-[#12355B] text-white p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between border border-blue-900">
          <div>
            <h4 className="font-bold text-base text-white">Next Step Actions</h4>
            <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
              Proceed directly to live practical task assessment with your assigned evaluator.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate(`/assessor/assessment/${activeWorker?.id || 'w-101'}`)}
              className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Practical Task</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/worker/dashboard')}
              className="w-full py-2 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-blue-200 border border-blue-700/60 font-semibold text-xs transition text-center cursor-pointer"
            >
              Back to Worker Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Domain Breakdown Progress Bars */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wrench className="w-5 h-5 text-[#12355B]" />
          <span>Competency Domain Breakdown</span>
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Tool Identification & Handling', value: mapping.domainBreakdown.toolKnowledge, color: 'bg-[#12355B]' },
            { label: 'Electrical Safety & PPE Compliance', value: mapping.domainBreakdown.safetyKnowledge, color: 'bg-[#0F766E]' },
            { label: 'Switchboard & House Wiring Skills', value: mapping.domainBreakdown.wiringSkills, color: 'bg-indigo-600' },
            { label: 'Circuit Safety & Continuity Testing', value: mapping.domainBreakdown.testingSkills, color: 'bg-amber-500' },
            { label: 'Prior Work Experience Weight', value: mapping.domainBreakdown.experienceScore, color: 'bg-purple-600' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Found & Skills Requiring Practical Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Skills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />
            <span>Identified Competencies</span>
          </h4>
          <ul className="space-y-2">
            {mapping.skillsFound.map((skill, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0F766E] mt-1 shrink-0"></span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Needing Verification */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Practical Verification Checklist</span>
          </h4>
          <ul className="space-y-2">
            {mapping.skillsRequiringVerification.slice(0, 5).map((skill, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Human-in-the-Loop Policy Banner */}
      <AIDisclaimerBanner />
    </div>
  );
};
