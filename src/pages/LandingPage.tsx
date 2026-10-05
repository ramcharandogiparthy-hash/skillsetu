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
  Sparkles,
  ChevronRight,
  Database,
  Building2,
  CheckCircle,
  Clock,
  Layers,
  BarChart3,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const handleWorkerLogin = async () => {
    await loginAsDemoWorker('w-101');
    navigate('/worker/dashboard');
  };

  const handleAssessorLogin = () => {
    loginAsDemoAssessor();
    navigate('/assessor/dashboard');
  };

  const handleAdminLogin = () => {
    loginAsDemoAdmin();
    navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Visually Impressive Hero Section with Navy-to-Blue Gradient & Abstract Network Pattern */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#12355B] via-[#1a4877] to-[#2563EB] text-white rounded-3xl shadow-xl border border-blue-900/60 p-6 sm:p-12">
        {/* Subtle Background Abstract Network Pattern Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Government & Hackathon Emblem Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-inner">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon 2026 Winner Prototype | Government & Skill India Initiative</span>
          </div>

          {/* Title & Main Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Turn real work experience into recognized opportunity.
            </h1>
            <p className="text-amber-300 font-extrabold text-sm sm:text-base tracking-wide uppercase">
              SkillSetu • {t('app.tagline')}
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed font-medium opacity-95">
            SkillSetu helps informal workers document their real-world experience, demonstrate practical skills, and receive a standardized RPL assessment with AI-assisted evidence support and human assessor approval.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#12355B] font-black text-sm sm:text-base shadow-lg shadow-amber-900/40 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
            >
              <Play className="w-5 h-5 fill-[#12355B]" />
              <span>Explore Demo</span>
            </Link>

            <button
              onClick={handleWorkerLogin}
              className="px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-black text-sm sm:text-base shadow-lg shadow-teal-900/40 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
            >
              <UserCheck className="w-5 h-5 text-teal-200" />
              <span>Start Assessment</span>
            </button>
          </div>

          {/* Badges Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-100 font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-700/60 shadow-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              MVP Trade: <strong>Assistant Electrician (NSQF Level 3)</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-700/60 shadow-xs">
              <Database className="w-4 h-4 text-teal-300" />
              IndexedDB Offline-First Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-700/60 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Human Assessor Final Approval
            </span>
          </div>
        </div>
      </section>

      {/* Mandatory Human-in-the-Loop AI Policy Banner */}
      <AIDisclaimerBanner />

      {/* Visual Process Flow with Icons: Worker -> Skill Mapping -> Assessment -> Assessor Review -> Certification */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#12355B] text-xs font-bold border border-blue-200">
            End-to-End RPL Assessment Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How SkillSetu RPL Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            From informal work experience to recognized NSQF Level 3 certification in 5 transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '1',
              title: 'Worker Registration',
              subtitle: 'Worker',
              desc: 'Worker enters demographic data and work background in English or Telugu.',
              icon: UserCheck,
              color: 'bg-[#12355B]'
            },
            {
              step: '2',
              title: 'Skill Mapping',
              subtitle: 'NSQF Mapping',
              desc: '10 visual self-declaration questions mapped automatically to NSQF Level 3.',
              icon: Layers,
              color: 'bg-[#2563EB]'
            },
            {
              step: '3',
              title: 'Practical Assessment',
              subtitle: 'Task Evaluation',
              desc: 'Assessor scores live switchboard wiring & safety task using 8-point checklist.',
              icon: ClipboardCheck,
              color: 'bg-[#0F766E]'
            },
            {
              step: '4',
              title: 'Assessor Review',
              subtitle: 'AI-Assisted Evidence',
              desc: 'AI computer vision checks safety gloves & tools to assist assessor review.',
              icon: BrainCircuit,
              color: 'bg-purple-600'
            },
            {
              step: '5',
              title: 'Certification',
              subtitle: 'Final Approval',
              desc: 'Human assessor makes final certification decision with digital signature.',
              icon: ShieldCheck,
              color: 'bg-[#16A34A]'
            }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#F6F9FC] p-5 rounded-2xl border border-slate-200 hover-lift space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl ${item.color} text-white font-black flex items-center justify-center text-xs shadow-xs`}>
                    {item.step}
                  </div>
                  <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-[#2563EB] transition" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.subtitle}</span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Entry Launcher Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Interactive Role Portals
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Launch any persona to test the end-to-end RPL evaluation process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#12355B] flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Worker Persona
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Informal Worker Portal</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Low-digital-literacy interface for Assistant Electricians to register, complete 10-question self-declarations (with voice notes), and track certification status.
                </p>
              </div>
            </div>
            <button
              onClick={handleWorkerLogin}
              className="w-full py-3 rounded-xl bg-[#12355B] hover:bg-[#1a4877] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <span>Launch Worker Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Assessor Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold">
                <ClipboardCheck className="w-6 h-6 text-[#0F766E]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  Assessor Persona
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Authorized Assessor Portal</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Field evaluator dashboard to conduct live switchboard practical task scoring, capture photo/video evidence, review AI feedback, and sign official decisions.
                </p>
              </div>
            </div>
            <button
              onClick={handleAssessorLogin}
              className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-teal-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F766E]"
            >
              <span>Launch Assessor Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  Admin Persona
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">National Skill Analytics</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  Governance dashboard showing district RPL completion rates, assessor consistency indices, outcome distribution charts, and full audit trails.
                </p>
              </div>
            </div>
            <button
              onClick={handleAdminLogin}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-700"
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8 shadow-xs">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Key Feature Capabilities
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Tailored specifically for Indian informal labor conditions, low connectivity, and high certification integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#F6F9FC] p-6 rounded-2xl border border-slate-200 hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Self-Declaration Questionnaire</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Simplified questions with visual tools and optional voice answers in Telugu/English for candidates with low literacy.
            </p>
          </div>

          <div className="bg-[#F6F9FC] p-6 rounded-2xl border border-slate-200 hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5 text-[#0F766E]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Standardized 8-Point Rubric</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Reduces score variation across assessors by standardizing switchboard installation and circuit testing steps.
            </p>
          </div>

          <div className="bg-[#F6F9FC] p-6 rounded-2xl border border-slate-200 hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Evidence Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Automated detection of PPE gloves, insulated tools, and voltage tester evidence to assist assessor review.
            </p>
          </div>

          <div className="bg-[#F6F9FC] p-6 rounded-2xl border border-slate-200 hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
              <WifiOff className="w-5 h-5 text-[#16A34A]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Offline-First Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Full field operation offline without internet; stores evaluation marks & media locally in IndexedDB until cloud sync.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
