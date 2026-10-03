import React from 'react';
import { Zap, Heart, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 no-print mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-white">SkillSetu RPL</span>
          </div>
          <p className="text-sm text-slate-300 font-medium">
            {t('app.tagline')}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            AI-assisted Recognition of Prior Learning assessment platform for informal workers in India. Empowering electricians, technicians, and craftspeople with formal competency verification.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Human-Assessor Final Approval System</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Quick Navigation
          </h5>
          <ul className="space-y-2 text-xs">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/worker/register" className="hover:text-white transition">Worker Registration</a></li>
            <li><a href="/worker/self-declaration" className="hover:text-white transition">Self-Declaration</a></li>
            <li><a href="/assessor/dashboard" className="hover:text-white transition">Assessor Dashboard</a></li>
            <li><a href="/admin/dashboard" className="hover:text-white transition">Admin Analytics</a></li>
            <li><a href="/offline-sync" className="hover:text-white transition">Offline Storage Sync</a></li>
          </ul>
        </div>

        {/* SIH Hackathon & Platform Info */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
            Hackathon Status
          </h5>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              Built for Smart India Hackathon
            </p>
            <p className="text-[11px] text-slate-400">
              Offline-first prototype using IndexedDB & local AI evidence review.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            © 2026 SkillSetu RPL. All rights reserved. Supported trade: Assistant Electrician (NSQF Level 3).
          </p>
        </div>
      </div>
    </footer>
  );
};
