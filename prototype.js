/* prototype.js - simple renderer that reads global data arrays created by your data files
   It expects the following globals (if present):
     - window.myWatchlist
     - window.movieRecommendations
     - window.koreanWatchlist
     - window.englishWatchlist or window.englishRecommendations
     - window.hindiWatchlist
     - window.chineseRecommendations
   The script is defensive: it ignores missing globals and renders what it finds.
*/

function makeCard(item){
  const div = document.createElement('div');
  div.className = 'bg-gray-900 rounded overflow-hidden shadow-lg';
  const poster = document.createElement('div');
  poster.className = 'w-full h-48 bg-gray-800 poster-placeholder';
  if(item.posterUrl){
    const img = document.createElement('img');
    img.src = item.posterUrl;
    img.alt = item.title || 'poster';
    img.loading = 'lazy';
    img.className = 'w-full h-48 object-cover';
    img.onerror = ()=>{ img.src = 'https://via.placeholder.com/500x750?text=No+Image'; };
    poster.innerHTML = '';
    poster.appendChild(img);
  } else {
    poster.textContent = item.title ? item.title.slice(0,16) : 'No Image';
  }
  div.appendChild(poster);
  const meta = document.createElement('div');
  meta.className = 'p-2';
  const t = document.createElement('div');
  t.className = 'font-semibold text-sm';
  t.textContent = item.title || 'Untitled';
  const y = document.createElement('div');
  y.className = 'text-xs text-gray-400';
  y.textContent = item.year || '';
  meta.appendChild(t);
  meta.appendChild(y);
  div.appendChild(meta);
  return div;
}

function renderGrid(containerId, arr){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  arr.forEach(item=>{
    const card = makeCard(item);
    container.appendChild(card);
  });
}

function renderCarousel(containerId, arr){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  arr.forEach(item=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'flex-shrink-0 w-40 sm:w-44 md:w-48';
    const card = makeCard(item);
    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });
}

function sortByYearDesc(arr){
  return (arr||[]).slice().sort((a,b)=> (b.year||0) - (a.year||0));
}

function shuffleArray(a){
  const out = a.slice();
  for(let i=out.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

function collectSeries(){
  const out = [];
  if(window.koreanWatchlist && Array.isArray(window.koreanWatchlist)) out.push(...window.koreanWatchlist);
  if(window.englishWatchlist && Array.isArray(window.englishWatchlist)) out.push(...window.englishWatchlist);
  if(window.englishRecommendations && Array.isArray(window.englishRecommendations)) out.push(...window.englishRecommendations);
  if(window.hindiWatchlist && Array.isArray(window.hindiWatchlist)) out.push(...window.hindiWatchlist);
  if(window.chineseRecommendations && Array.isArray(window.chineseRecommendations)) out.push(...window.chineseRecommendations);
  // remove duplicates by title
  const seen = new Set();
  return out.filter(it=>{
    const key = (it.title||'').toLowerCase();
    if(seen.has(key)) return false; seen.add(key); return true;
  });
}

function init(){
  const watchlist = window.myWatchlist && Array.isArray(window.myWatchlist) ? window.myWatchlist : [];
  const movies = window.movieRecommendations && Array.isArray(window.movieRecommendations) ? window.movieRecommendations : [];
  const series = collectSeries();

  // counts
  const watchlistCountEl = document.getElementById('watchlistCount');
  if(watchlistCountEl) watchlistCountEl.textContent = watchlist.length;

  // Render watchlist
  renderGrid('watchlistGrid', watchlist);

  // Recently released movies (top by year)
  const recentMovies = sortByYearDesc(movies).slice(0,12);
  renderCarousel('recentMoviesRow', recentMovies);

  // Recently released series
  const recentSeries = sortByYearDesc(series).slice(0,12);
  renderCarousel('recentSeriesRow', recentSeries);

  // Recently released dramas (Korean)
  const dramas = recentSeries.filter(s => (s.language && s.language.toLowerCase()==='korean') || (s.tags && s.tags.join(' ').toLowerCase().includes('korean')) );
  renderCarousel('recentDramasRow', dramas.slice(0,12));

  // Random mixed grid
  const mixed = shuffleArray([...(movies||[]), ...(series||[])]).slice(0,12);
  renderGrid('randomGrid', mixed);

  // Menu toggle behavior: open/close mobile sliding menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  function openMenu(){ if(mobileMenu) mobileMenu.classList.remove('hidden'); }
  function closeMenuFn(){ if(mobileMenu) mobileMenu.classList.add('hidden'); }
  if(menuBtn) menuBtn.addEventListener('click', openMenu);
  if(closeMenu) closeMenu.addEventListener('click', closeMenuFn);
  if(menuOverlay) menuOverlay.addEventListener('click', closeMenuFn);

  // Scroll buttons for carousels
  document.querySelectorAll('[data-scroll-target]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const targetId = btn.getAttribute('data-scroll-target');
      const dir = btn.getAttribute('data-dir');
      const el = document.getElementById(targetId);
      if(!el) return;
      const amount = Math.round(el.clientWidth * 0.7) * (dir==='left' ? -1 : 1);
      el.scrollBy({ left: amount, behavior: 'smooth' });
    });
  });

  // Reshuffle random grid
  const reshuffle = document.getElementById('reshuffle');
  if(reshuffle){
    reshuffle.addEventListener('click', ()=>{
      const again = shuffleArray([...(movies||[]), ...(series||[])]).slice(0,12);
      renderGrid('randomGrid', again);
    });
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else init();
