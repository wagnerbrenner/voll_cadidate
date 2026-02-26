import React from "react";
import { Users, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "./StatCard";
import { Student } from "../types/student";

interface DashboardProps {
    students: Student[];
}

export function Dashboard({ students }: DashboardProps) {
    const stats = {
        total: students.length,
        active: students.filter((s) => s.status === "Ativo").length,
        trial: students.filter((s) => s.status === "Experimental").length
    };

    return (
        <div className="p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    Bem-vindo ao VOLL
                </h2>
                <p className="text-slate-500 text-sm">
                    Gerencie seus alunos e acompanhe o crescimento do seu
                    studio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Total de Alunos"
                    value={stats.total}
                    icon={<Users className="text-blue-600" />}
                    trend="+12% este mês"
                />
                <StatCard
                    label="Alunos Ativos"
                    value={stats.active}
                    icon={<CheckCircle2 className="text-emerald-600" />}
                    trend="94% de retenção"
                />
                <StatCard
                    label="Aulas Experimentais"
                    value={stats.trial}
                    icon={<Clock className="text-amber-600" />}
                    trend="3 pendentes"
                />
            </div>
        </div>
    );
}
