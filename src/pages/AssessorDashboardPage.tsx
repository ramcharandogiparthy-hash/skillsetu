import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/db';
import type { WorkerProfile, PracticalAssessment, SelfDeclaration } from '../types';
import { AIDisclaimerBanner } from '../components/AIDisclaimerBanner';
import { EmptyState } from '../components/EmptyState';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Play, 
  Eye, 
  FileText,
  Zap,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck
} from 'lucide-react';

interface CombinedWorkerRow {
  worker: WorkerProfile;
  selfDeclScore: number;
  assessment?: PracticalAssessment;
}

export const AssessorDashboardPage: React.FC = () => {
  const { assessorName, setActiveWorker } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState<CombinedWorkerRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      const workers = await db.workers.toArray();
      const selfDecls = await db.selfDeclarations.toArray();
      const assessments = await db.assessments.toArray();

      const combined: CombinedWorkerRow[] = workers.map((w) => {
        const sd = selfDecls.find((d) => d.workerId === w.id);
        const pa = assessments.find((a) => a.workerId === w.id);
        return {
          worker: w,
          selfDeclScore: sd ? sd.score : 0,
          assessment: pa
        };
      });

      setRows(combined);
    };

    loadDashboardData();
  }, []);

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    const matchesSearch = r.worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.worker.district.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return !r.assessment || r.assessment.status === 'draft';
    if (statusFilter === 'awaiting_approval') return r.assessment?.status === 'awaiting_approval';
    if (statusFilter === 'approved') return r.assessment?.status === 'approved';
    return true;
  });

  // Calculate Stat Card Numbers
  const totalWorkers = rows.length;
  const pendingCount = rows.filter((r) => !r.assessment || r.assessment.status === 'draft').length;
  const awaitingApprovalCount = rows.filter((r) => r.assessment?.status === 'awaiting_approval').length;
  const approvedCount = rows.filter((r) => r.assessment?.status === 'approved').length;
  const pendingSyncCount = rows.filter((r) => r.assessment && !r.assessment.synced).length;

  const handleStartOrReview = (row: CombinedWorkerRow) => {
    setActiveWorker(row.worker);
    if (!row.assessment || row.assessment.status === 'draft') {
      navigate(`/assessor/assessment/${row.worker.id}`);
    } else if (row.assessment.status === 'awaiting_approval') {
      navigate(`/assessor/ai-evidence/${row.worker.id}`);
    } else {
      navigate(`/assessor/final-result/${row.worker.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <ClipboardCheck className="w-4 h-4 text-teal-300" />
            <span>Authorized Assessor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Assessor Evaluation Dashboard
          </h1>
          <p className="text-xs text-slate-200 mt-1 font-medium">
            Logged in as: <strong>{assessorName}</strong> | Center: <strong>Visakhapatnam Skill Node</strong>
          </p>
        </div>

        <button
          onClick={() => navigate('/offline-sync')}
          className="px-4 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-2 self-start md:self-auto transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-teal-300" />
          <span>{pendingSyncCount} Records Pending Sync</span>
        </button>
      </div>

      {/* Mandatory Human-in-the-loop AI Banner */}
      <AIDisclaimerBanner />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-[#12355B]" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalWorkers}</p>
          <p className="text-[10px] text-slate-500 font-medium">Assistant Electricians</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Evaluation</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">Ready for practical task</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-indigo-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting Approval</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-indigo-600">{awaitingApprovalCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">AI analysis complete</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#0F766E]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Approved Today</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-[#0F766E]">{approvedCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">Certified Level 3</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-rose-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Sync</span>
            <RefreshCw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-rose-600">{pendingSyncCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">Saved in IndexedDB</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search worker by name or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#12355B] focus:outline-none text-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none text-slate-900"
          >
            <option value="all">All Assessment Statuses</option>
            <option value="pending">Pending Practical Assessment</option>
            <option value="awaiting_approval">Awaiting Final Approval</option>
            <option value="approved">Approved & Certified</option>
          </select>
        </div>
      </div>

      {/* Searchable Worker Table */}
      {filteredRows.length === 0 ? (
        <EmptyState
          title="No candidates found"
          description="Try adjusting your search query or status filter to find worker profiles."
          actionText="Clear Filters"
          onAction={() => { setSearchQuery(''); setStatusFilter('all'); }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12355B] text-slate-100 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Worker Candidate</th>
                  <th className="p-4">Trade & NSQF</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4 text-center">Self-Decl Score</th>
                  <th className="p-4">Assessment Status</th>
                  <th className="p-4">Evidence Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRows.map((row) => {
                  const status = row.assessment?.status || 'draft';
                  const evidenceComplete = row.assessment?.evidenceComplete;

                  return (
                    <tr key={row.worker.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">{row.worker.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{row.worker.district}, {row.worker.state}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800">{row.worker.trade}</span>
                        <div className="text-[10px] text-[#12355B] font-bold">NSQF Level 3</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {row.worker.yearsOfExperience} Years
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#12355B] font-black text-xs border border-blue-200">
                          {row.selfDeclScore}%
                        </span>
                      </td>
                      <td className="p-4">
                        {status === 'approved' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] inline-flex items-center gap-1 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                            Approved
                          </span>
                        ) : status === 'awaiting_approval' ? (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold text-[11px] inline-flex items-center gap-1 border border-indigo-300">
                            <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                            Awaiting Decision
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] inline-flex items-center gap-1 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Pending Practical
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {evidenceComplete ? (
                          <span className="text-[#0F766E] font-bold flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Photo & Video Ready
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Incomplete</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleStartOrReview(row)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B] ${
                            status === 'approved'
                              ? 'bg-[#12355B] text-white hover:bg-[#1a4877]'
                              : status === 'awaiting_approval'
                              ? 'bg-indigo-700 text-white hover:bg-indigo-600 shadow-xs'
                              : 'bg-[#0F766E] text-white hover:bg-teal-600 shadow-xs'
                          }`}
                        >
                          {status === 'approved' ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Decision</span>
                            </>
                          ) : status === 'awaiting_approval' ? (
                            <>
                              <FileText className="w-3.5 h-3.5" />
                              <span>Review & Finalize</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Start Assessment</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
