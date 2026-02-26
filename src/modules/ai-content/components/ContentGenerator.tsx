import React, { useState } from 'react';
import { Sparkles, Copy, Check, Instagram, MessageCircle, User, Target, Smile } from 'lucide-react';
import { aiContentService, ContentType, ContentTone } from '../services/aiContent.service';

export function ContentGenerator() {
  const [type, setType] = useState<ContentType>('Instagram');
  const [studentName, setStudentName] = useState('');
  const [objective, setObjective] = useState('');
  const [tone, setTone] = useState<ContentTone>('Motivador');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective) {
      setError('Por favor, informe o objetivo da aula.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setGeneratedText('');
      
      const text = await aiContentService.generateSocialContent({
        type,
        studentName: studentName || undefined,
        classType: 'Pilates',
        objective,
        tone
      });
      
      setGeneratedText(text);
    } catch (err) {
      setError('Erro ao gerar conteúdo. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-600" />
          Configurações do Post
        </h3>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Platform Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plataforma</label>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['Instagram', 'WhatsApp'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setType(p)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === p 
                      ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p === 'Instagram' ? <Instagram size={14} /> : <MessageCircle size={14} />}
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Aluno (Opcional)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Ex: Maria Silva"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
              />
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Objetivo da Aula</label>
            <div className="relative">
              <Target className="absolute left-3 top-3 text-slate-400" size={16} />
              <textarea 
                required
                placeholder="Ex: Foco em fortalecimento do core e mobilidade de coluna..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px]"
                value={objective}
                onChange={e => setObjective(e.target.value)}
              />
            </div>
          </div>

          {/* Tone Select */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tom da Mensagem</label>
            <div className="relative">
              <Smile className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                value={tone}
                onChange={e => setTone(e.target.value as ContentTone)}
              >
                <option value="Motivador">Motivador</option>
                <option value="Profissional">Profissional</option>
                <option value="Leve">Leve / Descontraído</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar texto com IA
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Resultado Gerado</h3>
          {generatedText && (
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          )}
        </div>

        <div className="flex-1 relative">
          <textarea 
            readOnly
            placeholder="O texto gerado pela IA aparecerá aqui..."
            className="w-full h-full min-h-[300px] p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none resize-none leading-relaxed"
            value={generatedText}
          />
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-emerald-700 animate-pulse">Criando seu post...</p>
              </div>
            </div>
          )}
        </div>
        
        <p className="mt-4 text-[10px] text-slate-400 text-center">
          Dica: Você pode editar o texto acima antes de copiar se desejar fazer ajustes manuais.
        </p>
      </div>
    </div>
  );
}
