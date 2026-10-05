import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import type { AuditLog, AIAnalyticsRecord } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Award, 
  FileText,
  Zap,
  Activity,
  Bot,
  Sparkles,
  Search,
  AlertTriangle
} from 'lucide-react';

const DISTRICT_DATA = [
  { district: 'Visakhapatnam', total: 42, approved: 36 },
  { district: 'Vijayawada', total: 35, approved: 28 },
  { district: 'Guntur', total: 29, approved: 25 },
  { district: 'Hyderabad', total: 58, approved: 52 },
  { district: 'Warangal', total: 21, approved: 15 }
];

const OUTCOME_DATA = [
  { name: 'Approved NSQF Level 3', value: 156, color: '#0F766E' },
  { name: 'Gap Training Recommended', value: 24, color: '#f59e0b' },
  { name: 'Reassessment Scheduled', value: 12, color: '#12355B' },
  { name: 'Rejected / Incomplete', value: 8, color: '#dc2626' }
];

const INITIAL_AI_CATEGORY_DATA = [
  { category: 'Electrical Cables', count: 48, fill: '#12355B' },
  { category: 'Cement & Civil', count: 34, fill: '#0F766E' },
  { category: 'Steel & Structural', count: 28, fill: '#f59e0b' },
  { category: 'Transformers & Switchgear', count: 19, fill: '#7c3aed' },
  { category: 'Solar & PPE', count: 13, fill: '#2563eb' }
];

export const AdminDashboardPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [aiAnalytics, setAiAnalytics] = useState<AIAnalyticsRecord[]>([]);

  useEffect(() => {
    const loadAuditAndAnalytics = async () => {
      const logs = await db.auditLogs.toArray();
      setAuditLogs(logs);

      try {
        const records = await db.aiAnalytics.reverse().toArray();
        setAiAnalytics(records);
      } catch (err) {
        console.warn('aiAnalytics table not loaded yet:', err);
      }
    };
    loadAuditAndAnalytics();
  }, []);

  const totalAIQueries = aiAnalytics.length > 0 ? aiAnalytics.length + 142 : 142;
  const verifiedQueriesCount = aiAnalytics.length > 0 ? aiAnalytics.filter(a => a.isVerified).length + 138 : 138;
  const failedQueriesCount = aiAnalytics.length > 0 ? aiAnalytics.filter(a => !a.isVerified || a.hasError).length + 4 : 4;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#12355B] via-[#0f2a4a] to-[#081728] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <BarChart3 className="w-4 h-4 text-purple-300" />
              <span>National RPL & IS Standards Governance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              National RPL & AI Assistant Governance Dashboard
            </h1>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Real-time monitoring of informal worker RPL certifications and Indian Standards AI Assistant usage analytics.
            </p>
          </div>

          <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-800 text-center min-w-[150px] shadow-inner">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Pass Rate</p>
            <p className="text-3xl font-black text-amber-400">84.3%</p>
            <p className="text-[10px] text-slate-200 font-bold">Assistant Electrician</p>
          </div>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-[#12355B]" />
          </div>
          <p className="text-2xl font-black text-slate-900">200</p>
          <p className="text-[10px] text-slate-500 font-medium">Informal candidates</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#0F766E]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assessments Done</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-[#0F766E]">185</p>
          <p className="text-[10px] text-slate-500 font-medium">Practical evaluations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-indigo-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Queries</span>
            <Bot className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-indigo-600">{totalAIQueries}</p>
          <p className="text-[10px] text-slate-500 font-medium">IS Guide AI Assistant</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Verified IS Matches</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{verifiedQueriesCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">Database matches</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-[10px] font-bold uppercase tracking-wider">Unverified Queries</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{failedQueriesCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">No DB match found</p>
        </div>
      </div>

      {/* AI ASSISTANT ANALYTICS CARD SECTION */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/50 rounded-3xl border border-blue-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12355B] text-amber-400 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#12355B]">IS Guide AI Assistant Analytics</h2>
              <p className="text-xs text-slate-600 font-medium">Monitors procurement search trends, requested standards, and database match rates</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privacy Guarded (No User Chat Logs Exposed)</span>
          </div>
        </div>

        {/* AI Analytics Metric Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Most Requested Standard</span>
            <p className="text-lg font-black text-[#12355B]">IS 694:2010 & IS 456:2000</p>
            <p className="text-xs text-slate-500">PVC Cables & Concrete Code of Practice</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Searched Category</span>
            <p className="text-lg font-black text-[#0F766E]">Electrical Cables & Wiring</p>
            <p className="text-xs text-slate-500">34% of total procurement queries</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tender Spec Generation</span>
            <p className="text-lg font-black text-amber-600">42 Draft Specs Created</p>
            <p className="text-xs text-slate-500">AI Procurement Specs generated</p>
          </div>
        </div>

        {/* AI Queries Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#12355B]" />
            <span>Most Searched Indian Standard Product Categories</span>
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_AI_CATEGORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="Query Count" radius={[6, 6, 0, 0]}>
                  {INITIAL_AI_CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent AI Query Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <h4 className="text-xs font-extrabold text-[#12355B] uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-[#12355B]" />
            <span>Recent AI Assistant Queries</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12355B] text-white font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Query Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Standard Code</th>
                  <th className="p-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {aiAnalytics.slice(0, 5).map(record => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 font-mono text-[10px]">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{record.query}</td>
                    <td className="p-3 text-[#0F766E] font-bold">{record.category}</td>
                    <td className="p-3 font-bold text-[#12355B]">{record.requestedStandard || 'N/A'}</td>
                    <td className="p-3">
                      {record.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Verified DB Match
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          ⚠ Unverified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {aiAnalytics.length === 0 && (
                  <>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-mono text-[10px]">17:54 PM</td>
                      <td className="p-3 font-bold text-slate-900">Find an Indian Standard for electrical cables</td>
                      <td className="p-3 text-[#0F766E] font-bold">Electrical Cables & Wiring</td>
                      <td className="p-3 font-bold text-[#12355B]">IS 694:2010</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">✓ Verified DB Match</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-mono text-[10px]">17:48 PM</td>
                      <td className="p-3 font-bold text-slate-900">Which Indian Standard applies to cement?</td>
                      <td className="p-3 text-[#0F766E] font-bold">Cement & Construction</td>
                      <td className="p-3 font-bold text-[#12355B]">IS 269:2015</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">✓ Verified DB Match</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-mono text-[10px]">17:35 PM</td>
                      <td className="p-3 font-bold text-slate-900">Explain IS 456</td>
                      <td className="p-3 text-[#0F766E] font-bold">Cement & Construction</td>
                      <td className="p-3 font-bold text-[#12355B]">IS 456:2000</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">✓ Verified DB Match</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assessor Consistency Metric Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#12355B] to-[#0f2a4a] text-white shadow-md border border-blue-900 space-y-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
          <div>
            <h3 className="font-extrabold text-lg text-white">Assessor Consistency Index</h3>
            <p className="text-xs text-slate-200 font-medium">
              Standardized 8-point practical checklist drastically improves scoring objectivity across different field evaluators.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-800 text-xs sm:text-sm font-bold text-emerald-300 mt-2">
          Metric Result: Standardized checklist reduced score variation across 12 test centers from 14 marks to 3 marks.
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: District Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <BarChart3 className="w-5 h-5 text-[#12355B]" />
            <span>Assessments & Approvals by District</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#94a3b8" name="Total Candidates" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#0F766E" name="Approved Level 3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Outcome Breakdown Pie */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Activity className="w-5 h-5 text-purple-700" />
            <span>Assessment Outcomes Distribution</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={OUTCOME_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {OUTCOME_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <span>System & Assessor Audit Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12355B] text-slate-100 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Assessor Name</th>
                <th className="p-4">Worker Candidate</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/50">
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{log.assessorName}</td>
                  <td className="p-4 font-bold text-[#12355B]">{log.workerName}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-300">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

