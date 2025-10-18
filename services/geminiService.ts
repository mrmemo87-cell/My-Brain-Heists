
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this simulation, we'll proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash";

export const generateQuestion = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: `Generate a single, unique, and challenging trivia question about ${topic}. The question should be suitable for a test. Do not provide the answer or any preamble. Just the question text.`
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    return "Error: Could not generate a question. Please try again.";
  }
};

export const verifyAnswer = async (question: string, answer: string): Promise<boolean> => {
  try {
    const prompt = `
      Question: "${question}"
      User's Answer: "${answer}"
      Is the user's answer correct or very close to correct? Be lenient with minor spelling or phrasing differences. Respond with only the word "CORRECT" or "INCORRECT".
    `;
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text.trim().toUpperCase() === 'CORRECT';
  } catch (error) {
    console.error("Error verifying answer:", error);
    // Fail safe: if API fails, assume incorrect.
    return false;
  }
};
