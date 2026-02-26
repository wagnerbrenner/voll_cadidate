import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentsModule } from './components/StudentsModule';
import { ScheduleModule } from './components/ScheduleModule';
import { AddStudentModal } from './components/AddStudentModal';
import { studentsService } from './services/studentsService';
import { Student, NewStudent } from './types/student';
import { isSupabaseConfigured } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    email: '',
    phone: '',
    plan: 'Mensal',
    status: 'Ativo'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsService.fetchStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentsService.addStudent(newStudent);
      fetchStudents();
      setIsModalOpen(false);
      setNewStudent({ name: '', email: '', phone: '', plan: 'Mensal', status: 'Ativo' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onNewStudentClick={() => setIsModalOpen(true)} 
        />

        <div className="flex-1 overflow-y-auto">
          {!isSupabaseConfigured && (
            <div className="m-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Configuração Necessária</h4>
                <p className="text-sm text-amber-700 mb-3">
                  As variáveis de ambiente do Supabase não foram encontradas. Para que o CRM funcione corretamente, você precisa configurar as chaves no painel de Segredos.
                </p>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                  <span className="text-amber-500">VITE_SUPABASE_URL</span>
                  <span className="text-amber-500">VITE_SUPABASE_ANON_KEY</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard students={students} />}
          {activeTab === 'students' && (
            <StudentsModule 
              students={students} 
              loading={loading} 
              searchTerm={searchTerm} 
            />
          )}
          {activeTab === 'schedule' && <ScheduleModule students={students} />}
        </div>
      </main>

      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddStudent}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
      />
    </div>
  );
}
