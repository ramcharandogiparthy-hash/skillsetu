import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import type { AuditLog } from '../types';
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
  Activity
} from 'lucide-react';

const DISTRICT_DATA = [
  { district: 'Visakhapatnam', total: 42, approved: 36 },
  { district: 'Vijayawada', total: 35, approved: 28 },
  { district: 'Guntur', total: 29, approved: 25 },
  { district: 'Hyderabad', total: 58, approved: 52 },
  { district: 'Warangal', total: 21, approved: 15 }
];

const OUTCOME_DATA = [
  { name: 'Approved NSQF Level 3', value: 156, color: '#10b981' },
  { name: 'Gap Training Recommended', value: 24, color: '#f59e0b' },
  { name: 'Reassessment Scheduled', value: 12, color: '#3b82f6' },
  { name: 'Rejected / Incomplete', value: 8, color: '#ef4444' }
];

const TRADE_DATA = [
  { trade: 'Assistant Electrician', count: 185, avgScore: 84 },
  { trade: 'Plumber (Upcoming)', count: 0, avgScore: 0 },
  { trade: 'Solar Technician (Upcoming)', count: 0, avgScore: 0 }
];

export const AdminDashboardPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const loadAudit = async () => {
      const logs = await db.auditLogs.toArray();
      setAuditLogs(logs);
    };
    loadAudit();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>National RPL Governance & Quality Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              National RPL Analytics & Governance Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Smart India Hackathon Prototype | Real-time monitoring of informal worker certifications across districts.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[150px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Pass Rate</p>
            <p className="text-3xl font-extrabold text-emerald-400">84.3%</p>
            <p className="text-[10px] text-slate-300 font-medium">Assistant Electrician</p>
          </div>
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase">Total Registered</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">200</p>
          <p className="text-[10px] text-slate-500">Informal candidates</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-bold uppercase">Assessments Done</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">185</p>
          <p className="text-[10px] text-slate-500">Practical evaluations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-indigo-600">
            <span className="text-xs font-bold uppercase">Approval Rate</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600">84.3%</p>
          <p className="text-[10px] text-slate-500">Certified NSQF Level 3</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-bold uppercase">Average Score</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-purple-600">81.5 Marks</p>
          <p className="text-[10px] text-slate-500">Out of 100 max</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-bold uppercase">Pending Reviews</span>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">15</p>
          <p className="text-[10px] text-slate-500">Awaiting assessor signature</p>
        </div>
      </div>

      {/* Assessor Consistency Metric Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-800 space-y-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
          <div>
            <h3 className="font-extrabold text-lg text-white">Assessor Consistency Index</h3>
            <p className="text-xs text-blue-200">
              Standardized 8-point practical checklist drastically improves scoring objectivity across different evaluators.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-700 text-sm font-semibold text-emerald-300 mt-2">
          Demo result: Standardized checklist reduced score variation from 14 marks to 3 marks.
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: District Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
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
                <Bar dataKey="approved" fill="#10b981" name="Approved NSQF Level 3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Outcome Breakdown Pie */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <span>System & Assessor Audit Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
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
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{log.assessorName}</td>
                  <td className="p-4 font-bold text-blue-600">{log.workerName}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
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
