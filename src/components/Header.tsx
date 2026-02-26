import React from 'react';
import { Search, UserPlus } from 'lucide-react';

interface HeaderProps {
  onNewStudentClick: () => void;
}

export function Header({ onNewStudentClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sistema de Gestão</h2>
      </div>
      
      <button 
        onClick={onNewStudentClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
      >
        <UserPlus size={18} />
        Novo Aluno
      </button>
    </header>
  );
}
