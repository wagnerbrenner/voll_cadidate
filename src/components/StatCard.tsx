import React from 'react';

export function StatCard({ label, value, icon, trend }: { label: string, value: number | string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">{trend}</span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-800">{value}</h4>
    </div>
  );
}
