// ===== TMDB CONFIG =====
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY"
  }
};

// ===== HELPER FUNCTIONS =====
function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function makeCard(item, type = "movie") {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "N/A").split("-")[0];
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const popularity = item.popularity ? Math.round(item.popularity) : "N/A";
  const img = item.poster_path ? IMG_BASE + item.poster_path : "https://via.placeholder.com/300x450?text=No+Image";

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

// ===== RENDER HOME SECTIONS =====
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

// ===== SHOW/HIDE PAGES =====
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

// ===== DETAIL MODAL =====
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
document.getElementById("close-modal").addEventListener("click", () => modal.classList.add("hidden"));

// open modal
document.body.addEventListener("click", async (e) => {
  const card = e.target.closest("[data-id]");
  if (!card) return;
  const id = card.dataset.id;
  const type = card.dataset.type || "movie";
  await openDetailModal(id, type);
});

async function openDetailModal(id, type) {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos,credits,similar`, API_OPTIONS);
    const data = await res.json();
    const title = data.title || data.name;
    const tagline = data.tagline;
    const overview = data.overview || "No description available.";
    const year = (data.release_date || data.first_air_date || "").split("-")[0];
    const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
    const popularity = data.popularity ? Math.round(data.popularity) : "N/A";
    const runtime = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : "N/A");
    const genres = (data.genres || []).map(g => g.name);
    const languages = (data.spoken_languages || []).map(l => l.english_name);
    const status = data.status || "";
    const poster = data.poster_path ? IMG_BASE + data.poster_path : "";
    const trailer = (data.videos.results || []).find(v => v.type === "Trailer" && v.site === "YouTube");
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
    const cast = (data.credits.cast || []).slice(0, 6);
    const similar = (data.similar.results || []).slice(0, 10);

    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">
        <img src="${poster || "https://via.placeholder.com/300x450?text=No+Image"}" 
             class="w-full md:w-1/3 rounded-lg object-cover" 
             alt="${esc(title)}">

        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">${esc(title)}</h2>
          ${tagline ? `<p class="italic text-gray-400 mb-2">"${esc(tagline)}"</p>` : ""}
          <p class="text-gray-300 leading-relaxed mb-3">${esc(overview)}</p>

          <div class="mt-2 text-sm text-gray-400 space-y-1">
            <p><strong>Release Year:</strong> ${esc(year)}</p>
            <p><strong>IMDb:</strong> ⭐ ${esc(rating)}</p>
            <p><strong>Popularity:</strong> 🔥 ${esc(popularity)}</p>
            <p><strong>Runtime:</strong> ${esc(runtime)} min</p>
            <p><strong>Status:</strong> ${esc(status)}</p>
            ${genres.length ? `<p><strong>Genres:</strong> ${genres.join(", ")}</p>` : ""}
            ${languages.length ? `<p><strong>Languages:</strong> ${languages.join(", ")}</p>` : ""}
          </div>

          ${trailerUrl ? `
            <div class="mt-4">
              <iframe width="100%" height="200" src="${trailerUrl}" frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen class="rounded-md"></iframe>
            </div>` : ""}
        </div>
      </div>

      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Top Cast</h3>
        <div class="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
          ${cast.length ? cast.map(c => `
            <div class="flex flex-col items-center w-20">
              <img src="${c.profile_path ? IMG_BASE + c.profile_path : "https://via.placeholder.com/200x300?text=No+Photo"}"
                   class="rounded-full w-16 h-16 object-cover" alt="${esc(c.name)}">
              <p class="text-xs text-center mt-1">${esc(c.name)}</p>
            </div>`).join("") : `<p class="text-gray-400 text-sm">No cast information available.</p>`}
        </div>

        <h3 class="text-lg font-semibold mt-6 mb-2">Similar Titles</h3>
        <div id="similar-row" class="flex gap-3 overflow-x-auto pb-2">
          ${similar.length ? similar.map(s => `
            <div class="cursor-pointer min-w-[120px]" data-id="${s.id}" data-type="${s.media_type || (s.title ? 'movie' : 'tv')}">
              <img src="${s.poster_path ? IMG_BASE + s.poster_path : 'https://via.placeholder.com/200x300?text=No+Image'}" 
                   class="rounded-lg w-full h-40 object-cover" alt="${esc(s.title || s.name)}">
              <div class="mt-1 text-xs">${esc(s.title || s.name)}</div>
            </div>`).join("") : `<p class="text-gray-400">No similar titles found.</p>`}
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  } catch (err) {
    console.error("Modal error:", err);
  }
}

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
    "drama": "/discover/movie?with_genres=18"
  };

  const endpoint = sectionMap[sectionId];
  if (!endpoint) return;

  showPage("page-all");
  document.getElementById("all-title").innerText = btn.closest("div").querySelector("h2").innerText;
  const data = await fetchData(endpoint);
  document.getElementById("all-content").innerHTML = data.map(item => makeCard(item, "movie")).join("");
});

// ===== BACK HOME =====
document.getElementById("back-home").addEventListener("click", () => showPage("page-home"));

// ===== INITIAL LOAD =====
renderHome();
showPage("page-home");
