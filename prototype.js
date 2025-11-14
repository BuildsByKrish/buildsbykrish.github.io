// prototype.js - OurShow main logic (per-user watchlist/watchlater/reviews + TMDB + AI recommender)

/* ---------- CONFIG ---------- */
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = "fa75c4832cd40cf2bf75307fd4abe736"; // TMDB API key
const GEMINI_API_KEY = "AIzaSyATdHM8g689rEeFkpShnFTBOfv7jH_RgxA"; // Prototype key (move to server for prod)

/* ---------- UTIL ---------- */
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}
function fmtTime(ts){ try { return new Date(ts).toLocaleString(); } catch(e){ return String(ts); }}

/* ---------- TMDB ---------- */
async function tmdbFetch(endpoint) {
  try {
    const sep = endpoint.includes("?") ? "&" : "?";
    const url = `${TMDB_BASE_URL}${endpoint}${sep}api_key=${TMDB_KEY}`;
    const r = await fetch(url);
    if (!r.ok) { console.error("TMDB error", r.status, url); return null; }
    return await r.json();
  } catch (e) {
    console.error("tmdbFetch failed", e);
    return null;
  }
}

/* ---------- CARD / ROW ---------- */
function cardHTML(item, type="movie") {
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const pop = item.popularity ? Math.round(item.popularity) : "N/A";
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image";
  return `
    <div class="cursor-pointer min-w-[150px]" data-id="${item.id}" data-type="${type}">
      <img src="${poster}" class="rounded-lg aspect-[2/3] object-cover hover:opacity-80 transition" alt="${esc(title)}" />
      <h3 class="mt-1 text-sm font-medium">${esc(title)}</h3>
      <p class="text-gray-400 text-xs">${esc(year)} • ⭐ ${esc(rating)} • 🔥 ${esc(pop)}</p>
    </div>
  `;
}
function renderRow(containerId, results, type="movie"){
  const cont = document.getElementById(containerId);
  if(!cont) return;
  if (!results || results.length===0) { cont.innerHTML = `<p class="text-gray-400 text-sm">No results found.</p>`; return; }
  cont.innerHTML = results.map(r=>cardHTML(r,type)).join("");
}

/* ---------- HOME SECTIONS ---------- */
const HOME_SECTIONS = [
  { id:"ai-recommender", title:"🎯 Mood Recommender", type:"special" },
  { id:"trending-movies", title:"🔥 Trending Movies", endpoint:"/trending/movie/week", type:"movie" },
  { id:"trending-tv", title:"📺 Trending TV Shows", endpoint:"/trending/tv/week", type:"tv" },
  { id:"popular-asian", title:"🌏 Popular Asian Dramas", endpoint:"/discover/tv?with_original_language=ko,ja,zh&sort_by=popularity.desc", type:"tv" },
  { id:"top-hindi", title:"🇮🇳 Top Hindi Movies", endpoint:"/discover/movie?with_original_language=hi&sort_by=vote_average.desc", type:"movie" },
  { id:"best-hindi", title:"🎞️ Best Hindi Movies", endpoint:"/discover/movie?with_original_language=hi&sort_by=popularity.desc", type:"movie" },
  { id:"hindi-popular", title:"🎬 Hindi Movies Popular Now", endpoint:"/discover/movie?with_original_language=hi&sort_by=popularity.desc", type:"movie" },
  { id:"web-series", title:"💻 Best Web Series", endpoint:"/tv/popular", type:"tv" },
  { id:"upcoming-hindi", title:"🕒 Upcoming Hindi Movies", endpoint:"/movie/upcoming?with_original_language=hi", type:"movie" },
  { id:"upcoming-hollywood", title:"🎥 Upcoming Hollywood Movies", endpoint:"/movie/upcoming?with_original_language=en", type:"movie" },
  { id:"comedy", title:"😂 Best Comedy Movies", endpoint:"/discover/movie?with_genres=35", type:"movie" },
  { id:"action", title:"💥 Best Action Movies", endpoint:"/discover/movie?with_genres=28", type:"movie" },
  { id:"drama", title:"🎭 Best Dramas", endpoint:"/discover/movie?with_genres=18", type:"movie" }
];

async function buildHome(){
  const container = document.getElementById("sections-container");
  container.innerHTML = "";
  for(const s of HOME_SECTIONS){
    if (s.type === "special"){
      container.insertAdjacentHTML("beforeend", `
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold">${s.title}</h2>
            <div class="text-sm text-gray-400">Choose mood & genre</div>
          </div>
          <div class="bg-gray-800 p-4 rounded mb-2">
            <div class="flex flex-col sm:flex-row gap-3 items-center">
              <select id="mood-select" class="p-2 rounded bg-gray-700">
                <option value="">Select mood</option>
                <option value="happy">Happy</option>
                <option value="bored">Bored</option>
                <option value="romantic">Romantic</option>
                <option value="excited">Excited</option>
                <option value="chill">Chill</option>
                <option value="scary">Scary</option>
              </select>

              <select id="genre-select" class="p-2 rounded bg-gray-700">
                <option value="">Any genre</option>
                <option value="28">Action</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="27">Horror</option>
                <option value="10749">Romance</option>
                <option value="878">Sci-fi</option>
              </select>

              <button id="get-recs" class="bg-red-600 px-3 py-2 rounded">🎯 Get Recommendation</button>
              <div id="ai-status" class="text-sm text-gray-400 ml-2"></div>
            </div>
            <div id="ai-recs-row" class="flex gap-3 overflow-x-auto mt-4 pb-2"></div>
          </div>
        </div>
      `);
      // attach after DOM inserted
      setTimeout(()=> {
        const btn = document.getElementById("get-recs");
        if (btn) btn.addEventListener("click", handleAImood);
      }, 50);
      continue;
    }

    container.insertAdjacentHTML("beforeend", `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">${s.title}</h2>
          <button class="text-red-500 hover:underline" data-more="${s.id}">More ›</button>
        </div>
        <div id="${s.id}-row" class="flex overflow-x-auto space-x-3 pb-2"></div>
      </div>
    `);

    // fetch
    const data = await tmdbFetch(s.endpoint);
    const results = (data && data.results) ? data.results : [];
    renderRow(`${s.id}-row`, results, s.type);
  }
}

/* ---------- SPA + Search ---------- */
function showPage(pageId){
  document.querySelectorAll(".spa-page").forEach(p=>p.classList.add("hidden"));
  const el = document.getElementById(pageId);
  if (el) el.classList.remove("hidden");
}

const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key !== "Enter") return;
    const q = e.target.value.trim();
    if (!q) return;
    // genre map simple
    const genreMap = { action:28, comedy:35, drama:18, horror:27, romance:10749, scifi:878 };
    const lc = q.toLowerCase();
    if (genreMap[lc]) {
      showPage("page-all");
      document.getElementById("all-title").innerText = `Results: ${q}`;
      const data = await tmdbFetch(`/discover/movie?with_genres=${genreMap[lc]}&sort_by=popularity.desc`);
      const res = (data && data.results) ? data.results : [];
      document.getElementById("all-content").innerHTML = res.map(it => cardHTML(it, "movie")).join("");
      return;
    }
    // fallback multi search
    showPage("page-search");
    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(q)}&language=en-US`);
    const res = (data && data.results) ? data.results : [];
    document.getElementById("search-content").innerHTML = res.length ? res.map(it => cardHTML(it, it.media_type || "movie")).join("") : `<p class="text-gray-400">No results found.</p>`;
  });
}

/* ---------- MODAL ---------- */
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");
if (closeModalBtn) closeModalBtn.addEventListener("click", ()=> modal.classList.add("hidden"));
if (modal) modal.addEventListener("click",(e)=>{ if (e.target && e.target.id === "detail-modal") modal.classList.add("hidden"); });

document.body.addEventListener("click", async (e) => {
  const c = e.target.closest("[data-id]");
  if (!c) return;
  const id = c.dataset.id;
  const type = c.dataset.type || "movie";
  await openDetail(type, id);
});

async function openDetail(type, id) {
  const data = await tmdbFetch(`/${type}/${id}?append_to_response=videos,credits,similar`);
  if (!data) { modalContent.innerHTML = `<p class="p-4 text-gray-400">No details.</p>`; modal.classList.remove("hidden"); return; }
  const title = data.title || data.name || "Untitled";
  const poster = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image";
  const backdrop = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : "";
  const year = (data.release_date || data.first_air_date || "").split("-")[0] || "N/A";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
  const pop = data.popularity ? Math.round(data.popularity) : "N/A";
  const runtime = data.runtime || (data.episode_run_time?data.episode_run_time[0]:"N/A");
  const genres = (data.genres||[]).map(g=>g.name).join(", ");
  const trailer = (data.videos?.results||[]).find(v=>v.site==="YouTube" && v.type==="Trailer");
  const trailerEmbed = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";

  // cast and similar
  const cast = (data.credits?.cast || []).slice(0,6);
  const similar = (data.similar?.results || []).slice(0,10);

  modalContent.innerHTML = `
    ${backdrop ? `<div class="w-full h-44 bg-cover bg-center rounded-t-lg" style="background-image:url('${backdrop}'); filter:brightness(0.5)"></div>`: ""}
    <div class="p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/3">
          <img src="${poster}" class="rounded-lg w-full aspect-[2/3] object-cover" alt="${esc(title)}" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-1">${esc(title)}</h2>
          <p class="text-gray-300 mb-3">${esc(data.overview || "")}</p>
          <div class="text-sm text-gray-400 grid grid-cols-2 gap-2 mb-3">
            <div><strong>Year:</strong> ${esc(year)}</div>
            <div><strong>IMDb:</strong> ⭐ ${esc(rating)}</div>
            <div><strong>Popularity:</strong> 🔥 ${esc(pop)}</div>
            <div><strong>Runtime:</strong> ${esc(runtime)} min</div>
            <div class="col-span-2"><strong>Genres:</strong> ${esc(genres)}</div>
          </div>

          <div class="flex gap-2">
            <button id="add-watchlater" class="bg-yellow-500 text-black px-3 py-1 rounded">⏳ Watch Later</button>
            <button id="add-watched" class="bg-green-600 text-white px-3 py-1 rounded">✅ Watched</button>
            <button id="show-reviews" class="bg-blue-600 text-white px-3 py-1 rounded">💬 Reviews</button>
          </div>

          <div class="mt-3">
            ${trailerEmbed ? `<iframe class="w-full h-48 rounded" src="${trailerEmbed}" frameborder="0" allowfullscreen></iframe>` : ""}
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Top Cast</h3>
        <div class="flex flex-wrap gap-3">
          ${cast.length ? cast.map(c=> `
            <div class="flex flex-col items-center w-20">
              <img src="${c.profile_path ? `https://image.tmdb.org/t/p/w300${c.profile_path}` : 'https://via.placeholder.com/100'}" class="rounded-full w-16 h-16 object-cover" alt="${esc(c.name)}" />
              <p class="text-xs mt-1 text-center">${esc(c.name)}</p>
            </div>
          `).join("") : `<p class="text-gray-400 text-sm">No cast info.</p>`}
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Similar Titles</h3>
        <div class="flex overflow-x-auto gap-3 pb-2">
          ${similar.length ? similar.map(s => cardHTML(s, s.media_type || (s.title ? "movie":"tv"))).join("") : `<p class="text-gray-400">No similar titles.</p>`}
        </div>
      </div>

      <div id="reviews-container" class="mt-6 border-t border-gray-700 pt-4 hidden">
        <h3 class="text-lg font-semibold mb-3">Reviews</h3>
        <div id="reviews-list" class="space-y-3 mb-4"><p class="text-gray-400 text-sm">Loading...</p></div>
        <div>
          <div class="mb-2 text-sm">Your Rating:</div>
          <div id="review-meter" class="flex gap-2 mb-2 flex-wrap">
            <button data-val="Bad" class="rev-btn bg-gray-700 px-2 py-1 rounded text-sm">Bad</button>
            <button data-val="One-time Watch" class="rev-btn bg-gray-700 px-2 py-1 rounded text-sm">One-time Watch</button>
            <button data-val="Satisfactory" class="rev-btn bg-gray-700 px-2 py-1 rounded text-sm">Satisfactory</button>
            <button data-val="Good" class="rev-btn bg-gray-700 px-2 py-1 rounded text-sm">Good</button>
            <button data-val="Perfection" class="rev-btn bg-gray-700 px-2 py-1 rounded text-sm">Perfection</button>
          </div>
          <textarea id="review-comment" placeholder="Add comment (optional)" class="w-full p-2 rounded bg-gray-800 text-white mb-2"></textarea>
          <div class="flex gap-2">
            <button id="submit-review" class="bg-red-600 px-4 py-2 rounded">Submit Review</button>
            <button id="cancel-review" class="bg-gray-700 px-4 py-2 rounded">Clear</button>
          </div>
        </div>
      </div>

    </div>
  `;

  modal.classList.remove("hidden");

  // Attach modal buttons
  const addWL = document.getElementById("add-watchlater");
  const addW  = document.getElementById("add-watched");
  const showRev = document.getElementById("show-reviews");

  if (addWL) addWL.addEventListener("click", async ()=> {
    if (!auth.currentUser) { window.location.href = "login.html"; return; }
    const uid = auth.currentUser.uid;
    const key = `${type}_${id}`;
    await db.ref(`ourshow/users/${uid}/watchlater/${key}`).set({
      id, type, title: data.title||data.name||"", poster: data.poster_path||"", addedAt: Date.now()
    });
    alert("Added to Watch Later");
  });

  if (addW) addW.addEventListener("click", async ()=> {
    if (!auth.currentUser) { window.location.href = "login.html"; return; }
    const uid = auth.currentUser.uid;
    const key = `${type}_${id}`;
    await db.ref(`ourshow/users/${uid}/watchlist/${key}`).set({
      id, type, title: data.title||data.name||"", poster: data.poster_path||"", addedAt: Date.now()
    });
    alert("Added to My Watchlist");
  });

  if (showRev) showRev.addEventListener("click", async ()=> {
    const panel = document.getElementById("reviews-container");
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) await loadReviews(type, id);
  });

  // review meter click
  const meter = modalContent.querySelector("#review-meter");
  if (meter) {
    meter.addEventListener("click", (ev)=> {
      const b = ev.target.closest(".rev-btn");
      if (!b) return;
      meter.querySelectorAll(".rev-btn").forEach(x=>x.classList.remove("bg-red-600","text-white"));
      b.classList.add("bg-red-600","text-white");
    });
  }
  const submitReviewBtn = modalContent.querySelector("#submit-review");
  if (submitReviewBtn) submitReviewBtn.addEventListener("click", async ()=> {
    if (!auth.currentUser) { window.location.href = "login.html"; return; }
    const uid = auth.currentUser.uid;
    const selected = modalContent.querySelector(".rev-btn.bg-red-600");
    if (!selected) return alert("Select rating first.");
    const rating = selected.dataset.val;
    const comment = modalContent.querySelector("#review-comment").value.trim();
    const key = `${type}_${id}`;
    await db.ref(`ourshow/users/${uid}/reviews/${key}`).push({ rating, comment, title: data.title||data.name||"", ts: Date.now() });
    alert("Review submitted");
    await loadReviews(type, id);
    modalContent.querySelector("#review-comment").value = "";
    meter.querySelectorAll(".rev-btn").forEach(x=>x.classList.remove("bg-red-600","text-white"));
  });

  const cancelBtn = modalContent.querySelector("#cancel-review");
  if (cancelBtn) cancelBtn.addEventListener("click", ()=> {
    modalContent.querySelector("#review-comment").value = "";
    modalContent.querySelectorAll(".rev-btn").forEach(x=>x.classList.remove("bg-red-600","text-white"));
  });
}

/* ---------- REVIEWS (public display merges all users) ---------- */
async function loadReviews(type, id) {
  try {
    const key = `${type}_${id}`;
    // aggregate reviews from all users under ourshow/users/*/reviews/{key}
    const snapshot = await db.ref(`ourshow/users`).once("value");
    const users = snapshot.val() || {};
    const reviews = [];
    Object.keys(users).forEach(uid => {
      const r = users[uid]?.reviews?.[key];
      if (r) {
        Object.values(r).forEach(rv => reviews.push(rv));
      }
    });
    // sort
    reviews.sort((a,b)=> (b.ts||0)-(a.ts||0));
    const list = document.getElementById("reviews-list");
    if (!list) return;
    if (!reviews.length) { list.innerHTML = `<p class="text-gray-400">No reviews yet.</p>`; return; }
    list.innerHTML = reviews.map(rv => `
      <div class="bg-gray-800 p-3 rounded">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">${esc((rv.rating||"")[0]||"R")}</div>
            <div class="font-semibold text-sm">${esc(rv.rating)}</div>
          </div>
          <div class="text-xs text-gray-400">${fmtTime(rv.ts)}</div>
        </div>
        ${rv.comment ? `<p class="mt-2 text-sm text-gray-300">${esc(rv.comment)}</p>` : ""}
      </div>
    `).join("");
  } catch (e){ console.error("loadReviews", e); }
}

/* ---------- MORE BUTTONS ---------- */
document.body.addEventListener("click", async (e)=> {
  const btn = e.target.closest("[data-more]");
  if (!btn) return;
  const secId = btn.dataset.more;
  const sec = HOME_SECTIONS.find(s=>s.id===secId);
  if (!sec || !sec.endpoint) return;
  showPage("page-all");
  document.getElementById("all-title").innerText = sec.title;
  const data = await tmdbFetch(sec.endpoint);
  const res = (data && data.results) ? data.results : [];
  document.getElementById("all-content").innerHTML = res.length ? res.map(it => cardHTML(it, it.media_type || "movie")).join("") : `<p class="text-gray-400">No results.</p>`;
});

/* ---------- AI Recommender (basic Gemini attempt + TMDB fallback) ---------- */
const MOOD_MAP = {
  happy: { genres:[35,10751], keywords:["feel-good","uplifting"] },
  bored: { genres:[28,53], keywords:["fast-paced","engaging"] },
  romantic: { genres:[10749,18], keywords:["romantic","love"] },
  excited: { genres:[12,28], keywords:["adventure","epic"] },
  chill: { genres:[18,35], keywords:["calm","slice of life"] },
  scary: { genres:[27,53], keywords:["horror","thriller"] }
};

async function handleAImood(){
  const mood = document.getElementById("mood-select")?.value || "";
  const genre = document.getElementById("genre-select")?.value || "";
  const status = document.getElementById("ai-status");
  const row = document.getElementById("ai-recs-row");
  if (!row) return;
  row.innerHTML = "";
  if (!mood && !genre) { status.textContent = "Select mood or genre."; return; }
  status.textContent = "Thinking...";

  // Try Gemini (may be blocked by CORS) — fallback to TMDB if fails.
  try {
    const prompt = `Suggest 5 current/popular movies or TV shows (titles only) for mood "${mood || 'any'}" and genre "${genre || 'any'}". Provide titles separated by commas.`;
    const titles = await callGemini(prompt);
    if (titles && titles.length) {
      const fetched = [];
      for (const t of titles.slice(0,6)) {
        const search = await tmdbFetch(`/search/multi?query=${encodeURIComponent(t)}&language=en-US`);
        if (search && search.results && search.results.length) fetched.push(search.results[0]);
      }
      if (fetched.length) { row.innerHTML = fetched.map(it => cardHTML(it, it.media_type || "movie")).join(""); status.textContent = "AI picks ready."; return; }
    }
  } catch (e){ console.warn("Gemini failed, fallback", e); }

  // Fallback to TMDB discover
  status.textContent = "Using TMDB fallback...";
  try {
    let candidates = [];
    if (genre) {
      const d = await tmdbFetch(`/discover/movie?with_genres=${genre}&sort_by=popularity.desc`);
      candidates = (d && d.results) ? d.results : [];
    } else if (MOOD_MAP[mood]) {
      for (const g of MOOD_MAP[mood].genres.slice(0,2)) {
        const d = await tmdbFetch(`/discover/movie?with_genres=${g}&sort_by=popularity.desc`);
        if (d && d.results) candidates = candidates.concat(d.results);
      }
    } else {
      const d = await tmdbFetch(`/movie/popular`);
      candidates = (d && d.results) ? d.results : [];
    }
    // dedupe & pick 4
    const unique = [];
    (candidates||[]).forEach(c => { if (!unique.find(x=>x.id===c.id)) unique.push(c); });
    const picks = unique.sort(()=>0.5-Math.random()).slice(0,4);
    row.innerHTML = picks.length ? picks.map(p=>cardHTML(p,"movie")).join("") : `<p class="text-gray-400">No recommendations.</p>`;
    status.textContent = "Recommended from TMDB.";
  } catch (e){ console.error("fallback error", e); row.innerHTML = `<p class="text-gray-400">Error getting recs.</p>`; status.textContent = "Error."; }
}

/* Minimal Gemini call (may be CORS-blocked) */
async function callGemini(prompt){
  if (!GEMINI_API_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${GEMINI_API_KEY}`;
  const body = { prompt: { text: prompt }, temperature: 0.7, maxOutputTokens: 256 };
  const res = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Gemini failed " + res.status);
  const json = await res.json();
  // extract text robustly
  let text = "";
  if (json?.candidates?.[0]?.content) text = (Array.isArray(json.candidates[0].content) ? json.candidates[0].content.map(c=>c.text||"").join("\n") : (json.candidates[0].content.text||""));
  if (!text && json?.output?.[0]?.content?.[0]?.text) text = json.output[0].content[0].text;
  if (!text && json?.choices?.[0]?.text) text = json.choices[0].text;
  if (!text) text = JSON.stringify(json);
  // split titles by comma or newline
  let parts = text.split(/\r?\n|,/).map(p=>p.trim()).filter(Boolean);
  parts = parts.map(p => p.replace(/^\d+\.\s*/,"").replace(/["'“”]/g,"").trim()).filter(Boolean);
  return parts.slice(0,6);
}

/* ---------- PROTECTED PAGES: watchlist/watchlater read ---------- */
async function loadUserWatchlistPage(containerId, listName){
  // Check auth
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // redirect to login if page is protected
      window.location.href = "login.html";
      return;
    }
    const uid = user.uid;
    const snap = await db.ref(`ourshow/users/${uid}/${listName}`).once("value");
    const data = snap.val() || {};
    const container = document.getElementById(containerId);
    if (!container) return;
    const arr = Object.values(data);
    if (!arr.length) { container.innerHTML = `<p class="text-gray-400">No items yet.</p>`; return; }
    container.innerHTML = arr.map(it => `
      <div class="bg-gray-800 p-3 rounded flex items-center gap-3">
        <img src="${it.poster? (it.poster.startsWith("http")?it.poster:`https://image.tmdb.org/t/p/w200${it.poster}`):'https://via.placeholder.com/80x120?text=No'}" class="w-20 h-28 object-cover rounded" />
        <div class="flex-1">
          <div class="font-semibold">${esc(it.title)}</div>
          <div class="text-xs text-gray-400">Added: ${fmtTime(it.addedAt||0)}</div>
        </div>
        <div>
          <button class="remove-btn bg-red-600 px-2 py-1 rounded text-sm" data-key="${it.key||it.id}">Remove</button>
        </div>
      </div>
    `).join("");
    // remove handlers
    container.querySelectorAll(".remove-btn").forEach(b => b.addEventListener("click", async (ev)=>{
      const key = ev.target.dataset.key;
      await db.ref(`ourshow/users/${uid}/${listName}/${key}`).remove();
      loadUserWatchlistPage(containerId, listName);
    }));
  });
}

/* ---------- INIT ---------- */
async function init() {
  // ensure auth listener updates header/profile
  auth.onAuthStateChanged(user => {
    const profileBtn = document.getElementById("profile-btn");
    const loginBtn = document.getElementById("login-btn");
    const profImg = document.getElementById("profile-pic");
    const profName = document.getElementById("profile-name");
    if (user) {
      if (profileBtn) profileBtn.classList.remove("hidden");
      if (loginBtn) loginBtn.classList.add("hidden");
      if (profImg) profImg.src = user.photoURL || "https://via.placeholder.com/40";
      if (profName) profName.innerText = user.displayName || user.email.split("@")[0] || "User";
    } else {
      if (profileBtn) profileBtn.classList.add("hidden");
      if (loginBtn) loginBtn.classList.remove("hidden");
      if (profImg) profImg.src = "https://via.placeholder.com/40";
      if (profName) profName.innerText = "";
    }
  });

  // build home
  await buildHome();
  showPage("page-home");
}

init();
