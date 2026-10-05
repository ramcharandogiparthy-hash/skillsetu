import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Home, 
  UserCheck, 
  FileText, 
  Award, 
  User, 
  ClipboardCheck, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck, 
  BarChart3, 
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin, activeWorker } = useAuth();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const activeWorkerId = activeWorker?.id || 'w-101';

  const DEMO_STEPS = [
    { num: '01', name: 'Landing Page', path: '/', role: 'guest', icon: Home },
    { num: '02', name: 'Worker Registration', path: '/worker/register', role: 'worker', icon: UserCheck },
    { num: '03', name: 'Self-Declaration', path: '/worker/self-declaration', role: 'worker', icon: FileText },
    { num: '04', name: 'Qualification Mapping', path: '/worker/qualification-mapping', role: 'worker', icon: Award },
    { num: '05', name: 'Worker Dashboard', path: '/worker/dashboard', role: 'worker', icon: User },
    { num: '06', name: 'Assessor Portal', path: '/assessor/dashboard', role: 'assessor', icon: ClipboardCheck },
    { num: '07', name: 'Practical Task Evaluation', path: `/assessor/assessment/${activeWorkerId}`, role: 'assessor', icon: CheckCircle2 },
    { num: '08', name: 'AI Evidence Review', path: `/assessor/ai-evidence/${activeWorkerId}`, role: 'assessor', icon: BrainCircuit },
    { num: '09', name: 'Final Decision Portal', path: `/assessor/final-result/${activeWorkerId}`, role: 'assessor', icon: ShieldCheck },
    { num: '10', name: 'Official RPL Certificate', path: `/report/${activeWorkerId}`, role: 'assessor', icon: Zap },
    { num: '11', name: 'National Admin Analytics', path: '/admin/dashboard', role: 'admin', icon: BarChart3 },
    { num: '12', name: 'Offline Storage Sync', path: '/offline-sync', role: 'guest', icon: RefreshCw }
  ];

  const handleNavigateStep = async (step: typeof DEMO_STEPS[0]) => {
    if (step.role === 'worker') {
      await loginAsDemoWorker(activeWorkerId);
    } else if (step.role === 'assessor') {
      loginAsDemoAssessor();
    } else if (step.role === 'admin') {
      loginAsDemoAdmin();
    }
    navigate(step.path);
    showToast('Demo Navigation', `Jumped to Step ${step.num}: ${step.name}`, 'info');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 no-print">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#12355B] to-[#0F766E] text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition flex items-center gap-2 border border-blue-400/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
          title="Open Smart India Hackathon Live Presentation Shortcuts"
          aria-label="Open SIH Demo Shortcuts"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>SIH Judge Demo Controller</span>
          <ChevronUp className="w-4 h-4 text-blue-200" />
        </button>
      ) : (
        <div className="bg-[#12355B] text-white rounded-3xl p-5 shadow-2xl border border-blue-800 w-80 sm:w-96 space-y-4 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">SIH Live Demo Shortcuts</h4>
                <p className="text-[10px] text-blue-200">1-Click navigation between 12 presentation screens</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-200 transition cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Candidate Switcher */}
          <div className="p-3 rounded-2xl bg-blue-950/90 border border-blue-800 space-y-1.5">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Demo Candidate Active:</p>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              {[
                { id: 'w-101', name: 'Ravi (Pending)' },
                { id: 'w-102', name: 'Suresh (Draft)' },
                { id: 'w-103', name: 'Lakshmi (Review)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={async () => {
                    await loginAsDemoWorker(c.id);
                    showToast('Active Candidate Switched', `Selected candidate: ${c.name}`, 'success');
                  }}
                  className={`py-1.5 px-1 rounded-lg text-center transition cursor-pointer ${
                    activeWorkerId === c.id
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-blue-900/60 text-blue-200 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* 12 Demo Steps Grid */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {DEMO_STEPS.map((step) => {
              const IconComp = step.icon;
              const isCurrent = location.pathname === step.path || (step.path !== '/' && location.pathname.startsWith(step.path));

              return (
                <button
                  key={step.num}
                  onClick={() => handleNavigateStep(step)}
                  className={`w-full p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-blue-950/60 hover:bg-blue-900/80 text-blue-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] opacity-75">{step.num}</span>
                    <IconComp className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span className="truncate">{step.name}</span>
                  </div>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
