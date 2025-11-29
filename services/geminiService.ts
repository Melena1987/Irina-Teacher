import { GoogleGenAI, Type } from "@google/genai";
import { ChecklistItem } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSuggestedObjectives = async (
  language: string,
  level: string,
  classType: string
): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key not found");
    return [
      "No se ha configurado la API Key.",
      "Por favor contacta al administrador.",
    ];
  }

  try {
    const prompt = `
      Genera una lista de 5 objetivos de aprendizaje claros, concisos y accionables para un estudiante de ${language} de nivel ${level} en una clase de tipo ${classType}.
      Devuelve solo las cadenas de texto en un array JSON.
      Ejemplo: ["Mejorar la fluidez en pasado simple", "Aprender 20 verbos nuevos de cocina"]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonText = response.text || "[]";
    const objectives: string[] = JSON.parse(jsonText);
    return objectives;

  } catch (error) {
    console.error("Error generating objectives:", error);
    return [
      "Error al generar sugerencias con IA.",
      "Inténtalo de nuevo más tarde."
    ];
  }
};