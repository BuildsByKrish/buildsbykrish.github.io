// ===== TMDB CONFIG =====
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY",
  },
};

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.appspot.com",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// simulate user ID (in your real project, use firebase.auth().currentUser.uid)
const userId = localStorage.getItem("userId") || "guest_user";

// ===== HELPERS =====
function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]
  ));
}

function makeCard(item, type = "movie") {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "N/A").split("-")[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const popularity = item.popularity ? Math.round(item.popularity) : "N/A";
  const img = item.poster_path
    ? IMG_BASE + item.poster_path
    : "https://via.placeholder.com/300x450?text=No+Image";

  return `
    <div class="cursor-pointer min-w-[150px]" data-id="${item.id}" data-type="${type}">
      <img src="${img}" class="rounded-lg aspect-[2/3] object-cover hover:opacity-80 transition" alt="${esc(title)}">
      <h3 class="mt-1 text-sm font-medium">${esc(title)}</h3>
      <p class="text-gray-400 text-xs">${esc(year)} • ⭐ ${esc(rating)} • 🔥 ${esc(popularity)}</p>
    </div>`;
}

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, API_OPTIONS);
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

// ===== HOME SECTIONS =====
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
  ];

  const container = document.getElementById("sections-container");
  container.innerHTML = "";
  for (const s of sections) {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">${s.title}</h2>
          <button class="text-red-500 hover:underline" data-more="${s.id}">More ›</button>
        </div>
        <div id="${s.id}-row" class="flex overflow-x-auto space-x-3 pb-2"></div>
      </div>`
    );
    const data = await fetchData(s.endpoint);
    document.getElementById(`${s.id}-row`).innerHTML = data.map((i) => makeCard(i, s.type)).join("");
  }
}

// ===== MODAL =====
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
document.getElementById("close-modal").addEventListener("click", () => modal.classList.add("hidden"));

document.body.addEventListener("click", async (e) => {
  const card = e.target.closest("[data-id]");
  if (!card) return;
  const id = card.dataset.id;
  const type = card.dataset.type || "movie";
  await openDetailModal(id, type);
});

async function openDetailModal(id, type) {
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos,credits`, API_OPTIONS);
  const data = await res.json();
  const title = data.title || data.name;
  const poster = data.poster_path ? IMG_BASE + data.poster_path : "https://via.placeholder.com/300x450?text=No+Image";
  const year = (data.release_date || data.first_air_date || "N/A").split("-")[0];
  const rating = data.vote_average?.toFixed(1) || "N/A";
  const popularity = Math.round(data.popularity) || "N/A";
  const overview = data.overview || "No description available.";

  modalContent.innerHTML = `
    <div class="flex flex-col md:flex-row gap-4">
      <img src="${poster}" class="w-full md:w-1/3 rounded-lg object-cover">
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-2">${esc(title)}</h2>
        <p class="text-gray-400 text-sm mb-2">Year: ${year} • ⭐ ${rating} • 🔥 ${popularity}</p>
        <p class="text-gray-300 mb-3">${esc(overview)}</p>

        <div class="flex gap-3">
          <button id="btn-watchlater" class="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded">⏳ Add to Watch Later</button>
          <button id="btn-watched" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">✅ Mark as Watched</button>
        </div>
      </div>
    </div>`;

  modal.classList.remove("hidden");

  document.getElementById("btn-watchlater").onclick = () => saveToList("watchlater", data);
  document.getElementById("btn-watched").onclick = () => saveToList("watchlist", data);
}

// ===== SAVE TO FIREBASE =====
function saveToList(listType, item) {
  const itemData = {
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path ? IMG_BASE + item.poster_path : "",
    rating: item.vote_average?.toFixed(1) || "N/A",
    popularity: Math.round(item.popularity) || "N/A",
    timestamp: Date.now(),
  };
  firebase.database().ref(`${listType}/${userId}/${item.id}`).set(itemData);
  alert(`✅ Added to ${listType === "watchlater" ? "Watch Later" : "Watchlist"}!`);
}

// ===== INIT =====
renderHome();
