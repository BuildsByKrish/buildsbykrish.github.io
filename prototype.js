// OurShow App - Main Script
// Global state
let currentUser = null;
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const esc = (s) => String(s || "").replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

// ========== AUTH ==========
const initAuthListener = () => {
  if (typeof firebase === 'undefined' || !firebase || !firebase.auth) {
    console.warn('Firebase not loaded yet; registering initAuthListener to run when ready.');
    try {
      if (window.onFirebaseReady) window.onFirebaseReady(() => initAuthListener());
    } catch (e) {}
    return;
  }
  try {
    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      updateHeaderProfile(user);
    });
  } catch(e) {
    console.warn('Auth listener setup failed:', e);
  }
};

const updateHeaderProfile = (user) => {
  const profileName = document.getElementById('profile-name');
  if (user && profileName) {
    profileName.textContent = user.displayName || user.email || 'User';
  }
};

// ========== FIREBASE DATABASE OPERATIONS ==========
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

const readWatchlist = async (uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlist`);
    const snapshot = await ref.get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error('Error reading watchlist:', error);
    return [];
  }
};

const readWatchLater = async (uid) => {
  try {
    const ref = firebase.database().ref(`ourshow/users/${uid}/watchlater`);
    const snapshot = await ref.get();
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (error) {
    console.error('Error reading watch later:', error);
    return [];
  }
};

const saveReview = async (itemId, itemTitle, reviewText, uid) => {
  try {
    const key = firebase.database().ref(`ourshow/users/${uid}/reviews`).push().key;
    await firebase.database().ref(`ourshow/users/${uid}/reviews/${key}`).set({
      itemId: itemId,
      title: itemTitle,
      text: reviewText,
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
    return all.filter(r => r.itemId == itemId);
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

// ========== CARD CREATION ==========
function makeCard(item) {
  const div = document.createElement('div');
  div.className = 'bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 cursor-pointer m-1 card-item';
  div.style.width = '150px';
  div.dataset.id = item.id;
  div.dataset.type = item.type || 'movie';

  const img = document.createElement('img');
  const posterUrl = item.posterUrl || (item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null);
  img.src = posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster';
  img.alt = item.title || 'Poster';
  img.className = 'w-full h-64 object-cover bg-gray-800';
  img.onerror = function() {
    this.src = 'https://via.placeholder.com/300x450?text=No+Image';
  };

  const content = document.createElement('div');
  content.className = 'p-2';
  content.innerHTML = `<h3 class="text-white font-semibold text-sm truncate">${esc(item.title)}</h3><p class="text-gray-400 text-xs">${esc(item.year || '')}</p>`;

  div.appendChild(img);
  div.appendChild(content);
  div.addEventListener('click', () => window.loadDetails(item.id, item.type || 'movie'));
  return div;
}

// ========== SECTIONS & CAROUSEL ==========
const sections = [
  { id: 'trending-movies', title: 'Trending Movies', endpoint: '/trending/movie/week', type: 'movie' },
  { id: 'trending-tv', title: 'Trending Series', endpoint: '/trending/tv/week', type: 'tv' },
  { id: 'popular-movies', title: 'Popular Movies', endpoint: '/movie/popular', type: 'movie' },
  { id: 'popular-tv', title: 'Popular Series', endpoint: '/tv/popular', type: 'tv' },
  { id: 'now-playing', title: 'Now Playing', endpoint: '/movie/now_playing', type: 'movie' },
  { id: 'upcoming', title: 'Upcoming Movies', endpoint: '/movie/upcoming', type: 'movie' },
  { id: 'top-rated', title: 'Top Rated', endpoint: '/movie/top_rated', type: 'movie' },
  { id: 'kdramas', title: 'K-Dramas', endpoint: '/discover/tv?with_original_language=ko&sort_by=popularity.desc', type: 'tv' }
];

function createSectionEl(section) {
  const container = document.getElementById('sections-container');
  if (!container) return null;

  const sec = document.createElement('section');
  sec.className = 'space-y-3';
  sec.id = section.id;

  const titleDiv = document.createElement('div');
  titleDiv.className = 'flex items-center justify-between';

  const title = document.createElement('h2');
  title.className = 'text-xl font-semibold';
  title.textContent = section.title;

  const moreBtn = document.createElement('button');
  moreBtn.className = 'text-red-500 hover:text-red-400 text-sm font-semibold transition';
  moreBtn.textContent = 'More ➜';
  moreBtn.addEventListener('click', () => window.openViewAllModal(section.title, section.endpoint, section.type));

  titleDiv.appendChild(title);
  titleDiv.appendChild(moreBtn);
  sec.appendChild(titleDiv);

  const wrapper = document.createElement('div');
  wrapper.className = 'flex gap-4 overflow-x-auto pb-4 carousel-wrapper';
  wrapper.style.scrollBehavior = 'smooth';
  wrapper.dataset.endpoint = section.endpoint;
  wrapper.dataset.type = section.type;
  wrapper.dataset.page = '1';
  wrapper.dataset.loading = 'false';
  wrapper.addEventListener('scroll', onCarouselScroll);

  sec.appendChild(wrapper);
  container.appendChild(sec);
  return wrapper;
}

function onCarouselScroll(e) {
  const w = e.currentTarget;
  if (w.dataset.loading === 'true') return;
  const threshold = 200;
  if (w.scrollLeft + w.clientWidth >= w.scrollWidth - threshold) {
    const endpoint = w.dataset.endpoint;
    const type = w.dataset.type;
    let page = Number(w.dataset.page || 1) + 1;
    loadSectionPage(w, endpoint, type, page);
    w.dataset.page = String(page);
  }
}

async function loadSectionPage(wrapper, endpoint, type, page = 1) {
  try {
    wrapper.dataset.loading = 'true';
    const sep = endpoint.includes('?') ? '&' : '?';
    const ep = `${endpoint}${sep}page=${page}`;
    const data = await tmdbFetch(ep);
    const results = data && data.results ? data.results : [];
    const items = results.map(m => ({
      id: m.id,
      title: m.title || m.name,
      year: (m.release_date || m.first_air_date || '').split('-')[0],
      posterUrl: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
      overview: m.overview,
      type: type,
      rating: m.vote_average,
      popularity: m.popularity
    }));
    items.forEach(i => wrapper.appendChild(makeCard(i)));
  } catch (e) {
    console.error('Section load error:', e);
  } finally {
    wrapper.dataset.loading = 'false';
  }
}

async function initSections() {
  const container = document.getElementById('sections-container');
  if (!container) return;
  container.innerHTML = '';
  for (const s of sections) {
    const wrapper = createSectionEl(s);
    if (wrapper) await loadSectionPage(wrapper, s.endpoint, s.type, 1);
  }
}

// ========== MODAL FUNCTIONS ==========
window.loadDetails = async (id, type = 'movie') => {
  const modal = document.getElementById('item-modal');
  if (!modal) return;
  modal.innerHTML = `<div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-4 text-white">Loading...</div>`;
  modal.style.display = 'flex';

  try {
    const ep = `/${type}/${id}?append_to_response=credits,videos,similar,external_ids`;
    const data = await tmdbFetch(ep);
    if (!data) throw new Error('No data');

    const title = data.title || data.name || 'Untitled';
    const year = (data.release_date || data.first_air_date || '').split('-')[0] || '';
    const poster = data.poster_path ? `${IMAGE_BASE}${data.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster';
    const overview = data.overview || '';
    const rating = data.vote_average || 0;
    const popularity = data.popularity || 0;
    const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]) || null;
    const imdbId = data.external_ids && data.external_ids.imdb_id ? data.external_ids.imdb_id : null;

    const cast = (data.credits && data.credits.cast) ? data.credits.cast.slice(0, 8) : [];
    const videos = (data.videos && data.videos.results) ? data.videos.results : [];
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube') || null;
    const similar = (data.similar && data.similar.results) ? data.similar.results.slice(0, 12) : [];

    const html = [];
    html.push('<div class="relative">');
    html.push('<button id="close-modal" class="absolute right-2 top-2 bg-red-600 text-white px-3 py-1 rounded">✕</button>');
    html.push('<div class="flex gap-6">');
    html.push(`<img src="${poster}" class="w-40 h-60 object-cover rounded" alt="poster">`);
    html.push('<div class="flex-1">');
    html.push(`<h2 class="text-2xl font-bold">${esc(title)} <span class="text-gray-400 text-sm">(${esc(year)})</span></h2>`);
    html.push(`<p class="text-gray-300 mt-2">${esc(overview)}</p>`);
    html.push('<div class="mt-3 text-sm text-gray-300 space-y-1">');
    html.push(`<div><strong>Release Year:</strong> ${esc(year)}</div>`);
    html.push(`<div><strong>TMDB Rating:</strong> ⭐ ${esc(rating.toFixed(1))}</div>`);
    html.push(`<div><strong>Popularity:</strong> 📊 ${esc(popularity.toFixed(1))}</div>`);
    if (runtime) html.push(`<div><strong>Runtime:</strong> ${esc(runtime)} min</div>`);
    if (imdbId) html.push(`<div><a target="_blank" rel="noopener" class="text-red-400 hover:underline" href="https://www.imdb.com/title/${imdbId}">View on IMDB</a></div>`);
    html.push('</div>');

    html.push('<div class="mt-4 flex gap-2 flex-wrap">');
    html.push(`<button id="add-watchlist-btn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">➕ Watchlist</button>`);
    html.push(`<button id="add-watchlater-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">⏰ Watch Later</button>`);
    html.push(`<button id="write-review-btn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">✍️ Review</button>`);
    html.push('</div>');

    html.push('<div id="review-section" class="mt-4 hidden bg-gray-800 p-4 rounded">');
    html.push('<h3 class="font-semibold mb-2">Write Review</h3>');
    html.push('<textarea id="review-textarea" placeholder="Your thoughts..." class="w-full bg-gray-700 text-white p-2 rounded mb-2 h-16 text-sm"></textarea>');
    html.push('<div class="flex gap-2">');
    html.push(`<button id="submit-review-btn" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Submit</button>`);
    html.push(`<button id="cancel-review-btn" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">Cancel</button>`);
    html.push('</div>');
    html.push('<div id="reviews-list" class="mt-4 space-y-2 max-h-32 overflow-y-auto"></div>');
    html.push('</div>');

    if (trailer) {
      const key = trailer.key;
      html.push('<div class="mt-4"><iframe width="100%" height="250" src="https://www.youtube.com/embed/' + key + '" frameborder="0" allowfullscreen></iframe></div>');
    }

    if (cast.length) {
      html.push('<div class="mt-4"><h3 class="font-semibold mb-2">Cast</h3><div class="flex gap-2 overflow-x-auto pb-2">');
      cast.forEach(c => {
        const pic = c.profile_path ? `${IMAGE_BASE}${c.profile_path}` : 'https://via.placeholder.com/64';
        html.push(`<div class="w-20 text-center"><img src="${pic}" class="w-16 h-24 object-cover rounded"><div class="text-xs text-gray-300">${esc(c.name)}</div></div>`);
      });
      html.push('</div></div>');
    }

    if (similar.length) {
      html.push('<div class="mt-4"><h3 class="font-semibold mb-2">Similar</h3><div class="flex gap-2 overflow-x-auto pb-2">');
      similar.forEach(s => {
        const p = s.poster_path ? `${IMAGE_BASE}${s.poster_path}` : 'https://via.placeholder.com/100x150';
        html.push(`<div class="w-20 text-center cursor-pointer similar-item" data-id="${s.id}" data-type="${type}"><img src="${p}" class="w-16 h-24 object-cover rounded"><div class="text-xs text-gray-300">${esc(s.title || s.name)}</div></div>`);
      });
      html.push('</div></div>');
    }

    html.push('</div></div>');
    modal.innerHTML = `<div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-4 text-white">${html.join('')}</div>`;

    document.getElementById('close-modal').addEventListener('click', window.closeModal);

    const itemData = { id, title, year, posterUrl: poster, overview, rating, popularity, type, imdbId };

    document.getElementById('add-watchlist-btn').addEventListener('click', () => {
      if (!currentUser) { alert('Please login'); return; }
      writeToWatchlist(itemData, currentUser.uid).then(ok => {
        alert(ok ? '✅ Added!' : '❌ Error');
        if (ok) setTimeout(() => window.location.href = 'watchlist.html', 500);
      });
    });

    document.getElementById('add-watchlater-btn').addEventListener('click', () => {
      if (!currentUser) { alert('Please login'); return; }
      writeToWatchLater(itemData, currentUser.uid).then(ok => {
        alert(ok ? '✅ Added!' : '❌ Error');
        if (ok) setTimeout(() => window.location.href = 'watchlater.html', 500);
      });
    });

    document.getElementById('write-review-btn').addEventListener('click', () => {
      document.getElementById('review-section').classList.toggle('hidden');
    });

    document.getElementById('cancel-review-btn').addEventListener('click', () => {
      document.getElementById('review-section').classList.add('hidden');
      document.getElementById('review-textarea').value = '';
    });

    document.getElementById('submit-review-btn').addEventListener('click', () => {
      if (!currentUser) { alert('Please login'); return; }
      const text = document.getElementById('review-textarea').value.trim();
      if (!text) { alert('Enter a review'); return; }
      saveReview(itemData.id, itemData.title, text, currentUser.uid).then(ok => {
        if (ok) {
          document.getElementById('review-textarea').value = '';
          window.loadReviewsForModal(itemData.id);
        }
      });
    });

    window.loadReviewsForModal(itemData.id);

    modal.querySelectorAll('.similar-item').forEach(el => {
      el.addEventListener('click', () => {
        window.loadDetails(el.dataset.id, el.dataset.type);
      });
    });

  } catch (e) {
    console.error('Detail error:', e);
    modal.innerHTML = `<div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-4 text-white">Failed to load details.</div>`;
  }
};

window.loadReviewsForModal = async (itemId) => {
  if (!currentUser) return;
  const reviews = await getReviews(itemId, currentUser.uid);
  const reviewsList = document.getElementById('reviews-list');
  if (!reviewsList) return;
  if (reviews.length > 0) {
    reviewsList.innerHTML = reviews.map(r => `<div class="bg-gray-700 p-2 rounded text-xs"><p class="text-gray-300">${esc(r.text)}</p></div>`).join('');
  } else {
    reviewsList.innerHTML = '<p class="text-gray-500 text-xs">No reviews yet</p>';
  }
};

window.closeModal = () => {
  const modal = document.getElementById('item-modal');
  if (modal) modal.style.display = 'none';
};

window.openViewAllModal = async (title, endpoint, type) => {
  const modal = document.getElementById('item-modal');
  if (!modal) return;

  modal.innerHTML = `<div class="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative p-4 text-white">
    <button id="close-modal" class="absolute right-2 top-2 bg-red-600 text-white px-3 py-1 rounded">✕</button>
    <h2 class="text-2xl font-bold mb-4">${esc(title)}</h2>
    <div id="view-all-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <p class="col-span-full text-gray-400">Loading...</p>
    </div>
  </div>`;
  modal.style.display = 'flex';

  try {
    const allItems = [];
    for (let page = 1; page <= 3; page++) {
      const sep = endpoint.includes('?') ? '&' : '?';
      const ep = `${endpoint}${sep}page=${page}`;
      const data = await tmdbFetch(ep);
      if (data && data.results) {
        allItems.push(...data.results.map(m => ({
          id: m.id,
          title: m.title || m.name,
          year: (m.release_date || m.first_air_date || '').split('-')[0],
          posterUrl: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : null,
          type: type,
          rating: m.vote_average,
          popularity: m.popularity
        })));
      }
    }

    const grid = document.getElementById('view-all-grid');
    if (grid && allItems.length > 0) {
      grid.innerHTML = allItems.map(item => `
        <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer view-all-item" data-id="${item.id}" data-type="${item.type}">
          <img src="${item.posterUrl || 'https://via.placeholder.com/300x450'}" alt="${esc(item.title)}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/300x450'">
          <div class="p-3">
            <h3 class="text-white font-semibold text-sm truncate">${esc(item.title)}</h3>
            <p class="text-gray-400 text-xs mb-2">${esc(item.year || 'N/A')}</p>
            <p class="text-yellow-400 text-xs">⭐ ${item.rating?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.view-all-item').forEach(el => {
        el.addEventListener('click', () => {
          window.loadDetails(el.dataset.id, el.dataset.type);
        });
      });
    }
  } catch (e) {
    console.error('View all error:', e);
    document.getElementById('view-all-grid').innerHTML = '<p class="text-red-400">Failed to load</p>';
  }

  document.getElementById('close-modal').addEventListener('click', window.closeModal);
};

// ========== PWA ==========
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered');
    } catch (e) {
      console.warn('Service worker registration failed:', e);
    }
  }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
  initAuthListener();
  await registerSW();
  await initSections();
});
