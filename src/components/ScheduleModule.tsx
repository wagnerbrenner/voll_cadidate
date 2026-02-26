import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, User, FileText, Sparkles, Edit2, XCircle, CheckCircle, Eye, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { scheduleService } from '../services/scheduleService';
import { aiService } from '../modules/schedule/services/ai.service';
import { Student } from '../types/student';
import { Schedule } from '../types/schedule';
import { Modal } from './Modal';

interface ScheduleModuleProps {
  students: Student[];
}

export function ScheduleModule({ students }: ScheduleModuleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [viewingSchedule, setViewingSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'cancelled'>('all');

  const filteredSchedules = schedules.filter(item => {
    const matchesSearch = item.students?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [newSchedule, setNewSchedule] = useState({
    student_id: '',
    class_date: '',
    class_time: '',
    duration: 60,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const schedulesData = await scheduleService.fetchSchedule();
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!newSchedule.student_id || !newSchedule.class_date) {
      toast.warning('Selecione um aluno e uma data primeiro.');
      return;
    }

    const student = students.find(s => s.id === newSchedule.student_id);
    if (!student) return;

    try {
      setGeneratingAI(true);
      const description = await aiService.generateClassDescription(student.name, newSchedule.class_date);
      setNewSchedule({ ...newSchedule, description });
      toast.success('Descrição gerada com IA!');
    } catch (error) {
      toast.error('Erro ao gerar descrição com IA.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.student_id || !newSchedule.class_date || !newSchedule.class_time) return;

    try {
      setSubmitting(true);
      await scheduleService.addSchedule(newSchedule);
      setNewSchedule({ student_id: '', class_date: '', class_time: '', duration: 60, description: '' });
      fetchData();
      toast.success('Aula agendada com sucesso!');
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error('Erro ao agendar aula. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;
    try {
      setSubmitting(true);
      await scheduleService.updateSchedule(editingSchedule.id, {
        class_date: editingSchedule.class_date,
        class_time: editingSchedule.class_time,
        duration: editingSchedule.duration,
        description: editingSchedule.description
      });
      setEditingSchedule(null);
      fetchData();
      toast.success('Aula atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Erro ao atualizar aula. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta aula?')) return;
    try {
      await scheduleService.cancelSchedule(id);
      fetchData();
      toast.success('Aula cancelada.');
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      toast.error('Erro ao cancelar aula. Tente novamente.');
    }
  };

  return (
    <div className="p-8 overflow-y-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Agenda de Aulas</h2>
        <p className="text-slate-500 text-sm">Organize as aulas e horários dos seus alunos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus size={18} className="text-emerald-600" />
              Novo Agendamento
            </h3>
            
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aluno</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    value={newSchedule.student_id}
                    onChange={e => setNewSchedule({...newSchedule, student_id: e.target.value})}
                  >
                    <option value="">{students.length === 0 ? 'Nenhum aluno cadastrado' : 'Selecionar aluno...'}</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={newSchedule.class_date}
                      onChange={e => setNewSchedule({...newSchedule, class_date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário</label>
                  <input 
                    required
                    type="time"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={newSchedule.class_time}
                    onChange={e => setNewSchedule({...newSchedule, class_time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duração (minutos)</label>
                <select 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  value={newSchedule.duration}
                  onChange={e => setNewSchedule({...newSchedule, duration: parseInt(e.target.value)})}
                >
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Descrição / Observação</label>
                  <button 
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 disabled:text-slate-400 transition-colors cursor-pointer"
                  >
                    <Sparkles size={12} />
                    {generatingAI ? 'Gerando...' : 'Gerar com IA'}
                  </button>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                  <textarea 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
                    placeholder="Ex: Foco em alongamento..."
                    value={newSchedule.description}
                    onChange={e => setNewSchedule({...newSchedule, description: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? 'Agendando...' : (
                  <>
                    <CalendarIcon size={18} />
                    Agendar Aula
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-bold text-slate-800">Próximas Aulas</h3>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      statusFilter === 'all' 
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setStatusFilter('scheduled')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      statusFilter === 'scheduled' 
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Agendadas
                  </button>
                  <button
                    onClick={() => setStatusFilter('cancelled')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      statusFilter === 'cancelled' 
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Canceladas
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Pesquisar por aluno..."
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
                    <th className="px-6 py-4 font-semibold">Aluno</th>
                    <th className="px-6 py-4 font-semibold">Data e Hora</th>
                    <th className="px-6 py-4 font-semibold">Duração</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Carregando agenda...</td>
                    </tr>
                  ) : filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Nenhuma aula encontrada.</td>
                    </tr>
                  ) : (
                    filteredSchedules.map((item) => (
                      <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${item.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="font-semibold text-slate-800">{item.students?.name || 'Aluno não encontrado'}</p>
                            {item.status === 'cancelled' && (
                              <span className="text-[10px] font-bold text-red-500 uppercase">Cancelada</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-800 font-medium">
                              {new Date(item.class_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                            </span>
                            <span className="text-xs text-slate-500">
                              às {item.class_time?.slice(0, 5)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {item.duration} min
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setViewingSchedule(item)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                              title="Ver Detalhes"
                            >
                              <Eye size={16} />
                            </button>
                            {item.status !== 'cancelled' && (
                              <>
                                <button 
                                  onClick={() => setEditingSchedule(item)}
                                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleCancelSchedule(item.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="Cancelar"
                                >
                                  <XCircle size={16} />
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
          </div>
        </div>
      </div>

      {/* Modal de Visualização de Aula */}
      <Modal 
        isOpen={!!viewingSchedule} 
        onClose={() => setViewingSchedule(null)} 
        title="Detalhes da Aula"
      >
        {viewingSchedule && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
                {viewingSchedule.students?.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aluno</p>
                <p className="font-bold text-slate-800 text-base">{viewingSchedule.students?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                  <CalendarIcon size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Data</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(viewingSchedule.class_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                  <Clock size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Horário</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {viewingSchedule.class_time?.slice(0, 5)} ({viewingSchedule.duration}m)
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                <FileText size={12} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Descrição</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {viewingSchedule.description || "Sem descrição."}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setViewingSchedule(null)}
              className="w-full py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 transition-all shadow-md cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal de Edição de Aula */}
      <Modal 
        isOpen={!!editingSchedule} 
        onClose={() => setEditingSchedule(null)} 
        title="Editar Aula"
      >
        {editingSchedule && (
          <form onSubmit={handleEditSchedule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
                <input 
                  required
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={editingSchedule.class_date}
                  onChange={e => setEditingSchedule({...editingSchedule, class_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário</label>
                <input 
                  required
                  type="time"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={editingSchedule.class_time}
                  onChange={e => setEditingSchedule({...editingSchedule, class_time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duração (minutos)</label>
              <select 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                value={editingSchedule.duration}
                onChange={e => setEditingSchedule({...editingSchedule, duration: parseInt(e.target.value)})}
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
                value={editingSchedule.description}
                onChange={e => setEditingSchedule({...editingSchedule, description: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:bg-emerald-400 cursor-pointer"
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
