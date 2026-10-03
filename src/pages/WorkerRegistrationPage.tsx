import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../db/db';
import type { WorkerProfile } from '../types';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckSquare, 
  Save, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Globe
} from 'lucide-react';

export const WorkerRegistrationPage: React.FC = () => {
  const { setActiveWorker, loginAsDemoWorker } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);

  // Form Fields State
  const [formData, setFormData] = useState<Partial<WorkerProfile>>({
    fullName: 'Ramesh Naidu',
    mobileNumber: '9848099887',
    age: 31,
    gender: 'Male',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    preferredLanguage: 'Telugu',
    trade: 'Assistant Electrician',
    yearsOfExperience: 5,
    workType: 'Independent',
    consentGiven: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'age' || name === 'yearsOfExperience' ? Number(value) : value
      }));
    }
  };

  const saveDraftToDb = async () => {
    const workerId = `w-${Date.now().toString().slice(-4)}`;
    const newWorker: WorkerProfile = {
      id: workerId,
      fullName: formData.fullName || 'Draft Worker',
      mobileNumber: formData.mobileNumber || '9999999999',
      age: formData.age || 25,
      gender: formData.gender as any || 'Male',
      district: formData.district || 'Visakhapatnam',
      state: formData.state || 'Andhra Pradesh',
      preferredLanguage: formData.preferredLanguage as any || 'Telugu',
      trade: 'Assistant Electrician',
      yearsOfExperience: formData.yearsOfExperience || 3,
      workType: formData.workType as any || 'Independent',
      consentGiven: !!formData.consentGiven,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.workers.put(newWorker);
    await loginAsDemoWorker(workerId);
    showToast('Offline Draft Saved', 'Worker profile stored in IndexedDB.', 'info');
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      showToast('Consent Required', 'Please accept the data consent checkbox to proceed.', 'warning');
      return;
    }

    const workerId = `w-${Date.now().toString().slice(-4)}`;
    const newWorker: WorkerProfile = {
      id: workerId,
      fullName: formData.fullName || 'New Worker',
      mobileNumber: formData.mobileNumber || '9848000000',
      age: formData.age || 28,
      gender: (formData.gender as any) || 'Male',
      district: formData.district || 'Visakhapatnam',
      state: formData.state || 'Andhra Pradesh',
      preferredLanguage: (formData.preferredLanguage as any) || 'Telugu',
      trade: 'Assistant Electrician',
      yearsOfExperience: formData.yearsOfExperience || 4,
      workType: (formData.workType as any) || 'Independent',
      consentGiven: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.workers.put(newWorker);
    await loginAsDemoWorker(workerId);
    showToast('Registration Complete', `Registered ${newWorker.fullName} successfully. Proceed to Self-Declaration.`, 'success');
    navigate('/worker/self-declaration');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Worker RPL Skill Registration
        </h1>
        <p className="text-slate-600 text-sm">
          Recognizing prior electrical work experience for formal assessment.
        </p>
      </div>

      {/* Progress Indicator Steps */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { num: 1, label: 'Personal Details' },
          { num: 2, label: 'Experience & Trade' },
          { num: 3, label: 'Data Consent' }
        ].map((item) => (
          <div key={item.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
                step === item.num
                  ? 'bg-blue-600 text-white shadow'
                  : step > item.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {item.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline-block ${
                step === item.num ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <form onSubmit={handleFinalSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Step 1: Personal & Location Details</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName || ''}
                onChange={handleChange}
                placeholder="e.g. Ramesh Naidu"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber || ''}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  min={18}
                  max={70}
                  required
                  value={formData.age || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender || 'Male'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preferred Language *
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage || 'Telugu'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium bg-white"
                >
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district || ''}
                  onChange={handleChange}
                  placeholder="e.g. Visakhapatnam"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state || ''}
                  onChange={handleChange}
                  placeholder="e.g. Andhra Pradesh"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Step 2: Work Experience & Trade Selection</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3">
              <Zap className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white">MVP Trade Selection</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Currently supporting <strong>Assistant Electrician (NSQF Level 3)</strong>.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Selected Trade
              </label>
              <input
                type="text"
                readOnly
                value="Assistant Electrician (NSQF Level 3)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-bold text-sm cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Years of Practical Experience *
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min={1}
                  max={45}
                  required
                  value={formData.yearsOfExperience || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Work Engagement Type *
                </label>
                <select
                  name="workType"
                  value={formData.workType || 'Independent'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-medium bg-white"
                >
                  <option value="Independent">Independent Technician</option>
                  <option value="Helper">Helper / Trainee</option>
                  <option value="Supervisor">Site Supervisor</option>
                  <option value="Contractor">Small Contractor</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Step 3: Consent for Data & AI Assessment</span>
            </h3>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-blue-900">
                Informal Worker Consent Statement
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                By ticking the consent box, I agree to store my demographic details, photo/video practical assessment evidence, and voice recordings on SkillSetu RPL for competency evaluation.
              </p>
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-[11px] text-slate-600">
                <strong>Notice:</strong> Your data is stored locally in IndexedDB and is only shared with authorized human assessors. AI is used solely for evidence guidance and quality scoring.
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                name="consentGiven"
                checked={!!formData.consentGiven}
                onChange={handleChange}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <span className="text-xs font-semibold text-slate-900 leading-normal">
                I give consent for storing my details, voice audio, and practical assessment video/photo evidence.
              </span>
            </label>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={saveDraftToDb}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Offline Draft</span>
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition flex items-center gap-1.5"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
