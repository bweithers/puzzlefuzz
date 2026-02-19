// Bun API server - handles /api routes for local development
// React dev server proxies /api/* requests here via "proxy" in package.json

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

const server = Bun.serve({
  port: 3002,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/api/gemini-test' && req.method === 'POST') {
      try {
        const { prompt } = await req.json();
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        console.log('Generating response for prompt...');
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return new Response(JSON.stringify({ result: text }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Gemini error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`API server running on http://localhost:${server.port}`);
console.log('Open http://localhost:3000 in your browser');
