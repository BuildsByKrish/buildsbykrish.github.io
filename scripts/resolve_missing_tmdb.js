#!/usr/bin/env node
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const apiKey = process.env.TMDB_API_KEY;
if (!apiKey) {
  console.error('Set TMDB_API_KEY in environment before running this script.');
  process.exit(1);
}

const dataFile = path.join(__dirname, '..', 'chineserecommendations.js');
const code = fs.readFileSync(dataFile, 'utf8');
const m = code.match(/window\.chineseWatchlist\s*=\s*(\[([\s\S]*)\]);/);
if (!m) {
  console.error('Unable to parse chineserecommendations.js');
  process.exit(1);
}
const arr = JSON.parse(m[1]);
const missing = arr.filter(x => !x.posterUrl).map(x => ({ id: x.id, title: x.title, year: x.year }));

function generateCandidates(title) {
  const t = title || '';
  const c = new Set();
  c.add(t);
  c.add(t.replace(/\s*\([^)]*\)/g, '').trim());
  c.add(t.replace(/\s*[-,\/]?\s*\d{4}\s*$/g, '').trim());
  c.add(t.replace(/\b[Ss]eason\s*\d+\b/g, '').trim());
  c.add(t.replace(/\bS\d+\b/g, '').trim());
  if (t.toLowerCase().startsWith('the ')) c.add(t.substring(4));
  if (t.toLowerCase().startsWith('legend of ')) c.add(t.substring('legend of '.length));
  // common spacing variants
  c.add(t.replace(/\s+/g, ' ').trim());
  // try splitting camel/concatenated names: Haolan -> Hao Lan
  c.forEach(s => {
    const s2 = s.replace(/haolan/gi, 'hao lan');
    c.add(s2);
  });
  // for titles with trailing number like "Ashes of Love 2" try "Ashes of Love season 2"
  c.forEach(s => {
    const s3 = s.replace(/\s+(\d+)$/,' season $1');
    c.add(s3);
  });
  return Array.from(c).filter(Boolean);
}

async function searchCandidate(q, year) {
  const encoded = encodeURIComponent(q);
  const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encoded}${year ? `&first_air_date_year=${year}` : ''}`;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encoded}${year ? `&year=${year}` : ''}`;
  try {
    const [tvRes, movieRes] = await Promise.all([
      axios.get(tvUrl, { timeout: 10000 }).catch(()=>({data:{results:[]}})),
      axios.get(movieUrl, { timeout: 10000 }).catch(()=>({data:{results:[]}}))
    ]);
    const results = [];
    if (tvRes && tvRes.data && tvRes.data.results) results.push(...tvRes.data.results.map(r=>({...r, media_type:'tv'})));
    if (movieRes && movieRes.data && movieRes.data.results) results.push(...movieRes.data.results.map(r=>({...r, media_type:'movie'})));
    return results.slice(0,5);
  } catch (e) {
    return [];
  }
}

(async () => {
  console.log('Found', missing.length, 'missing titles. Running targeted searches...');
  for (const item of missing) {
    console.log('\n== ' + item.title + (item.year ? ' ('+item.year+')' : '') + ' ==');
    const cands = generateCandidates(item.title);
    const seen = new Set();
    for (const cand of cands) {
      if (seen.has(cand.toLowerCase())) continue;
      seen.add(cand.toLowerCase());
      const res = await searchCandidate(cand, item.year);
      if (!res || res.length === 0) continue;
      console.log('\nCandidate: ' + cand);
      res.forEach(r => {
        console.log(` - [${r.media_type}] ${r.name || r.title} | id:${r.id} | poster:${r.poster_path || 'NONE'} | date:${r.first_air_date||r.release_date||'N/A'}`);
      });
      // small delay
      await new Promise(r => setTimeout(r, 250));
    }
  }
})();
