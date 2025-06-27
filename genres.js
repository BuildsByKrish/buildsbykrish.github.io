const container = document.getElementById("watchlistContainer");
const searchInput = document.getElementById("search");
const genreFilters = document.getElementById("genreFilters");
let activeGenre = "All";
const watchedSet = new Set(JSON.parse(localStorage.getItem("watchedShows") || "[]"));

function saveWatched() {
  localStorage.setItem("watchedShows", JSON.stringify(Array.from(watchedSet)));
}

function renderFilters() {
  const genreSet = new Set();
  seriesData.forEach(s => s.genres.forEach(g => genreSet.add(g)));
  const allGenres = ["All", ...Array.from(genreSet).sort()];
  genreFilters.innerHTML = allGenres
    .map(g => `<button class="${g === "All" ? "active" : ""}" onclick="filterByGenre('${g}')">${g}</button>`)
    .join("");
}

function filterByGenre(genre) {
  activeGenre = genre;
  document.querySelectorAll(".filters button").forEach(btn =>
    btn.classList.toggle("active", btn.textContent === genre)
  );
  renderSeries();
}

function createCard(s) {
  const imgSrc = s.image || "images/placeholder.jpg";
  const isWatched = watchedSet.has(s.title);
  return `
    <div class="card ${isWatched ? 'watched' : ''}">
      <img src="${imgSrc}" alt="${s.title} poster" class="poster" />
      <h3>${s.title}</h3>
      <div class="meta">${s.platform} • ${s.country}</div>
      <div class="desc">${s.description}</div>
      <div class="stars">${"⭐".repeat(s.rating)}</div>
      <label class="watch-toggle">
        <input type="checkbox" ${isWatched ? "checked" : ""} onchange="toggleWatched('${s.title}', this.checked)">
        Watched
      </label>
    </div>
  `;
}

function toggleWatched(title, checked) {
  checked ? watchedSet.add(title) : watchedSet.delete(title);
  saveWatched();
  renderSeries();
}

function renderSeries() {
  const query = searchInput.value.toLowerCase();
  const genreGroups = {};

  seriesData.forEach(s => {
    const matchesGenre = activeGenre === "All" || s.genres.includes(activeGenre);
    const matchesSearch = s.title.toLowerCase().includes(query);
    if (matchesGenre && matchesSearch) {
      s.genres.forEach(g => {
        if (!genreGroups[g]) genreGroups[g] = [];
        genreGroups[g].push(s);
      });
    }
  });

  container.innerHTML = Object.keys(genreGroups).sort().map(genre => `
    <div class="genre-section">
      <h2>${genre}</h2>
      <div class="cards">${genreGroups[genre].map(createCard).join("")}</div>
    </div>
  `).join("");
}

searchInput.addEventListener("input", renderSeries);
renderFilters();
renderSeries();