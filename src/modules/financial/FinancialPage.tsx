import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { financialService } from './services/financial.service';
import { FinancialRecord, NewFinancialRecord, FinancialType, FinancialStatus } from './types';
import { FinancialForm } from './components/FinancialForm';
import { FinancialList } from './components/FinancialList';

export function FinancialPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<FinancialType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FinancialStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await financialService.getFinancialRecords();
      setRecords(data);
    } catch (error) {
      console.error('Erro ao buscar registros financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (newRecord: NewFinancialRecord) => {
    await financialService.createFinancialRecord(newRecord);
    fetchRecords();
    toast.success('Lançamento financeiro cadastrado!');
  };

  const handleUpdateStatus = async (id: string, status: FinancialStatus) => {
    try {
      if (status === 'cancelled') {
        await financialService.cancelFinancialRecord(id);
        fetchRecords();
        toast.success('Lançamento cancelado.');
      } else {
        await financialService.updateFinancialStatus(id, status);
        fetchRecords();
        toast.success(status === 'paid' ? 'Lançamento marcado como pago!' : 'Status atualizado.');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do lançamento.');
    }
  };

  const handleUpdateDueDate = async (id: string, dueDate: string) => {
    try {
      await financialService.updateDueDate(id, dueDate);
      fetchRecords();
      toast.success('Data de vencimento atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar vencimento:', error);
      toast.error('Erro ao atualizar vencimento do lançamento.');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 overflow-y-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Gestão Financeira</h2>
        <p className="text-slate-500 text-sm">Controle suas contas a pagar e receber de forma simples.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <FinancialForm onSave={handleSave} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <FinancialList 
            records={filteredRecords}
            loading={loading}
            onUpdateStatus={handleUpdateStatus}
            onUpdateDueDate={handleUpdateDueDate}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>
    </div>
  );
}
