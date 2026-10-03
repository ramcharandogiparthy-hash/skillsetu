import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserCheck, ClipboardCheck, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');

  const handleDemoLogin = async () => {
    if (selectedRole === 'worker') {
      await loginAsDemoWorker('w-101');
      showToast('Welcome Demo Worker', 'Logged in as Ravi Kumar (Assistant Electrician)', 'success');
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
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 text-blue-600 mb-2">
          <Zap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Demo Role Authentication
        </h1>
        <p className="text-slate-600 text-sm">
          Select a role to test the complete end-to-end RPL assessment flow without real SMS OTP.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Worker Role Option */}
        <button
          onClick={() => setSelectedRole('worker')}
          className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 ${
            selectedRole === 'worker'
              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl ${selectedRole === 'worker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Informal Worker</h3>
              {selectedRole === 'worker' && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-600 text-white">Selected</span>}
            </div>
            <p className="text-xs text-slate-600">
              Register, self-declare electrician skills, view NSQF Level 3 qualification suggestion, and check assessment status.
            </p>
          </div>
        </button>

        {/* Assessor Role Option */}
        <button
          onClick={() => setSelectedRole('assessor')}
          className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 ${
            selectedRole === 'assessor'
              ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl ${selectedRole === 'assessor' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Authorized Assessor</h3>
              {selectedRole === 'assessor' && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600 text-white">Selected</span>}
            </div>
            <p className="text-xs text-slate-600">
              Score practical switchboard tasks, upload evidence, review AI feedback, and sign final competency decisions.
            </p>
          </div>
        </button>

        {/* Admin Role Option */}
        <button
          onClick={() => setSelectedRole('admin')}
          className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 ${
            selectedRole === 'admin'
              ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-600/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl ${selectedRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Platform Admin</h3>
              {selectedRole === 'admin' && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-600 text-white">Selected</span>}
            </div>
            <p className="text-xs text-slate-600">
              View state analytics, district completion charts, assessor consistency metrics, and audit logs.
            </p>
          </div>
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={handleDemoLogin}
        className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
      >
        <span>Continue as Demo {selectedRole === 'worker' ? 'Worker' : selectedRole === 'assessor' ? 'Assessor' : 'Admin'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
