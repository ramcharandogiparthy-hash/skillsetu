import React, { useState } from 'react';
import { FileText, X, Sparkles, CheckCircle2, Building2, Package, ShieldCheck } from 'lucide-react';

interface ProcurementSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    product: string;
    intendedUse: string;
    quantity: string;
    requiredPerformance: string;
    applicationIndustry: string;
  }) => void;
}

export const ProcurementSpecModal: React.FC<ProcurementSpecModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [product, setProduct] = useState('Electrical Cables (1.1 kV)');
  const [intendedUse, setIntendedUse] = useState('Internal electrification for government office building');
  const [quantity, setQuantity] = useState('5,000 meters');
  const [requiredPerformance, setRequiredPerformance] = useState('High voltage resistance, FRLS PVC insulation, 70°C continuous rating');
  const [applicationIndustry, setApplicationIndustry] = useState('Public Works Department (PWD) / CPWD Tender');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      product,
      intendedUse,
      quantity,
      requiredPerformance,
      applicationIndustry
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#12355B] to-[#1a4877] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Generate Procurement Specification</h3>
              <p className="text-xs text-blue-200">AI-guided BIS Tender Specification Generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#12355B]" />
              Product / Item Name
            </label>
            <input
              type="text"
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="e.g., Electrical Cables, Portland Cement, TMT Steel Bars"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#12355B] focus:border-[#12355B] outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#12355B]" />
              Intended Application / Use
            </label>
            <input
              type="text"
              value={intendedUse}
              onChange={e => setIntendedUse(e.target.value)}
              placeholder="e.g., Underground cabling, RCC Slab construction, Rural water supply"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#12355B] focus:border-[#12355B] outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Estimated Quantity</label>
              <input
                type="text"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g., 5,000 meters / 100 MT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#12355B] outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Procuring Department / PSU</label>
              <input
                type="text"
                value={applicationIndustry}
                onChange={e => setApplicationIndustry(e.target.value)}
                placeholder="e.g., CPWD / State PWD / DISCOM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#12355B] outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#12355B]" />
              Required Performance & Technical Parameters
            </label>
            <textarea
              value={requiredPerformance}
              onChange={e => setRequiredPerformance(e.target.value)}
              rows={3}
              placeholder="Enter special requirements e.g., FRLS insulation, 53 grade strength, 10kA tripping capacity"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#12355B] outline-none font-medium resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            ⚠️ <strong>Legal Disclaimer:</strong> Generated specification drafts must be verified against official BIS publications and Quality Control Orders before issuing tender documents.
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#12355B] hover:bg-blue-900 text-white font-extrabold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Specification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
