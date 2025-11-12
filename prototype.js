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
  measurementId: "G-C8VJHYRDTQ",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const currentUser =
  JSON.parse(localStorage.getItem("ourshow_user")) ||
  { name: "Guest", email: "none", uid: "guest" };

// ===== HELPER FUNCTIONS =====
function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (m) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m])
  );
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
    </div>
  `;
}

// ===== FETCH DATA =====
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, API_OPTIONS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
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
    { id: "drama", title: "🎭 Best Dramas", endpoint: "/discover/movie?with_genres=18", type: "movie" },
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
    document.getElementById(`${s.id}-row`).innerHTML = data.map((item) => makeCard(item, s.type)).join("");
  }
}

// ===== SHOW/HIDE PAGES =====
function showPage(pageId) {
  document.querySelectorAll(".spa-page").forEach((p) => p.classList.add("hidden"));
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
    document.getElementById("search-content").innerHTML = data.length
      ? data.map((item) => makeCard(item, item.media_type || "movie")).join("")
      : `<p class="text-gray-400">No results found.</p>`;
  }
});

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

// ===== DETAIL MODAL FUNCTION =====
async function openDetailModal(id, type) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos,credits,similar`, API_OPTIONS);
    const data = await res.json();
    const title = data.title || data.name;
    const overview = data.overview || "No description available.";
    const year = (data.release_date || data.first_air_date || "").split("-")[0];
    const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
    const popularity = data.popularity ? Math.round(data.popularity) : "N/A";
    const poster = data.poster_path ? IMG_BASE + data.poster_path : "https://via.placeholder.com/300x450?text=No+Image";
    const trailer = (data.videos.results || []).find((v) => v.type === "Trailer" && v.site === "YouTube");
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";

    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">
        <img src="${poster}" class="w-full md:w-1/3 rounded-lg object-cover" alt="${esc(title)}">
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">${esc(title)}</h2>
          <p class="text-gray-300 mb-3">${esc(overview)}</p>
          <p class="text-gray-400 text-sm">Release: ${esc(year)} • ⭐ ${esc(rating)} • 🔥 ${esc(popularity)}</p>

          <div class="flex gap-3 mt-4">
            <button id="add-watchlater" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">📌 Watch Later</button>
            <button id="mark-watched" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">✅ Watched</button>
          </div>

          ${trailerUrl ? `<iframe width="100%" height="200" src="${trailerUrl}" class="rounded-md mt-4"></iframe>` : ""}
        </div>
      </div>

      <div class="mt-6 border-t border-gray-700 pt-4">
        <h3 class="text-lg font-semibold mb-2">Your Review</h3>
        <div id="review-meter" class="flex gap-2 mb-2 flex-wrap">
          ${["Bad", "One-time Watch", "Satisfactory", "Good", "Perfection"]
            .map(
              (r) =>
                `<button data-value="${r}" class="review-btn bg-gray-700 hover:bg-red-600 px-2 py-1 rounded text-sm">${r}</button>`
            )
            .join("")}
        </div>
        <textarea id="review-comment" placeholder="Write your thoughts..." class="w-full p-2 rounded bg-gray-800 text-white mb-2"></textarea>
        <button id="submit-review" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Submit Review</button>
      </div>
    `;

    modal.classList.remove("hidden");

    // ====== WATCHLIST FUNCTIONS ======
    document.getElementById("add-watchlater").addEventListener("click", () => addToList("watchlater", id, data));
    document.getElementById("mark-watched").addEventListener("click", () => addToList("watched", id, data));

    // ====== REVIEW FUNCTIONS ======
    document.getElementById("submit-review").addEventListener("click", () =>
      submitReview(id, title)
    );
  } catch (err) {
    console.error("Modal error:", err);
  }
}

// ===== FIREBASE WATCHLIST =====
function addToList(listType, id, data) {
  const userId = currentUser.uid || "guest";
  db.ref(`${listType}/${userId}/${id}`).set({
    title: data.title || data.name,
    poster: data.poster_path ? IMG_BASE + data.poster_path : "",
    timestamp: new Date().toISOString(),
  });
  alert(`Added to ${listType === "watchlater" ? "Watch Later" : "My Watchlist"} ✅`);
}

// ===== FIREBASE REVIEW =====
function submitReview(id, title) {
  const ratingBtn = document.querySelector(".review-btn.bg-red-600");
  const ratingValue = ratingBtn ? ratingBtn.dataset.value : null;
  const comment = document.getElementById("review-comment").value.trim();
  if (!ratingValue) return alert("Please select a rating first!");

  const userId = currentUser.uid || "guest";
  db.ref(`reviews/${id}/${userId}`).set({
    name: currentUser.name,
    rating: ratingValue,
    comment,
    timestamp: new Date().toISOString(),
  });
  alert("Review submitted successfully!");
}

// ===== REVIEW SELECTION LOGIC =====
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("review-btn")) {
    document.querySelectorAll(".review-btn").forEach((b) => b.classList.remove("bg-red-600"));
    e.target.classList.add("bg-red-600");
  }
});

// ===== MORE BUTTONS =====
document.body.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-more]");
  if (!btn) return;
  const sectionId = btn.dataset.more;
  const sectionMap = {
    "trending-movies": "/trending/movie/week",
    "trending-tv": "/trending/tv/week",
    "top-hindi": "/discover/movie?with_original_language=hi&sort_by=vote_average.desc",
    "best-hindi": "/discover/movie?with_original_language=hi&sort_by=popularity.desc",
    "hindi-popular": "/discover/movie?with_original_language=hi&sort_by=popularity.desc",
    "web-series": "/tv/popular",
    "upcoming-hindi": "/movie/upcoming?with_original_language=hi",
    "upcoming-hollywood": "/movie/upcoming?with_original_language=en",
    "comedy": "/discover/movie?with_genres=35",
    "action": "/discover/movie?with_genres=28",
    "drama": "/discover/movie?with_genres=18",
  };

  const endpoint = sectionMap[sectionId];
  if (!endpoint) return;

  showPage("page-all");
  document.getElementById("all-title").innerText = btn.closest("div").querySelector("h2").innerText;
  const data = await fetchData(endpoint);
  document.getElementById("all-content").innerHTML = data.map((item) => makeCard(item, "movie")).join("");
});

// ===== BACK HOME =====
document.getElementById("back-home").addEventListener("click", () => showPage("page-home"));

// ===== INITIAL LOAD =====
renderHome();
showPage("page-home");
