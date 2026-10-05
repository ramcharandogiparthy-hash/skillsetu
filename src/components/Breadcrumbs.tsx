import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const routeLabels: Record<string, string> = {
  'worker': 'Worker Flow',
  'register': 'Registration',
  'self-declaration': 'Self-Declaration',
  'qualification-mapping': 'Qualification Mapping',
  'dashboard': 'Dashboard',
  'assessor': 'Assessor Portal',
  'assessment': 'Practical Task',
  'ai-evidence': 'AI Evidence Review',
  'final-result': 'Final Certification',
  'admin': 'Admin Portal',
  'offline-sync': 'Offline Sync',
  'report': 'Assessment Report',
  'login': 'Demo Authentication'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-between py-2 px-1 text-xs no-print">
      <div className="flex items-center gap-1.5 flex-wrap text-slate-500 font-medium">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-600 hover:text-[#12355B] transition focus-visible:ring-1 focus-visible:ring-[#12355B] rounded px-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeLabels[name] || name;

          return (
            <React.Fragment key={routeTo}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="font-bold text-[#12355B] px-1 bg-blue-50/80 text-[#12355B] rounded border border-blue-100/80 capitalize">
                  {label}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-slate-600 hover:text-[#12355B] transition font-medium capitalize focus-visible:ring-1 focus-visible:ring-[#12355B] rounded px-1"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Back Button */}
      {pathnames.length > 1 && (
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#12355B] bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-xs transition shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#12355B]"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      )}
    </nav>
  );
};
