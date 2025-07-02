const grid = document.getElementById("watchlistGrid");
const liveCount = document.getElementById("liveCount");
const progressFill = document.getElementById("progressFill");

const totalGoal = 1000;
const list = typeof myWatchlist !== "undefined" ? myWatchlist : [];
const total = list.length;

// Update live count
liveCount.textContent = `📺 ${total}/1000 Series Watched`;

// Animate progress bar
progressFill.style.width = `${(total / totalGoal) * 100}%`;

// Render each series card
list.forEach((show, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 0.05}s`;

  card.innerHTML = `
    <h3>${i + 1}. ${show.title}</h3>
    <div class="tags">
      <span class="tag">${show.platform}</span>
      <span class="tag">${show.genre}</span>
      <span class="tag">📅 ${show.year}</span>
      <span class="tag">🔥 ${show.popularity}%</span>
      <span class="tag">${show.hindiDubbed ? "🔁 Hindi Dubbed" : "🎧 Original"}</span>
    </div>
    <p style="font-size: 0.85rem; margin-top: 0.5rem;">
      Seasons: ${show.seasons}, Episodes: ${show.episodes}, Runtime: ${show.runtime}
    </p>
  `;

  grid.appendChild(card);
});