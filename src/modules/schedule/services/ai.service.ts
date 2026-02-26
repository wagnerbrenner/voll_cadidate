import { GoogleGenAI } from "@google/genai";

export const aiService = {
  async generateClassDescription(studentName: string, classDate: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const prompt = `Você é um instrutor de Pilates profissional. 
    Gere uma descrição curta e profissional (3 a 5 linhas) para uma aula de Pilates.
    Aluno: ${studentName}
    Data: ${classDate}
    Foque em postura, respiração, fortalecimento e mobilidade.
    Retorne apenas o texto da descrição, sem introduções ou saudações.`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
      });

      return response.text || "Erro ao gerar descrição.";
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("Falha ao gerar descrição com IA.");
    }
  }
};
