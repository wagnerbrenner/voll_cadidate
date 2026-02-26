import React from 'react';
import { Filter, Search } from 'lucide-react';
import { FinancialType, FinancialStatus } from '../types';

interface FinancialFiltersProps {
  typeFilter: FinancialType | 'all';
  setTypeFilter: (type: FinancialType | 'all') => void;
  statusFilter: FinancialStatus | 'all';
  setStatusFilter: (status: FinancialStatus | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FinancialFilters({ 
  typeFilter, 
  setTypeFilter, 
  statusFilter, 
  setStatusFilter,
  searchTerm,
  setSearchTerm
}: FinancialFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center gap-6">
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
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
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
            {(['all', 'pending', 'paid', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendente' : status === 'paid' ? 'Pago' : 'Cancelado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Pesquisar por descrição..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
