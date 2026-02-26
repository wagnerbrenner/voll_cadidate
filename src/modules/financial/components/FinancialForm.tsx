import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { NewFinancialRecord, FinancialType } from '../types';

interface FinancialFormProps {
  onSave: (record: NewFinancialRecord) => Promise<void>;
}

export function FinancialForm({ onSave }: FinancialFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<NewFinancialRecord>({
    description: '',
    amount: 0,
    type: 'receivable',
    status: 'pending',
    due_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record.description || record.amount <= 0 || !record.due_date) {
      toast.warning('Preencha todos os campos obrigatórios e garanta que o valor seja maior que zero.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(record);
      setRecord({
        description: '',
        amount: 0,
        type: 'receivable',
        status: 'pending',
        due_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      toast.error('Erro ao salvar lançamento financeiro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Plus size={18} className="text-emerald-600" />
        Novo Lançamento
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              required
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ex: Mensalidade João Silva"
              value={record.description}
              onChange={e => setRecord({...record, description: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                required
                type="number"
                step="0.01"
                min="0.01"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="0.00"
                value={record.amount || ''}
                onChange={e => setRecord({...record, amount: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vencimento</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                required
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={record.due_date}
                onChange={e => setRecord({...record, due_date: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
          <div className="flex gap-2">
            {(['receivable', 'payable'] as FinancialType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setRecord({...record, type})}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  record.type === type 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {type === 'receivable' ? 'Conta a Receber' : 'Conta a Pagar'}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          {submitting ? 'Salvando...' : (
            <>
              <Plus size={18} />
              Salvar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
