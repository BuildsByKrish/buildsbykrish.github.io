const container = document.getElementById("watchlistContainer");
const searchInput = document.getElementById("search");
const genreFilters = document.getElementById("genreFilters");

let activeGenre = "All";

// 🧠 Load watched shows from localStorage
const watchedSet = new Set(JSON.parse(localStorage.getItem("watchedShows") || "[]"));

function saveWatched() {
  localStorage.setItem("watchedShows", JSON.stringify(Array.from(watchedSet)));
}

// Render genre filters
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

// 🔎 Live search
searchInput.addEventListener("input", renderSeries);

// 📝 Suggestion form
document.getElementById("suggestForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("suggestTitle").value.trim();
  const genre = document.getElementById("suggestGenre").value.trim();
  const by = document.getElementById("suggestBy").value.trim();

  const suggestion = {
    title,
    genre,
    suggestedBy: by || "Anonymous",
    timestamp: new Date().toISOString()
  };

  const prev = JSON.parse(localStorage.getItem("suggestions") || "[]");
  prev.push(suggestion);
  localStorage.setItem("suggestions", JSON.stringify(prev));

  document.getElementById("suggestForm").reset();
  document.getElementById("suggestionSuccess").style.display = "block";
  setTimeout(() => {
    document.getElementById("suggestionSuccess").style.display = "none";
  }, 3000);
});

// 💬 Render suggestions
function renderSuggestions() {
  const list = document.getElementById("suggestionList");
  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");

  list.innerHTML = suggestions.map(s => `
    <li><strong>${s.title}</strong> (${s.genre}) — suggested by ${s.suggestedBy}</li>
  `).reverse().join("");
}

function scrollToSuggestion() {
  document.querySelector(".suggestion-box").scrollIntoView({ behavior: "smooth" });
}

// 🚀 Init
renderFilters();
renderSeries();
renderSuggestions();
function exportSuggestions() {
  const data = localStorage.getItem("suggestions") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
  if (!suggestions.length) {
    alert("No suggestions to export!");
    return;
  }

  const header = "Title,Genre,Suggested By,Timestamp\n";
  const rows = suggestions.map(s =>
    `"${s.title}","${s.genre}","${s.suggestedBy}","${s.timestamp}"`
  ).join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportSuggestions() {
  const data = localStorage.getItem("suggestions") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
  if (!suggestions.length) {
    alert("No suggestions to export!");
    return;
  }

  const header = "Title,Genre,Suggested By,Timestamp\n";
  const rows = suggestions.map(s =>
    `"${s.title}","${s.genre}","${s.suggestedBy}","${s.timestamp}"`
  ).join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.csv";
  a.click();
  URL.revokeObjectURL(url);
}