import React, { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, User, FileText } from "lucide-react";
import { scheduleService } from "../services/scheduleService";
import { Student } from "../types/student";
import { Schedule } from "../types/schedule";

interface ScheduleModuleProps {
    students: Student[];
}

export function ScheduleModule({ students }: ScheduleModuleProps) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [newSchedule, setNewSchedule] = useState({
        student_id: "",
        class_date: "",
        class_time: "",
        duration: 60,
        description: ""
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
            console.error("Error fetching schedule data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !newSchedule.student_id ||
            !newSchedule.class_date ||
            !newSchedule.class_time
        )
            return;

        try {
            setSubmitting(true);
            await scheduleService.addSchedule(newSchedule);
            setNewSchedule({
                student_id: "",
                class_date: "",
                class_time: "",
                duration: 60,
                description: ""
            });
            fetchData();
        } catch (error) {
            console.error("Error adding schedule:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 overflow-y-auto space-y-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    Agenda de Aulas
                </h2>
                <p className="text-slate-500 text-sm">
                    Organize as aulas e horários dos seus alunos.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-emerald-600" />
                            Novo Agendamento
                        </h3>

                        <form
                            onSubmit={handleAddSchedule}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Aluno
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={16}
                                    />
                                    <select
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                                        value={newSchedule.student_id}
                                        onChange={(e) =>
                                            setNewSchedule({
                                                ...newSchedule,
                                                student_id: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">
                                            {students.length === 0
                                                ? "Nenhum aluno cadastrado"
                                                : "Selecionar aluno..."}
                                        </option>
                                        {students.map((student) => (
                                            <option
                                                key={student.id}
                                                value={student.id}
                                            >
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Data
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <input
                                            required
                                            type="date"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            value={newSchedule.class_date}
                                            onChange={(e) =>
                                                setNewSchedule({
                                                    ...newSchedule,
                                                    class_date: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Horário
                                    </label>
                                    <input
                                        required
                                        type="time"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={newSchedule.class_time}
                                        onChange={(e) =>
                                            setNewSchedule({
                                                ...newSchedule,
                                                class_time: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Duração (minutos)
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                                    value={newSchedule.duration}
                                    onChange={(e) =>
                                        setNewSchedule({
                                            ...newSchedule,
                                            duration: parseInt(e.target.value)
                                        })
                                    }
                                >
                                    <option value={30}>30 min</option>
                                    <option value={45}>45 min</option>
                                    <option value={60}>60 min</option>
                                    <option value={90}>90 min</option>
                                    <option value={120}>120 min</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Descrição / Observação
                                </label>
                                <div className="relative">
                                    <FileText
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={16}
                                    />
                                    <textarea
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px]"
                                        placeholder="Ex: Foco em alongamento..."
                                        value={newSchedule.description}
                                        onChange={(e) =>
                                            setNewSchedule({
                                                ...newSchedule,
                                                description: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    "Agendando..."
                                ) : (
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
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">
                                Próximas Aulas
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">
                                            Aluno
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Data e Hora
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Duração
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Descrição
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12 text-center text-slate-400"
                                            >
                                                Carregando agenda...
                                            </td>
                                        </tr>
                                    ) : schedules.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12 text-center text-slate-400"
                                            >
                                                Nenhuma aula agendada.
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {item.students?.name ||
                                                            "Aluno não encontrado"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-slate-800 font-medium">
                                                            {new Date(
                                                                item.class_date
                                                            ).toLocaleDateString(
                                                                "pt-BR",
                                                                {
                                                                    timeZone:
                                                                        "UTC"
                                                                }
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            às{" "}
                                                            {item.class_time?.slice(
                                                                0,
                                                                5
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                        {item.duration} min
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-500 truncate max-w-[150px]">
                                                        {item.description ||
                                                            "-"}
                                                    </p>
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
        </div>
    );
}
