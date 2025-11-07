/* prototype.js - Fetches real-time movie and TV data from The Movie Database (TMDB) API.
   Requires TMDB_API_KEY, TMDB_BASE_URL, and TMDB_IMAGE_BASE_URL to be defined globally.
*/

// --- Utility Functions ---

/**
 * Creates an HTML card element for a TMDB item (Movie or TV).
 * @param {object} tmdbItem - The data object from TMDB API.
 * @returns {HTMLElement} The created div element.
 */
function makeCard(tmdbItem){
  const div = document.createElement('div');
  
  // Determine if it's a carousel item
  const isCarousel = div.parentElement && div.parentElement.classList.contains('flex');

  // Use 'title' for movies, 'name' for TV series
  const title = tmdbItem.title || tmdbItem.name || 'Untitled';
  const year = (tmdbItem.release_date || tmdbItem.first_air_date || '').split('-')[0] || 'N/A';
  const posterPath = tmdbItem.poster_path;
  const rating = tmdbItem.vote_average ? tmdbItem.vote_average.toFixed(1) : 'N/A';

  // Adjust card size and styling
  div.className = isCarousel 
    ? 'flex-shrink-0 w-32 md:w-40 bg-gray-900 rounded-lg overflow-hidden shadow-xl transition transform hover:scale-[1.02] duration-300'
    : 'bg-gray-900 rounded-lg overflow-hidden shadow-xl transition transform hover:scale-[1.02] duration-300';
  
  // The poster area
  const poster = document.createElement('div');
  poster.className = isCarousel 
    ? 'w-full h-48 md:h-60 bg-gray-800 poster-placeholder'
    : 'w-full h-48 md:h-60 bg-gray-800 poster-placeholder';

  if(posterPath){
    const img = document.createElement('img');
    img.src = `${TMDB_IMAGE_BASE_URL}${posterPath}`;
    img.alt = title + ' Poster';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover';
    // Fallback for broken image or missing path
    img.onerror = ()=>{ 
        img.parentNode.innerHTML = '';
        img.parentNode.textContent = title.slice(0, 16);
        img.parentNode.classList.add('flex', 'items-center', 'justify-center', 'text-center', 'p-2');
    };
    poster.innerHTML = '';
    poster.appendChild(img);
  } else {
    poster.textContent = title.slice(0, 16);
    poster.classList.add('flex', 'items-center', 'justify-center', 'text-center', 'p-2');
  }
  div.appendChild(poster);
  
  // The meta information area
  const meta = document.createElement('div');
  meta.className = 'p-2 text-xs h-12 flex flex-col justify-center';
  meta.innerHTML = `
    <h4 class="font-bold truncate text-gray-100">${title}</h4>
    <p class="text-gray-400">${year} | ${rating !== 'N/A' ? '⭐' + rating : ''}</p>
  `;
  div.appendChild(meta);
  
  return div;
}

/**
 * Renders a list of TMDB items into a specified carousel row container.
 * @param {string} containerId - The ID of the HTML container.
 * @param {Array} items - The array of TMDB results.
 */
function renderCarousel(containerId, items) {
  const container = document.getElementById(containerId);
  console.log(`[RENDER] Attempting to render ${items.length} items to container: #${containerId}`); // DEBUG LOG
  
  if (!container) {
    console.error(`Container ID ${containerId} not found.`);
    return;
  }

  // Clear existing placeholder content
  container.innerHTML = ''; 

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<p class="text-gray-400 p-4">Could not load content from TMDB.</p>';
    return;
  }

  items.forEach(item => {
    container.appendChild(makeCard(item));
  });
}

/**
 * Fetches data from a TMDB endpoint with exponential backoff for retries.
 * @param {string} endpoint - The TMDB API path (e.g., '/trending/movie/day').
 * @param {number} retries - Current retry count (default 3).
 */
async function fetchData(endpoint, retries = 3) {
  if (TMDB_API_KEY === "YOUR_TMDB_API_KEY_HERE" || !TMDB_API_KEY) {
    console.error("Please set your TMDB API Key in index.html to load data.");
    return [];
  }
  
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[FETCH] Attempt ${attempt}: Fetching ${endpoint}`); // DEBUG LOG
      const response = await fetch(url);
      
      if (!response.ok) {
        // Log the exact error status and message from TMDB if possible
        const errorText = await response.text();
        console.error(`[FETCH ERROR] TMDB request failed for ${endpoint} with status ${response.status}. Response body: ${errorText}`); // DEBUG LOG
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[FETCH SUCCESS] Received ${data.results ? data.results.length : 0} results for ${endpoint}.`); // DEBUG LOG
      return data.results || []; // Return the array of results
      
    } catch (error) {
      if (attempt === retries) {
        console.error(`[FATAL] Failed to fetch ${endpoint} after ${retries} attempts.`); // DEBUG LOG
        return [];
      }
      // Exponential backoff: 1s, 2s, 4s delay
      const delay = Math.pow(2, attempt) * 1000; 
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Shuffles an array in place (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Main Application Execution ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle Logic ---
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    function toggleMenu() {
        if(mobileMenu) mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden'); 
    }

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeMenu) closeMenu.addEventListener('click', toggleMenu);
    if(menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    // --- Carousel Scroll Buttons Logic ---
    document.querySelectorAll('[data-scroll-target]').forEach(btn => {
        btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-scroll-target');
        const dir = btn.getAttribute('data-dir');
        const el = document.getElementById(targetId);
        if(!el) return;
        
        const amount = Math.round(el.clientWidth * 0.7) * (dir === 'left' ? -1 : 1);
        el.scrollBy({ left: amount, behavior: 'smooth' });
        });
    });


    // --- TMDB Data Loading ---
    async function loadTMDBData() {
        console.log("[INIT] Starting TMDB data load..."); // DEBUG LOG
        const endpoints = {
            trendingMovies: '/trending/movie/day',
            topRatedTV: '/tv/top_rated',
            popularWeek: '/trending/all/week',
            upcomingMovies: '/movie/upcoming',
        };

        const [
            trendingMoviesData, 
            topRatedTVData, 
            popularWeekData, 
            upcomingMoviesData
        ] = await Promise.all([
            fetchData(endpoints.trendingMovies),
            fetchData(endpoints.topRatedTV),
            fetchData(endpoints.popularWeek),
            fetchData(endpoints.upcomingMovies)
        ]);
        
        // Check collected data lengths - DEBUG LOG
        console.log(`[DATA SUMMARY] Trending Movies: ${trendingMoviesData.length}, Top TV: ${topRatedTVData.length}, Popular Week: ${popularWeekData.length}`); 

        // 1. Render Carousels
        renderCarousel('trendingMoviesRow', trendingMoviesData);
        renderCarousel('topRatedTVRow', topRatedTVData);
        renderCarousel('popularWeekRow', popularWeekData);

        // 2. Prepare data for the Random Grid
        // Combine all fetched data into the global array
        window.allFetchedData = [
            ...trendingMoviesData, 
            ...topRatedTVData, 
            ...popularWeekData, 
            ...upcomingMoviesData
        ].filter(item => item && item.poster_path); // Filter out items without posters
        
        console.log(`[RANDOM GRID] Total items collected for grid: ${window.allFetchedData.length}`); // DEBUG LOG
        
        // Initial render of the random grid
        renderRandomGrid();
    }
    
    // Function to render the random grid using the globally aggregated data
    function renderRandomGrid() {
        const randomGridContainer = document.getElementById('randomGrid');
        const combinedData = window.allFetchedData;

        if (!randomGridContainer || combinedData.length === 0) {
             randomGridContainer.innerHTML = '<p class="text-gray-400 col-span-full p-4">No content available for random selection.</p>';
             return;
        }
        
        // Shuffle the data and pick the first 12 items
        const randomizedItems = shuffleArray([...combinedData]).slice(0, 12);
        
        // Clear and render
        randomGridContainer.innerHTML = '';
        randomizedItems.forEach(item => {
            randomGridContainer.appendChild(makeCard(item));
        });
    }

    // Reshuffle random grid button logic
    const reshuffle = document.getElementById('reshuffle');
    if(reshuffle){
        reshuffle.addEventListener('click', renderRandomGrid);
    }
    
    // Start data loading
    loadTMDBData();

});