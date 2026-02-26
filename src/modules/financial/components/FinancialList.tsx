import React, { useState } from 'react';
import { CheckCircle, Clock, ArrowUpCircle, ArrowDownCircle, XCircle, Calendar, Search, Filter } from 'lucide-react';
import { FinancialRecord, FinancialStatus, FinancialType } from '../types';
import { Modal } from '../../../components/Modal';

interface FinancialListProps {
  records: FinancialRecord[];
  loading: boolean;
  onUpdateStatus: (id: string, status: FinancialStatus) => Promise<void>;
  onUpdateDueDate: (id: string, dueDate: string) => Promise<void>;
  typeFilter: FinancialType | 'all';
  setTypeFilter: (type: FinancialType | 'all') => void;
  statusFilter: FinancialStatus | 'all';
  setStatusFilter: (status: FinancialStatus | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FinancialList({ 
  records, 
  loading, 
  onUpdateStatus, 
  onUpdateDueDate,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm
}: FinancialListProps) {
  const [updatingDueDate, setUpdatingDueDate] = useState<FinancialRecord | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleUpdateDueDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingDueDate || !newDueDate) return;
    try {
      setSubmitting(true);
      await onUpdateDueDate(updatingDueDate.id, newDueDate);
      setUpdatingDueDate(null);
      setNewDueDate('');
    } catch (error) {
      console.error('Erro ao atualizar vencimento:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-bold text-slate-800">Lançamentos Financeiros</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tipo:</span>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                {(['all', 'receivable', 'payable'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      typeFilter === type 
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type === 'all' ? 'Todos' : type === 'receivable' ? 'Receber' : 'Pagar'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                {(['all', 'pending', 'paid', 'cancelled'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      statusFilter === status 
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendente' : status === 'paid' ? 'Pago' : 'Canc.'}
                  </button>
                ))}
              </div>
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
                <tr key={record.id} className={`hover:bg-slate-50/50 transition-colors ${record.status === 'cancelled' ? 'opacity-60' : ''}`}>
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
                        : record.status === 'cancelled'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status === 'paid' ? (
                        <><CheckCircle size={12} /> Pago</>
                      ) : record.status === 'cancelled' ? (
                        <><XCircle size={12} /> Cancelado</>
                      ) : (
                        <><Clock size={12} /> Pendente</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {record.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(record.id, 'paid')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            title="Marcar como Pago"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setUpdatingDueDate(record);
                              setNewDueDate(record.due_date);
                            }}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                            title="Alterar Vencimento"
                          >
                            <Calendar size={18} />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(record.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Cancelar"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!updatingDueDate} 
        onClose={() => setUpdatingDueDate(null)} 
        title="Alterar Vencimento"
      >
        {updatingDueDate && (
          <form onSubmit={handleUpdateDueDate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nova Data de Vencimento</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:bg-emerald-400 cursor-pointer"
            >
              {submitting ? 'Salvando...' : 'Atualizar Vencimento'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
