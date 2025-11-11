// prototype.js — Final version with cinematic modal (movies + TV)
// TMDB v4 token (you provided)
const TMDB_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY";
const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

// Helper: fetch with token and safe JSON
async function tmdbFetch(path) {
  try {
    const res = await fetch(`${TMDB_API_BASE}${path}`, {
      headers: { Authorization: TMDB_TOKEN, accept: "application/json" }
    });
    if (!res.ok) {
      console.error("TMDB fetch error", res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Network/Fetch error", err);
    return null;
  }
}

// Small escape
function esc(s){ return String(s || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// Card markup for grid rows
function makeCard(item, type="movie"){
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const vote = (item.vote_average != null) ? Number(item.vote_average).toFixed(1) : "N/A";
  const img = item.poster_path ? IMG_BASE + item.poster_path : "https://via.placeholder.com/300x450?text=No+Image";
  return `<div class="card min-w-[150px] cursor-pointer" data-id="${item.id}" data-type="${type}" role="button" tabindex="0">
    <img src="${img}" alt="${esc(title)}" class="rounded-lg aspect-[2/3] object-cover w-full">
    <div class="mt-1 text-sm font-medium">${esc(title)}</div>
    <div class="text-gray-400 text-xs">${esc(year)} • ⭐ ${esc(vote)}</div>
  </div>`;
}

// Render a row into a container element (by id)
function renderRow(containerId, items, type="movie"){
  const el = document.getElementById(containerId);
  if(!el) return;
  if(!items || !items.length){
    el.innerHTML = `<p class="text-gray-400 text-sm">No results found.</p>`;
    return;
  }
  el.innerHTML = items.map(i=>makeCard(i,type)).join("");
}

// SPA helpers
function showPage(id){
  document.querySelectorAll(".spa-page").forEach(p => p.classList.add("hidden"));
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");
}

// SECTION CREATOR — creates a horizontal scroll row with title and More button
function insertSection(parentId, sectionId, title){
  const parent = document.getElementById(parentId);
  if(!parent) return;
  const html = `
    <div id="${sectionId}-wrap">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-semibold">${esc(title)}</h2>
        <button class="text-red-500 hover:underline" data-more="${sectionId}">More ›</button>
      </div>
      <div id="${sectionId}" class="flex gap-3 overflow-x-auto pb-2"></div>
    </div>`;
  parent.insertAdjacentHTML("beforeend", html);
}

// Open all-results page for a given endpoint
async function openMore(sectionId, endpoint, type="movie", title="Results"){
  showPage("page-all");
  const allTitle = document.getElementById("all-title");
  const allContent = document.getElementById("all-content");
  allTitle.textContent = title;
  allContent.innerHTML = `<p class="text-gray-400">Loading...</p>`;
  const json = await tmdbFetch(endpoint + (endpoint.includes("?") ? "&language=en-US&page=1": "?language=en-US&page=1"));
  const results = json && json.results ? json.results : [];
  if(!results.length){
    allContent.innerHTML = `<p class="text-gray-400">No results found.</p>`;
  } else {
    allContent.innerHTML = results.map(i=>makeCard(i,type)).join("");
  }
}

// Modal: cinematic layout builder for both movie & tv
async function openDetailModal(id, type="movie"){
  const modal = document.getElementById("detail-modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `<div class="p-6 text-center text-gray-400">Loading details...</div>`;
  modal.classList.remove("hidden");

  // fetch full details including videos, credits, similar
  const data = await tmdbFetch(`/${type}/${id}?append_to_response=videos,credits,similar&language=en-US`);
  if(!data){
    modalContent.innerHTML = `<div class="p-6 text-red-400">Failed to load details.</div>`;
    return;
  }

  // basics
  const title = data.title || data.name || "Untitled";
  const tagline = data.tagline || "";
  const year = (data.release_date || data.first_air_date || "").split("-")[0] || "N/A";
  const popularity = data.popularity != null ? Number(data.popularity).toFixed(1) : "N/A";
  const rating = data.vote_average != null ? Number(data.vote_average).toFixed(1) : "N/A";
  const overview = data.overview || "No description available.";
  const backdrop = data.backdrop_path ? BACKDROP_BASE + data.backdrop_path : (data.poster_path ? IMG_BASE + data.poster_path : "");
  const genres = (data.genres || []).map(g => g.name);
  const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]) || null;
  const status = data.status || (data.in_production ? "In Production" : "");
  const languages = (data.spoken_languages || data.languages || []).map(l => l.english_name || l.name || l.iso_639_1);

  // trailer: prefer YouTube trailer
  let trailerUrl = null;
  if(data.videos && data.videos.results && data.videos.results.length){
    const yt = data.videos.results.find(v => v.site === "YouTube" && v.type.toLowerCase().includes("trail"));
    const any = yt || data.videos.results.find(v => v.site === "YouTube");
    if(any) trailerUrl = `https://www.youtube.com/embed/${any.key}`;
  }

  // top cast
  const cast = (data.credits && data.credits.cast) ? data.credits.cast.slice(0,6) : [];

  // similar
  const similar = (data.similar && data.similar.results) ? data.similar.results.slice(0,8) : [];

  // build modal HTML
  modalContent.innerHTML = `
    <div class="relative text-white">
      <div class="w-full h-64 md:h-72 bg-black/30" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.85)), url('${esc(backdrop)}'); background-size: cover; background-position: center;">
        <button id="modal-close-btn" class="absolute top-4 right-4 text-2xl text-white/90 hover:text-red-500">✖</button>
        <div class="flex flex-col md:flex-row items-start gap-4 p-6 md:pl-10">
          <img src="${data.poster_path ? (IMG_BASE + data.poster_path) : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${esc(title)}" class="w-36 md:w-48 rounded-lg shadow-lg">
          <div class="flex-1">
            <h1 class="text-2xl md:text-3xl font-bold">${esc(title)} <span class="text-gray-300 text-sm">(${esc(year)})</span></h1>
            ${tagline ? `<p class="text-gray-300 italic">${esc(tagline)}</p>` : ""}
            <div class="mt-2 flex flex-wrap gap-2 items-center">
              <span class="px-2 py-1 rounded bg-white/10 text-sm">⭐ ${esc(rating)}</span>
              <span class="px-2 py-1 rounded bg-white/10 text-sm">Popularity: ${esc(popularity)}</span>
              ${runtime ? `<span class="px-2 py-1 rounded bg-white/10 text-sm">${esc(runtime)} min</span>` : ""}
              ${status ? `<span class="px-2 py-1 rounded bg-white/10 text-sm">${esc(status)}</span>` : ""}
              ${languages.length ? `<span class="px-2 py-1 rounded bg-white/10 text-sm">${esc(languages.join(", "))}</span>` : ""}
            </div>
            <div class="mt-3 text-sm text-gray-200">${esc(overview)}</div>
            <div class="mt-4 flex gap-2">
              ${trailerUrl ? `<a class="inline-block px-4 py-2 bg-red-600 rounded hover:bg-red-700" href="${trailerUrl}" target="_blank" rel="noopener">Watch Trailer</a>` : ""}
              <button id="open-similar" class="inline-block px-4 py-2 bg-white/10 rounded hover:bg-white/20">Similar Titles</button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Top Cast</h3>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
          ${cast.map(c => `
            <div class="text-center">
              <img src="${c.profile_path ? (IMG_BASE + c.profile_path) : 'https://via.placeholder.com/200x300?text=No+Photo'}" alt="${esc(c.name)}" class="w-full rounded-lg object-cover h-36">
              <div class="mt-1 text-sm font-medium">${esc(c.name)}</div>
              <div class="text-xs text-gray-400">${esc(c.character || '')}</div>
            </div>`).join("")}
        </div>

        <h3 class="text-lg font-semibold mt-6 mb-2">Similar Titles</h3>
        <div id="similar-row" class="flex gap-3 overflow-x-auto pb-2">
          ${similar.length ? similar.map(s => `
            <div class="similar-card cursor-pointer min-w-[120px]" data-id="${s.id}" data-type="${s.media_type || (s.title ? 'movie' : 'tv')}">
              <img src="${s.poster_path ? (IMG_BASE + s.poster_path) : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${esc(s.title || s.name)}" class="rounded-lg w-full h-40 object-cover">
              <div class="mt-1 text-xs">${esc(s.title || s.name)}</div>
            </div>`).join("") : `<p class="text-gray-400">No similar titles found.</p>`}
        </div>
      </div>
    </div>
  `;

  // close handlers (new elements created)
  document.getElementById("modal-close-btn")?.addEventListener("click", () => modal.classList.add("hidden"));
  // also ensure top close button exists
  document.getElementById("close-modal")?.addEventListener("click", () => modal.classList.add("hidden"));

  // clicking similar opens new detail (delegate)
  document.getElementById("similar-row")?.addEventListener("click", e => {
    const card = e.target.closest(".similar-card");
    if(card){
      const nid = card.dataset.id;
      const ntype = card.dataset.type || "movie";
      // open new details — replace content
      openDetailModal(nid, ntype);
      // scroll to top of modal (optional)
      modal.scrollTop = 0;
    }
  });
}

// Close modal by overlay and ESC
(function setupModalClose(){
  const modal = document.getElementById("detail-modal");
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.classList.add("hidden"); });
  window.addEventListener("keydown", (e) => { if(e.key === "Escape") modal.classList.add("hidden"); });
})();

// Click on cards to open modal (delegated)
document.body.addEventListener("click", (e) => {
  if(e.target.closest("#detail-modal")) return; // ignore clicks inside modal
  const card = e.target.closest("[data-id]");
  if(!card) return;
  const id = card.dataset.id;
  const type = card.dataset.type || "movie";
  if(id) openDetailModal(id, type);
});

// SEARCH
const searchInput = document.getElementById("search-input");
const searchContent = document.getElementById("search-content");
const pageSearch = document.getElementById("page-search");
const pageHome = document.getElementById("page-home");
const pageAll = document.getElementById("page-all");

let searchTimeout = null;
if(searchInput){
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if(!q){ pageSearch.classList.add("hidden"); pageHome.classList.remove("hidden"); return; }
      runSearch(q);
    }, 400);
  });
}

async function runSearch(q){
  pageHome.classList.add("hidden");
  pageAll.classList.add("hidden");
  pageSearch.classList.remove("hidden");
  searchContent.innerHTML = `<p class="text-gray-400">Searching...</p>`;

  const movies = await tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&language=en-US`);
  const tv = await tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&language=en-US`);
  const movieResults = movies && movies.results ? movies.results : [];
  const tvResults = tv && tv.results ? tv.results : [];
  const combined = [...movieResults.map(i=>({...i, _type:'movie'})), ...tvResults.map(i=>({...i, _type:'tv'}))];
  if(!combined.length) searchContent.innerHTML = `<p class="text-gray-400">No results found.</p>`;
  else searchContent.innerHTML = combined.map(i => makeCard(i, i._type || 'movie')).join("");
}

// MORE buttons (delegated)
document.body.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-more]");
  if(!btn) return;
  const section = btn.dataset.more;
  // map section id to endpoint and title/type
  const map = {
    "trending-movies": { ep: "/trending/movie/week", title: "Trending Movies", type:"movie" },
    "trending-tv": { ep: "/trending/tv/week", title: "Trending TV Shows", type:"tv" },
    "top-hindi": { ep: "/discover/movie?with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=50", title: "Top Hindi Movies", type:"movie" },
    "best-hindi": { ep: "/discover/movie?with_original_language=hi&sort_by=popularity.desc", title: "Best Hindi Movies", type:"movie" },
    "hindi-now": { ep: "/movie/popular?region=IN", title: "Hindi Movies Popular Now", type:"movie" },
    "best-webseries": { ep: "/tv/top_rated", title: "Best Web Series", type:"tv" },
    "upcoming-hindi": { ep: "/movie/upcoming?region=IN", title: "Upcoming Hindi Movies", type:"movie" },
    "upcoming-hollywood": { ep: "/movie/upcoming?region=US", title: "Upcoming Hollywood Movies", type:"movie" },
    "best-comedy": { ep: "/discover/movie?with_genres=35&sort_by=popularity.desc", title: "Best Comedy Movies", type:"movie" },
    "best-action": { ep: "/discover/movie?with_genres=28&sort_by=popularity.desc", title: "Best Action Movies", type:"movie" },
    "best-dramas": { ep: "/discover/movie?with_genres=18&sort_by=vote_average.desc", title: "Best Dramas", type:"movie" }
  };
  const cfg = map[section];
  if(cfg) openMore(section, cfg.ep, cfg.type, cfg.title);
});

// Back to home
document.getElementById("back-home")?.addEventListener("click", () => {
  showPage("page-home");
});

// INITIAL LOAD: insert requested sections in order and fetch top items
(async function init(){
  // ensure page-home cleared
  const ph = document.getElementById("page-home");
  ph.innerHTML = '';

  // sections in required order:
  const sections = [
    { id:"trending-movies", title:"Trending Movies", ep:"/trending/movie/week", type:"movie" },
    { id:"trending-tv", title:"Trending TV Shows", ep:"/trending/tv/week", type:"tv" },
    { id:"top-hindi", title:"Top Hindi Movies", ep:"/discover/movie?with_original_language=hi&sort_by=vote_average.desc&vote_count.gte=50", type:"movie" },
    { id:"best-hindi", title:"Best Hindi Movies", ep:"/discover/movie?with_original_language=hi&sort_by=popularity.desc", type:"movie" },
    { id:"hindi-now", title:"Hindi Movies Popular Now", ep:"/movie/popular?region=IN", type:"movie" },
    { id:"best-webseries", title:"Best Web Series", ep:"/tv/top_rated", type:"tv" },
    { id:"upcoming-hindi", title:"Upcoming Hindi Movies", ep:"/movie/upcoming?region=IN", type:"movie" },
    { id:"upcoming-hollywood", title:"Upcoming Hollywood Movies", ep:"/movie/upcoming?region=US", type:"movie" },
    { id:"best-comedy", title:"Best Comedy Movies", ep:"/discover/movie?with_genres=35&sort_by=popularity.desc", type:"movie" },
    { id:"best-action", title:"Best Action Movies", ep:"/discover/movie?with_genres=28&sort_by=popularity.desc", type:"movie" },
    { id:"best-dramas", title:"Best Dramas", ep:"/discover/movie?with_genres=18&sort_by=vote_average.desc", type:"movie" }
  ];

  for(const s of sections){
    insertSection("page-home", s.id, s.title);
    // fetch top items and render (limit to 10)
    const json = await tmdbFetch(s.ep + (s.ep.includes("?") ? "&language=en-US&page=1" : "?language=en-US&page=1"));
    const items = json && json.results ? json.results.slice(0,10) : [];
    renderRow(s.id, items, s.type);
    // small delay to avoid bursts (optional)
    await new Promise(r => setTimeout(r, 120));
  }

  // Initially show home
  showPage("page-home");
})();
