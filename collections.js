function createPosterTile(show) {
  const stars = "⭐".repeat(show.rating || 0);
  const genreTags = (show.genres || [])
    .map(g => `<span class="tag">${g}</span>`)
    .join("");

  return `
    <div class="poster-tile">
      <div class="poster-info">
        <h3>${show.title}</h3>
        <p>${stars} • ${show.runtime} min • ${show.episodes} ep</p>
        <div class="tags">
          ${genreTags}
          <span class="tag">${show.platform}</span>
        </div>
      </div>
    </div>
  `;
}

function renderCollections() {
  const groups = {
    recommendedGrid: s => s.recommended,
    englishGrid: s => s.language === "English",
    hindiGrid: s => s.language === "Hindi",
    koreanGrid: s => s.language === "Korean",
    chineseGrid: s => s.language === "Chinese"
  };

  for (const [id, filterFn] of Object.entries(groups)) {
    const container = document.getElementById(id);
    const filtered = seriesData.filter(filterFn);
    container.innerHTML = filtered.map(createPosterTile).join("");
  }
}

function goBack() {
  window.location.href = "watchlist.html"; // Or whatever your main vault file is
}

renderCollections();
