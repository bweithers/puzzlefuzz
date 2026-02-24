// /api/gemini-test.js
import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 30,
};

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export default async function handler(req, res) {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  try {
    console.log(req.body);
    console.log(prompt);
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    // Generate content
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    console.log("Api call result: ", result);
    const text = result.text;

    // Send the response
    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    console.log(prompt);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}