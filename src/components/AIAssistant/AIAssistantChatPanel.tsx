import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  X, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  FileText, 
  Scale, 
  HelpCircle, 
  Search, 
  AlertCircle, 
  RotateCcw,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { AIMessageRenderer } from './AIMessageRenderer';
import { ProcurementSpecModal } from './ProcurementSpecModal';
import { processAssistantQuery } from '../../services/isAssistantService';
import type { AIMessage, StandardSourceRef } from '../../types';

interface AIAssistantChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_WELCOME_TEXT = `Hello! I'm IS Guide AI Assistant.
I can help you:
• Find relevant Indian Standards
• Understand IS codes and standards
• Identify applicable standards for procurement
• Explain technical requirements
• Compare related standards
• Guide you through the IS Guide AI platform

How can I help you today?`;

const QUICK_ACTIONS = [
  { label: 'Find an Indian Standard', query: 'Find an Indian Standard for electrical cables' },
  { label: 'Recommend standards for my product', query: 'Recommend standards for cement and RCC construction' },
  { label: 'Explain an IS code', query: 'Explain IS 456' },
  { label: 'Compare two standards', query: 'Compare IS 694 and IS 7098' },
  { label: 'Help with procurement specification', query: 'Help me create a procurement specification' },
  { label: 'How does IS Guide AI work?', query: 'How does IS Guide AI work?' }
];

export const AIAssistantChatPanel: React.FC<AIAssistantChatPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message on mount if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          conversationId: 'default-conv',
          role: 'assistant',
          content: INITIAL_WELCOME_TEXT,
          createdAt: new Date().toISOString(),
          verificationStatus: 'Verified from database',
          followUps: [
            'Find standards for electrical cables',
            'Which Indian Standard applies to cement?',
            'Explain IS 456',
            'Help me create a procurement specification'
          ]
        }
      ]);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    setError(null);

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      conversationId: 'default-conv',
      role: 'user',
      content: query,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await processAssistantQuery({
        query,
        history: [...messages, userMessage]
      });

      const assistantMessage: AIMessage = {
        id: `ast-${Date.now()}`,
        conversationId: 'default-conv',
        role: 'assistant',
        content: response.content,
        createdAt: new Date().toISOString(),
        sources: response.sources,
        verificationStatus: response.verificationStatus,
        followUps: response.followUps,
        specificationDraft: response.specificationDraft
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setError('An error occurred while communicating with the IS Guide AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          conversationId: 'default-conv',
          role: 'assistant',
          content: INITIAL_WELCOME_TEXT,
          createdAt: new Date().toISOString(),
          verificationStatus: 'Verified from database',
          followUps: [
            'Find standards for electrical cables',
            'Which Indian Standard applies to cement?',
            'Explain IS 456',
            'Help me create a procurement specification'
          ]
        }
      ]);
      setError(null);
    }
  };

  const handleGenerateSpecSubmit = (specData: {
    product: string;
    intendedUse: string;
    quantity: string;
    requiredPerformance: string;
    applicationIndustry: string;
  }) => {
    const customPrompt = `Help me create a procurement specification for ${specData.product}. Intended use: ${specData.intendedUse}. Quantity: ${specData.quantity}. Performance: ${specData.requiredPerformance}. Industry: ${specData.applicationIndustry}.`;
    handleSendMessage(customPrompt);
  };

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
        isExpanded
          ? 'inset-2 sm:inset-6 rounded-3xl'
          : 'bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[440px] h-[92vh] sm:h-[640px] max-h-[100vh] sm:rounded-3xl'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#1a4877] to-[#0F766E] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-0.5 flex items-center justify-center shadow-inner">
              <div className="w-full h-full bg-[#12355B] rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            {/* Live indicator dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#12355B] rounded-full animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm sm:text-base tracking-tight text-white">IS Guide AI Assistant</h2>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-[9px] uppercase tracking-wider">
                Official BIS DB
              </span>
            </div>
            <p className="text-[11px] text-teal-100 font-medium">Indian Standards Recommendation Engine</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:flex p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title={isExpanded ? 'Minimize Window' : 'Expand Window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F6F9FC]">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#12355B] text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs transition-all ${
                msg.role === 'user'
                  ? 'bg-[#12355B] text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{msg.content}</p>
              ) : (
                <AIMessageRenderer
                  content={msg.content}
                  sources={msg.sources}
                  verificationStatus={msg.verificationStatus}
                  specificationDraft={msg.specificationDraft}
                  onCodeClick={(code) => handleSendMessage(`Explain ${code}`)}
                />
              )}

              {/* Timestamp */}
              <div className={`mt-1.5 text-[9px] font-medium flex items-center gap-1 ${msg.role === 'user' ? 'text-blue-200 justify-end' : 'text-slate-400'}`}>
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Follow-up Question Chips */}
              {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suggested Follow-ups:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.followUps.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#12355B] font-extrabold text-[11px] border border-blue-200 transition cursor-pointer text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Quick Suggestion Buttons on Welcome State */}
        {messages.length === 1 && (
          <div className="pt-2 pb-4 space-y-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">Quick Action Suggestions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action, aIdx) => (
                <button
                  key={aIdx}
                  onClick={() => handleSendMessage(action.query)}
                  className="p-2.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-left transition shadow-2xs hover:border-blue-300 group cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#12355B] group-hover:text-blue-700 block">{action.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Click to execute query</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold pl-2 py-2">
            <div className="w-7 h-7 rounded-xl bg-[#12355B] text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-600">IS Assistant is searching database</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#12355B] animate-ping"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping delay-200"></span>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleSendMessage(messages[messages.length - 1]?.content)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:bg-rose-700"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Trigger Bar above Input */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setIsSpecModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] border border-amber-300 flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <FileText className="w-3 h-3 text-amber-700" />
          <span>Generate Spec</span>
        </button>

        <button
          onClick={() => handleSendMessage('Compare IS 694 and IS 7098')}
          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#12355B] font-bold text-[11px] border border-blue-200 flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <Scale className="w-3 h-3 text-[#12355B]" />
          <span>Compare Cables</span>
        </button>

        <button
          onClick={() => handleSendMessage('Which Indian Standard applies to cement?')}
          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-[11px] border border-teal-200 flex-shrink-0 cursor-pointer"
        >
          <span>Cement Standards</span>
        </button>

        <button
          onClick={() => handleSendMessage('Explain IS 456')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 flex-shrink-0 cursor-pointer"
        >
          <span>IS 456</span>
        </button>
      </div>

      {/* Text Input Footer */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about Indian Standards, IS codes, procurement..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#12355B] focus:bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#12355B] hover:bg-blue-900 disabled:opacity-40 text-white font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Interactive Procurement Spec Form Modal */}
      <ProcurementSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
        onGenerate={handleGenerateSpecSubmit}
      />
    </div>
  );
};
