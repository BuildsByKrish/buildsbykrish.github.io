// ===== TMDB CONFIG =====
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTc1YzQ4MzJjZDQwY2YyYmY3NTMwN2ZkNGFiZTczNiIsIm5iZiI6MTc2MTk2MDQzNC42MzIsInN1YiI6IjY5MDU2MWYyNGQ0ZDdkYzlhYTU5N2IwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pj6KWB1P8WQZ-GmMIrhjK8Jb5yo_sbLuGIjFTuRC-aY"
  }
};

// ===== ELEMENTS =====
const pageHome = document.getElementById("page-home");
const pageAll = document.getElementById("page-all");
const allTitle = document.getElementById("all-title");
const allContent = document.getElementById("all-content");
const searchContent = document.getElementById("search-content");
const searchInput = document.getElementById("search-input");
const pageSearch = document.getElementById("page-search");
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");
const backHomeBtn = document.getElementById("back-home");

// ===== FETCH FUNCTION =====
async function fetchData(endpoint) {
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, API_OPTIONS);
  const data = await res.json();
  return data.results || [];
}

// ===== CARD GENERATOR =====
function makeCard(item, type = "movie") {
  const imgSrc = item.poster_path ? TMDB_IMG_URL + item.poster_path : "https://via.placeholder.com/300x450?text=No+Image";
  const title = item.title || item.name;
  return `
    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
         onclick="openDetail(${item.id}, '${type}')">
      <img src="${imgSrc}" alt="${title}" class="w-full h-64 object-cover">
      <div class="p-2 text-center text-sm">${title}</div>
    </div>
  `;
}

// ===== SECTION CREATOR =====
async function createSection(title, endpoint, type = "movie") {
  const items = await fetchData(endpoint);
  const visibleItems = items.slice(0, 10);
  const section = document.createElement("div");
  section.className = "space-y-2";
  section.innerHTML = `
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">${title}</h2>
      <button class="text-red-500 hover:underline" onclick="showAll('${title}', '${endpoint}', '${type}')">More ›</button>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">${visibleItems.map(i => makeCard(i, type)).join("")}</div>
  `;
  pageHome.appendChild(section);
}

// ===== SHOW ALL PAGE =====
async function showAll(title, endpoint, type) {
  pageHome.classList.add("hidden");
  pageSearch.classList.add("hidden");
  pageAll.classList.remove("hidden");
  allTitle.textContent = title;
  const items = await fetchData(endpoint);
  allContent.innerHTML = items.length
    ? items.map(i => makeCard(i, type)).join("")
    : `<p class='text-gray-400'>No results found.</p>`;
}

backHomeBtn.addEventListener("click", () => {
  pageAll.classList.add("hidden");
  pageHome.classList.remove("hidden");
});

// ===== DETAIL MODAL =====
async function openDetail(id, type) {
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos`, API_OPTIONS);
  const item = await res.json();
  const img = item.backdrop_path ? TMDB_BACKDROP_URL + item.backdrop_path : TMDB_IMG_URL + item.poster_path;
  const title = item.title || item.name;
  const desc = item.overview || "No description available.";
  const video = item.videos.results.find(v => v.site === "YouTube" && v.type === "Trailer");
  const trailer = video ? `https://www.youtube.com/embed/${video.key}` : null;

  modalContent.innerHTML = `
    <img src="${img}" class="w-full h-64 object-cover rounded-t-lg">
    <div class="p-4 space-y-2">
      <h2 class="text-2xl font-bold">${title}</h2>
      <p class="text-sm text-gray-300">${desc}</p>
      ${trailer ? `<iframe width="100%" height="315" src="${trailer}" class="rounded-lg mt-2"></iframe>` : ""}
    </div>
  `;
  modal.classList.remove("hidden");
}
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

// ===== SEARCH =====
searchInput.addEventListener("input", async e => {
  const query = e.target.value.trim();
  if (!query) {
    pageSearch.classList.add("hidden");
    pageHome.classList.remove("hidden");
    return;
  }
  pageHome.classList.add("hidden");
  pageAll.classList.add("hidden");
  pageSearch.classList.remove("hidden");

  const movieResults = await fetchData(`/search/movie?query=${query}`);
  const tvResults = await fetchData(`/search/tv?query=${query}`);
  const results = [...movieResults, ...tvResults];
  searchContent.innerHTML = results.length
    ? results.map(i => makeCard(i, i.title ? "movie" : "tv")).join("")
    : `<p class='text-gray-400'>No results found.</p>`;
});

// ===== HOME PAGE LOAD =====
(async function loadHome() {
  await createSection("Trending Movies", "/trending/movie/week", "movie");
  await createSection("Trending TV Shows", "/trending/tv/week", "tv");
  await createSection("Top Hindi Movies", "/discover/movie?with_original_language=hi&sort_by=vote_average.desc", "movie");
  await createSection("Best Hindi Movies", "/discover/movie?with_original_language=hi&sort_by=popularity.desc", "movie");
  await createSection("Hindi Movies Popular Now", "/movie/popular?region=IN", "movie");
  await createSection("Best Web Series", "/tv/top_rated", "tv");
  await createSection("Upcoming Hindi Movies", "/movie/upcoming?region=IN", "movie");
  await createSection("Upcoming Hollywood Movies", "/movie/upcoming?region=US", "movie");
  await createSection("Best Comedy Movies", "/discover/movie?with_genres=35&sort_by=popularity.desc", "movie");
  await createSection("Best Action Movies", "/discover/movie?with_genres=28&sort_by=popularity.desc", "movie");
  await createSection("Best Dramas", "/discover/movie?with_genres=18&sort_by=vote_average.desc", "movie");
})();
