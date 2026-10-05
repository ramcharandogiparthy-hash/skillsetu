import React from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

interface AIAssistantFloatingButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AIAssistantFloatingButton: React.FC<AIAssistantFloatingButtonProps> = ({
  isOpen,
  onToggle
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 no-print">
      <button
        onClick={onToggle}
        className={`group relative p-3.5 sm:p-4 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center cursor-pointer ${
          isOpen
            ? 'bg-slate-800 text-white hover:bg-slate-900 rotate-90'
            : 'bg-gradient-to-br from-[#12355B] via-[#1a4877] to-[#0F766E] text-white hover:scale-105 border border-amber-400/30'
        }`}
        aria-label="Toggle IS Guide AI Assistant"
        title="IS Guide AI Assistant"
      >
        {/* Subtle Ambient Pulse Ring when closed */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-2xl bg-amber-400/30 animate-ping pointer-events-none opacity-75"></span>
        )}

        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-6 h-6 text-amber-400" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="hidden md:inline-block font-extrabold text-xs tracking-wide text-white">
              IS Guide AI
            </span>
          </div>
        )}
      </button>

      {/* Floating Hover Badge */}
      {!isOpen && (
        <div className="hidden lg:block absolute bottom-full right-0 mb-2 whitespace-nowrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#12355B] text-white font-extrabold text-[11px] shadow-lg border border-blue-800 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ask IS Guide AI Assistant</span>
          </div>
        </div>
      )}
    </div>
  );
};
