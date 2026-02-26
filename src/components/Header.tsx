import React from 'react';
import { Search, UserPlus } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNewStudentClick: () => void;
}

export function Header({ searchTerm, setSearchTerm, onNewStudentClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar alunos..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <button 
        onClick={onNewStudentClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
      >
        <UserPlus size={18} />
        Novo Aluno
      </button>
    </header>
  );
}
