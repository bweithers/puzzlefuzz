// /api/secureEndpoint.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY; // This is secure, not exposed to client
  const API_ENDPOINT = 'https://api.example.com/data';

  try {
    const apiRes = await fetch(API_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}