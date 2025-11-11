// ================= CONFIG =================
const TMDB_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY";
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

// ================= HELPERS =================
async function fetchTMDB(endpoint) {
  try {
    const res = await fetch(`${TMDB_API_BASE}${endpoint}`, {
      headers: { Authorization: TMDB_TOKEN },
    });
    if (!res.ok) {
      console.error("TMDB API error", res.status, await res.text());
      return { results: [] };
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error", err);
    return { results: [] };
  }
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

// ================= CARD & RENDER =================
function makeCard(item, type) {
  const title = item.title || item.name || "Unknown";
  const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const vote = (typeof item.vote_average === 'number') ? item.vote_average.toFixed(1) : (item.vote_average ? item.vote_average : "N/A");
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
  if (!data || !Array.isArray(data.results) || data.results.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm">No results found.</p>`;
    return;
  }
  container.innerHTML = data.results.map(item => makeCard(item, type)).join('');
}

// ================= SPA NAV =================
function showPage(pageId) {
  document.querySelectorAll(".spa-page").forEach(p => p.classList.add("hidden"));
  const el = document.getElementById(pageId);
  if (el) el.classList.remove("hidden");
}

// ================= SEARCH =================
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

// ================= MODAL =================
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");

document.getElementById("close-modal")?.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target && e.target.id === "detail-modal") modal.classList.add("hidden");
});
document.body.addEventListener("click", e => {
  if (e.target.closest("#detail-modal")) return;
  const card = e.target.closest("[data-id]");
  if (!card) return;
  const id = card.dataset.id;
  const type = card.dataset.type || "movie";
  fetchDetailsAndShowModal(id, type);
});

async function fetchDetailsAndShowModal(id, type) {
  if (!id) return;
  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  const title = data.title || data.name || "Untitled";
  const date = data.release_date || data.first_air_date || "Unknown";
  const genres = (data.genres || []).map(g => g.name).join(", ") || "N/A";
  const runtime = data.runtime || data.episode_run_time?.[0] || "N/A";
  const languages = (data.spoken_languages || data.languages || []).map(l => l.english_name || l.name || l.iso_639_1).join(", ") || "N/A";
  const status = data.status || "N/A";
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
      </div>
    </div>`;
  modal.classList.remove("hidden");
}

// ================= MORE BUTTONS =================
document.body.addEventListener("click", async e => {
  const btn = e.target.closest("[data-more]");
  if (!btn) return;
  const section = btn.dataset.more;
  showPage("page-all");

  let endpoint = "", title = "", type = "movie";
  switch (section) {
    case "trending": endpoint = "/trending/all/week"; title = "🔥 Trending This Week"; break;
    case "popular-movies": endpoint = "/movie/popular"; title = "🎬 Popular Movies"; break;

    // Hindi sections
    case "hindi-top": endpoint = "/discover/movie?with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=50"; title = "🎥 Top Hindi Movies"; break;
    case "hindi-best": endpoint = "/discover/movie?with_original_language=hi&sort_by=popularity.desc"; title = "🇮🇳 Best Hindi Movies"; break;
    case "hindi-now": endpoint = "/discover/movie?with_original_language=hi&sort_by=release_date.desc"; title = "🔥 Hindi Movies Popular Now"; break;

    case "top-movies": endpoint = "/movie/top_rated"; title = "⭐ Top Rated Movies"; break;
    case "upcoming": endpoint = "/movie/upcoming"; title = "🕒 Upcoming Movies"; break;
    case "popular-tv": endpoint = "/tv/popular"; title = "📺 Popular TV Shows"; type = "tv"; break;
    case "top-tv": endpoint = "/tv/top_rated"; title = "🏆 Top Rated TV Shows"; type = "tv"; break;
    default: endpoint = "/movie/popular"; title = "🎬 Movies";
  }

  const data = await fetchTMDB(`${endpoint}&language=en-US&page=1`);
  document.getElementById("all-title").innerText = title;
  document.getElementById("all-content").innerHTML = (data.results || []).map(item => makeCard(item, type)).join("");
});

document.getElementById("back-home")?.addEventListener("click", () => showPage("page-home"));

// ================= INIT =================
async function init() {
  showPage("page-home");

  const sections = [
    { id: "trending", title: "🔥 Trending This Week", endpoint: "/trending/all/week", type: "movie" },
    { id: "popular-movies", title: "🎬 Popular Movies", endpoint: "/movie/popular", type: "movie" },

    // Hindi 3 sections (3rd–5th rows)
    { id: "hindi-top", title: "🎥 Top Hindi Movies", endpoint: "/discover/movie?with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=50", type: "movie" },
    { id: "hindi-best", title: "🇮🇳 Best Hindi Movies", endpoint: "/discover/movie?with_original_language=hi&sort_by=popularity.desc", type: "movie" },
    { id: "hindi-now", title: "🔥 Hindi Movies Popular Now", endpoint: "/discover/movie?with_original_language=hi&sort_by=release_date.desc", type: "movie" },

    { id: "top-movies", title: "⭐ Top Rated Movies", endpoint: "/movie/top_rated", type: "movie" },
    { id: "upcoming", title: "🕒 Upcoming Movies", endpoint: "/movie/upcoming", type: "movie" },
    { id: "popular-tv", title: "📺 Popular TV Shows", endpoint: "/tv/popular", type: "tv" },
    { id: "top-tv", title: "🏆 Top Rated TV Shows", endpoint: "/tv/top_rated", type: "tv" },
  ];

  const container = document.getElementById("page-home");
  if (!container) return;

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
    const data = await fetchTMDB(`${s.endpoint}&language=en-US`);
    renderRow(`${s.id}-row`, data, s.type);
  }
}

init();
