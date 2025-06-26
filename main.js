
alert("main.js is running");
console.log("Series Data:", seriesData);
const container = document.getElementById("watchlistContainer");
const searchInput = document.getElementById("search");
const genreFilters = document.getElementById("genreFilters");

let activeGenre = "All";

// Generate genre filter buttons
function renderFilters() {
  const genreSet = new Set();
  seriesData.forEach(s => s.genres.forEach(g => genreSet.add(g)));

  const allGenres = ["All", ...Array.from(genreSet).sort()];
  genreFilters.innerHTML = allGenres
    .map(g => `<button class="${g === "All" ? "active" : ""}" onclick="filterByGenre('${g}')">${g}</button>`)
    .join("");
}

// Handle genre filter clicks
function filterByGenre(genre) {
  activeGenre = genre;
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === genre);
  });
  renderSeries();
}

// Build each card (with image)
function createCard(s) {
  const imgSrc = s.image ? s.image : "images/placeholder.jpg";
  return `
    <div class="card">
      <img src="${imgSrc}" alt="${s.title} poster" class="poster" />
      <h3>${s.title}</h3>
      <div class="meta">${s.platform} • ${s.country}</div>
      <div class="desc">${s.description}</div>
      <div class="stars">${"⭐".repeat(s.rating)}</div>
    </div>
  `;
}

// Render all series
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

  const sortedGenres = Object.keys(genreGroups).sort();
  container.innerHTML = sortedGenres.map(genre => {
    const sortedCards = genreGroups[genre]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(createCard)
      .join("");

    return `
      <div class="genre-section">
        <h2>${genre}</h2>
        <div class="cards">${sortedCards}</div>
      </div>
    `;
  }).join("");
}

// Live search
searchInput.addEventListener("input", renderSeries);

// Init
renderFilters();
renderSeries();
