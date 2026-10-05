import React from 'react';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AIDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-950 text-xs font-bold shadow-xs">
        <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t('ai.disclaimer_body')}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#12355B] to-[#0f2a4a] border-l-4 border-amber-400 p-4 sm:p-5 rounded-2xl shadow-sm text-white space-y-2 no-print">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 mt-0.5 border border-amber-500/30">
          <UserCheck className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
              <span>{t('ai.disclaimer_title')}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40 uppercase tracking-wider">
                Mandatory Governance Rule
              </span>
            </h4>
            <span className="text-[10px] font-bold text-teal-300 flex items-center gap-1 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
              <ShieldCheck className="w-3 h-3 text-teal-300" />
              Human Assessor Final Authority
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {t('ai.disclaimer_body')}
          </p>
        </div>
      </div>
    </div>
  );
};
