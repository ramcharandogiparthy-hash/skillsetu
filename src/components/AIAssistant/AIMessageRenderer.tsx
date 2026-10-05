import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Copy, Check } from 'lucide-react';
import type { StandardSourceRef, ProcurementSpecDraft } from '../../types';

interface AIMessageRendererProps {
  content: string;
  sources?: StandardSourceRef[];
  verificationStatus?: 'Verified from database' | 'Requires verification' | 'AI Recommendation';
  specificationDraft?: ProcurementSpecDraft;
  onCodeClick?: (isCode: string) => void;
}

export const AIMessageRenderer: React.FC<AIMessageRendererProps> = ({
  content,
  sources,
  verificationStatus,
  specificationDraft,
  onCodeClick
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process markdown formatting into elements
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    const flushTable = (keyPrefix: string) => {
      if (tableRows.length > 0) {
        const parsedRows = tableRows.map(r => r.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
        const headers = parsedRows[0];
        // skip separator row if present
        const dataRows = parsedRows.slice(1).filter(row => !row.every(cell => cell.startsWith('---') || cell === ''));

        elements.push(
          <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-xs text-left border-collapse bg-white">
              <thead className="bg-[#12355B] text-white">
                <tr>
                  {headers?.map((h, i) => (
                    <th key={i} className="px-3 py-2 font-bold uppercase tracking-wider border-b border-blue-900">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2.5 font-medium text-slate-800 align-top">
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table line detect
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableRows.push(trimmed);
        return;
      } else if (inTable) {
        flushTable(`line-${index}`);
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-black text-[#12355B] mt-3 mb-1.5 flex items-center gap-1.5">
            {renderInlineFormatting(trimmed.replace('### ', ''))}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-extrabold text-slate-900 mt-2.5 mb-1">
            {renderInlineFormatting(trimmed.replace('#### ', ''))}
          </h4>
        );
      } else if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletContent = trimmed.replace(/^[•*-]\s*/, '');
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 pl-1 text-slate-800 text-xs sm:text-sm">
            <span className="text-amber-500 font-bold select-none mt-0.5">•</span>
            <div className="flex-1">{renderInlineFormatting(bulletContent)}</div>
          </div>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^\d+/)?.[0];
        const numContent = trimmed.replace(/^\d+\.\s*/, '');
        elements.push(
          <div key={index} className="flex items-start gap-2 my-1 pl-1 text-slate-800 text-xs sm:text-sm">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#12355B] font-extrabold text-[10px] mt-0.5">{num}</span>
            <div className="flex-1">{renderInlineFormatting(numContent)}</div>
          </div>
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="my-2 p-3 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-xs text-amber-900 font-medium">
            {renderInlineFormatting(trimmed.replace('> ', ''))}
          </blockquote>
        );
      } else if (trimmed === '---') {
        elements.push(<hr key={index} className="my-3 border-slate-200" />);
      } else if (trimmed === '') {
        elements.push(<div key={index} className="h-1.5" />);
      } else {
        elements.push(
          <p key={index} className="my-1 text-xs sm:text-sm leading-relaxed text-slate-800">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable('end');
    }

    return elements;
  };

  // Parse inline bold, IS code tags, and inline backticks
  const renderInlineFormatting = (text: string) => {
    // Regex for bold **text**, IS codes like IS 456, and `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|IS\s*\d+(?:\s*\(Part\s*\d+\))?(?::\d{4})?)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeText = part.slice(1, -1);
        return (
          <code 
            key={i} 
            onClick={() => onCodeClick?.(codeText)}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-blue-100/80 text-[#12355B] font-mono text-[11px] font-bold border border-blue-200 hover:bg-blue-200 cursor-pointer transition"
          >
            {codeText}
          </code>
        );
      }
      if (/^IS\s*\d+/i.test(part)) {
        return (
          <button
            key={i}
            onClick={() => onCodeClick?.(part)}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs border border-amber-300 transition cursor-pointer"
            title={`Click to inspect details of ${part}`}
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Message Content */}
      <div className="prose prose-slate max-w-none text-slate-800">
        {renderFormattedText(content)}
      </div>

      {/* Specification Copy Action if present */}
      {specificationDraft && (
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-extrabold text-[#12355B] block">Procurement Specification Ready</span>
            <span className="text-slate-600 text-[11px]">{specificationDraft.recommendedStandards[0]?.isNumber || 'IS Code'} compliant specification draft</span>
          </div>
          <button
            onClick={() => handleCopy(content)}
            className="px-3 py-1.5 rounded-xl bg-[#12355B] hover:bg-blue-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Spec'}</span>
          </button>
        </div>
      )}

      {/* Sources & Verification Status Footer */}
      {(verificationStatus || (sources && sources.length > 0)) && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          {/* Verification Badge */}
          <div className="flex items-center gap-1.5">
            {verificationStatus === 'Verified from database' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified from database</span>
              </span>
            )}
            {verificationStatus === 'Requires verification' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Requires verification</span>
              </span>
            )}
            {verificationStatus === 'AI Recommendation' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300 shadow-2xs">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>AI Recommendation</span>
              </span>
            )}
          </div>

          {/* Sources List */}
          {sources && sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-slate-500 font-medium">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sources:</span>
              {sources.map((s, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                  {s.isNumber}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
