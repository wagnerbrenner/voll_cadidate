import React from "react";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Student } from "../types/student";

interface StudentsModuleProps {
    students: Student[];
    loading: boolean;
    searchTerm: string;
}

export function StudentsModule({
    students,
    loading,
    searchTerm
}: StudentsModuleProps) {
    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                        Lista de Alunos
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                            Todos
                        </span>
                        <span className="px-3 py-1 text-slate-400 rounded-full text-xs font-medium hover:bg-slate-50 cursor-pointer">
                            Ativos
                        </span>
                        <span className="px-3 py-1 text-slate-400 rounded-full text-xs font-medium hover:bg-slate-50 cursor-pointer">
                            Inativos
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">
                                    Aluno
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Plano
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Contato
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        Carregando alunos...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-slate-400"
                                    >
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Desde{" "}
                                                        {new Date(
                                                            student.created_at
                                                        ).toLocaleDateString(
                                                            "pt-BR"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={student.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">
                                                {student.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Phone size={12} />{" "}
                                                    {student.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Mail size={12} />{" "}
                                                    {student.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
