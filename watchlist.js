// script.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vaultContainer");
  const genreFilter = document.getElementById("genreFilter");
  const platformFilter = document.getElementById("platformFilter");
  const imdbFilter = document.getElementById("imdbFilter");
  const hindiToggle = document.getElementById("hindiToggle");
  const searchInput = document.getElementById("searchInput");
  const languageFilter = document.getElementById("languageFilter");
  const goTopBtn = document.getElementById("goTopBtn"); // Get the scroll button

  // Function to render the series cards
  function renderVault(data) {
    container.innerHTML = ""; // Clear existing content
    if (data.length === 0) {
      container.innerHTML = "<p class='no-results'>No series found matching your criteria.</p>";
      return;
    }
    data.forEach(entry => {
      const card = document.createElement("div");
      card.className = "vault-card";

      // Handle multiple genres and platforms with tags
      const genreTags = entry.genre
        .split("/")
        .map(g => `<span class="tag">🎬 ${g.trim()}</span>`)
        .join("");

      const platformDisplay = entry.platform
        .split(" / ")
        .map(p => `<span class="tag platform-tag">${p.trim()}</span>`)
        .join(" ");

      card.innerHTML = `
        <span class="series-id">#${entry.id}</span>
        <h2>${entry.title}</h2>
        <p><strong>Language:</strong> ${entry.language}</p>
        <p><strong>Genre:</strong> ${genreTags}</p>
        <p><strong>Platform:</strong> ${platformDisplay}</p>
        <p><strong>Year:</strong> ${entry.year}</p>
        <p><strong>IMDb:</strong> ${entry.imdbRating ? entry.imdbRating.toFixed(1) : 'N/A'}</p>
        <p><strong>Hindi Dubbed:</strong> ${entry.hindiDubbed ? "✅ Yes" : "❌ No"}</p>
        ${entry.mustWatch ? '<div class="must-watch-badge">⭐ Must Watch</div>' : ''}

        <p class="description hidden">${entry.description}</p>
        <button class="toggle-description-btn" data-target-id="desc-${entry.id}">View Description</button>
      `;
      container.appendChild(card);
    });

    // Attach event listeners to the new buttons after they are rendered
    document.querySelectorAll('.toggle-description-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Find the description paragraph within the same card
            const descriptionElement = this.previousElementSibling; // The <p class="description"> is right before the button
            if (descriptionElement) {
                descriptionElement.classList.toggle('hidden');
                this.textContent = descriptionElement.classList.contains('hidden') ? 'View Description' : 'Hide Description';
            }
        });
    });
  }

  // Function to populate filter dropdowns (remains the same)
  function populateFilters(data) {
    const languages = [...new Set(data.map(d => d.language))].sort();
    const allGenres = data.flatMap(d => d.genre.split("/").map(g => g.trim()));
    const genres = [...new Set(allGenres)].sort();
    const allPlatforms = data.flatMap(d => d.platform.split(" / ").map(p => p.trim()));
    const platforms = [...new Set(allPlatforms)].sort();

    // Clear previous options before populating
    languageFilter.innerHTML = '<option value="">All Languages</option>';
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    platformFilter.innerHTML = '<option value="">All Platforms</option>';

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

  // Function to apply all filters (remains the same as previous)
  function applyFilters() {
    let filtered = [...myWatchlist]; // Use myWatchlist as defined in data.js

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
    if (search) filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(search) ||
      d.description.toLowerCase().includes(search) ||
      d.tags.some(tag => tag.toLowerCase().includes(search))
    );

    renderVault(filtered);
  }

  // Event Listeners for filters
  [languageFilter, genreFilter, platformFilter, imdbFilter, hindiToggle, searchInput]
    .forEach(el => el.addEventListener("input", applyFilters));

  // Event listener for scroll to top button visibility
  window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      goTopBtn.style.display = "block";
    } else {
      goTopBtn.style.display = "none";
    }
  };

  // Initial calls to populate filters and render content
  if (typeof myWatchlist !== 'undefined') {
      populateFilters(myWatchlist);
      applyFilters(); // Call applyFilters initially to render all based on default filters
  } else {
      console.error("myWatchlist data is not loaded. Ensure data.js is linked before script.js.");
  }
});
