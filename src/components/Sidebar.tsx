import React from "react";
import {
    Users,
    LayoutDashboard,
    Calendar,
    TrendingUp,
    Settings,
    LogOut,
    ChevronRight
} from "lucide-react";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

function NavItem({
    icon,
    label,
    active = false,
    disabled = false,
    onClick
}: NavItemProps) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`
        flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group
        ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
        ${disabled ? "opacity-40 cursor-not-allowed grayscale" : ""}
      `}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            {active && <ChevronRight size={14} />}
            {disabled && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                    Em breve
                </span>
            )}
        </div>
    );
}

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-900">VOLL Candidate</h1>
        </div>
        
        <nav className="space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Alunos" 
            active={activeTab === 'students'} 
            onClick={() => setActiveTab('students')}
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Agenda" 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
          />
          <NavItem 
            icon={<TrendingUp size={20} />} 
            label="Financeiro" 
            active={activeTab === 'financial'} 
            onClick={() => setActiveTab('financial')}
          />
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-100">
        <NavItem icon={<Settings size={20} />} label="Configurações" />
        <NavItem icon={<LogOut size={20} />} label="Sair" />
      </div>
    </aside>
  );
}
