import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { forceResetSeedData } from '../db/seedData';
import { 
  Zap, 
  Globe, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  User, 
  Shield, 
  Award, 
  BarChart3, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { role, activeWorker, loginAsDemoWorker, loginAsDemoAssessor, loginAsDemoAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-300 transition">
                  SkillSetu RPL
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Role specific links */}
            {role === 'worker' && (
              <>
                <Link
                  to="/worker/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname.startsWith('/worker/dashboard') ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {t('nav.worker_dashboard')}
                </Link>
                <Link
                  to="/worker/self-declaration"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname.startsWith('/worker/self-declaration') ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {t('nav.self_declaration')}
                </Link>
              </>
            )}

            {role === 'assessor' && (
              <Link
                to="/assessor/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith('/assessor') ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t('nav.assessor_dashboard')}
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname.startsWith('/admin') ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t('nav.admin_dashboard')}
              </Link>
            )}

            <Link
              to="/offline-sync"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                location.pathname === '/offline-sync' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              {t('nav.offline_sync')}
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Online/Offline Status Indicator */}
            <Link
              to="/offline-sync"
              title={isOnline ? 'Online - Ready to sync' : 'Offline mode active'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'EN | తెలుగు' : 'తెలుగు | EN'}</span>
            </button>

            {/* Active Demo Role Switcher Dropdown */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 px-1.5 font-medium">Role:</span>
              <button
                onClick={() => { loginAsDemoWorker(); navigate('/worker/dashboard'); }}
                className={`px-2 py-1 rounded font-semibold transition ${
                  role === 'worker' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Worker
              </button>
              <button
                onClick={() => { loginAsDemoAssessor(); navigate('/assessor/dashboard'); }}
                className={`px-2 py-1 rounded font-semibold transition ${
                  role === 'assessor' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Assessor
              </button>
              <button
                onClick={() => { loginAsDemoAdmin(); navigate('/admin/dashboard'); }}
                className={`px-2 py-1 rounded font-semibold transition ${
                  role === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetData}
              title="Reset initial demo records"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="px-2.5 py-1 rounded text-xs bg-slate-800 text-blue-300 border border-slate-700"
            >
              {language === 'en' ? 'తెలుగు' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-800 text-sm">
            <span className="text-slate-400">Current Role:</span>
            <span className="font-bold text-blue-400 capitalize">{role}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-1">
            <button
              onClick={() => { loginAsDemoWorker(); navigate('/worker/dashboard'); setMobileMenuOpen(false); }}
              className={`py-2 text-center rounded text-xs font-semibold ${role === 'worker' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Worker Demo
            </button>
            <button
              onClick={() => { loginAsDemoAssessor(); navigate('/assessor/dashboard'); setMobileMenuOpen(false); }}
              className={`py-2 text-center rounded text-xs font-semibold ${role === 'assessor' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Assessor Demo
            </button>
            <button
              onClick={() => { loginAsDemoAdmin(); navigate('/admin/dashboard'); setMobileMenuOpen(false); }}
              className={`py-2 text-center rounded text-xs font-semibold ${role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Admin Demo
            </button>
          </div>

          <nav className="flex flex-col gap-1 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/worker/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.register')}
            </Link>
            <Link
              to="/worker/self-declaration"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.self_declaration')}
            </Link>
            <Link
              to="/assessor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.assessor_dashboard')}
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.admin_dashboard')}
            </Link>
            <Link
              to="/offline-sync"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm text-slate-200 hover:bg-slate-800"
            >
              {t('nav.offline_sync')}
            </Link>
          </nav>

          <button
            onClick={() => { handleResetData(); setMobileMenuOpen(false); }}
            className="w-full mt-3 py-2 px-3 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Demo Data
          </button>
        </div>
      )}
    </header>
  );
};
