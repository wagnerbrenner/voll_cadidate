import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { Student } from '../types/student';
import { scheduleService } from '../services/scheduleService';
import { financialService } from '../modules/financial/services/financial.service';
import { Schedule } from '../types/schedule';
import { FinancialRecord } from '../modules/financial/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface DashboardProps {
  students: Student[];
}

export function Dashboard({ students }: DashboardProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [schedulesData, financialsData] = await Promise.all([
          scheduleService.fetchSchedule(),
          financialService.getFinancialRecords()
        ]);
        setSchedules(schedulesData);
        setFinancials(financialsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'Ativo').length,
    experimentalStudents: students.filter(s => s.status === 'Experimental').length,
    totalRevenue: financials
      .filter(f => f.type === 'receivable' && f.status === 'paid')
      .reduce((acc, curr) => acc + curr.amount, 0),
    pendingRevenue: financials
      .filter(f => f.type === 'receivable' && f.status === 'pending')
      .reduce((acc, curr) => acc + curr.amount, 0),
    totalExpenses: financials
      .filter(f => f.type === 'payable' && f.status === 'paid')
      .reduce((acc, curr) => acc + curr.amount, 0),
    upcomingClasses: schedules.filter(s => s.status === 'scheduled' && new Date(s.class_date) >= new Date()).length
  };

  // Data for Plans Pie Chart
  const planData = [
    { name: 'Mensal', value: students.filter(s => s.plan === 'Mensal').length },
    { name: 'Trimestral', value: students.filter(s => s.plan === 'Trimestral').length },
    { name: 'Semestral', value: students.filter(s => s.plan === 'Semestral').length },
    { name: 'Anual', value: students.filter(s => s.plan === 'Anual').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // Data for Financial Bar Chart (Last 6 months simplified)
  const financialData = [
    { name: 'Receita', value: stats.totalRevenue, color: '#10b981' },
    { name: 'Pendente', value: stats.pendingRevenue, color: '#f59e0b' },
    { name: 'Despesas', value: stats.totalExpenses, color: '#ef4444' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Painel de Controle</h2>
          <p className="text-slate-500 text-sm">Visão geral do seu studio de Pilates.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo em Caixa</p>
          <p className={`text-2xl font-black ${stats.totalRevenue - stats.totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalRevenue - stats.totalExpenses)}
          </p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total de Alunos" 
          value={stats.totalStudents} 
          icon={<Users className="text-blue-600" />} 
          trend={`${stats.activeStudents} ativos`}
        />
        <StatCard 
          label="Receita Realizada" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<TrendingUp className="text-emerald-600" />} 
          trend={`${formatCurrency(stats.pendingRevenue)} pendente`}
        />
        <StatCard 
          label="Despesas Pagas" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<TrendingDown className="text-red-600" />} 
          trend="Contas do mês"
        />
        <StatCard 
          label="Próximas Aulas" 
          value={stats.upcomingClasses} 
          icon={<Calendar className="text-amber-600" />} 
          trend="Próximos 7 dias"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600" />
              Resumo Financeiro
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Valor']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plans Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Distribuição de Planos
            </h3>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Students */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Novos Alunos</h3>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.plan}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  student.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Próximas Aulas do Dia</h3>
          <div className="space-y-3">
            {schedules
              .filter(s => s.status === 'scheduled' && s.class_date === new Date().toISOString().split('T')[0])
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Hora</span>
                      <span className="text-sm font-black text-slate-800">{item.class_time?.slice(0, 5)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.students?.name}</p>
                      <p className="text-xs text-slate-500">{item.duration} minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Confirmada</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                </div>
              ))}
            {schedules.filter(s => s.status === 'scheduled' && s.class_date === new Date().toISOString().split('T')[0]).length === 0 && (
              <div className="py-8 text-center">
                <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-400 text-sm">Sem aulas agendadas para hoje.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
