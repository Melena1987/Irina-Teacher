import { GoogleGenAI, Type } from "@google/genai";
import { ChecklistItem } from "../types";

// SAFETY CHECK: Prevent "process is not defined" error in browsers
const getApiKey = () => {
  try {
    // Check if we are in a Node environment or if a bundler injected process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Setup for Vite (common in modern React apps)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("Could not read API Key from environment:", e);
  }
  return '';
};

const apiKey = getApiKey();
// Initialize AI only if key exists to prevent immediate crash, handle in function calls
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSuggestedObjectives = async (
  language: string,
  level: string,
  classType: string
): Promise<string[]> => {
  if (!ai || !apiKey) {
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