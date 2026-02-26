import React from 'react';
import { Sparkles } from 'lucide-react';
import { ContentGenerator } from './components/ContentGenerator';

export function AiContentPage() {
  return (
    <div className="p-8 overflow-y-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Sparkles size={24} className="text-emerald-600" />
            Gerador de Conteúdo
          </h2>
          <p className="text-slate-500 text-sm">Crie posts e mensagens personalizadas para suas redes sociais usando IA.</p>
        </div>
      </div>

      <ContentGenerator />
    </div>
  );
}
