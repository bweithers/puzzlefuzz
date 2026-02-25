// /api/gemini-test.js
import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 30,
};

const DEFAULT_SYSTEM_PROMPT = `You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}. If you receive empty lists, give back Game Over!`;

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, systemPrompt } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt || DEFAULT_SYSTEM_PROMPT,
      },
    });

    const text = result.text;
    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}
