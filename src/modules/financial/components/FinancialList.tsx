import React from 'react';
import { CheckCircle, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { FinancialRecord, FinancialStatus } from '../types';

interface FinancialListProps {
  records: FinancialRecord[];
  loading: boolean;
  onUpdateStatus: (id: string, status: FinancialStatus) => Promise<void>;
}

export function FinancialList({ records, loading, onUpdateStatus }: FinancialListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Lançamentos Financeiros</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Descrição</th>
              <th className="px-6 py-4 font-semibold">Tipo</th>
              <th className="px-6 py-4 font-semibold">Valor</th>
              <th className="px-6 py-4 font-semibold">Vencimento</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Carregando lançamentos...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Nenhum lançamento encontrado.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{record.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {record.type === 'receivable' ? (
                        <ArrowUpCircle size={16} className="text-emerald-500" />
                      ) : (
                        <ArrowDownCircle size={16} className="text-red-500" />
                      )}
                      <span className="text-sm text-slate-600">
                        {record.type === 'receivable' ? 'Receber' : 'Pagar'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${record.type === 'receivable' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(record.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {new Date(record.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                      record.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status === 'paid' ? (
                        <><CheckCircle size={12} /> Pago</>
                      ) : (
                        <><Clock size={12} /> Pendente</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {record.status === 'pending' && (
                      <button 
                        onClick={() => onUpdateStatus(record.id, 'paid')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all border border-emerald-200"
                      >
                        Marcar como Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
