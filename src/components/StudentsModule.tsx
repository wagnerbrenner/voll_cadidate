import React, { useState } from 'react';
import { Phone, Mail, FileDown, Edit2, Trash2, AlertTriangle, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from './StatusBadge';
import { Student } from '../types/student';
import { exportService } from '../modules/students/services/export.service';
import { studentsService } from '../services/studentsService';
import { Modal } from './Modal';

interface StudentsModuleProps {
  students: Student[];
  loading: boolean;
  onRefresh: () => void;
}

export function StudentsModule({ students, loading, onRefresh }: StudentsModuleProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Inativo' | 'Experimental'>('Todos');
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(localSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      setIsSubmitting(true);
      await studentsService.updateStudent(editingStudent.id, {
        name: editingStudent.name,
        plan: editingStudent.plan,
        plan_start_date: editingStudent.plan_start_date
      });
      setEditingStudent(null);
      onRefresh();
      toast.success('Aluno atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      toast.error('Erro ao atualizar aluno. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      setIsSubmitting(true);
      await studentsService.deleteStudent(deletingStudent.id);
      setDeletingStudent(null);
      onRefresh();
      toast.success('Aluno removido com sucesso.');
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      toast.error('Erro ao remover aluno. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 overflow-y-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="font-bold text-slate-800">Lista de Alunos</h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  exportService.exportToCSV(students);
                  toast.success('CSV exportado com sucesso!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
              >
                <FileDown size={16} />
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Pesquisar por nome ou e-mail..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={localSearchTerm}
                onChange={e => setLocalSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit">
              {(['Todos', 'Ativo', 'Inativo', 'Experimental'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === status 
                      ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Aluno</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Plano</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Carregando alunos...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhum aluno encontrado.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500">Desde {new Date(student.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{student.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={12} /> {student.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={12} /> {student.email}
                        </div>
                      </div>
                    </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingStudent(student)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => setDeletingStudent(student)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal 
        isOpen={!!editingStudent} 
        onClose={() => setEditingStudent(null)} 
        title="Editar Aluno"
      >
        {editingStudent && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={editingStudent.name}
                onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plano</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  value={editingStudent.plan}
                  onChange={e => setEditingStudent({...editingStudent, plan: e.target.value})}
                >
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Início do Plano</label>
                <input 
                  required
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={editingStudent.plan_start_date}
                  onChange={e => setEditingStudent({...editingStudent, plan_start_date: e.target.value})}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:bg-emerald-400 cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal 
        isOpen={!!deletingStudent} 
        onClose={() => setDeletingStudent(null)} 
        title="Remover Aluno"
      >
        {deletingStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
              <AlertTriangle size={24} className="shrink-0" />
              <p className="text-sm font-medium">
                Tem certeza que deseja remover <strong>{deletingStudent.name}</strong>? Esta ação excluirá permanentemente todos os dados financeiros e agendamentos vinculados.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingStudent(null)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:bg-red-400 cursor-pointer"
              >
                {isSubmitting ? 'Removendo...' : 'Sim, Remover'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
