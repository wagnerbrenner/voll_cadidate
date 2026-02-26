import { GoogleGenAI } from "@google/genai";

export type ContentType = 'Instagram' | 'WhatsApp';
export type ContentTone = 'Motivador' | 'Profissional' | 'Leve';

export interface ContentParams {
  type: ContentType;
  studentName?: string;
  classType: string;
  objective: string;
  tone: ContentTone;
}

export const aiContentService = {
  async generateSocialContent(params: ContentParams): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const prompt = `Você é um especialista em marketing para studios de Pilates.
    Gere um texto curto e envolvente em Português (PT-BR) para ser postado em redes sociais.
    
    DETALHES:
    - Plataforma: ${params.type}
    - Tipo de Aula: ${params.classType}
    - Objetivo: ${params.objective}
    - Tom da Mensagem: ${params.tone}
    ${params.studentName ? `- Nome do Aluno: ${params.studentName}` : ''}
    
    REGRAS:
    - Use emojis de forma natural.
    - Mantenha o texto profissional mas cativante.
    - Se for Instagram: inclua hashtags relevantes no final.
    - Se for WhatsApp: use um tom mais direto e pessoal.
    - Retorne APENAS o texto do post, sem introduções, explicações ou aspas.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
      });

      return response.text || "Erro ao gerar conteúdo.";
    } catch (error) {
      console.error("AI Content Generation Error:", error);
      throw new Error("Falha ao gerar conteúdo com IA.");
    }
  }
};
