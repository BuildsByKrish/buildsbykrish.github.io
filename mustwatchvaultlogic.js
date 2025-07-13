const container = document.getElementById("vaultContainer");
const carousel = document.getElementById("topCarousel");
const genreFilter = document.getElementById("genreFilter");
const platformFilter = document.getElementById("platformFilter");
const imdbFilter = document.getElementById("imdbFilter");
const hindiToggle = document.getElementById("hindiToggle");
const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");

const allVaults = [
  ...hindirecommendations.map(d => ({ ...d, language: "Hindi" })),
  ...englishrecommendations.map(d => ({ ...d, language: "English" })),
  ...koreanrecommendations.map(d => ({ ...d, language: "Korean" })),
  ...chineserecommendations.map(d => ({ ...d, language: "Chinese" }))
];

const mustWatchEntries = allVaults.filter(d => d.mustWatch);

// 🧢 Render Carousel Posters
function renderCarousel(data) {
  carousel.innerHTML = "";
  const top10 = [...data].sort((a, b) => b.imdbRating - a.imdbRating).slice(0, 10);
  top10.forEach(entry => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <strong>${entry.title}</strong><br/>
      <small>${entry.language} | IMDb ${entry.imdbRating}</small>
    `;
    carousel.appendChild(item);
  });
}

// 🧱 Render Vault Cards
function renderVault(data) {
  container.innerHTML = "";
  data.forEach(entry => {
    const card = document.createElement("div");
    card.className = "vault-card must-watch";

    const genreTags = entry.genre
      .split("/")
      .map(g => `<span class="tag">🎬 ${g.trim()}</span>`)
      .join(" ");

    card.innerHTML = `
      <h2>${entry.title}</h2>
      <p><strong>Language:</strong> ${entry.language}</p>
      <p><strong>Genre:</strong> ${genreTags}</p>
      <p><strong>Platform:</strong> ${entry.platform}</p>
      <p><strong>Year:</strong> ${entry.year}</p>
      <p><strong>IMDb:</strong> ${entry.imdbRating}</p>
      <p><strong>Hindi Dubbed:</strong> ${entry.hindiDubbed ? "✅" : "❌"}</p>
      <p class="description">${entry.description}</p>
    `;
    container.appendChild(card);
  });
}

// 🧃 Fill Filter Options
function populateFilters(data) {
  const languages = [...new Set(data.map(d => d.language))].sort();
  const genres = [...new Set(data.flatMap(d => d.genre.split("/").map(g => g.trim())))].sort();
  const platforms = [...new Set(data.flatMap(d => d.platform.split(" / ").map(p => p.trim())))].sort();

  languages.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    languageFilter.appendChild(opt);
  });
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });
  platforms.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    platformFilter.appendChild(opt);
  });
}

// 🧭 Apply All Filters
function applyFilters() {
  let filtered = [...mustWatchEntries];
  const lang = languageFilter.value;
  const genre = genreFilter.value;
  const platform = platformFilter.value;
  const imdb = parseFloat(imdbFilter.value);
  const hindiOnly = hindiToggle.checked;
  const search = searchInput.value.toLowerCase();

  if (lang) filtered = filtered.filter(d => d.language === lang);
  if (genre) filtered = filtered.filter(d => d.genre.includes(genre));
  if (platform) filtered = filtered.filter(d => d.platform.includes(platform));
  if (imdb) filtered = filtered.filter(d => d.imdbRating >= imdb);
  if (hindiOnly) filtered = filtered.filter(d => d.hindiDubbed);
  if (search) filtered = filtered.filter(d => d.title.toLowerCase().includes(search));

  renderVault(filtered);
}

[languageFilter, genreFilter, platformFilter, imdbFilter, hindiToggle, searchInput]
  .forEach(el => el.addEventListener("input", applyFilters));

populateFilters(mustWatchEntries);
renderVault(mustWatchEntries);
renderCarousel(mustWatchEntries);