import React from 'react';

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-pulse">
      <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-100 rounded-md w-full"></div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
      <td className="p-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    </tr>
  );
};
