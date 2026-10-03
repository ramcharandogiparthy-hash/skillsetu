import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AIDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 text-xs font-medium">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t('ai.disclaimer_body')}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-md text-slate-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
            <span>{t('ai.disclaimer_title')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
              MANDATORY RULE
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {t('ai.disclaimer_body')}
          </p>
        </div>
      </div>
    </div>
  );
};
