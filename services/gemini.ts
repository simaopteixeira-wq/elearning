
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client using the API key exclusively from environment variables.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_api_key_here') {
  console.warn("Aviso: GEMINI_API_KEY não configurada no ficheiro .env.local");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });

export const generateCourseOutline = async (topic: string) => {
  // Directly call generateContent with the model name and contents.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie um currículo estruturado para um curso sobre "${topic}". Retorne o resultado em português.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING, description: "Um resumo do que será ensinado nesta lição" },
                duration: { type: Type.STRING, description: "Duração estimada (ex: 10 min)" }
              },
              required: ["title", "content", "duration"]
            }
          }
        },
        required: ["title", "description", "category", "lessons"]
      },
    },
  });

  try {
    // Access the response text via the .text property as defined in the SDK.
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao processar resposta do Gemini:", error);
    return null;
  }
};

export const parseRawContentToCourse = async (rawText: string) => {
  // Directly call generateContent for structured data extraction.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analise o seguinte texto bruto de um curso e extraia a estrutura organizada (Título, Descrição, Categoria e Lições com o conteúdo pedagógico completo). Texto: "${rawText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["title", "content", "duration"]
            }
          }
        },
        required: ["title", "description", "category", "lessons"]
      },
    },
  });

  try {
    // Access the response text via the .text property as defined in the SDK.
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao converter conteúdo bruto:", error);
    return null;
  }
};
