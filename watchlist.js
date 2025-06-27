const posterGrid = document.getElementById("posterGrid");
const watchedSet = new Set(JSON.parse(localStorage.getItem("watchedShows") || "[]"));

function saveWatched() {
  localStorage.setItem("watchedShows", JSON.stringify(Array.from(watchedSet)));
}

function createPosterTile(show) {
  const isWatched = watchedSet.has(show.title);
  const imgSrc = show.image || "images/placeholder.jpg";
  const genres = show.genres ? show.genres.join(", ") : "Unspecified";
  const hoverInfo = `
    <div class="poster-info">
      <h3>${show.title}</h3>
      <p>${genres}</p>
      <p>${"⭐".repeat(show.rating || 0)}</p>
      <small>${show.platform || "Unknown Platform"}</small>
    </div>
  `;

  return `
    <div class="poster-tile ${isWatched ? "watched" : ""}" onclick="toggleWatched('${show.title}')">
      <img src="${imgSrc}" alt="${show.title}" />
      ${hoverInfo}
    </div>
  `;
}

function toggleWatched(title) {
  watchedSet.has(title) ? watchedSet.delete(title) : watchedSet.add(title);
  saveWatched();
  renderPosters();
}

function renderPosters() {
  if (!Array.isArray(seriesData)) {
    posterGrid.innerHTML = `<p style="color: #aaa;">No shows found. Please check your data.js file.</p>`;
    return;
  }
  const html = seriesData.map(createPosterTile).join("");
  posterGrid.innerHTML = html;
}

renderPosters();