import React from 'react';
import { Filter } from 'lucide-react';
import { FinancialType, FinancialStatus } from '../types';

interface FinancialFiltersProps {
  typeFilter: FinancialType | 'all';
  setTypeFilter: (type: FinancialType | 'all') => void;
  statusFilter: FinancialStatus | 'all';
  setStatusFilter: (status: FinancialStatus | 'all') => void;
}

export function FinancialFilters({ 
  typeFilter, 
  setTypeFilter, 
  statusFilter, 
  setStatusFilter 
}: FinancialFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2 text-slate-500">
        <Filter size={18} />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">Tipo:</span>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['all', 'receivable', 'payable'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                typeFilter === type 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'all' ? 'Todos' : type === 'receivable' ? 'Receber' : 'Pagar'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['all', 'pending', 'paid'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                statusFilter === status 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendente' : 'Pago'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
