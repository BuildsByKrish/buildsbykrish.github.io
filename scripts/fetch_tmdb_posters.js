#!/usr/bin/env node
// Fetch poster URLs from TMDB and update movie.js
// Usage: TMDB_API_KEY=your_key node scripts/fetch_tmdb_posters.js [path/to/movie.js]

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const vm = require('vm');

async function main() {
  // Flexible argument parsing:
  // If TMDB_API_KEY is set in env, argv[2] is movieFile, argv[3] is optional varName.
  // Otherwise, argv[2] is apiKey, argv[3] is movieFile, argv[4] is optional varName.
  let apiKey = process.env.TMDB_API_KEY;
  let movieFile;
  let varNameArg = process.env.TMDB_VAR_NAME;

  if (apiKey) {
    movieFile = process.argv[2] || path.join(__dirname, '..', 'movie.js');
    varNameArg = process.argv[3] || varNameArg;
  } else {
    apiKey = process.argv[2];
    if (!apiKey) {
      console.error('Error: TMDB API key not provided. Set TMDB_API_KEY env var or pass as first arg.');
      console.error('Example: TMDB_API_KEY=xxxxx node scripts/fetch_tmdb_posters.js ../movie.js');
      process.exit(1);
    }
    movieFile = process.argv[3] || path.join(__dirname, '..', 'movie.js');
    varNameArg = process.argv[4] || varNameArg;
  }
  if (!fs.existsSync(movieFile)) {
    console.error('Error: movie file not found at', movieFile);
    process.exit(1);
  }

  const code = fs.readFileSync(movieFile, 'utf8');

  // Execute movie.js in a sandbox to capture window.movieRecommendations
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(code, sandbox, { filename: movieFile });
  } catch (err) {
    console.error('Failed to execute movie.js in sandbox. Make sure it only assigns to window.movieRecommendations.');
    console.error(err);
    process.exit(1);
  }

  // Some files declare top-level variables with `const/let` (not `window.`).
  // Try to detect those lexical bindings by running a small detector in the same context
  // and copying any found arrays into sandbox.__captured for later lookup.
  try {
    const detectScript = `(() => {
      const names = ['movieRecommendations','myWatchlist','koreanWatchlist','englishWatchlist','hindiWatchlist'];
      this.__captured = this.__captured || {};
      names.forEach(n => {
        try {
          if (typeof globalThis !== 'undefined' && typeof globalThis[n] !== 'undefined') {
            this.__captured[n] = globalThis[n];
          } else if (typeof this[n] !== 'undefined') {
            this.__captured[n] = this[n];
          } else if (typeof window !== 'undefined' && typeof window[n] !== 'undefined') {
            this.__captured[n] = window[n];
          }
        } catch(e) { /* ignore */ }
      });
    })();`;
    vm.runInNewContext(detectScript, sandbox, { filename: movieFile + '.detect' });
  } catch (e) {
    // non-fatal
  }

  let movies;
  // Prefer explicit varNameArg from args/env
  if (varNameArg) {
    if (sandbox.window && sandbox.window[varNameArg]) movies = sandbox.window[varNameArg];
    else if (sandbox[varNameArg]) movies = sandbox[varNameArg];
    else if (sandbox.__captured && sandbox.__captured[varNameArg]) movies = sandbox.__captured[varNameArg];
  }

  // Fallback checks for common names
  if (!movies && sandbox.window && sandbox.window.movieRecommendations) movies = sandbox.window.movieRecommendations;
  if (!movies && sandbox.window && sandbox.window.myWatchlist) movies = sandbox.window.myWatchlist;
  if (!movies && sandbox.window && sandbox.window.koreanWatchlist) movies = sandbox.window.koreanWatchlist;
  if (!movies && sandbox.__captured && sandbox.__captured.koreanWatchlist) movies = sandbox.__captured.koreanWatchlist;
  if (!movies && sandbox.__captured && sandbox.__captured.englishWatchlist) movies = sandbox.__captured.englishWatchlist;
  if (!movies && sandbox.__captured && sandbox.__captured.hindiWatchlist) movies = sandbox.__captured.hindiWatchlist;
  
  if (!movies) {
    console.error('Could not find a movie/series array in the executed file. You can pass the variable name as the 2nd argument or set TMDB_VAR_NAME env var.');
    process.exit(1);
  }
  if (!Array.isArray(movies)) {
    console.error('movieRecommendations is not an array. Aborting.');
    process.exit(1);
  }

  console.log(`Found ${movies.length} movie entries. Querying TMDB for posters...`);

  let updated = 0;
  const force = process.env.FORCE === '1' || process.env.FORCE === 'true' || process.argv.includes('--force');
  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    // Skip if already has a sensible posterUrl that looks like it's from TMDB, unless force is set
    if (m.posterUrl && typeof m.posterUrl === 'string' && m.posterUrl.trim().length > 10 && !m.posterUrl.includes('placehold')) {
      if (!force && m.posterUrl.includes('image.tmdb.org')) {
        continue;
      }
      if (!force && !m.posterUrl.includes('image.tmdb.org')) {
        // existing non-TMDB poster exists; by default we keep it. To override, run with FORCE=1 or --force
        console.log(`Skipping existing non-TMDB poster for: ${m.title} (use FORCE to overwrite)`);
        continue;
      }
    }

    // Build a set of candidate queries to improve matching for series with noisy titles
    const rawTitle = (m.title || '').trim();
    function buildCandidates(title) {
      const out = new Set();
      if (!title) return Array.from(out);
      out.add(title);
      // Remove parenthetical parts: e.g., "Sweet Home Season 2 (2023)" -> "Sweet Home Season 2"
      out.add(title.replace(/\s*\([^)]*\)/g, '').trim());
      // Remove 'Season' mentions: "Season 2" or "S2" -> remove that segment
      out.add(title.replace(/\b[Ss]eason\s*\d+\b/g, '').trim());
      out.add(title.replace(/\bS\d+\b/g, '').trim());
      // Remove trailing year tokens like "(2022)", "- 2022", "/ 2022", or just a trailing year
      out.add(title.replace(/\s*[-,\/]?\s*\d{4}\s*$/g, '').trim());
      // If there's a colon, try only the part before colon
      if (title.includes(':')) out.add(title.split(':')[0].trim());
      // Try removing subtitles in parentheses/brackets
      out.add(title.replace(/[\[\]\(\)"'“”‘’]/g, '').trim());
      // Collapse multiple spaces
      out.forEach(t => out.add(t.replace(/\s{2,}/g, ' ').trim()));
      // Lowercase variants (TMDB is case-insensitive but keep original too)
      Array.from(out).forEach(t => out.add(t.toLowerCase()));
      // Remove empty and return
      return Array.from(out).filter(Boolean);
    }

    const candidates = buildCandidates(rawTitle);
    const yearParam = m.year ? `&first_air_date_year=${encodeURIComponent(m.year)}` : '';

    // Try TV search first (better for series), then fall back to movie search
    let results = [];
    try {
      // Try all candidate queries until we get results
      for (const candidateRaw of candidates) {
        const candidate = encodeURIComponent(candidateRaw);
        // First try TV search
        const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${candidate}${m.year ? `&first_air_date_year=${encodeURIComponent(m.year)}` : ''}`;
        const tvRes = await axios.get(tvUrl, { timeout: 10000 });
        results = tvRes.data && tvRes.data.results ? tvRes.data.results : [];
        if (results.length > 0) {
          // console.log(`Matched TV with candidate '${candidateRaw}' for '${m.title}'`);
          break;
        }

        // fallback to movie search for the same candidate
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${candidate}${m.year ? `&year=${encodeURIComponent(m.year)}` : ''}`;
        const movieRes = await axios.get(movieUrl, { timeout: 10000 });
        results = movieRes.data && movieRes.data.results ? movieRes.data.results : [];
        if (results.length > 0) {
          // console.log(`Matched Movie with candidate '${candidateRaw}' for '${m.title}'`);
          break;
        }
        // otherwise continue with next candidate
      }

      if (results.length === 0) {
        // Stricter fallback: use the multi-search endpoint and try to normalize titles
        try {
          const cleaned = rawTitle.replace(/\s*\([^)]*\)/g, '').replace(/\b[Ss]eason\s*\d+\b/g, '').replace(/["'“”‘’\[\]]/g, '').trim();
          const multiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(cleaned)}${m.year ? `&year=${encodeURIComponent(m.year)}` : ''}`;
          const multiRes = await axios.get(multiUrl, { timeout: 10000 });
          const multiResults = multiRes.data && multiRes.data.results ? multiRes.data.results : [];

          function normalizeForMatch(s) {
            if (!s) return '';
            return s.toString().toLowerCase()
              .replace(/[^a-z0-9\s]/g, '') // drop punctuation
              .replace(/\b(the|a|an)\b/g, '') // drop leading stopwords
              .replace(/\s{2,}/g, ' ')
              .trim();
          }

          const targetNorm = normalizeForMatch(cleaned || rawTitle);
          let chosenFromMulti = null;
          for (const r of multiResults) {
            // r may have name/title/original_name/original_title
            const candidates = [r.name, r.title, r.original_name, r.original_title].filter(Boolean);
            for (const c of candidates) {
              const cn = normalizeForMatch(c);
              if (!cn || !targetNorm) continue;
              // direct inclusion or startsWith are good heuristics for alternate spellings
              if (cn.includes(targetNorm) || targetNorm.includes(cn) || cn.startsWith(targetNorm) || targetNorm.startsWith(cn)) {
                chosenFromMulti = r;
                break;
              }
            }
            if (chosenFromMulti) break;
          }

          if (chosenFromMulti && chosenFromMulti.poster_path) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${chosenFromMulti.poster_path}`;
            m.posterUrl = posterUrl;
            updated++;
            console.log(`Updated poster for (multi-fallback): ${m.title} -> ${posterUrl}`);
            // polite delay
            await new Promise(r => setTimeout(r, 250));
            continue;
          }
        } catch (e) {
          // ignore and fall through to original warning
        }

        console.warn(`No TMDB result for: ${m.title} (${m.year || 'unknown'})`);
        continue;
      }

      // Prefer exact year match when possible
      let chosen = results[0];
      if (m.year) {
        const exact = results.find(r => {
          // TV results use first_air_date, movies use release_date
          return String(r.first_air_date || r.release_date || '').startsWith(String(m.year));
        });
        if (exact) chosen = exact;
      }

      if (chosen.poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/w500${chosen.poster_path}`;
        m.posterUrl = posterUrl;
        updated++;
        console.log(`Updated poster for: ${m.title} -> ${posterUrl}`);
      } else {
        console.warn(`No poster_path for TMDB result of: ${m.title}`);
      }

      // Respect a small delay to be polite (TMDB rate limits)
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.error(`Failed to fetch TMDB for ${m.title}:`, err && err.message ? err.message : err);
    }
  }

  // Backup original file
  const backupPath = movieFile + '.bak.' + Date.now();
  fs.copyFileSync(movieFile, backupPath);
  console.log('Backup of original file written to', backupPath);

  // Determine which window variable name to use when writing output
  let varNameUsed = varNameArg;
  if (!varNameUsed) {
    if (sandbox.window.movieRecommendations) varNameUsed = 'movieRecommendations';
    else if (sandbox.window.myWatchlist) varNameUsed = 'myWatchlist';
    else if (sandbox.window.koreanWatchlist) varNameUsed = 'koreanWatchlist';
    else varNameUsed = 'movieRecommendations';
  }

  const output = `// ${path.basename(movieFile)} - updated posterUrl fields by scripts/fetch_tmdb_posters.js\n` +
                 `// DO NOT COMMIT your TMDB API key. This file is safe to commit (contains only data).\n\n` +
                 `window.${varNameUsed} = ${JSON.stringify(movies, null, 2)};\n`;

  fs.writeFileSync(movieFile, output, 'utf8');
  console.log(`Wrote updated file (${updated} posters updated) to ${movieFile}.`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
