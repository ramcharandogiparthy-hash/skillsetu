import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserCheck, ClipboardCheck, ShieldCheck, Zap, ArrowRight, User } from 'lucide-react';
import type { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('w-101');

  const DEMO_WORKERS = [
    { id: 'w-101', name: 'Ravi Kumar', exp: '6 Years', status: 'Pending Assessment' },
    { id: 'w-102', name: 'Suresh Babu', exp: '4 Years', status: 'Evidence Incomplete' },
    { id: 'w-103', name: 'Lakshmi Devi', exp: '7 Years', status: 'Awaiting Final Approval' }
  ];

  const handleDemoLogin = async () => {
    if (selectedRole === 'worker') {
      await loginAsDemoWorker(selectedWorkerId);
      const workerObj = DEMO_WORKERS.find((w) => w.id === selectedWorkerId);
      showToast('Welcome Demo Worker', `Logged in as ${workerObj?.name || 'Ravi Kumar'} (Assistant Electrician)`, 'success');
      navigate('/worker/dashboard');
    } else if (selectedRole === 'assessor') {
      loginAsDemoAssessor();
      showToast('Welcome Assessor', 'Logged in as Rajesh Sharma (Senior Assessor)', 'success');
      navigate('/assessor/dashboard');
    } else if (selectedRole === 'admin') {
      loginAsDemoAdmin();
      showToast('Welcome Administrator', 'Accessing SkillSetu National Skill Analytics', 'success');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto shadow-xs border border-blue-100 mb-3">
          <Zap className="w-7 h-7 text-[#12355B]" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Demo Role Authentication
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium">
          Select a persona below to test the complete end-to-end RPL assessment workflow.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Worker Role Option */}
        <div
          onClick={() => setSelectedRole('worker')}
          className={`p-5 rounded-2xl border text-left transition flex flex-col gap-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
            selectedRole === 'worker'
              ? 'bg-blue-50/90 border-[#12355B] ring-2 ring-[#12355B]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${selectedRole === 'worker' ? 'bg-[#12355B] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Informal Worker</h3>
                {selectedRole === 'worker' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#12355B] text-white">Selected</span>}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Register skills, declare 10 Assistant Electrician competencies, view NSQF Level 3 mapping recommendation, and track certification progress.
              </p>
            </div>
          </div>

          {/* Sub-selector for specific Demo Worker */}
          {selectedRole === 'worker' && (
            <div className="pt-2 border-t border-blue-200 space-y-2">
              <label className="block text-[11px] font-bold text-[#12355B] uppercase">Select Candidate Profile:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_WORKERS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedWorkerId(w.id); }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      selectedWorkerId === w.id
                        ? 'bg-[#12355B] text-white font-bold border-[#12355B]'
                        : 'bg-white text-slate-700 hover:bg-blue-100/50 border-slate-200 font-medium'
                    }`}
                  >
                    <p className="font-bold truncate">{w.name}</p>
                    <p className="text-[10px] opacity-80">{w.exp} exp</p>
                    <p className="text-[9px] opacity-70 truncate mt-0.5">{w.status}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assessor Role Option */}
        <button
          onClick={() => setSelectedRole('assessor')}
          className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
            selectedRole === 'assessor'
              ? 'bg-teal-50/90 border-[#0F766E] ring-2 ring-[#0F766E]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl shrink-0 ${selectedRole === 'assessor' ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600'}`}>
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Authorized Assessor</h3>
              {selectedRole === 'assessor' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F766E] text-white">Selected</span>}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Conduct live 8-point switchboard task practical evaluations, upload evidence, review AI feedback, and sign final decisions.
            </p>
          </div>
        </button>

        {/* Admin Role Option */}
        <button
          onClick={() => setSelectedRole('admin')}
          className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-700 ${
            selectedRole === 'admin'
              ? 'bg-purple-50/90 border-purple-700 ring-2 ring-purple-700/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl shrink-0 ${selectedRole === 'admin' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Platform Admin</h3>
              {selectedRole === 'admin' && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-700 text-white">Selected</span>}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              View district completion charts, assessor consistency metrics, outcome distribution, and governance audit logs.
            </p>
          </div>
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={handleDemoLogin}
        className="w-full py-4 rounded-xl bg-[#12355B] hover:bg-[#1a4877] text-white font-bold text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B]"
      >
        <span>Continue as Demo {selectedRole === 'worker' ? `Worker (${DEMO_WORKERS.find(w=>w.id===selectedWorkerId)?.name})` : selectedRole === 'assessor' ? 'Assessor' : 'Admin'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
