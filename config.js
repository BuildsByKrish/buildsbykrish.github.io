// API Configuration - Secure API Keys
// These should ideally be stored in environment variables or backend-proxied
// For now, we'll use them client-side with proper error handling

const API_CONFIG = {
  TMDB: {
    // Using READ ACCESS TOKEN (recommended for security)
    readAccessToken: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY",
    apiKey: "fa75c4832cd40cf2bf75307fd4abe736",
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p"
  },
  GEMINI: {
    apiKey: "AIzaSyATdHM8g689rEeFkpShnFTBOfv7jH_RgxA",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta2"
  }
};

// Helper function to fetch from TMDB with READ ACCESS TOKEN (more secure than API key alone)
async function tmdbFetch(endpoint, options = {}) {
  const url = `${API_CONFIG.TMDB.baseUrl}${endpoint}`;
  
  const headers = {
    'Authorization': `Bearer ${API_CONFIG.TMDB.readAccessToken}`,
    'Content-Type': 'application/json;charset=utf-8',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      ...options
    });

    if (!response.ok) {
      // Fallback to API key method if token fails
      if (response.status === 401) {
        console.warn('Token expired, trying API key method...');
        return tmdbFetchWithKey(endpoint, options);
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TMDB Fetch Error (token method):', error);
    // Try fallback to API key method for network/CORS errors as a best-effort
    try {
      console.warn('Attempting TMDB API key fallback due to error...');
      const fallback = await tmdbFetchWithKey(endpoint, options);
      if (fallback) return fallback;
    } catch (e) {
      console.error('TMDB Fetch Fallback Error:', e);
    }
    return null;
  }
}

// Fallback method using API key
async function tmdbFetchWithKey(endpoint, options = {}) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${API_CONFIG.TMDB.baseUrl}${endpoint}${sep}api_key=${API_CONFIG.TMDB.apiKey}`;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TMDB Fetch Error:', error);
    return null;
  }
}

// Helper function for Gemini API calls
async function geminiCall(prompt) {
  const url = `${API_CONFIG.GEMINI.baseUrl}/models/gemini-pro:generateContent?key=${API_CONFIG.GEMINI.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 256,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        return parts.map(p => p.text).join('\n');
      }
    }
    
    return null;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, tmdbFetch, tmdbFetchWithKey, geminiCall };
}
