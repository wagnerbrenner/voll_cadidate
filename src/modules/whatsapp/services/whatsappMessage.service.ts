import { GoogleGenAI } from "@google/genai";

export const whatsappMessageService = {
  async generateMessage(studentName: string, subject: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const prompt = `Você é um instrutor de Pilates profissional e atencioso.
    Gere uma mensagem curta e amigável para enviar no WhatsApp ao aluno.
    
    Aluno: ${studentName}
    Assunto: ${subject}
    
    REGRAS:
    - Tom cordial e profissional, mas próximo
    - Mensagem direta, ideal para WhatsApp (não muito longa)
    - Use emojis de forma natural e moderada
    - Inclua saudação inicial (Oi, Olá, etc.)
    - Retorne APENAS o texto da mensagem, sem introduções, aspas ou explicações`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
      });

      return response.text || "Erro ao gerar mensagem.";
    } catch (error) {
      console.error("WhatsApp Message AI Error:", error);
      throw new Error("Falha ao gerar mensagem com IA.");
    }
  }
};
