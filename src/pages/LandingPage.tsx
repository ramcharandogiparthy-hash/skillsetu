import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { 
  Zap, 
  CheckCircle2, 
  UserCheck, 
  ClipboardCheck, 
  BrainCircuit, 
  WifiOff, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  Users,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { loginAsDemoWorker, loginAsDemoAssessor } = useAuth();
  const navigate = useNavigate();

  const handleWorkerLogin = async () => {
    await loginAsDemoWorker('w-101');
    navigate('/worker/dashboard');
  };

  const handleAssessorLogin = () => {
    loginAsDemoAssessor();
    navigate('/assessor/dashboard');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon RPL Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            SkillSetu <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">RPL</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Empowering informal workers with transparent self-declaration, offline practical assessment, and human-guided AI evidence verification.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleWorkerLogin}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>{t('hero.btn_worker')}</span>
            </button>

            <button
              onClick={handleAssessorLogin}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2"
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>{t('hero.btn_assessor')}</span>
            </button>

            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition flex items-center gap-2"
            >
              <span>{t('hero.btn_demo')}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trade Supported Badge */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-semibold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Supported Trade MVP: <strong>Assistant Electrician (NSQF Level 3)</strong></span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* AI Disclaimer Policy Banner */}
        <AIDisclaimerBanner />

        {/* Core Feature Cards */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Key Platform Capabilities
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Built specifically for low digital literacy environments, offline field deployment, and strict assessor accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Self-Declaration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple visual & voice-assisted questionnaire for Assistant Electrician skills.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Practical Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                8-point standardized practical evaluation checklist for switchboard wiring & safety.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI Evidence Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated detection of safety gloves, tools, and evidence quality checks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Offline Storage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                IndexedDB storage captures marks and photos offline, syncing later when online.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Assessor Approval</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Human assessor makes final decisions with digital signature & audit log.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works Timeline */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 border border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              How SkillSetu RPL Works
            </h2>
            <p className="text-slate-400 text-sm">
              From informal job experience to recognized competency certification in 5 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '1', title: 'Register', desc: 'Worker completes basic demographic & trade details in English/Telugu.' },
              { step: '2', title: 'Declare Skills', desc: '10 visual questions with optional voice response.' },
              { step: '3', title: 'Get Suggestion', desc: 'Transparent rules engine maps answers to NSQF Level 3.' },
              { step: '4', title: 'Practical Task', desc: 'Assessor scores live switchboard installation task.' },
              { step: '5', title: 'Assessor Decision', desc: 'Human assessor reviews AI guidance & approves result.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 relative space-y-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                  {item.step}
                </div>
                <h4 className="font-bold text-base text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
