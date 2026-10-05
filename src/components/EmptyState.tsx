import React from 'react';
import { Inbox, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto shadow-xs border border-blue-100">
        {icon || <Inbox className="w-7 h-7 text-[#12355B]" />}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12355B] hover:bg-[#1a4877] text-white font-bold text-xs shadow-xs transition"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
