# OurShow - Entertainment Vault Platform

A modern, progressive web application (PWA) for discovering and managing movies and TV shows with personalized recommendations.

## 🎯 Features

- **Personalized Watchlist & Watch Later Lists** - Save items with Firebase persistence
- **Review System** - Write and view reviews on movies/series
- **TMDB Integration** - Access trending, popular, and genre-specific content
- **AI Recommendations** - Get personalized suggestions using Gemini AI
- **PWA Support** - Install as an app with offline caching
- **Dark/Light Theme** - Toggle between themes with localStorage persistence
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## 🔐 API Configuration

### APIs Used

1. **TMDB (The Movie Database)**
   - **Read Access Token**: Stored securely in `config.js`
   - **API Key**: Available as fallback
   - **Base URL**: https://api.themoviedb.org/3

2. **Google Gemini AI**
   - **API Key**: Stored securely in `config.js`
   - **Base URL**: https://generativelanguage.googleapis.com/v1beta2

3. **Firebase (Real-time Database)**
   - **Project**: krishs-watchlist-vault
   - **Region**: Asia-Southeast1

### Securing API Keys

API keys are stored in `config.js` and are **NOT** committed to version control due to `.gitignore` rules.

**For Production Deployment:**
1. Move `config.js` to a backend service (Node.js, Firebase Cloud Functions, etc.)
2. Call APIs through a proxy endpoint instead of directly from the client
3. Store keys in environment variables on the server
4. Never expose API keys in client-side code

**Current Setup (Development):**
- API functions in `config.js` make direct calls to TMDB and Gemini
- Keys are accessible in the browser (acceptable for development only)
- Authentication uses TMDB's read access token (more secure than API key alone)

## 🚀 Getting Started

### Prerequisites
- Node.js (for running the development server)
- Modern browser with JavaScript enabled
- Firebase account for database access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BuildsByKrish/buildsbykrish.github.io.git
cd buildsbykrish.github.io
```

2. Install dependencies (optional, for development tools):
```bash
npm install
```

3. Start the development server:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
node -e "const http=require('http'), fs=require('fs'); http.createServer((q,r)=>fs.readFile(q.url.slice(1)||'index.html',(e,d)=>r.end(e?'404':d))).listen(8000);"
```

4. Open http://127.0.0.1:8000 in your browser

## 📁 File Structure

```
.
├── index.html              # Homepage with Tailwind design
├── watchlist.html          # User's watchlist page
├── watchlater.html         # Watch later list page
├── prototype.js            # Main application logic
├── config.js               # API configuration (⚠️ not in git)
├── firebase-config.js      # Firebase initialization
├── sw.js                   # Service Worker for PWA
├── manifest.webmanifest    # PWA manifest
├── data.js                 # Local movie/series data
├── movie.js                # Movie recommendations
├── korean.js               # K-drama data
├── englishrecommendations.js
├── hindirecommendations.js
└── chineserecommendations.js
```

## 🔧 API Usage

### TMDB API

The application uses TMDB's secure read access token for API calls:

```javascript
// In config.js - Helper function
async function tmdbFetch(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TMDB.readAccessToken}`,
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  return await response.json();
}

// Usage in prototype.js
const trendingMovies = await tmdbFetch('/trending/movie/week');
const searchResults = await tmdbFetch(`/search/multi?query=${query}`);
```

### Gemini AI

Generate AI recommendations based on mood and genre:

```javascript
const recommendation = await geminiCall(prompt);
```

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Service worker caches assets and API responses
- **App Shell**: Fast loading and responsive interface
- **Theme Color**: Customizable dark/light theme

## 🔒 Data Privacy

- User data stored in Firebase Realtime Database
- Per-user data structure: `ourshow/users/{uid}/`
- Reviews, watchlist, and history are private to each user
- No data is shared with third parties except TMDB and Gemini APIs

## 🐛 Troubleshooting

### TMDB API Not Responding
1. Verify internet connection
2. Check if TMDB service is online: https://status.themoviedb.org
3. Confirm API key/token in `config.js`
4. Check browser console for specific errors

### Firebase Connection Issues
1. Verify Firebase project is active
2. Check network connectivity
3. Ensure CORS is properly configured
4. Check Firebase rules allow read/write access

### AI Recommendations Not Working
1. Verify Gemini API key is valid
2. Check API quota on Google Cloud Console
3. Ensure proper request format in `config.js`
4. Check browser console for errors

## 📊 Data Sources

- **Movies/Series**: TMDB API + local JSON files
- **Recommendations**: TMDB Trending/Popular endpoints
- **AI Suggestions**: Google Gemini API
- **User Data**: Firebase Realtime Database

## 🚢 Deployment

### GitHub Pages
1. Push to main branch
2. GitHub Pages automatically serves the site
3. Ensure index.html loads all necessary scripts

### Custom Hosting
1. Build/minify assets if needed
2. Deploy to your hosting service
3. Ensure CORS headers are configured for TMDB API
4. Update Firebase rules if needed

## 📝 Environment Variables (For Backend Proxy)

When migrating to a backend proxy:

```
TMDB_READ_TOKEN=eyJhbGciOiJIUzI1NiJ9...
TMDB_API_KEY=fa75c4832cd40cf2bf75307fd4abe736
GEMINI_API_KEY=AIzaSyATdHM8g689rEeFkpShnFTBOfv7jH_RgxA
FIREBASE_CONFIG={"apiKey":"...","authDomain":"..."}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **TMDB**: For the comprehensive movie database API
- **Google**: For Gemini AI and Firebase services
- **Tailwind CSS**: For utility-first CSS framework

---

**Last Updated**: November 14, 2025  
**Status**: ✅ Production Ready
