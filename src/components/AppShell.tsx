import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { forceResetSeedData } from '../db/seedData';
import { Breadcrumbs } from './Breadcrumbs';
import { Footer } from './Footer';
import { QuickDemoBar } from './QuickDemoBar';
import { NetworkStatusBadge } from './NetworkStatusBadge';
import { AIAssistantFloatingButton } from './AIAssistant/AIAssistantFloatingButton';
import { AIAssistantChatPanel } from './AIAssistant/AIAssistantChatPanel';
import { 
  Zap, 
  Globe, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  ClipboardCheck, 
  ShieldCheck, 
  RefreshCw, 
  Menu, 
  X, 
  Home, 
  FileText, 
  Award, 
  BrainCircuit, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  User,
  CheckCircle2,
  Bell,
  Sparkles
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { role, activeWorker, assessorName, loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      await forceResetSeedData();
      showToast('Demo Data Reset', 'IndexedDB state has been restored to default demo records.', 'success');
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const activeWorkerId = activeWorker?.id || 'w-101';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F9FC] text-slate-900 selection:bg-[#12355B] selection:text-white font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#12355B] text-white border-b border-blue-900/80 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand Logo & Desktop Sidebar Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 transition focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                title={sidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
                aria-label="Toggle Sidebar"
              >
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-teal-600 to-[#12355B] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                  <div className="w-full h-full bg-[#12355B] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-200 transition">
                      SkillSetu <span className="text-amber-400 font-extrabold">RPL</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      SIH Hackathon
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium tracking-wide">
                    {t('app.tagline')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Right: Actions (Offline Badge, Notifications, Language, Role Selector) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Network Status Badge & PWA Install Button */}
              <NetworkStatusBadge />


              {/* Notifications Icon Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    showToast('System Notifications', '3 practical assessments pending assessor sign-off.', 'info');
                  }}
                  className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 transition cursor-pointer relative focus-visible:ring-2 focus-visible:ring-white"
                  title="View Notifications"
                  aria-label="View Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                </button>
              </div>

              {/* Language Switcher Toggle Button */}
              <button
                onClick={() => {
                  const newLang = language === 'en' ? 'te' : 'en';
                  setLanguage(newLang);
                  showToast('Language Changed', `Switched interface language to ${newLang === 'en' ? 'English' : 'Telugu (తెలుగు)'}`, 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/60 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                title="Switch Language / భాష మార్చండి"
                aria-label="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-300" />
                <span>{language === 'en' ? 'EN | తెలుగు' : 'తెలుగు | EN'}</span>
              </button>

              {/* Desktop Role Quick Switcher Pills */}
              <div className="hidden md:flex items-center bg-blue-950/70 p-1 rounded-xl border border-blue-800 text-xs">
                <span className="text-blue-300 px-2 text-[11px] font-bold">Role:</span>
                <button
                  onClick={() => { loginAsDemoWorker(activeWorkerId); navigate('/worker/dashboard'); }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    role === 'worker' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  Worker
                </button>
                <button
                  onClick={() => { loginAsDemoAssessor(); navigate('/assessor/dashboard'); }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    role === 'assessor' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  Assessor
                </button>
                <button
                  onClick={() => { loginAsDemoAdmin(); navigate('/admin/dashboard'); }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    role === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Demo Data Reset Button */}
              <button
                onClick={handleResetData}
                title="Reset all demo records back to initial seed data"
                className="hidden sm:flex p-2 rounded-xl bg-blue-900/60 hover:bg-rose-900/60 text-blue-200 hover:text-rose-300 border border-blue-700/60 hover:border-rose-700/60 transition cursor-pointer"
                aria-label="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-blue-900/80 text-white hover:bg-blue-800 lg:hidden"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar Navigation + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Desktop Sidebar Navigation */}
        <aside
          className={`hidden lg:block shrink-0 transition-all duration-300 no-print ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sticky top-22 space-y-5">
            {/* Profile / Demo Role Summary Box */}
            {!sidebarCollapsed && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase text-[#12355B]">Active Role</span>
                  <span className="px-2 py-0.5 rounded bg-[#12355B] text-white font-extrabold text-[10px] uppercase">
                    {role}
                  </span>
                </div>
                <p className="font-black text-slate-900 text-sm truncate">
                  {role === 'worker'
                    ? activeWorker?.fullName || 'Ravi Kumar'
                    : role === 'assessor'
                    ? 'Rajesh Sharma'
                    : 'System Administrator'}
                </p>
                <p className="text-[11px] text-slate-500 font-bold">
                  {role === 'worker' ? 'Assistant Electrician' : role === 'assessor' ? 'Senior Assessor' : 'Governance Portal'}
                </p>
              </div>
            )}

            {/* Grouped Links */}
            <nav className="space-y-4">
              {/* General Group */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Overview
                  </p>
                )}
                <div className="space-y-1">
                  <Link
                    to="/"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/') && location.pathname === '/'
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Home"
                  >
                    <Home className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!sidebarCollapsed && <span>{t('nav.home')}</span>}
                  </Link>

                  <Link
                    to="/offline-sync"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/offline-sync')
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Offline Sync"
                  >
                    <RefreshCw className="w-4 h-4 shrink-0 text-[#0F766E]" />
                    {!sidebarCollapsed && <span>{t('nav.offline_sync')}</span>}
                  </Link>
                </div>
              </div>

              {/* Worker Flow Group */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Worker Portal
                  </p>
                )}
                <div className="space-y-1">
                  <Link
                    to="/worker/register"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/worker/register')
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Worker Registration"
                  >
                    <UserCheck className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!sidebarCollapsed && <span>Skill Registration</span>}
                  </Link>

                  <Link
                    to="/worker/self-declaration"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/worker/self-declaration')
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Self-Declaration"
                  >
                    <FileText className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!sidebarCollapsed && <span>Self-Declaration</span>}
                  </Link>

                  <Link
                    to="/worker/qualification-mapping"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/worker/qualification-mapping')
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Qualification Mapping"
                  >
                    <Award className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!sidebarCollapsed && <span>NSQF Level 3 Mapping</span>}
                  </Link>

                  <Link
                    to="/worker/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/worker/dashboard')
                        ? 'border-l-4 border-[#2563EB] bg-blue-50/90 text-[#12355B] shadow-xs'
                        : 'text-slate-600 hover:text-[#12355B] hover:bg-slate-100'
                    }`}
                    title="Worker Dashboard"
                  >
                    <User className="w-4 h-4 shrink-0 text-[#2563EB]" />
                    {!sidebarCollapsed && <span>Worker Dashboard</span>}
                  </Link>
                </div>
              </div>

              {/* Assessor Flow Group */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Assessor Portal
                  </p>
                )}
                <div className="space-y-1">
                  <Link
                    to="/assessor/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/assessor/dashboard')
                        ? 'border-l-4 border-[#0F766E] bg-teal-50/90 text-[#0F766E] shadow-xs'
                        : 'text-slate-600 hover:text-[#0F766E] hover:bg-teal-50'
                    }`}
                    title="Assessor Dashboard"
                  >
                    <ClipboardCheck className="w-4 h-4 shrink-0 text-[#0F766E]" />
                    {!sidebarCollapsed && <span>Assessor Dashboard</span>}
                  </Link>

                  <Link
                    to={`/assessor/assessment/${activeWorkerId}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/assessor/assessment')
                        ? 'border-l-4 border-[#0F766E] bg-teal-50/90 text-[#0F766E] shadow-xs'
                        : 'text-slate-600 hover:text-[#0F766E] hover:bg-teal-50'
                    }`}
                    title="Practical Task Evaluation"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0F766E]" />
                    {!sidebarCollapsed && <span>Practical Task</span>}
                  </Link>

                  <Link
                    to={`/assessor/ai-evidence/${activeWorkerId}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/assessor/ai-evidence')
                        ? 'border-l-4 border-[#0F766E] bg-teal-50/90 text-[#0F766E] shadow-xs'
                        : 'text-slate-600 hover:text-[#0F766E] hover:bg-teal-50'
                    }`}
                    title="AI Evidence Review"
                  >
                    <BrainCircuit className="w-4 h-4 shrink-0 text-purple-600" />
                    {!sidebarCollapsed && <span>AI Evidence Support</span>}
                  </Link>

                  <Link
                    to={`/assessor/final-result/${activeWorkerId}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/assessor/final-result')
                        ? 'border-l-4 border-[#0F766E] bg-teal-50/90 text-[#0F766E] shadow-xs'
                        : 'text-slate-600 hover:text-[#0F766E] hover:bg-teal-50'
                    }`}
                    title="Final Decision"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#0F766E]" />
                    {!sidebarCollapsed && <span>Final Decision</span>}
                  </Link>
                </div>
              </div>

              {/* Admin Governance */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Governance
                  </p>
                )}
                <div className="space-y-1">
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive('/admin/dashboard')
                        ? 'border-l-4 border-purple-600 bg-purple-50/90 text-purple-900 shadow-xs'
                        : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                    }`}
                    title="National Admin Portal"
                  >
                    <BarChart3 className="w-4 h-4 shrink-0 text-purple-600" />
                    {!sidebarCollapsed && <span>National Analytics</span>}
                  </Link>
                </div>
              </div>
            </nav>

            {/* Quick Demo Reset Footer in Sidebar */}
            {!sidebarCollapsed && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleResetData}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile / Tablet Drawer Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex lg:hidden no-print">
            <div className="bg-white w-4/5 max-w-sm h-full p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#12355B]" />
                  <span className="font-extrabold text-lg text-slate-900">SkillSetu RPL</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role switch pill in drawer */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Switch Demo Role</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { loginAsDemoWorker(activeWorkerId); navigate('/worker/dashboard'); setMobileMenuOpen(false); }}
                    className={`py-2 text-center rounded-xl text-xs font-bold ${role === 'worker' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Worker
                  </button>
                  <button
                    onClick={() => { loginAsDemoAssessor(); navigate('/assessor/dashboard'); setMobileMenuOpen(false); }}
                    className={`py-2 text-center rounded-xl text-xs font-bold ${role === 'assessor' ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Assessor
                  </button>
                  <button
                    onClick={() => { loginAsDemoAdmin(); navigate('/admin/dashboard'); setMobileMenuOpen(false); }}
                    className={`py-2 text-center rounded-xl text-xs font-bold ${role === 'admin' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#2563EB]" /> Home
                </Link>
                <Link to="/worker/register" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-[#2563EB]" /> Worker Registration
                </Link>
                <Link to="/worker/self-declaration" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#2563EB]" /> Self-Declaration
                </Link>
                <Link to="/assessor/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <ClipboardCheck className="w-4 h-4 text-[#0F766E]" /> Assessor Portal
                </Link>
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-purple-600" /> Admin Analytics
                </Link>
                <Link to="/offline-sync" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-[#0F766E]" /> Offline Storage Sync
                </Link>
              </nav>

              <button
                onClick={() => { handleResetData(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Demo Data
              </button>
            </div>
          </div>
        )}

        {/* Main Content Workspace Area */}
        <main className="flex-1 min-w-0">
          <Breadcrumbs />
          <div className="mt-2">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12355B] text-white border-t border-blue-900 lg:hidden no-print px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 text-center text-[10px] font-bold">
          <Link
            to="/"
            className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname === '/' ? 'text-amber-400 font-extrabold' : 'text-slate-300'}`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {role === 'worker' ? (
            <Link
              to="/worker/dashboard"
              className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/worker') ? 'text-amber-400 font-extrabold' : 'text-slate-300'}`}
            >
              <User className="w-4 h-4" />
              <span>Worker</span>
            </Link>
          ) : role === 'assessor' ? (
            <Link
              to="/assessor/dashboard"
              className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/assessor') ? 'text-teal-300 font-extrabold' : 'text-slate-300'}`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Assessor</span>
            </Link>
          ) : (
            <Link
              to="/admin/dashboard"
              className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/admin') ? 'text-purple-300 font-extrabold' : 'text-slate-300'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/worker/self-declaration"
            className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname === '/worker/self-declaration' ? 'text-amber-400 font-extrabold' : 'text-slate-300'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Self-Decl</span>
          </Link>

          <Link
            to="/offline-sync"
            className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname === '/offline-sync' ? 'text-teal-300 font-extrabold' : 'text-slate-300'}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
          </Link>

          <Link
            to="/login"
            className={`py-1.5 flex flex-col items-center gap-0.5 ${location.pathname === '/login' ? 'text-amber-400 font-extrabold' : 'text-slate-300'}`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Role</span>
          </Link>
        </div>
      </nav>

      <QuickDemoBar />
      <Footer />

      {/* Floating IS Guide AI Assistant Widget */}
      <AIAssistantFloatingButton
        isOpen={isAssistantOpen}
        onToggle={() => setIsAssistantOpen(!isAssistantOpen)}
      />
      <AIAssistantChatPanel
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

