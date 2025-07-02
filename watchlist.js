const grid = document.getElementById("watchlistGrid");
const liveCount = document.getElementById("liveCount");
const progressFill = document.getElementById("progressFill");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const genreButtons = document.getElementById("genreButtons");
const backToTopBtn = document.getElementById("backToTop");

const totalGoal = 1000;

// Filter for Hindi originals only (if needed)
// const filteredVault = myWatchlist.filter(item => item.language === "Hindi" && !item.hindiDubbed);
let filteredList = [...myWatchlist];
let activeGenre = null;

// Render cards
function render(list) {
  grid.innerHTML = "";
  liveCount.textContent = `📺 ${list.length}/${totalGoal} Series Watched`;
  progressFill.style.width = `${(list.length / totalGoal) * 100}%`;

  list.forEach((show, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 0.03}s`;

    const descriptionId = `desc-${show.id}`;

    card.innerHTML = `
      <h3>${i + 1}. ${show.title}</h3>
      <div class="tags">
        <span class="tag">${show.platform}</span>
        <span class="tag">${show.genre}</span>
        <span class="tag">📅 ${show.year}</span>
        <span class="tag">🔥 ${show.popularity}%</span>
        <span class="tag">⭐ ${show.imdbRating}</span>
        <span class="tag">${show.hindiDubbed ? "🔁 Hindi Dubbed" : "🎧 Original"}</span>
      </div>
      <p style="font-size: 0.85rem; margin-top: 0.5rem;">
        Seasons: ${show.seasons}, Episodes: ${show.episodes}, Runtime: ${show.runtime}
      </p>
      <button class="desc-btn" onclick="toggleDescription('${descriptionId}')">📖 Show Description</button>
      <p id="${descriptionId}" class="description hidden">${show.description}</p>
    `;

    grid.appendChild(card);
  });
}

// Toggle description
function toggleDescription(id) {
  const desc = document.getElementById(id);
  desc.classList.toggle("hidden");
}

// Generate genre buttons
function generateGenres() {
  const genres = [...new Set(myWatchlist.map(item => item.genre))].sort();
  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.onclick = () => {
      if (activeGenre === genre) {
        activeGenre = null;
        btn.classList.remove("active");
        filteredList = [...myWatchlist];
      } else {
        activeGenre = genre;
        document.querySelectorAll(".genre-buttons button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filteredList = myWatchlist.filter(item => item.genre === genre);
      }
      applyFilters();
    };
    genreButtons.appendChild(btn);
  });
}

// Search
searchInput.addEventListener("input", () => {
  applyFilters();
});

// Sort
sortSelect.addEventListener("change", () => {
  applyFilters();
});

// Apply search + sort
function applyFilters() {
  let list = [...filteredList];
  const query = searchInput.value.toLowerCase();

  if (query) {
    list = list.filter(item => item.title.toLowerCase().includes(query));
  }

  const sortBy = sortSelect.value;
  if (sortBy === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "year") {
    list.sort((a, b) => a.year - b.year);
  } else if (sortBy === "popularity") {
    list.sort((a, b) => b.popularity - a.popularity);
  }

  render(list);
}

// Back to top visibility
window.addEventListener("scroll", () => {
  backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

// Init
generateGenres();
render(myWatchlist);