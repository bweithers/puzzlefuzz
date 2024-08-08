// /api/gemini-test.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    // Get the model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log(req.body);
    // Get the prompt from the request body
    const { prompt } = req.body;

    console.log(prompt);
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate content
    const result = await model.generateContent(prompt);
    console.log("Api call result: ", result);
    const response = await result.response;
    const text = response.text();

    // Send the response
    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}