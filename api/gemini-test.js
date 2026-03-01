// /api/gemini-test.js
import { GoogleGenAI } from '@google/genai';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const config = {
  maxDuration: 30,
};

// ── Firebase Admin (server-side only) ──
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

const DEFAULT_SYSTEM_PROMPT = `You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}. If you receive empty lists, give back Game Over!`;

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

// ── In-memory rate limiting ──
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;
const ipHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipHits.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    ipHits.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  record.count++;
  return record.count > MAX_REQUESTS;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipHits) {
    if (now - record.windowStart > WINDOW_MS * 2) {
      ipHits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ── Prompt validation ──
const MAX_PROMPT_LENGTH = 2000;
const PROMPT_PATTERN = /Words to pick:.*Words to avoid:/s;

function isValidPrompt(prompt) {
  if (typeof prompt !== 'string') return false;
  if (prompt.length > MAX_PROMPT_LENGTH) return false;
  if (!PROMPT_PATTERN.test(prompt)) return false;
  return true;
}

// ── Origin check ──
function isAllowedOrigin(req) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN; // e.g. "https://puzzlefuzz.com"
  if (!allowedOrigin) return true; // skip check if not configured

  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';

  // Allow exact match or Vercel preview deploys
  if (origin === allowedOrigin) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (referer.startsWith(allowedOrigin)) return true;
  if (referer.includes('.vercel.app')) return true;

  return false;
}

// ── Agent system prompt lookup (cached in memory) ──
const agentPromptCache = new Map();

async function getAgentSystemPrompt(agentId) {
  if (!agentId || agentId === 'default') return DEFAULT_SYSTEM_PROMPT;

  if (agentPromptCache.has(agentId)) return agentPromptCache.get(agentId);

  try {
    const snap = await db.collection('agents').doc(agentId).get();
    if (snap.exists && snap.data()?.systemPrompt) {
      const prompt = snap.data().systemPrompt;
      agentPromptCache.set(agentId, prompt);
      return prompt;
    }
  } catch (error) {
    console.error('Error fetching agent prompt:', error);
  }

  return DEFAULT_SYSTEM_PROMPT;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Origin check
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  const { prompt, agentId } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Validate prompt structure
    if (!isValidPrompt(prompt)) {
      return res.status(400).json({ error: 'Invalid prompt format' });
    }

    // Look up system prompt server-side instead of trusting the client
    const systemInstruction = await getAgentSystemPrompt(agentId);

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        maxOutputTokens: 200,
      },
    });

    const text = result.text;
    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}
