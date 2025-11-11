// ===== CONFIG =====
const TMDB_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY";
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  databaseURL: "https://krishs-watchlist-vault-default-rtdb.firebaseio.com",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.appspot.com",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== FETCH TMDB =====
async function fetchTMDB(endpoint) {
  try {
    const res = await fetch(`${TMDB_API_BASE}${endpoint}`, {
      headers: { Authorization: TMDB_TOKEN },
    });
    if (!res.ok) {
      console.error("API error:", res.status, await res.text());
      return { results: [] };
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return { results: [] };
  }
}

// ===== DOM HELPERS =====
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
  });
}

function makeCard(item, type) {
  const title = item.title || item.name || "Unknown";
  const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const vote = (typeof item.vote_average === "number") ? item.vote_average.toFixed(1) : (item.vote_average ? item.vote_average : "N/A");
  const img = item.poster_path ? IMG_BASE + item.poster_path : "https://via.placeholder.com/300x450?text=No+Image";

  return `
    <div class="cursor-pointer min-w-[150px]" data-id="${item.id}" data-type="${type}">
      <img src="${img}" class="rounded-lg aspect-[2/3] object-cover hover:opacity-80 transition" alt="${escapeHtml(title)}">
      <h3 class="mt-1 text-sm font-medium">${escapeHtml(title)}</h3>
      <p class="text-gray-400 text-xs">${escapeHtml(year)} • ⭐ ${escapeHtml(vote)}</p>
    </div>`;
}

function renderRow(containerId, data, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!data || !data.results || data.results.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm">No results found.</p>`;
    return;
  }
  container.innerHTML = data.results.map(item => makeCard(item, type)).join("");
}

// ===== SPA NAV =====
function showPage(pageId) {
  document.querySelectorAll(".spa-page").forEach(p => p.classList.add("hidden"));
  const el = document.getElementById(pageId);
  if (el) el.classList.remove("hidden");
}

// ===== SEARCH =====
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") performSearch(e.target.value.trim());
  });
}

async function performSearch(query) {
  if (!query) return;
  showPage("page-search");
  const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&language=en-US`);
  const container = document.getElementById("search-content");
  if (!container) return;
  container.innerHTML = (data.results || []).map(item => makeCard(item, item.media_type || "movie")).join("");
}

// ===== MODAL + PER-MOVIE CHAT =====
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close-modal");

if (closeBtn) {
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target && e.target.id === "detail-modal") modal.classList.add("hidden");
  });
}

// Card click
document.body.addEventListener("click", e => {
  if (e.target.closest("#detail-modal")) return;
  const card = e.target.closest("[data-id]");
  if (card) {
    const type = card.dataset.type || "movie";
    fetchDetailsAndShowModal(card.dataset.id, type);
  }
});

async function fetchDetailsAndShowModal(id, type) {
  if (!id || !type) return;
  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  const title = data.title || data.name || "Untitled";
  const date = data.release_date || data.first_air_date || "Unknown";
  const genres = (data.genres || []).map(g => g.name).join(", ") || "N/A";
  const runtime = data.runtime || data.episode_run_time?.[0] || "N/A";
  const languages = (data.spoken_languages || []).map(l => l.english_name || l.name).join(", ") || "N/A";
  const status = data.status || "N/A";

  // Modal HTML + chat box
  modalContent.innerHTML = `
    <div>
      ${data.backdrop_path ? `<img src="${BACKDROP_BASE + data.backdrop_path}" class="w-full h-60 object-cover rounded-t-lg opacity-80">` : ""}
      <div class="p-4">
        <h2 class="text-2xl font-bold mb-2">${escapeHtml(title)}</h2>
        <p class="text-gray-400 mb-2">${escapeHtml(date)} • ⭐ ${escapeHtml(data.vote_average ?? "N/A")}</p>
        <p class="mb-3 text-sm">${escapeHtml(data.overview || "No description available.")}</p>
        <p class="text-sm"><strong>Genres:</strong> ${escapeHtml(genres)}</p>
        <p class="text-sm"><strong>Runtime:</strong> ${escapeHtml(runtime)}</p>
        <p class="text-sm"><strong>Languages:</strong> ${escapeHtml(languages)}</p>
        <p class="text-sm"><strong>Status:</strong> ${escapeHtml(status)}</p>
        
        <div class="mt-4">
          <h3 class="font-semibold mb-2">💬 Movie Chat</h3>
          <div id="movie-chat" class="bg-gray-800 rounded-lg p-2 h-48 overflow-y-auto mb-2"></div>
          <input id="movie-input" type="text" placeholder="Type your message..." 
            class="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
        </div>
      </div>
    </div>`;

  modal.classList.remove("hidden");

  // Setup Firebase per-movie chat
  const movieChat = document.getElementById("movie-chat");
  const movieInput = document.getElementById("movie-input");

  db.ref(`movie_chat/${id}`).off(); // Remove previous listeners
  db.ref(`movie_chat/${id}`).on("value", snapshot => {
    const msgs = snapshot.val() || {};
    movieChat.innerHTML = "";
    Object.values(msgs).forEach(m => {
      const div = document.createElement("div");
      div.className = "mb-1 text-sm";
      div.textContent = m.text;
      movieChat.appendChild(div);
    });
    movieChat.scrollTop = movieChat.scrollHeight;
  });

  movieInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const msg = { text: e.target.value.trim(), time: Date.now() };
      db.ref(`movie_chat/${id}`).push(msg);
      e.target.value = "";
    }
  });
}

// ===== MORE BUTTONS =====
document.body.addEventListener("click", async e => {
  const btn = e.target.closest("[data-more]");
  if (!btn) return;

  const section = btn.dataset.more;
  showPage("page-all");
  let endpoint = "", title = "", type = "movie";

  switch (section) {
    case "trending": endpoint = "/trending/all/week"; title = "🔥 Trending This Week"; break;
    case "popular-movies": endpoint = "/movie/popular"; title = "🎬 Popular Movies"; break;
    case "top-movies": endpoint = "/movie/top_rated"; title = "⭐ Top Rated Movies"; break;
    case "upcoming": endpoint = "/movie/upcoming"; title = "🕒 Upcoming Movies"; break;
    case "popular-tv": endpoint = "/tv/popular"; title = "📺 Popular TV Shows"; type = "tv"; break;
    case "top-tv": endpoint = "/tv/top_rated"; title = "🏆 Top Rated TV Shows"; type = "tv"; break;
    default: endpoint = "/movie/popular"; title = "🎬 Movies";
  }

  const data = await fetchTMDB(`${endpoint}?language=en-US&page=1`);
  document.getElementById("all-title").innerText = title;
  document.getElementById("all-content").innerHTML = (data.results || []).map(item => makeCard(item, type)).join("");
});

// ===== BACK TO HOME =====
const backHomeBtn = document.getElementById("back-home");
if (backHomeBtn) backHomeBtn.addEventListener("click", () => showPage("page-home"));

// ===== INITIAL LOAD =====
async function init() {
  showPage("page-home");

  const sections = [
    { id: "trending", title: "🔥 Trending This Week", endpoint: "/trending/all/week", type: "movie" },
    { id: "popular-movies", title: "🎬 Popular Movies", endpoint: "/movie/popular", type: "movie" },
    { id: "top-movies", title: "⭐ Top Rated Movies", endpoint: "/movie/top_rated", type: "movie" },
    { id: "upcoming", title: "🕒 Upcoming Movies", endpoint: "/movie/upcoming", type: "movie" },
    { id: "popular-tv", title: "📺 Popular TV Shows", endpoint: "/tv/popular", type: "tv" },
    { id: "top-tv", title: "🏆 Top Rated TV Shows", endpoint: "/tv/top_rated", type: "tv" }
  ];

  const container = document.getElementById("sections-container");
  if (!container) return;

  for (const s of sections) {
    container.insertAdjacentHTML(
      "beforeend",
      `<div>
         <div class="flex items-center justify-between mb-3">
           <h2 class="text-xl font-semibold">${s.title}</h2>
           <button class="text-red-500 hover:underline" data-more="${s.id}">More ›</button>
         </div>
         <div id="${s.id}-row" class="flex overflow-x-auto space-x-3 pb-2"></div>
       </div>`
    );

    const data = await fetchTMDB(`${s.endpoint}?language=en-US`);
    renderRow(`${s.id}-row`, data, s.type);
  }
}
// ===== GLOBAL CHAT =====
const globalChatMessages = document.getElementById("global-chat-messages");
const globalChatInput = document.getElementById("global-chat-input");

// Listen for new messages
db.ref("global_chat").on("value", snapshot => {
  const msgs = snapshot.val() || {};
  globalChatMessages.innerHTML = "";
  Object.values(msgs).forEach(m => {
    const div = document.createElement("div");
    div.className = "mb-1 text-sm";
    div.textContent = m.text;
    globalChatMessages.appendChild(div);
  });
  globalChatMessages.scrollTop = globalChatMessages.scrollHeight;
});

// Send message
globalChatInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    const msg = { text: e.target.value.trim(), time: Date.now() };
    db.ref("global_chat").push(msg);
    e.target.value = "";
  }
});


init();
