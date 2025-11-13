// ===== TMDB CONFIG =====
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = "fa75c4832cd40cf2bf75307fd4abe736";

// ===== FIREBASE INIT (use config from your project) =====
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
    authDomain: "krishs-watchlist-vault.firebaseapp.com",
    databaseURL: "https://krishs-watchlist-vault-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "krishs-watchlist-vault",
    storageBucket: "krishs-watchlist-vault.appspot.com",
    messagingSenderId: "1085194969409",
    appId: "1:1085194969409:web:45becd2ef6afe86e0741c0"
  });
}
const db = firebase.database();

// ===== HELPER FUNCTION =====
function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

// ===== FETCH DATA =====
async function fetchData(endpoint) {
  try {
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// ===== MAKE CARD =====
function makeCard(item, type = "movie") {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "N/A").split("-")[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const popularity = item.popularity ? Math.round(item.popularity) : "N/A";
  const img = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return `
    <div class="cursor-pointer min-w-[150px]" data-id="${item.id}" data-type="${type}">
      <img src="${img}" class="rounded-lg aspect-[2/3] object-cover hover:opacity-80 transition" alt="${esc(title)}">
      <h3 class="mt-1 text-sm font-medium">${esc(title)}</h3>
      <p class="text-gray-400 text-xs">${esc(year)} • ⭐ ${esc(rating)} • 🔥 ${esc(popularity)}</p>
    </div>
  `;
}

// ===== RENDER HOME =====
async function renderHome() {
  const sections = [
    { id: "trending-movies", title: "🔥 Trending Movies", endpoint: "/trending/movie/week", type: "movie" },
    { id: "trending-tv", title: "📺 Trending TV Shows", endpoint: "/trending/tv/week", type: "tv" },
    { id: "top-hindi", title: "🇮🇳 Top Hindi Movies", endpoint: "/discover/movie?with_original_language=hi&sort_by=vote_average.desc", type: "movie" },
    { id: "best-hindi", title: "🎞️ Best Hindi Movies", endpoint: "/discover/movie?with_original_language=hi&sort_by=popularity.desc", type: "movie" },
    { id: "hindi-popular", title: "🎬 Hindi Movies Popular Now", endpoint: "/discover/movie?with_original_language=hi&sort_by=popularity.desc", type: "movie" },
    { id: "web-series", title: "💻 Best Web Series", endpoint: "/tv/popular", type: "tv" },
    { id: "upcoming-hindi", title: "🕒 Upcoming Hindi Movies", endpoint: "/movie/upcoming?with_original_language=hi", type: "movie" },
    { id: "upcoming-hollywood", title: "🎥 Upcoming Hollywood Movies", endpoint: "/movie/upcoming?with_original_language=en", type: "movie" },
    { id: "comedy", title: "😂 Best Comedy Movies", endpoint: "/discover/movie?with_genres=35", type: "movie" },
    { id: "action", title: "💥 Best Action Movies", endpoint: "/discover/movie?with_genres=28", type: "movie" },
    { id: "drama", title: "🎭 Best Dramas", endpoint: "/discover/movie?with_genres=18", type: "movie" }
  ];

  const container = document.getElementById("sections-container");
  container.innerHTML = "";
  for (const s of sections) {
    container.insertAdjacentHTML("beforeend", `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">${s.title}</h2>
          <button class="text-red-500 hover:underline" data-more="${s.id}">More ›</button>
        </div>
        <div id="${s.id}-row" class="flex overflow-x-auto space-x-3 pb-2"></div>
      </div>
    `);
    const data = await fetchData(s.endpoint);
    document.getElementById(`${s.id}-row`).innerHTML = data.map(item => makeCard(item, s.type)).join("");
  }
}

// ===== PAGE SWITCH =====
function showPage(pageId) {
  document.querySelectorAll(".spa-page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

// ===== SEARCH =====
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    if (!query) return;
    showPage("page-search");
    const data = await fetchData(`/search/multi?query=${encodeURIComponent(query)}&language=en-US`);
    document.getElementById("search-content").innerHTML =
      data.length ? data.map(item => makeCard(item, item.media_type || "movie")).join("") :
      `<p class="text-gray-400">No results found.</p>`;
  }
});

// ===== MODAL =====
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
document.getElementById("close-modal").addEventListener("click", () => modal.classList.add("hidden"));

// ===== OPEN MODAL =====
document.body.addEventListener("click", async (e) => {
  const card = e.target.closest("[data-id]");
  if (!card) return;
  const id = card.dataset.id;
  const type = card.dataset.type || "movie";
  await openDetailModal(id, type);
});

async function openDetailModal(id, type) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos,credits,similar&api_key=${TMDB_KEY}`);
    const data = await res.json();
    const title = data.title || data.name;
    const year = (data.release_date || data.first_air_date || "").split("-")[0];
    const rating = data.vote_average?.toFixed(1) || "N/A";
    const popularity = Math.round(data.popularity || 0);
    const overview = data.overview || "No description available.";
    const runtime = data.runtime || data.episode_run_time?.[0] || "N/A";
    const genres = (data.genres || []).map(g => g.name).join(", ");
    const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "";
    const trailer = (data.videos.results || []).find(v => v.type === "Trailer" && v.site === "YouTube");
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
    const cast = (data.credits.cast || []).slice(0, 6);
    const similar = (data.similar.results || []).slice(0, 10);

    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">
        <img src="${poster}" class="w-full md:w-1/3 rounded-lg object-cover" alt="${esc(title)}">

        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">${esc(title)}</h2>
          <p class="text-gray-300 leading-relaxed mb-3">${esc(overview)}</p>

          <div class="text-sm text-gray-400 space-y-1">
            <p><strong>Release Year:</strong> ${esc(year)}</p>
            <p><strong>IMDb:</strong> ⭐ ${esc(rating)}</p>
            <p><strong>Popularity:</strong> 🔥 ${esc(popularity)}</p>
            <p><strong>Runtime:</strong> ${esc(runtime)} min</p>
            <p><strong>Genres:</strong> ${esc(genres)}</p>
          </div>

          <div class="flex gap-2 mt-4 flex-wrap">
            <button onclick="addToWatchlist('${id}','${esc(title)}')" class="bg-red-600 px-3 py-1 rounded">➕ Add to Watchlist</button>
            <button onclick="addToWatchLater('${id}','${esc(title)}')" class="bg-blue-600 px-3 py-1 rounded">🕒 Watch Later</button>
            <button onclick="showReviews('${id}')" class="bg-green-600 px-3 py-1 rounded">💬 Reviews</button>
          </div>

          <div class="mt-4">
            <label class="block text-sm mb-1">Add Your Review:</label>
            <select id="review-select" class="bg-gray-800 text-white p-2 rounded">
              <option value="">Select Rating</option>
              <option>👎 Bad</option>
              <option>👌 One-time Watch</option>
              <option>🙂 Satisfactory</option>
              <option>👍 Good</option>
              <option>🔥 Perfection</option>
            </select>
            <button onclick="submitReview('${id}','${esc(title)}')" class="bg-red-600 px-3 py-1 rounded ml-2">Submit</button>
          </div>

          ${trailerUrl ? `<iframe class="mt-4 w-full h-48 rounded" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` : ""}
        </div>
      </div>

      <h3 class="text-lg font-semibold mt-6 mb-2">Top Cast</h3>
      <div class="flex flex-wrap gap-3 justify-center md:justify-start">
        ${cast.map(c => `
          <div class="flex flex-col items-center w-20">
            <img src="${c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : "https://via.placeholder.com/100"}"
                 class="rounded-full w-16 h-16 object-cover" alt="${esc(c.name)}">
            <p class="text-xs mt-1 text-center">${esc(c.name)}</p>
          </div>
        `).join("")}
      </div>

      <h3 class="text-lg font-semibold mt-6 mb-2">Similar Titles</h3>
      <div class="flex overflow-x-auto gap-3">
        ${similar.map(s => makeCard(s, s.media_type || "movie")).join("")}
      </div>
    `;
    modal.classList.remove("hidden");
  } catch (err) {
    console.error("Modal error:", err);
  }
}

// ===== FIREBASE FEATURES =====
function addToWatchlist(id, title) {
  db.ref("ourshow/watchlist/" + id).set({ title });
  alert(`✅ Added "${title}" to Watchlist`);
}

function addToWatchLater(id, title) {
  db.ref("ourshow/watchlater/" + id).set({ title });
  alert(`🕒 Added "${title}" to Watch Later`);
}

function submitReview(id, title) {
  const select = document.getElementById("review-select");
  const value = select.value;
  if (!value) return alert("Please select a rating.");
  db.ref("ourshow/reviews/" + id).push({ title, review: value, time: Date.now() });
  alert("✅ Review added!");
}

function showReviews(id) {
  const ref = db.ref("ourshow/reviews/" + id);
  ref.once("value", (snap) => {
    const reviews = snap.val();
    if (!reviews) return alert("No reviews yet!");
    const all = Object.values(reviews).map(r => `• ${r.review}`).join("\n");
    alert(`User Reviews:\n\n${all}`);
  });
}

// ===== BACK HOME =====
document.getElementById("back-home").addEventListener("click", () => showPage("page-home"));

// ===== INITIAL LOAD =====
renderHome();
showPage("page-home");
