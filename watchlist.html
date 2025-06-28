const posterGrid = document.getElementById("posterGrid");
const topPicksGrid = document.getElementById("topPicksGrid");
const watchedSet = new Set(JSON.parse(localStorage.getItem("watchedShows") || "[]"));

const topPickTitles = [
  "Peaky Blinders",
  "Game of Thrones",
  "Breaking Bad",
  "When Life Gives You Tangerines",
  "You",
  "Lucifer",
  "Squid Game"
];

function saveWatched() {
  localStorage.setItem("watchedShows", JSON.stringify(Array.from(watchedSet)));
}

function createPosterTile(show, index, isTop = false) {
  const isWatched = watchedSet.has(show.title);
  const stars = "⭐".repeat(show.rating || 0);
  const number = index + 1;

  const genreTags = (show.genres || [])
    .map(g => `<span class="tag">${g}</span>`)
    .join("");

  const platformTag = show.platform
    ? `<span class="tag">${show.platform}</span>`
    : "";

  const runtimeText = show.runtime ? `• ${show.runtime} min` : "";
  const episodeText = show.episodes
    ? `• ${show.episodes} ${show.episodes === 1 ? "episode" : "episodes"}`
    : "";

  return `
    <div class="poster-tile text-only ${isWatched ? "watched" : ""} ${isTop ? "top-pick" : ""}" onclick="toggleWatched('${show.title}')">
      <div class="poster-info">
        <h3>${number}. ${show.title}</h3>
        <p>${stars} ${runtimeText} ${episodeText}</p>
        <div class="tags">
          ${genreTags}
          ${platformTag}
        </div>
      </div>
    </div>
  `;
}

function toggleWatched(title) {
  watchedSet.has(title) ? watchedSet.delete(title) : watchedSet.add(title);
  saveWatched();
  renderAll();
}

function populateGenreMenu() {
  const genres = new Set();
  seriesData.forEach(s => s.genres?.forEach(g => genres.add(g)));
  const select = document.getElementById("genreFilter");
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    select.appendChild(opt);
  });
}

function renderAll() {
  const filter = document.getElementById("genreFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  const top = seriesData.filter(s => topPickTitles.includes(s.title));
  topPicksGrid.innerHTML = top.map((s, i) => createPosterTile(s, i, true)).join("");

  const filtered = seriesData.filter(s => {
    const notTop = !topPickTitles.includes(s.title);
    const matchesGenre = filter === "All" || s.genres?.includes(filter);
    const matchesSearch = s.title.toLowerCase().includes(search);
    return notTop && matchesGenre && matchesSearch;
  });

  posterGrid.innerHTML = filtered.map((s, i) => createPosterTile(s, i)).join("");
}

document.getElementById("genreFilter").addEventListener("change", renderAll);
document.getElementById("searchInput").addEventListener("input", renderAll);

populateGenreMenu();
renderAll();