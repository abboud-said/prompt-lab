import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function runAI(prompt, temperature) {
  // Use gemini-2.5-flash model
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { temperature } 
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}