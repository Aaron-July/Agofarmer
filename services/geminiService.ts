import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (title: string, keywords: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional and engaging job or tool description for "${title}" using these keywords: ${keywords}. Keep it under 100 words.`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description.";
  }
};

export const chatWithAI = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are 'AgroBot', a helpful assistant for the AgroFarmer Connect platform. You help users find jobs, tools, and navigate the app. Be concise and friendly.",
      }
    });
    return response.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble thinking right now. Please try again later.";
  }
};