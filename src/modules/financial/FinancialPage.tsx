import React, { useState, useEffect } from 'react';
import { financialService } from './services/financial.service';
import { FinancialRecord, NewFinancialRecord, FinancialType, FinancialStatus } from './types';
import { FinancialForm } from './components/FinancialForm';
import { FinancialList } from './components/FinancialList';
import { FinancialFilters } from './components/FinancialFilters';

export function FinancialPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<FinancialType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FinancialStatus | 'all'>('all');

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
  };

  const handleUpdateStatus = async (id: string, status: FinancialStatus) => {
    try {
      await financialService.updateFinancialStatus(id, status);
      fetchRecords();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do lançamento.');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesType && matchesStatus;
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
          <FinancialFilters 
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <FinancialList 
            records={filteredRecords}
            loading={loading}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
}
