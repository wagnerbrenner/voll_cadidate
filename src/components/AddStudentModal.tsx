import React from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NewStudent } from "../types/student";

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (e: React.FormEvent) => void;
    newStudent: NewStudent;
    setNewStudent: (student: NewStudent) => void;
}

export function AddStudentModal({
    isOpen,
    onClose,
    onAdd,
    newStudent,
    setNewStudent
}: AddStudentModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800">
                                Novo Aluno
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="Ex: João Silva"
                                    value={newStudent.name}
                                    onChange={(e) =>
                                        setNewStudent({
                                            ...newStudent,
                                            name: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        E-mail
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="joao@email.com"
                                        value={newStudent.email}
                                        onChange={(e) =>
                                            setNewStudent({
                                                ...newStudent,
                                                email: e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="(11) 99999-9999"
                                        value={newStudent.phone}
                                        onChange={(e) =>
                                            setNewStudent({
                                                ...newStudent,
                                                phone: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Plano
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                                        value={newStudent.plan}
                                        onChange={(e) =>
                                            setNewStudent({
                                                ...newStudent,
                                                plan: e.target.value
                                            })
                                        }
                                    >
                                        <option>Mensal</option>
                                        <option>Trimestral</option>
                                        <option>Semestral</option>
                                        <option>Anual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Início do Plano
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={newStudent.plan_start_date}
                                        onChange={(e) =>
                                            setNewStudent({
                                                ...newStudent,
                                                plan_start_date: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Status Inicial
                                </label>
                                <div className="flex gap-2">
                                    {["Ativo", "Experimental"].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() =>
                                                setNewStudent({
                                                    ...newStudent,
                                                    status
                                                })
                                            }
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                                newStudent.status === status
                                                    ? "bg-emerald-600 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Cadastrar Aluno
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
