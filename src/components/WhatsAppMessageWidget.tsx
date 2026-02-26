import React, { useState } from 'react';
import { MessageCircle, Sparkles, Copy, Check, X, User, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { whatsappMessageService } from '../modules/whatsapp/services/whatsappMessage.service';
import { Student } from '../types/student';

const ASSUNTO_OPCOES = [
  'Lembrete de aula',
  'Confirmação de agendamento',
  'Mensalidade / Pagamento',
  'Parabéns / Aniversário',
  'Reagendamento',
  'Novidades do studio',
  'Check-in pós-aula',
  'Outro (personalizado)'
] as const;

interface WhatsAppMessageWidgetProps {
  students: Student[];
}

export function WhatsAppMessageWidget({ students }: WhatsAppMessageWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [assunto, setAssunto] = useState<string>('Lembrete de aula');
  const [assuntoCustom, setAssuntoCustom] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast.warning('Selecione um aluno.');
      return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const assuntoFinal = assunto === 'Outro (personalizado)' ? assuntoCustom : assunto;
    if (!assuntoFinal.trim()) {
      toast.warning('Informe o assunto da mensagem.');
      return;
    }

    try {
      setLoading(true);
      setGeneratedMessage('');
      const message = await whatsappMessageService.generateMessage(student.name, assuntoFinal);
      setGeneratedMessage(message);
      toast.success('Mensagem gerada!');
    } catch (error) {
      toast.error('Erro ao gerar mensagem. Verifique se a GEMINI_API_KEY está configurada.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Mensagem copiada!');
  };

  const handleOpenWhatsApp = () => {
    const student = students.find(s => s.id === studentId);
    if (!student?.phone || !generatedMessage) return;
    const phone = student.phone.replace(/\D/g, '');
    if (!phone) return;
    const text = encodeURIComponent(generatedMessage);
    window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
    toast.success('Abrindo WhatsApp...');
  };

  const selectedStudent = students.find(s => s.id === studentId);
  const hasValidPhone = selectedStudent?.phone && selectedStudent.phone.replace(/\D/g, '').length >= 10;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg shadow-emerald-900/30 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Gerar mensagem WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#25D366] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="font-bold text-sm">Gerar Mensagem WhatsApp</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aluno</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                  >
                    <option value="">Selecionar aluno...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assunto</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    value={assunto}
                    onChange={e => setAssunto(e.target.value)}
                  >
                    {ASSUNTO_OPCOES.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {assunto === 'Outro (personalizado)' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descreva o assunto</label>
                  <input
                    type="text"
                    placeholder="Ex: Convite para evento especial"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={assuntoCustom}
                    onChange={e => setAssuntoCustom(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || students.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    Gerar mensagem
                  </>
                )}
              </button>
            </form>

            {/* Result */}
            {generatedMessage && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Mensagem gerada</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                    {hasValidPhone && (
                      <button
                        onClick={handleOpenWhatsApp}
                        className="flex items-center gap-1 text-xs font-bold text-[#25D366] hover:text-[#20bd5a] cursor-pointer"
                      >
                        <MessageCircle size={12} />
                        Abrir WhatsApp
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  readOnly
                  className="w-full min-h-[120px] p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 resize-none"
                  value={generatedMessage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
