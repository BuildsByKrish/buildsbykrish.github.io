/**
 * Backend Proxy Example for Secure API Handling
 * 
 * This is a Node.js/Express example showing how to set up a backend proxy
 * to handle API calls securely. In production, you should use this instead
 * of making API calls directly from the client.
 * 
 * Usage:
 * 1. Install express and cors: npm install express cors dotenv
 * 2. Create a .env file with your API keys (never commit this)
 * 3. Run this server: node backend-proxy-example.js
 * 4. Update prototype.js to call your backend endpoints instead of direct APIs
 * 
 * Benefits:
 * - API keys stay on the server (never exposed to client)
 * - CORS headers handled by your server
 * - Rate limiting can be implemented
 * - Logging and monitoring possible
 * - Cache responses for better performance
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Configuration (from environment variables)
const API_CONFIG = {
  TMDB: {
    baseUrl: 'https://api.themoviedb.org/3',
    readAccessToken: process.env.TMDB_READ_TOKEN,
    apiKey: process.env.TMDB_API_KEY,
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
  },
  GEMINI: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta2',
    apiKey: process.env.GEMINI_API_KEY
  }
};

/**
 * TMDB API Proxy Endpoint
 * 
 * Example requests:
 * GET /api/tmdb/trending/movie/week
 * GET /api/tmdb/search/multi?query=inception
 * GET /api/tmdb/discover/tv?with_genres=18
 */
app.get('/api/tmdb/*', async (req, res) => {
  try {
    const endpoint = req.path.replace('/api/tmdb', '');
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = `${API_CONFIG.TMDB.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;

    console.log(`[TMDB] GET ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TMDB.readAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    if (response.status === 401) {
      // Fallback to API key if token fails
      const fallbackResponse = await fetch(`${fullUrl}${queryString ? '&' : '?'}api_key=${API_CONFIG.TMDB.apiKey}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      });
      const data = await fallbackResponse.json();
      return res.json(data);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[TMDB Error]', error.message);
    res.status(500).json({ error: 'TMDB API Error', details: error.message });
  }
});

/**
 * Gemini AI Proxy Endpoint
 * 
 * Example request:
 * POST /api/gemini
 * {
 *   "prompt": "Recommend me a sci-fi movie like Inception"
 * }
 */
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`[Gemini] Generating content for prompt: "${prompt.substring(0, 50)}..."`);

    const response = await fetch(
      `${API_CONFIG.GEMINI.baseUrl}/models/gemini-pro:generateContent?key=${API_CONFIG.GEMINI.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[Gemini Error]', data);
      return res.status(response.status).json({ error: 'Gemini API Error', details: data });
    }

    // Extract text from response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    res.json({ text });
  } catch (error) {
    console.error('[Gemini Error]', error.message);
    res.status(500).json({ error: 'Gemini API Error', details: error.message });
  }
});

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    tmdbConfigured: !!API_CONFIG.TMDB.readAccessToken,
    geminiConfigured: !!API_CONFIG.GEMINI.apiKey
  });
});

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'OurShow API Proxy',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      tmdb: 'GET /api/tmdb/*',
      gemini: 'POST /api/gemini',
      documentation: 'https://github.com/BuildsByKrish/buildsbykrish.github.io'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OurShow API Proxy running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`⚙️  TMDB configured: ${!!API_CONFIG.TMDB.readAccessToken}`);
  console.log(`🤖 Gemini configured: ${!!API_CONFIG.GEMINI.apiKey}`);
});

module.exports = app;
