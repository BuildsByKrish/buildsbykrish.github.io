// Lightweight app script: load TMDB trending movies & series and enable PWA install
(function(){
  // Simple DOM helpers for rendering
  const esc = s => String(s||'').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

  const makeCard = (item) => {
    const div = document.createElement('div');
    div.className = 'bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 cursor-pointer m-1';
    div.style.width = '150px';

    const img = document.createElement('img');
    img.src = item.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster';
    img.alt = item.title || 'Poster';
    img.className = 'w-full h-64 object-cover';
    img.onerror = () => { img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="Arial" font-size="20">No Image</text></svg>'; };

    const content = document.createElement('div');
    content.className = 'p-2';
    content.innerHTML = `<h3 class="text-white font-semibold text-sm truncate">${esc(item.title)}</h3><p class="text-gray-400 text-xs">${esc(item.year||'')}</p>`;

    div.appendChild(img);
    div.appendChild(content);
    div.addEventListener('click', ()=> alert(item.title || 'No title'));
    return div;
  };

  const renderCarousel = (title, items) => {
    const container = document.getElementById('sections-container');
    if (!container) return;
    const section = document.createElement('section');
    section.className = 'space-y-3';
    section.innerHTML = `<h2 class="text-xl font-semibold">${esc(title)}</h2>`;
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-4 overflow-x-auto pb-4 carousel-wrapper';
    wrapper.style.scrollBehavior = 'smooth';
    items.forEach(i=> wrapper.appendChild(makeCard(i)));
    section.appendChild(wrapper);
    container.appendChild(section);
  };

  // Load TMDB data using tmdbFetch from config.js
  async function loadTMDB() {
    if (typeof tmdbFetch !== 'function') {
      console.error('tmdbFetch not available. Make sure config.js is loaded.');
      const container = document.getElementById('sections-container');
      if (container) container.innerHTML = '<p class="text-red-400">TMDB helper missing. Check `config.js`</p>';
      return;
    }

    try {
      const movies = await tmdbFetch('/trending/movie/week');
      const series = await tmdbFetch('/trending/tv/week');

      const mapItems = (arr, isTv=false) => (arr||[]).map(m => ({
        id: m.id,
        title: m.title || m.name,
        year: (m.release_date||m.first_air_date||'').split('-')[0],
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        overview: m.overview,
        type: isTv ? 'tv' : 'movie'
      }));

      const movieItems = mapItems(movies && movies.results ? movies.results : [], false);
      const seriesItems = mapItems(series && series.results ? series.results : [], true);

      const container = document.getElementById('sections-container');
      if (container) container.innerHTML = '';

      if (movieItems.length) renderCarousel('Trending Movies', movieItems.slice(0, 20));
      if (seriesItems.length) renderCarousel('Trending Series', seriesItems.slice(0, 20));

      if ((!movieItems.length) && (!seriesItems.length)) {
        const c = document.getElementById('sections-container');
        if (c) c.innerHTML = '<p class="text-gray-400">No TMDB data available. Check network or API keys.</p>';
      }
    } catch (e) {
      console.error('Error loading TMDB:', e);
      const c = document.getElementById('sections-container');
      if (c) c.innerHTML = '<p class="text-red-400">Failed to load TMDB data.</p>';
    }
  }

  // PWA install prompt handling
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-block';
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('PWA install choice:', choice);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    }
  });

  // Register service worker if available
  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered:', reg.scope);
      } catch (e) {
        console.warn('Service worker registration failed:', e);
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    await registerSW();
    await loadTMDB();
  });

})();
// OurShow Main Application Logic
let currentUser = null;
let deferredPrompt = null;

// ========== CONFIG ==========
// API configs are loaded from config.js (see HTML)
// TMDB and Gemini APIs are accessed via helper functions: tmdbFetch(), geminiCall()

// ========== AUTH ==========
const initAuthListener = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      updateHeaderProfile(user);
    } else {
      currentUser = null;
      updateHeaderProfile(null);
    }
  });
};

const updateHeaderProfile = (user) => {
  const profileBtn = document.getElementById('profile-icon-btn');
  const loginLink = document.getElementById('auth-link');
  const profileName = document.getElementById('profile-name');
  
  if (user) {
    if (profileBtn) profileBtn.style.display = 'block';
    if (loginLink) loginLink.style.display = 'none';
    if (profileName) profileName.textContent = user.displayName || user.email;
  } else {
    if (profileBtn) profileBtn.style.display = 'none';
    if (loginLink) loginLink.style.display = 'block';
  }
};

// ========== FIREBASE OPERATIONS ==========
const writeToWatchlist = async (item, uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlist/${item.id}`);
    await ref.set({ ...item, addedAt: firebase.database.ServerValue.TIMESTAMP });
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

const writeToWatchLater = async (item, uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlater/${item.id}`);
    await ref.set({ ...item, addedAt: firebase.database.ServerValue.TIMESTAMP });
    return true;
  } catch (error) {
    console.error('Error adding to watch later:', error);
    return false;
  }
};

const deleteFromWatchlist = async (itemId, uid) => {
  try {
    await firebase.database().ref(`ourshow/users/${uid}/watchlist/${itemId}`).remove();
    return true;
  } catch (error) {
    console.error('Error deleting:', error);
    return false;
  }
};

const readWatchlist = async (uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlist`);
    const snapshot = await ref.get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error('Error reading:', error);
    return [];
  }
};

const readWatchLater = async (uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlater`);
    const snapshot = await ref.get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error('Error reading:', error);
    return [];
  }
};

const logViewingHistory = async (item, uid) => {
  try {
    const key = firebase.database().ref(`ourshow/users/${uid}/history`).push().key;
    await firebase.database().ref(`ourshow/users/${uid}/history/${key}`).set({
      itemId: item.id, title: item.title, posterUrl: item.posterUrl,
      viewedAt: firebase.database.ServerValue.TIMESTAMP
    });
  } catch (error) {
    console.error('Error logging history:', error);
  }
};

const saveReview = async (item, reviewText, uid) => {
  try {
    const key = firebase.database().ref(`ourshow/users/${uid}/reviews`).push().key;
    await firebase.database().ref(`ourshow/users/${uid}/reviews/${key}`).set({
      itemId: item.id, title: item.title, text: reviewText,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
    return true;
  } catch (error) {
    console.error('Error saving review:', error);
    return false;
  }
};

const getReviews = async (itemId, uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/reviews`);
    const snapshot = await ref.get();
    if (!snapshot.exists()) return [];
    const all = Object.values(snapshot.val());
    return all.filter(r => r.itemId === itemId);
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

const saveChatMessage = async (role, message, uid) => {
  try {
    const key = firebase.database().ref(`ourshow/users/${uid}/ai_chat`).push().key;
    await firebase.database().ref(`ourshow/users/${uid}/ai_chat/${key}`).set({
      role, message, createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  } catch (error) {
    console.error('Error saving chat:', error);
  }
};

const getChatHistory = async (uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/ai_chat`);
    const snapshot = await ref.orderByChild('createdAt').limitToLast(50).get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error('Error loading chat:', error);
    return [];
  }
};

// ========== UTIL ==========
const esc = (s) => String(s || "").replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
const fmtTime = (ts) => { try { return new Date(ts).toLocaleString(); } catch(e){ return String(ts); }};

// ========== DOM CREATION ==========
const makeCard = (item, onClick = null) => {
  const div = document.createElement('div');
  div.className = 'bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 cursor-pointer card-item';
  div.style.width = '150px';
  div.dataset.id = item.id;
  
  const img = document.createElement('img');
  img.src = item.posterUrl || 'https://via.placeholder.com/150x225?text=No+Poster';
  img.alt = item.title;
  img.className = 'w-full h-64 object-cover';
  img.onerror = () => { img.src = 'https://via.placeholder.com/150x225?text=Error'; };
  
  const content = document.createElement('div');
  content.className = 'p-3';
  content.innerHTML = `<h3 class="text-white font-semibold text-sm truncate">${esc(item.title)}</h3><p class="text-gray-400 text-xs">${esc(item.year || 'N/A')}</p>`;
  
  div.appendChild(img);
  div.appendChild(content);
  
  if (onClick) {
    div.addEventListener('click', onClick);
  } else {
    div.addEventListener('click', () => openModal(item));
  }
  
  return div;
};

const renderGrid = (containerId, items, onClick = null) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    container.appendChild(makeCard(item, onClick));
  });
};

const renderCarousel = (containerId, items) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'flex gap-4 overflow-x-auto pb-4 carousel-wrapper';
  wrapper.style.scrollBehavior = 'smooth';
  
  items.forEach((item) => {
    wrapper.appendChild(makeCard(item));
  });
  
  container.appendChild(wrapper);
};

const sortByYearDesc = (arr) => [...arr].sort((a, b) => (b.year || 0) - (a.year || 0));

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const collectSeries = () => {
  const allSeries = [];
  const seen = new Set();
  
  [window.englishRecommendations, window.englishWatchlist, window.hindiWatchlist, window.koreanWatchlist, window.chineseRecommendations].forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (item.id && !seen.has(item.id)) {
          seen.add(item.id);
          allSeries.push(item);
        }
      });
    }
  });
  
  return allSeries;
};

// ========== MODAL ==========
const openModal = async (item) => {
  const modal = document.getElementById('item-modal');
  if (!modal) return;
  
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      <button id="close-modal" class="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded z-50">✕</button>
      
      <div class="flex gap-6 p-6">
        <img src="${item.posterUrl || 'https://via.placeholder.com/150x225'}" alt="${esc(item.title)}" class="w-32 h-48 object-cover rounded flex-shrink-0">
        
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-white mb-2">${esc(item.title)}</h2>
          <p class="text-gray-300 mb-4">${esc(item.year || 'N/A')} | ${esc(item.platform || 'N/A')}</p>
          
          <p class="text-gray-400 mb-4">${esc(item.description || 'No description available')}</p>
          
          ${item.genre ? `<p class="text-gray-400 mb-2"><span class="font-semibold">Genre:</span> ${esc(item.genre)}</p>` : ''}
          ${item.language ? `<p class="text-gray-400 mb-2"><span class="font-semibold">Language:</span> ${esc(item.language)}</p>` : ''}
          ${item.imdbRating ? `<p class="text-gray-400 mb-4"><span class="font-semibold">Rating:</span> ⭐ ${esc(item.imdbRating)}</p>` : ''}
          
          <div class="flex gap-2 mb-4">
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm" onclick="addToWatchlist('${item.id}')">
              Add to Watchlist
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onclick="addToWatchLater('${item.id}')">
              Watch Later
            </button>
          </div>
          
          <div id="reviews-section" class="mb-4">
            <h3 class="text-white font-semibold mb-2">Your Reviews</h3>
            <div id="reviews-list" class="text-gray-400 text-sm mb-2 max-h-40 overflow-y-auto"></div>
            <textarea id="review-input" placeholder="Add your review..." class="w-full bg-gray-800 text-white p-2 rounded text-sm mb-2 h-16"></textarea>
            <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm" onclick="submitReview('${item.id}')">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Load reviews if user is logged in
  if (currentUser) {
    const reviews = await getReviews(item.id, currentUser.uid);
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
      if (reviews.length > 0) {
        reviewsList.innerHTML = reviews.map(r => `<div class="bg-gray-800 p-2 rounded mb-1"><p class="text-gray-300 text-xs">${esc(r.text)}</p></div>`).join('');
      } else {
        reviewsList.innerHTML = '<p class="text-gray-500 text-xs italic">No reviews yet</p>';
      }
    }
  }
  
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
};

const closeModal = () => {
  const modal = document.getElementById('item-modal');
  if (modal) modal.style.display = 'none';
};

// ========== WATCHLIST OPERATIONS ==========
const addToWatchlist = async (itemId) => {
  if (!currentUser) {
    alert('Please log in first');
    return;
  }
  
  const allData = [
    ...(window.myWatchlist || []),
    ...(window.movieRecommendations || []),
    ...(window.koreanWatchlist || []),
    ...(window.englishRecommendations || []),
    ...(window.englishWatchlist || []),
    ...(window.hindiWatchlist || []),
    ...(window.chineseRecommendations || [])
  ];
  
  const item = allData.find(it => it.id == itemId);
  if (item) {
    const success = await writeToWatchlist(item, currentUser.uid);
    alert(success ? 'Added to watchlist!' : 'Failed to add');
  }
};

const addToWatchLater = async (itemId) => {
  if (!currentUser) {
    alert('Please log in first');
    return;
  }
  
  const allData = [
    ...(window.myWatchlist || []),
    ...(window.movieRecommendations || []),
    ...(window.koreanWatchlist || []),
    ...(window.englishRecommendations || []),
    ...(window.englishWatchlist || []),
    ...(window.hindiWatchlist || []),
    ...(window.chineseRecommendations || [])
  ];
  
  const item = allData.find(it => it.id == itemId);
  if (item) {
    const success = await writeToWatchLater(item, currentUser.uid);
    alert(success ? 'Added to watch later!' : 'Failed to add');
  }
};

const submitReview = async (itemId) => {
  if (!currentUser) {
    alert('Please log in first');
    return;
  }
  
  const reviewInput = document.getElementById('review-input');
  const reviewText = reviewInput.value.trim();
  
  if (!reviewText) {
    alert('Please enter a review');
    return;
  }
  
  const allData = [
    ...(window.myWatchlist || []),
    ...(window.movieRecommendations || []),
    ...(window.koreanWatchlist || []),
    ...(window.englishRecommendations || []),
    ...(window.englishWatchlist || []),
    ...(window.hindiWatchlist || []),
    ...(window.chineseRecommendations || [])
  ];
  
  const item = allData.find(it => it.id == itemId);
  if (item) {
    const success = await saveReview(item, reviewText, currentUser.uid);
    if (success) {
      alert('Review submitted!');
      reviewInput.value = '';
      const reviews = await getReviews(itemId, currentUser.uid);
      const reviewsList = document.getElementById('reviews-list');
      if (reviewsList) {
        reviewsList.innerHTML = reviews.map(r => `<div class="bg-gray-800 p-2 rounded mb-1"><p class="text-gray-300 text-xs">${esc(r.text)}</p></div>`).join('');
      }
    }
  }
};

// ========== THEME TOGGLE ==========
const initThemeToggle = () => {
  const themeBtn = document.getElementById('theme-btn');
  const html = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');
      if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeBtn.textContent = '🌙';
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.textContent = '☀️';
      }
    });
  }
};

// ========== PWA INSTALL ==========
const handleInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response: ${outcome}`);
          deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  });
};

// ========== MENU & UI ==========
const setupMenuToggle = () => {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
};

const setupProfileDropdown = () => {
  const profileBtn = document.getElementById('profile-icon-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
};

// ========== INIT ==========
const loadDataFromTMDB = async () => {
  // Load trending movies if not already loaded
  if (!window.movieRecommendations || window.movieRecommendations.length === 0) {
    console.log('Loading movies from TMDB...');
    try {
      const data = await tmdbFetch('/trending/movie/week');
      if (data && data.results) {
        window.movieRecommendations = data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          year: (m.release_date || m.first_air_date || '').split('-')[0],
          posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/300x450',
          description: m.overview,
          genre: 'Movie'
        }));
      }
    } catch (err) {
      console.error('Error loading TMDB movies:', err);
    }
  }

  // Load trending TV shows if not already loaded
  if (!window.englishRecommendations || window.englishRecommendations.length === 0) {
    console.log('Loading series from TMDB...');
    try {
      const data = await tmdbFetch('/trending/tv/week');
      if (data && data.results) {
        window.englishRecommendations = data.results.map(s => ({
          id: s.id,
          title: s.name || s.title,
          year: (s.release_date || s.first_air_date || '').split('-')[0],
          posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : 'https://via.placeholder.com/300x450',
          description: s.overview,
          genre: 'Series',
          type: 'tv'
        }));
      }
    } catch (err) {
      console.error('Error loading TMDB series:', err);
    }
  }

  // Load K-dramas if not already loaded
  if (!window.koreanWatchlist || window.koreanWatchlist.length === 0) {
    console.log('Loading K-dramas from TMDB...');
    try {
      const data = await tmdbFetch('/discover/tv?with_original_language=ko&sort_by=popularity.desc');
      if (data && data.results) {
        window.koreanWatchlist = data.results.slice(0, 20).map(s => ({
          id: s.id,
          title: s.name || s.title,
          year: (s.release_date || s.first_air_date || '').split('-')[0],
          posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : 'https://via.placeholder.com/300x450',
          description: s.overview,
          genre: 'K-Drama',
          type: 'tv'
        }));
      }
    } catch (err) {
      console.error('Error loading K-dramas:', err);
    }
  }
};

const init = async () => {
  // Initialize Firebase auth listener
  initAuthListener();
  
  // Load data from TMDB if local data not available
  await loadDataFromTMDB();
  
  // Setup UI
  setupMenuToggle();
  setupProfileDropdown();
  initThemeToggle();
  handleInstallPrompt();
  
  // Build home page sections
  await buildHomePageSections();
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Service worker registration failed:', err);
    });
  }
};

const buildHomePageSections = async () => {
  // Render watchlist
  if (window.myWatchlist && Array.isArray(window.myWatchlist)) {
    renderGrid('watchlist-grid', window.myWatchlist.slice(0, 8));
  }
  
  // Render carousels from available data
  const recentMovies = sortByYearDesc(window.movieRecommendations || []).slice(0, 12);
  const recentSeries = sortByYearDesc(collectSeries()).slice(0, 12);
  const koreanDramas = sortByYearDesc(window.koreanWatchlist || []).slice(0, 12);
  
  if (recentMovies.length > 0) {
    renderCarousel('recently-released-movies', recentMovies);
  }
  if (recentSeries.length > 0) {
    renderCarousel('recently-released-series', recentSeries);
  }
  if (koreanDramas.length > 0) {
    renderCarousel('recently-released-dramas', koreanDramas);
  }
  
  // Render random grid
  const randomItems = shuffleArray([
    ...(window.movieRecommendations || []),
    ...collectSeries()
  ]).slice(0, 20);
  
  if (randomItems.length > 0) {
    renderGrid('random-grid', randomItems);
  }
  
  // Reshuffle button
  const reshuffleBtn = document.getElementById('reshuffle-btn');
  if (reshuffleBtn) {
    reshuffleBtn.addEventListener('click', () => {
      const newRandom = shuffleArray([
        ...(window.movieRecommendations || []),
        ...collectSeries()
      ]).slice(0, 20);
      renderGrid('random-grid', newRandom);
    });
  }
};

// Global functions for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.addToWatchlist = addToWatchlist;
window.addToWatchLater = addToWatchLater;
window.submitReview = submitReview;

// ========== SEARCH & AI FUNCTIONS ==========
window.searchMovies = async (query) => {
  console.log('Searching for:', query);
  try {
    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&language=en-US`);
    if (data && data.results && data.results.length > 0) {
      renderGrid('search-results', data.results.map(r => ({
        id: r.id,
        title: r.title || r.name,
        posterUrl: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/300x450',
        year: (r.release_date || r.first_air_date || '').split('-')[0],
        description: r.overview,
        type: r.media_type || 'movie'
      })));
      console.log('Found ' + data.results.length + ' results');
      return true;
    } else {
      console.log('No results found');
      return false;
    }
  } catch (err) {
    console.error('Search error:', err);
    return false;
  }
};

window.getAIRecommendations = async (mood, genre) => {
  console.log('Getting AI recommendations for mood:', mood, 'genre:', genre);
  try {
    const prompt = `Suggest 5 popular movies or TV shows that are perfect for someone who feels ${mood} and likes ${genre || 'any genre'}. Return only the titles separated by commas.`;
    
    const response = await geminiCall(prompt);
    if (response) {
      console.log('AI Response:', response);
      const titles = response.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      // Search for each recommended title
      const recommendations = [];
      for (const title of titles.slice(0, 5)) {
        const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(title)}&language=en-US`);
        if (data && data.results && data.results.length > 0) {
          recommendations.push({
            id: data.results[0].id,
            title: data.results[0].title || data.results[0].name,
            posterUrl: data.results[0].poster_path ? `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}` : 'https://via.placeholder.com/300x450',
            year: (data.results[0].release_date || data.results[0].first_air_date || '').split('-')[0],
            description: data.results[0].overview,
            type: data.results[0].media_type || 'movie'
          });
        }
      }
      
      if (recommendations.length > 0) {
        console.log('AI Recommendations:', recommendations);
        return recommendations;
      }
    }
    return null;
  } catch (err) {
    console.error('AI recommendation error:', err);
    return null;
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
